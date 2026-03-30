import { createSupabaseServerClient } from "@/lib/supabase/server";

interface RecordAuditLogParams {
  target_type: string;
  target_id: string;
  action_type: string;
  changed_by_name: string;
  before_value?: Record<string, unknown> | null;
  after_value?: Record<string, unknown> | null;
}

export async function recordAuditLog(params: RecordAuditLogParams) {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from("audit_logs").insert({
    target_type: params.target_type,
    target_id: params.target_id,
    action_type: params.action_type,
    changed_by_name: params.changed_by_name,
    before_value: params.before_value ?? null,
    after_value: params.after_value ?? null
  });

  if (error) {
    throw new Error(`audit_logs 기록 실패: ${error.message}`);
  }
}