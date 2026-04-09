import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { createProjectAction } from "@/app/projects/actions";
import { ProjectForm } from "@/components/projects/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <PageTitle description="새 사업 정보를 등록합니다." />

        <Link
          href="/projects"
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
        >
          목록으로
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProjectForm action={createProjectAction} />
      </div>
    </div>
  );
}
