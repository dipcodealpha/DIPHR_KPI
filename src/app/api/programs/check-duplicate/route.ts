import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const projectId = searchParams.get("project_id")?.trim() ?? "";
  const programName = searchParams.get("program_name")?.trim() ?? "";
  const startDate = searchParams.get("start_date")?.trim() ?? "";
  const excludeId = searchParams.get("exclude_id")?.trim() ?? "";

  if (!projectId || !programName || !startDate) {
    return NextResponse.json({
      exists: false,
      count: 0
    });
  }

  const supabase = createSupabaseServerClient();

  let query = supabase
    .from("programs")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)
    .eq("project_id", projectId)
    .eq("program_name", programName)
    .eq("start_date", startDate);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { count, error } = await query;

  if (error) {
    return NextResponse.json(
      {
        exists: false,
        count: 0,
        message: "중복 확인 중 오류가 발생했습니다."
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    exists: (count ?? 0) > 0,
    count: count ?? 0,
    message:
      (count ?? 0) > 0
        ? "동일 사업·동일 교육명·동일 시작일 조합의 기존 교육이 있습니다."
        : ""
  });
}