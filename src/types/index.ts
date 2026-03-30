export type ProgramStatus = "예정" | "완료";

export interface ProjectRow {
  id: string;
  project_year: number;
  project_name: string;
  department: string | null;
  note: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectListItem extends ProjectRow {
  latest_changed_by_name: string | null;
}

export interface ProgramRow {
  id: string;
  project_id: string;
  program_name: string;
  start_date: string;
  end_date: string;
  hours: number;
  completion_count: number | null;
  manager_name: string;
  created_by_name: string;
  updated_by_name: string | null;
  note: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLogRow {
  id: string;
  target_type: string;
  target_id: string;
  action_type: string;
  changed_by_name: string;
  before_value: Record<string, unknown> | null;
  after_value: Record<string, unknown> | null;
  changed_at: string;
}

export interface ProjectOption {
  id: string;
  project_year: number;
  project_name: string;
  label: string;
}

export interface ProgramListItem extends ProgramRow {
  project_year: number | null;
  project_name: string | null;
  status: ProgramStatus;
}

export function getProgramStatus(
  completionCount: number | null
): ProgramStatus {
  return completionCount === null ? "예정" : "완료";
}