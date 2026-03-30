import { PageTitle } from "@/components/ui/page-title";
import { MessageBox } from "@/components/ui/message-box";
import { buildCsv, buildDataUrl } from "@/lib/csv";
import { formatDateTime } from "@/lib/format";
import { listProjects } from "@/lib/projects";
import {
  createProjectAction,
  deactivateProjectAction,
  updateProjectAction
} from "@/app/projects/actions";

interface ProjectsPageProps {
  searchParams?: Promise<{
    success?: string;
  }>;
}

function getSuccessMessage(success?: string) {
  if (success === "created") {
    return "사업이 등록되었습니다.";
  }

  if (success === "updated") {
    return "사업 정보가 수정되었습니다.";
  }

  if (success === "deactivated") {
    return "사업이 비활성화되었습니다.";
  }

  return "";
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  try {
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const successMessage = getSuccessMessage(resolvedSearchParams.success);
    const projects = await listProjects();

    const csvRows = projects.map((project) => ({
      연도: project.project_year,
      사업명: project.project_name,
      부서: project.department ?? "",
      비고: project.note ?? "",
      활성여부: project.is_active ? "활성" : "비활성",
      최종수정일: formatDateTime(project.updated_at)
    }));

    const csv = buildCsv(csvRows, [
      "연도",
      "사업명",
      "부서",
      "비고",
      "활성여부",
      "최종수정일"
    ]);

    const csvDownloadUrl = buildDataUrl(csv);

    return (
      <div className="space-y-8">
        <div className="flex items-end justify-between gap-4">
          <PageTitle description="사업 목록 조회, 등록, 수정, 비활성화" />

          <a
            href={csvDownloadUrl}
            download="projects.csv"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            CSV 다운로드
          </a>
        </div>

        {successMessage ? (
          <MessageBox tone="success" message={successMessage} />
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">사업 등록</h3>

          <form action={createProjectAction} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">사업연도</label>
              <input
                name="project_year"
                type="number"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">사업명</label>
              <input
                name="project_name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">부서</label>
              <input
                name="department"
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
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                사업 등록
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">사업 목록</h3>

          {projects.length === 0 ? (
            <MessageBox
              tone="info"
              message="등록된 사업이 없습니다. 먼저 사업을 등록해 주세요."
            />
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">
                      {project.project_year} / {project.project_name}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      상태: {project.is_active ? "활성" : "비활성"} · 최종수정일:{" "}
                      {formatDateTime(project.updated_at)}
                    </p>
                  </div>
                </div>

                <form action={updateProjectAction} className="grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="id" value={project.id} />

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
                      rows={4}
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
                  <form action={deactivateProjectAction} className="mt-3 flex gap-2">
                    <input type="hidden" name="id" value={project.id} />
                    <input
                      name="changed_by_name"
                      placeholder="비활성화 처리자명"
                      className="w-full max-w-xs rounded-xl border border-slate-300 px-4 py-3 text-sm"
                      required
                    />
                    <button
                      type="submit"
                      className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    >
                      비활성화
                    </button>
                  </form>
                ) : null}
              </div>
            ))
          )}
        </section>
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-6">
        <PageTitle description="사업 목록 조회, 등록, 수정, 비활성화" />
        <MessageBox
          tone="error"
          title="사업 목록 조회 실패"
          message={error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요."}
        />
      </div>
    );
  }
}