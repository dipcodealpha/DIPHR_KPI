import Link from "next/link";
import { formatDate, formatDateTime, formatNumber } from "@/lib/format";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DashboardData } from "@/lib/dashboard";

interface DashboardTablesProps {
  lists: DashboardData["lists"];
}

type ProgramListItem = DashboardData["lists"]["scheduled"][number];

function getTargetLabel(value: string) {
  if (value === "projects") return "사업";
  if (value === "programs") return "교육";
  return value;
}

function getActionLabel(value: string) {
  if (value === "create") return "등록";
  if (value === "update") return "수정";
  if (value === "deactivate") return "비활성화";
  return value;
}

function getCompletionStatus(completionCount: number | null) {
  return completionCount === null
    ? { label: "예정", tone: "warning" as const }
    : { label: "완료", tone: "success" as const };
}

function formatCompletionCount(completionCount: number | null) {
  return completionCount === null ? "-" : `${formatNumber(completionCount)}명`;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
      {message}
    </div>
  );
}

function TableScrollHint() {
  return (
    <p className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 lg:hidden">
      표가 화면보다 넓으면 좌우로 스크롤해 모든 열을 확인할 수 있습니다.
    </p>
  );
}

function ProgramStatusBadge({ completionCount }: { completionCount: number | null }) {
  const status = getCompletionStatus(completionCount);

  return <StatusBadge tone={status.tone}>{status.label}</StatusBadge>;
}

function ProgramListSection({
  scheduled,
  completed
}: {
  scheduled: ProgramListItem[];
  completed: ProgramListItem[];
}) {
  const rows = [...scheduled, ...completed];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase text-slate-500">
            PROGRAM LIST
          </div>
          <h2 className="mt-1 text-lg font-bold text-slate-950">교육 목록</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="warning">예정 {formatNumber(scheduled.length)}건</StatusBadge>
          <StatusBadge tone="success">완료 {formatNumber(completed.length)}건</StatusBadge>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="표시할 데이터가 없습니다." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <TableScrollHint />
          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">교육명</th>
                  <th className="px-4 py-3 text-left font-semibold">사업명</th>
                  <th className="px-4 py-3 text-left font-semibold">기간</th>
                  <th className="px-4 py-3 text-right font-semibold">시수</th>
                  <th className="px-4 py-3 text-right font-semibold">수료자 수</th>
                  <th className="px-4 py-3 text-left font-semibold">상태</th>
                  <th className="px-4 py-3 text-right font-semibold">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((program) => (
                  <tr key={program.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-4 align-top">
                      <div className="max-w-[320px]">
                        <Link
                          href={`/programs/${program.id}`}
                          className="font-semibold text-slate-950 underline-offset-4 hover:underline"
                          title={program.program_name}
                        >
                          {program.program_name}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">{program.manager_name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex max-w-[260px] flex-wrap items-center gap-2">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600">
                          {program.project_year}
                        </span>
                        <span className="font-medium text-slate-700">{program.project_name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 align-top text-slate-600">
                      {formatDate(program.start_date)} ~ {formatDate(program.end_date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right align-top font-medium text-slate-700">
                      {formatNumber(program.hours)}시간
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right align-top font-semibold text-slate-900">
                      {formatCompletionCount(program.completion_count)}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <ProgramStatusBadge completionCount={program.completion_count} />
                    </td>
                    <td className="px-4 py-4 text-right align-top">
                      <Link
                        href={`/programs/${program.id}`}
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
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
    </section>
  );
}

function AuditLogSection({ logs }: { logs: DashboardData["lists"]["recentAuditLogs"] }) {
  return (
    <details className="group rounded-lg border border-slate-200 bg-slate-50/80 shadow-sm">
      <summary className="flex cursor-pointer list-none flex-col gap-3 px-5 py-4 marker:hidden sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
        <div>
          <div className="text-xs font-semibold uppercase text-slate-500">
            AUDIT LOG
          </div>
          <h2 className="mt-1 text-sm font-bold text-slate-800">최근 수정 목록 10건</h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>{formatNumber(logs.length)}건 표시</span>
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 group-open:hidden">
            펼치기
          </span>
          <span className="hidden rounded-full border border-slate-200 bg-white px-2.5 py-1 group-open:inline-flex">
            접기
          </span>
        </div>
      </summary>

      <div className="border-t border-slate-200 px-5 pb-5 pt-2">
        {logs.length === 0 ? (
          <EmptyState message="최근 수정 이력이 없습니다." />
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <TableScrollHint />
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2.5 text-left font-semibold">대상</th>
                    <th className="px-3 py-2.5 text-left font-semibold">대상명</th>
                    <th className="px-3 py-2.5 text-left font-semibold">작업유형</th>
                    <th className="px-3 py-2.5 text-left font-semibold">수정자</th>
                    <th className="px-3 py-2.5 text-left font-semibold">수정일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="text-slate-600">
                      <td className="px-3 py-2.5">{getTargetLabel(log.target_type)}</td>
                      <td className="px-3 py-2.5">{log.target_name ?? "-"}</td>
                      <td className="px-3 py-2.5">{getActionLabel(log.action_type)}</td>
                      <td className="px-3 py-2.5">{log.changed_by_name}</td>
                      <td className="whitespace-nowrap px-3 py-2.5">
                        {formatDateTime(log.changed_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </details>
  );
}

export function DashboardTables({ lists }: DashboardTablesProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <ProgramListSection scheduled={lists.scheduled} completed={lists.completed} />
      <AuditLogSection logs={lists.recentAuditLogs} />
    </div>
  );
}
