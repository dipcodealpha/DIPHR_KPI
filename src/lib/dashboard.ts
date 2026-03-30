import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProgramRow, ProjectRow } from "@/types";

export interface DashboardFilterOptions {
  years: number[];
  projects: Array<{
    id: string;
    label: string;
  }>;
  managers: string[];
}

export interface DashboardKpi {
  totalProjects: number;
  totalPrograms: number;
  totalHours: number;
  totalCompletionCount: number;
}

export interface DashboardChartItem {
  name: string;
  value: number;
}

export interface DashboardProgramListItem {
  id: string;
  project_name: string;
  project_year: number;
  program_name: string;
  start_date: string;
  end_date: string;
  hours: number;
  completion_count: number | null;
  manager_name: string;
  updated_by_name: string | null;
  updated_at: string;
  status: "예정" | "완료";
}

export interface DashboardAuditItem {
  id: string;
  target_type: string;
  action_type: string;
  changed_by_name: string;
  changed_at: string;
  target_id: string;
  after_value: Record<string, unknown> | null;
}

export interface DashboardData {
  filters: DashboardFilterOptions;
  selected: {
    year: string;
    projectId: string;
    manager: string;
  };
  kpi: DashboardKpi;
  charts: {
    byYear: DashboardChartItem[];
    byYearParticipants: DashboardChartItem[];
    byProject: DashboardChartItem[];
    byProjectParticipants: DashboardChartItem[];
  };
  lists: {
    scheduled: DashboardProgramListItem[];
    completed: DashboardProgramListItem[];
    recentAuditLogs: DashboardAuditItem[];
  };
}

interface GetDashboardDataParams {
  year?: string;
  projectId?: string;
  manager?: string;
}

function getProgramStatus(completionCount: number | null): "예정" | "완료" {
  return completionCount === null ? "예정" : "완료";
}

function toNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sortChartDesc(items: DashboardChartItem[]) {
  return items.sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, "ko"));
}

