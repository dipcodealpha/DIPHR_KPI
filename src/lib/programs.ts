import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit-log";
import {
  getProgramStatus,
  type ProgramListItem,
  type ProgramRow
} from "@/types";

interface ProgramCreateMutationInput {
  project_id: string;
  program_name: string;
  start_date: string;
  end_date: string;
  hours: number;
  completion_count: number | null;
  manager_name: string;
  created_by_name: string;
  note: string | null;
}

interface ProgramUpdateMutationInput {
  project_id: string;
  program_name: string;
  start_date: string;
  end_date: string;
  hours: number;
  completion_count: number | null;
  manager_name: string;
  updated_by_name: string;
  note: string | null;
}

export async function listPrograms() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      *,
      projects (
        project_year,
        project_name
      )
    `
    )
    .eq("is_active", true)
    .order("start_date", { ascending: false })
    .order("program_name", { ascending: true });

  if (error) {
    throw new Error(`programs 조회 실패: ${error.message}`);
  }

  return ((data ?? []) as Array<
    ProgramRow & {
      projects?: {
        project_year: number;
        project_name: string;
      } | null;
    }
  >).map((program) => ({
    ...program,
    project_year: program.projects?.project_year ?? null,
    project_name: program.projects?.project_name ?? null,
    status: getProgramStatus(program.completion_count)
  })) as ProgramListItem[];
}

export async function getProgramById(id: string) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      *,
      projects (
        project_year,
        project_name
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error(`program 조회 실패: ${error?.message ?? "not found"}`);
  }

  return data as ProgramRow & {
    projects?: {
      project_year: number;
      project_name: string;
    } | null;
  };
}

export async function createProgram(input: ProgramCreateMutationInput) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("programs")
    .insert({
      project_id: input.project_id,
      program_name: input.program_name,
      start_date: input.start_date,
      end_date: input.end_date,
      hours: input.hours,
      completion_count: input.completion_count,
      manager_name: input.manager_name,
      created_by_name: input.created_by_name,
      note: input.note
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`program 등록 실패: ${error?.message ?? "unknown error"}`);
  }

  await recordAuditLog({
    target_type: "programs",
    target_id: data.id,
    action_type: "create",
    changed_by_name: input.created_by_name,
    before_value: null,
    after_value: data
  });

  return data as ProgramRow;
}

export async function updateProgram(
  id: string,
  input: ProgramUpdateMutationInput
) {
  const supabase = createSupabaseServerClient();

  const { data: before, error: beforeError } = await supabase
    .from("programs")
    .select("*")
    .eq("id", id)
    .single();

  if (beforeError || !before) {
    throw new Error(`program 조회 실패: ${beforeError?.message ?? "not found"}`);
  }

  const { data: after, error: updateError } = await supabase
    .from("programs")
    .update({
      project_id: input.project_id,
      program_name: input.program_name,
      start_date: input.start_date,
      end_date: input.end_date,
      hours: input.hours,
      completion_count: input.completion_count,
      manager_name: input.manager_name,
      updated_by_name: input.updated_by_name,
      note: input.note
    })
    .eq("id", id)
    .select("*")
    .single();

  if (updateError || !after) {
    throw new Error(`program 수정 실패: ${updateError?.message ?? "unknown error"}`);
  }

  await recordAuditLog({
    target_type: "programs",
    target_id: id,
    action_type: "update",
    changed_by_name: input.updated_by_name,
    before_value: before,
    after_value: after
  });

  return after as ProgramRow;
}