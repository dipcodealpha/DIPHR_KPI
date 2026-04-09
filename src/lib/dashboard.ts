import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProgramRow, ProjectRow } from "@/types";

export interface DashboardFilterOptions {
  years: number[];
  projects: Array<{
    id: string;
    label: string;
  }>;
  managers: string[];
  statuses: Array<"예정" | "완료">;
}

export interface DashboardKpi {
  totalProjects: number;
  totalPrograms: number;
  totalHours: number;
  totalCompletionCount: number;
  averageCompletionPerProgram: number;
  averageHoursPerProgram: number;
}

export interface DashboardChartItem {
  id?: string;
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
  target_name: string | null;
  after_value: Record<string, unknown> | null;
}

export interface DashboardData {
  filters: DashboardFilterOptions;
  selected: {
    year: string;
    projectId: string;
    manager: string;
    status: string;
  };
  kpi: DashboardKpi;
  charts: {
    byYear: DashboardChartItem[];
    byYearParticipants: DashboardChartItem[];
    byProject: DashboardChartItem[];
    byProjectParticipants: DashboardChartItem[];
    byMonthPrograms: DashboardChartItem[];
    byMonthCompletions: DashboardChartItem[];
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
  status?: string;
}

type DashboardProgramSource = ProgramRow & {
  projects?: {
    id: string;
    project_year: number;
    project_name: string;
    is_active?: boolean;
  } | null;
};

type DashboardProgram = ProgramRow & {
  project_year: number;
  project_name: string;
  status: "예정" | "완료";
};

function getProgramStatus(completionCount: number | null): "예정" | "완료" {
  return completionCount === null ? "예정" : "완료";
}

function toNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sortChartDesc(items: DashboardChartItem[]) {
  return items.sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, "ko"));
}

