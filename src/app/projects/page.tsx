import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { MessageBox } from "@/components/ui/message-box";
import { buildCsv, buildDataUrl } from "@/lib/csv";
import { formatDateTime } from "@/lib/format";
import { listProjects } from "@/lib/projects";
import {
  createProjectAction,
  deactivateProjectAction
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
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const successMessage = getSuccessMessage(resolvedSearchParams.success);

  try {
    const projects = await listProjects();

    const csvRows = projects.map((project) => ({
      연도: project.project_year,
      사업명: project.project_name,
      부서: project.department ?? "",
      처리자명: project.latest_changed_by_name ?? "",
      상태: project.is_active ? "활성" : "비활성",
      최종수정일: formatDateTime(project.updated_at)
    }));

    const csv = buildCsv(csvRows, [
      "연도",
      "사업명",
      "부서",
      "처리자명",
      "상태",
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
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left">연도</th>
                      <th className="px-4 py-3 text-left">사업명</th>
                      <th className="px-4 py-3 text-left">부서</th>
                      <th className="px-4 py-3 text-left">처리자명</th>
                      <th className="px-4 py-3 text-left">상태</th>
                      <th className="px-4 py-3 text-left">최종수정일</th>
                      <th className="px-4 py-3 text-left">수정</th>
                      <th className="px-4 py-3 text-left">비활성화</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr
                        key={project.id}
                        className="border-t border-slate-200 transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-3">{project.project_year}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          <Link
                            href={`/projects/${project.id}`}
                            className="inline-flex max-w-[280px] truncate underline-offset-4 hover:underline"
                            title={project.project_name}
                          >
                            {project.project_name}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{project.department ?? "-"}</td>
                        <td className="px-4 py-3">
                          {project.latest_changed_by_name ?? "-"}
                        </td>
                        <td className="px-4 py-3">
                          {project.is_active ? "활성" : "비활성"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {formatDateTime(project.updated_at)}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/projects/${project.id}`}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            수정
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          {project.is_active ? (
                            <form action={deactivateProjectAction}>
                              <input type="hidden" name="id" value={project.id} />
                              <input type="hidden" name="redirect_to" value="/projects" />
                              <div className="flex min-w-[220px] gap-2">
                                <input
                                  name="changed_by_name"
                                  placeholder="처리자명"
                                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                                  required
                                />
                                <button
                                  type="submit"
                                  className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100"
                                >
                                  비활성화
                                </button>
                              </div>
                            </form>
                          ) : (
                            <span className="text-xs text-slate-400">완료</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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