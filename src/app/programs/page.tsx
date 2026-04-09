import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { MessageBox } from "@/components/ui/message-box";
import { StatusBadge } from "@/components/ui/status-badge";
import { listPrograms } from "@/lib/programs";
import { buildCsv, buildDataUrl } from "@/lib/csv";
import { formatDate, formatDateTime, getProgramStatus } from "@/lib/format";

interface ProgramsPageProps {
  searchParams?: Promise<{
    success?: string;
    q?: string;
    project?: string;
  }>;
}

function getSuccessMessage(success?: string) {
  if (success === "created") {
    return "교육이 등록되었습니다.";
  }

  if (success === "updated") {
    return "교육 정보가 수정되었습니다.";
  }

  return "";
}

export default async function ProgramsPage({ searchParams }: ProgramsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const successMessage = getSuccessMessage(resolvedSearchParams.success);
  const keyword = resolvedSearchParams.q?.trim() ?? "";
  const selectedProject = resolvedSearchParams.project?.trim() ?? "";

  let programs;

  try {
    programs = await listPrograms();
  } catch (error) {
    return (
      <div className="space-y-6">
        <PageTitle description="교육 목록 조회" />
        <MessageBox
          tone="error"
          title="교육 목록을 불러오지 못했습니다."
          message={error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요."}
        />
      </div>
    );
  }

  const projectOptions = Array.from(
    new Set(
      programs
        .map((program) => program.project_name?.trim())
        .filter((projectName): projectName is string => Boolean(projectName))
    )
  ).sort((a, b) => a.localeCompare(b, "ko"));

  const filteredPrograms = programs.filter((program) => {
    if (selectedProject && program.project_name !== selectedProject) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const normalizedKeyword = keyword.toLocaleLowerCase("ko-KR");
    const searchTarget = [
      program.program_name,
      program.project_name ?? "",
      program.manager_name
    ]
      .join(" ")
      .toLocaleLowerCase("ko-KR");

    return searchTarget.includes(normalizedKeyword);
  });

  const csvRows = filteredPrograms.map((program) => ({
    연도: program.project_year ?? "",
    사업명: program.project_name ?? "",
    교육명: program.program_name,
    시작일: formatDate(program.start_date),
    종료일: formatDate(program.end_date),
    교육시수: program.hours,
    수료자수: program.completion_count ?? "",
    상태: getProgramStatus(program.completion_count),
    담당자명: program.manager_name,
    비고: program.note ?? "",
    최종수정자명: program.updated_by_name ?? "",
    최종수정일: formatDateTime(program.updated_at)
  }));

  const csv = buildCsv(csvRows, [
    "연도",
    "사업명",
    "교육명",
    "시작일",
    "종료일",
    "교육시수",
    "수료자수",
    "상태",
    "담당자명",
    "비고",
    "최종수정자명",
    "최종수정일"
  ]);

  const csvDownloadUrl = buildDataUrl(csv);
  const hasFilter = Boolean(keyword || selectedProject);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <PageTitle description="교육 목록 조회" />

        <div className="flex gap-2">
          <a
            href={csvDownloadUrl}
            download="programs.csv"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            CSV 다운로드
          </a>

          <Link
            href="/programs/new"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium !text-white transition hover:bg-slate-800"
            style={{ color: "#ffffff" }}
          >
            교육 등록
          </Link>
        </div>
      </div>

      {successMessage ? <MessageBox tone="success" message={successMessage} /> : null}

      <form className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid w-full gap-3 md:grid-cols-2 lg:max-w-2xl">
            <div className="space-y-2">
              <label htmlFor="program-search" className="text-sm font-medium text-slate-700">
                교육 검색
              </label>
              <input
                id="program-search"
                name="q"
                defaultValue={keyword}
                placeholder="교육명, 사업명, 담당자명으로 검색"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="program-project" className="text-sm font-medium text-slate-700">
                사업 선택
              </label>
              <select
                id="program-project"
                name="project"
                defaultValue={selectedProject}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
              >
                <option value="">전체 사업</option>
                {projectOptions.map((projectName) => (
                  <option key={projectName} value={projectName}>
                    {projectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              검색
            </button>
            <Link
              href="/programs"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              초기화
            </Link>
          </div>
        </div>
      </form>

      {filteredPrograms.length === 0 ? (
        <MessageBox
          tone="info"
          title={hasFilter ? "검색 결과가 없습니다." : "등록된 교육이 없습니다."}
          message={
            hasFilter
              ? "검색어 또는 사업 선택을 바꾸거나 초기화 후 다시 확인해 주세요."
              : "우측 상단의 교육 등록 버튼으로 첫 교육을 추가해 주세요."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">연도</th>
                  <th className="px-4 py-3 text-left">사업명</th>
                  <th className="px-4 py-3 text-left">교육명</th>
                  <th className="px-4 py-3 text-left">기간</th>
                  <th className="px-4 py-3 text-left">교육시수</th>
                  <th className="px-4 py-3 text-left">수료자수</th>
                  <th className="px-4 py-3 text-left">상태</th>
                  <th className="px-4 py-3 text-left">담당자명</th>
                  <th className="px-4 py-3 text-left">비고</th>
                  <th className="px-4 py-3 text-left">최종수정자명</th>
                  <th className="px-4 py-3 text-left">최종수정일</th>
                  <th className="px-4 py-3 text-left">수정</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map((program) => (
                  <tr
                    key={program.id}
                    className="border-t border-slate-200 transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">{program.project_year ?? "-"}</td>
                    <td className="px-4 py-3">{program.project_name ?? "-"}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link
                        href={`/programs/${program.id}`}
                        className="inline-flex max-w-[240px] truncate underline-offset-4 hover:underline"
                        title={program.program_name}
                      >
                        {program.program_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(program.start_date)} ~ {formatDate(program.end_date)}
                    </td>
                    <td className="px-4 py-3">{program.hours}</td>
                    <td className="px-4 py-3">{program.completion_count ?? "-"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        tone={program.completion_count === null ? "warning" : "success"}
                      >
                        {getProgramStatus(program.completion_count)}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3">{program.manager_name}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/programs/${program.id}`}
                        className="block max-w-[280px] truncate text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
                        title={program.note ?? ""}
                      >
                        {program.note?.trim() ? program.note : "-"}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{program.updated_by_name ?? "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDateTime(program.updated_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/programs/${program.id}`}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        수정
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
