import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit-log";
import type { ProjectOption, ProjectRow } from "@/types";

interface ProjectMutationInput {
  project_year: number;
  project_name: string;
  department: string | null;
  note: string | null;
}

export async function listProjects() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("project_year", { ascending: false })
    .order("project_name", { ascending: true });

  if (error) {
    throw new Error(`projects 조회 실패: ${error.message}`);
  }

  return (data ?? []) as ProjectRow[];
}

export async function getProjectOptions() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select("id, project_year, project_name")
    .eq("is_active", true)
    .order("project_year", { ascending: false })
    .order("project_name", { ascending: true });

  if (error) {
    throw new Error(`projects 옵션 조회 실패: ${error.message}`);
  }

  return ((data ?? []) as Array<Pick<ProjectRow, "id" | "project_year" | "project_name">>).map(
    (project): ProjectOption => ({
      id: project.id,
      project_year: project.project_year,
      project_name: project.project_name,
      label: `${project.project_year} / ${project.project_name}`
    })
  );
}

export async function createProject(
  input: ProjectMutationInput,
  changedByName: string
) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      project_year: input.project_year,
      project_name: input.project_name,
      department: input.department,
      note: input.note
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`project 등록 실패: ${error?.message ?? "unknown error"}`);
  }

  await recordAuditLog({
    target_type: "projects",
    target_id: data.id,
    action_type: "create",
    changed_by_name: changedByName,
    before_value: null,
    after_value: data
  });

  return data as ProjectRow;
}

export async function updateProject(
  id: string,
  input: ProjectMutationInput,
  changedByName: string
) {
  const supabase = createSupabaseServerClient();

  const { data: before, error: beforeError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (beforeError || !before) {
    throw new Error(`project 조회 실패: ${beforeError?.message ?? "not found"}`);
  }

  const { data: after, error: updateError } = await supabase
    .from("projects")
    .update({
      project_year: input.project_year,
      project_name: input.project_name,
      department: input.department,
      note: input.note
    })
    .eq("id", id)
    .select("*")
    .single();

  if (updateError || !after) {
    throw new Error(`project 수정 실패: ${updateError?.message ?? "unknown error"}`);
  }

  await recordAuditLog({
    target_type: "projects",
    target_id: id,
    action_type: "update",
    changed_by_name: changedByName,
    before_value: before,
    after_value: after
  });

  return after as ProjectRow;
}

export async function deactivateProject(id: string, changedByName: string) {
  const supabase = createSupabaseServerClient();

  const { data: before, error: beforeError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (beforeError || !before) {
    throw new Error(`project 조회 실패: ${beforeError?.message ?? "not found"}`);
  }

  const { data: after, error: updateError } = await supabase
    .from("projects")
    .update({
      is_active: false
    })
    .eq("id", id)
    .select("*")
    .single();

  if (updateError || !after) {
    throw new Error(`project 비활성화 실패: ${updateError?.message ?? "unknown error"}`);
  }

  await recordAuditLog({
    target_type: "projects",
    target_id: id,
    action_type: "deactivate",
    changed_by_name: changedByName,
    before_value: before,
    after_value: after
  });

  return after as ProjectRow;
}