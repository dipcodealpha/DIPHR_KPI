import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { getProjectOptions } from "@/lib/projects";
import { createProgramAction } from "@/app/programs/actions";
import { ProgramForm } from "@/components/programs/program-form";

export default async function NewProgramPage() {
  const projectOptions = await getProjectOptions();

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