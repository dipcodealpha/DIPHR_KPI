import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { MessageBox } from "@/components/ui/message-box";
import { getProjectOptions } from "@/lib/projects";
import { createProgramAction } from "@/app/programs/actions";
import { ProgramForm } from "@/components/programs/program-form";

export default async function NewProgramPage() {
  let projectOptions: Awaited<ReturnType<typeof getProjectOptions>>;

  try {
    projectOptions = await getProjectOptions();
  } catch (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <PageTitle description="사업 선택 후 교육 정보를 등록합니다." />

          <Link
            href="/programs"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
          >
            목록으로
          </Link>
        </div>

        <MessageBox
          tone="error"
          title="사업 선택 목록을 불러오지 못했습니다."
          message={`${error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요."} Supabase 프로젝트가 일시 중지되었거나 Vercel 환경변수, 네트워크, DB 조회 권한에 문제가 있을 수 있습니다. Supabase 프로젝트 상태와 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 값을 확인해 주세요.`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <PageTitle description="사업 선택 후 교육 정보를 등록합니다." />

        <Link
          href="/programs"
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
        >
          목록으로
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {projectOptions.length === 0 ? (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            활성 사업이 없습니다. 먼저 사업을 등록하거나 활성 상태를 확인하세요.
          </div>
        ) : (
          <ProgramForm
            mode="create"
            action={createProgramAction}
            projectOptions={projectOptions}
          />
        )}
      </div>
    </div>
  );
}