export async function getDashboardData(
  params: GetDashboardDataParams = {}
): Promise<DashboardData> {
  const supabase = createSupabaseServerClient();

  const [projectsResult, programsResult, auditLogsResult] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("is_active", true)
      .order("project_year", { ascending: false })
      .order("project_name", { ascending: true }),

    supabase
      .from("programs")
      .select(
        `
        *,
        projects (
          id,
          project_year,
          project_name,
          is_active
        )
      `
      )
      .eq("is_active", true)
      .order("updated_at", { ascending: false }),

    supabase
      .from("audit_logs")
      .select("*")
      .in("target_type", ["projects", "programs"])
      .order("changed_at", { ascending: false })
      .limit(50)
  ]);

  if (projectsResult.error) {
    throw new Error(`dashboard projects 조회 실패: ${projectsResult.error.message}`);
  }

  if (programsResult.error) {
    throw new Error(`dashboard programs 조회 실패: ${programsResult.error.message}`);
  }

  if (auditLogsResult.error) {
    throw new Error(`dashboard audit_logs 조회 실패: ${auditLogsResult.error.message}`);
  }

  const projects = (projectsResult.data ?? []) as ProjectRow[];

  const allPrograms = ((programsResult.data ?? []) as Array<
    ProgramRow & {
      projects?: {
        id: string;
        project_year: number;
        project_name: string;
        is_active?: boolean;
      } | null;
    }
  >)
    .filter((program) => program.projects)
    .map((program) => ({
      ...program,
      project_year: program.projects?.project_year ?? 0,
      project_name: program.projects?.project_name ?? "",
      status: getProgramStatus(program.completion_count)
    }));

  const filterYears = Array.from(
    new Set(
      allPrograms
        .map((program) => program.project_year)
        .filter((year) => Number.isFinite(year))
    )
  ).sort((a, b) => b - a);

  const filterProjects = projects.map((project) => ({
    id: project.id,
    label: `${project.project_year} / ${project.project_name}`
  }));

  const filterManagers = Array.from(
    new Set(
      allPrograms
        .map((program) => program.manager_name.trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, "ko"));

  const selectedYear = params.year?.trim() ?? "";
  const selectedProjectId = params.projectId?.trim() ?? "";
  const selectedManager = params.manager?.trim() ?? "";

  const filteredPrograms = allPrograms.filter((program) => {
    if (selectedYear && String(program.project_year) !== selectedYear) {
      return false;
    }

    if (selectedProjectId && program.project_id !== selectedProjectId) {
      return false;
    }

    if (selectedManager && program.manager_name !== selectedManager) {
      return false;
    }

    return true;
  });

  const relatedProjectIds = new Set(filteredPrograms.map((program) => program.project_id));
  const filteredProjects = projects.filter((project) => relatedProjectIds.has(project.id));

  const kpi: DashboardKpi = {
    totalProjects: filteredProjects.length,
    totalPrograms: filteredPrograms.length,
    totalHours: filteredPrograms.reduce((sum, program) => sum + toNumber(program.hours), 0),
    totalCompletionCount: filteredPrograms.reduce(
      (sum, program) => sum + toNumber(program.completion_count),
      0
    )
  };

  const byYearMap = new Map<string, number>();
  const byYearParticipantsMap = new Map<string, number>();
  const byProjectMap = new Map<string, number>();
  const byProjectParticipantsMap = new Map<string, number>();

  for (const program of filteredPrograms) {
    const yearKey = String(program.project_year);
    const projectKey = program.project_name;
    const completionCount = toNumber(program.completion_count);

    byYearMap.set(yearKey, (byYearMap.get(yearKey) ?? 0) + 1);
    byYearParticipantsMap.set(
      yearKey,
      (byYearParticipantsMap.get(yearKey) ?? 0) + completionCount
    );

    byProjectMap.set(projectKey, (byProjectMap.get(projectKey) ?? 0) + 1);
    byProjectParticipantsMap.set(
      projectKey,
      (byProjectParticipantsMap.get(projectKey) ?? 0) + completionCount
    );
  }

  const charts = {
    byYear: sortChartDesc(
      Array.from(byYearMap.entries()).map(([name, value]) => ({ name, value }))
    ),
    byYearParticipants: sortChartDesc(
      Array.from(byYearParticipantsMap.entries()).map(([name, value]) => ({ name, value }))
    ),
    byProject: sortChartDesc(
      Array.from(byProjectMap.entries()).map(([name, value]) => ({ name, value }))
    ),
    byProjectParticipants: sortChartDesc(
      Array.from(byProjectParticipantsMap.entries()).map(([name, value]) => ({
        name,
        value
      }))
    )
  };

  const scheduled = filteredPrograms
    .filter((program) => program.status === "예정")
    .slice(0, 20);

  const completed = filteredPrograms
    .filter((program) => program.status === "완료")
    .slice(0, 20);

  const recentAuditLogs = ((auditLogsResult.data ?? []) as DashboardAuditItem[])
    .filter((log) => {
      if (selectedProjectId && log.target_type === "programs") {
        const afterValue = log.after_value ?? {};
        return String(afterValue.project_id ?? "") === selectedProjectId;
      }

      if (selectedManager && log.target_type === "programs") {
        const afterValue = log.after_value ?? {};
        return String(afterValue.manager_name ?? "") === selectedManager;
      }

      if (selectedYear && log.target_type === "programs") {
        const afterValue = log.after_value ?? {};
        return String(afterValue.start_date ?? "").startsWith(selectedYear);
      }

      return true;
    })
    .slice(0, 10);

  return {
    filters: {
      years: filterYears,
      projects: filterProjects,
      managers: filterManagers
    },
    selected: {
      year: selectedYear,
      projectId: selectedProjectId,
      manager: selectedManager
    },
    kpi,
    charts,
    lists: {
      scheduled,
      completed,
      recentAuditLogs
    }
  };
}