function sortMonthChartAsc(items: DashboardChartItem[]) {
  return items.sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

function formatMonthLabel(dateString: string) {
  if (!dateString || typeof dateString !== "string") return "날짜 미상";

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return "날짜 미상";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");

  return `${year}.${month}`;
}

function getYearKey(dateString: string, fallbackYear: number) {
  if (!dateString || typeof dateString !== "string") return String(fallbackYear);

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return String(fallbackYear);

  return String(parsed.getFullYear());
}

function getAuditTargetName(
  log: {
    target_type: string;
    target_id: string;
    after_value: Record<string, unknown> | null;
  },
  projectNameMap: Map<string, string>,
  programNameMap: Map<string, string>
) {
  if (log.target_type === "projects") {
    const mappedName = projectNameMap.get(log.target_id);
    const fallbackName = String(log.after_value?.project_name ?? "").trim();

    return mappedName ?? (fallbackName || null);
  }

  if (log.target_type === "programs") {
    const mappedName = programNameMap.get(log.target_id);
    const fallbackName = String(log.after_value?.program_name ?? "").trim();

    return mappedName ?? (fallbackName || null);
  }

  return null;
}

function buildDashboardKpi(programs: DashboardProgram[], projects: ProjectRow[]): DashboardKpi {
  const relatedProjectIds = new Set(programs.map((program) => program.project_id));
  const totalPrograms = programs.length;
  const totalHours = programs.reduce((sum, program) => sum + toNumber(program.hours), 0);
  const totalCompletionCount = programs.reduce(
    (sum, program) => sum + toNumber(program.completion_count),
    0
  );

  return {
    totalProjects: projects.filter((project) => relatedProjectIds.has(project.id)).length,
    totalPrograms,
    totalHours,
    totalCompletionCount,
    averageCompletionPerProgram:
      totalPrograms > 0 ? Number((totalCompletionCount / totalPrograms).toFixed(1)) : 0,
    averageHoursPerProgram: totalPrograms > 0 ? Number((totalHours / totalPrograms).toFixed(1)) : 0
  };
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

  const allPrograms = ((programsResult.data ?? []) as DashboardProgramSource[])
    .filter((program) => program.projects)
    .map(
      (program): DashboardProgram => ({
        ...program,
        project_year: program.projects?.project_year ?? 0,
        project_name: program.projects?.project_name ?? "",
        status: getProgramStatus(program.completion_count)
      })
    );

  const filterYears = Array.from(
    new Set(
      allPrograms
        .map((program) => program.project_year)
        .filter((year) => Number.isFinite(year))
    )
  ).sort((a, b) => b - a);

  const selectedYear = params.year?.trim() ?? "";
  const selectedProjectId = params.projectId?.trim() ?? "";
  const selectedManager = params.manager?.trim() ?? "";
  const selectedStatus = params.status?.trim() ?? "";

  const projectOptionsSource = selectedYear
    ? projects.filter((project) => String(project.project_year) === selectedYear)
    : projects;

  const filterProjects = projectOptionsSource.map((project) => ({
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

    if (selectedStatus && program.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  const relatedProjectIds = new Set(filteredPrograms.map((program) => program.project_id));
  const filteredProgramIds = new Set(filteredPrograms.map((program) => program.id));

  const projectNameMap = new Map(
    projects.map((project) => [project.id, `${project.project_year} / ${project.project_name}`])
  );
  const programNameMap = new Map(allPrograms.map((program) => [program.id, program.program_name]));

  const kpi = buildDashboardKpi(filteredPrograms, projects);

  const byYearMap = new Map<string, number>();
  const byYearParticipantsMap = new Map<string, number>();
  const byProjectMap = new Map<string, DashboardChartItem>();
  const byProjectParticipantsMap = new Map<string, DashboardChartItem>();
  const byMonthProgramsMap = new Map<string, number>();
  const byMonthCompletionsMap = new Map<string, number>();

  for (const program of filteredPrograms) {
    const actualYearKey = getYearKey(program.start_date, program.project_year);
    const monthKey = formatMonthLabel(program.start_date);
    const projectKey = program.project_name;
    const completionCount = toNumber(program.completion_count);

    byYearMap.set(actualYearKey, (byYearMap.get(actualYearKey) ?? 0) + 1);
    byYearParticipantsMap.set(
      actualYearKey,
      (byYearParticipantsMap.get(actualYearKey) ?? 0) + completionCount
    );

    byMonthProgramsMap.set(monthKey, (byMonthProgramsMap.get(monthKey) ?? 0) + 1);
    byMonthCompletionsMap.set(
      monthKey,
      (byMonthCompletionsMap.get(monthKey) ?? 0) + completionCount
    );

    const existingProjectCount = byProjectMap.get(projectKey);
    byProjectMap.set(projectKey, {
      id: program.project_id,
      name: projectKey,
      value: (existingProjectCount?.value ?? 0) + 1
    });

    const existingProjectCompletion = byProjectParticipantsMap.get(projectKey);
    byProjectParticipantsMap.set(projectKey, {
      id: program.project_id,
      name: projectKey,
      value: (existingProjectCompletion?.value ?? 0) + completionCount
    });
  }

  const charts = {
    byYear: sortChartDesc(
      Array.from(byYearMap.entries()).map(([name, value]) => ({ name, value }))
    ),
    byYearParticipants: sortChartDesc(
      Array.from(byYearParticipantsMap.entries()).map(([name, value]) => ({ name, value }))
    ),
    byProject: sortChartDesc(Array.from(byProjectMap.values())),
    byProjectParticipants: sortChartDesc(Array.from(byProjectParticipantsMap.values())),
    byMonthPrograms: sortMonthChartAsc(
      Array.from(byMonthProgramsMap.entries()).map(([name, value]) => ({ name, value }))
    ),
    byMonthCompletions: sortMonthChartAsc(
      Array.from(byMonthCompletionsMap.entries()).map(([name, value]) => ({ name, value }))
    )
  };

  const scheduled = filteredPrograms.filter((program) => program.status === "예정").slice(0, 20);
  const completed = filteredPrograms.filter((program) => program.status === "완료").slice(0, 20);

  const recentAuditLogs = ((auditLogsResult.data ?? []) as Array<{
    id: string;
    target_type: string;
    action_type: string;
    changed_by_name: string;
    changed_at: string;
    target_id: string;
    after_value: Record<string, unknown> | null;
  }>)
    .filter((log) => {
      if (log.target_type === "programs") {
        return filteredProgramIds.has(log.target_id);
      }

      if (log.target_type === "projects") {
        return relatedProjectIds.has(log.target_id);
      }

      return false;
    })
    .map((log) => ({
      ...log,
      target_name: getAuditTargetName(log, projectNameMap, programNameMap)
    }))
    .slice(0, 10);

  return {
    filters: {
      years: filterYears,
      projects: filterProjects,
      managers: filterManagers,
      statuses: ["예정", "완료"]
    },
    selected: {
      year: selectedYear,
      projectId: selectedProjectId,
      manager: selectedManager,
      status: selectedStatus
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
