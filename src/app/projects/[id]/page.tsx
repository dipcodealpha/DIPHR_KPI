import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { MessageBox } from "@/components/ui/message-box";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProjectDeactivateForm } from "@/components/projects/project-deactivate-form";
import {
  deactivateProjectAction,
  updateProjectAction
} from "@/app/projects/actions";
import { getProjectById } from "@/lib/projects";
import { formatDateTime } from "@/lib/format";

interface ProjectEditPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    success?: string;
  }>;
}

function getSuccessMessage(success?: string) {
  if (success === "updated") {
    return "사업 정보가 수정되었습니다.";
  }

  if (success === "deactivated") {
    return "사업이 비활성화되었습니다.";
  }

  return "";
}

export default async function ProjectEditPage({
  params,
  searchParams
}: ProjectEditPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const successMessage = getSuccessMessage(resolvedSearchParams.success);

  let project;

  try {
    project = await getProjectById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <PageTitle description="기존 사업 정보를 수정합니다." />

        <Link
          href="/projects"
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
        >
          목록으로
        </Link>
      </div>

      {successMessage ? <MessageBox tone="success" message={successMessage} /> : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <span>상태:</span>
          <StatusBadge tone={project.is_active ? "success" : "muted"}>
            {project.is_active ? "활성" : "비활성"}
          </StatusBadge>
          <span>· 최종수정일</span>
          {formatDateTime(project.updated_at)}
        </div>

        <form action={updateProjectAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="id" value={project.id} />
          <input type="hidden" name="redirect_to" value={`/projects/${project.id}`} />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">사업연도</label>
            <input
              name="project_year"
              type="number"
              defaultValue={project.project_year}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">사업명</label>
            <input
              name="project_name"
              defaultValue={project.project_name}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">부서</label>
            <input
              name="department"
              defaultValue={project.department ?? ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">처리자명</label>
            <input
              name="changed_by_name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">비고</label>
            <textarea
              name="note"
              rows={6}
              defaultValue={project.note ?? ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              수정 저장
            </button>
          </div>
        </form>

        {project.is_active ? (
          <ProjectDeactivateForm
            action={deactivateProjectAction}
            id={project.id}
            redirectTo="/projects"
          />
        ) : (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            <StatusBadge tone="muted">비활성</StatusBadge>
            <span>비활성화된 사업입니다.</span>
          </div>
        )}
      </div>
    </div>
  );
}
