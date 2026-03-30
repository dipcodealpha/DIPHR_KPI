import { formatDate, formatDateTime } from "@/lib/format";
import type { DashboardData } from "@/lib/dashboard";

interface DashboardTablesProps {
  lists: DashboardData["lists"];
}

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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
      {message}
    </div>
  );
}

function TableSection({
  title,
  rows
}: {
  title: string;
  rows: DashboardData["lists"]["scheduled"] | DashboardData["lists"]["completed"];
}) {
  return (
    <section className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Table
        </div>
        <h3 className="mt-2 text-base font-semibold text-slate-900">{title}</h3>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="표시할 데이터가 없습니다." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-3 text-left font-semibold">사업</th>
                <th className="px-3 py-3 text-left font-semibold">교육명</th>
                <th className="px-3 py-3 text-left font-semibold">기간</th>
                <th className="px-3 py-3 text-left font-semibold">시수</th>
                <th className="px-3 py-3 text-left font-semibold">수료자수</th>
                <th className="px-3 py-3 text-left font-semibold">담당자</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((program) => (
                <tr
                  key={program.id}
                  className="border-t border-slate-200 transition hover:bg-slate-50"
                >
                  <td className="px-3 py-3">
                    {program.project_year} / {program.project_name}
                  </td>
                  <td className="px-3 py-3">{program.program_name}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {formatDate(program.start_date)} ~ {formatDate(program.end_date)}
                  </td>
                  <td className="px-3 py-3">{program.hours}</td>
                  <td className="px-3 py-3">{program.completion_count ?? "-"}</td>
                  <td className="px-3 py-3">{program.manager_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function DashboardTables({ lists }: DashboardTablesProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TableSection title="예정 교육 목록" rows={lists.scheduled} />
        <TableSection title="완료 교육 목록" rows={lists.completed} />
      </div>

      <section className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
        <div className="mb-4 border-b border-slate-200 pb-3">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Audit Log
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900">
            최근 수정 목록 10건
          </h3>
        </div>

        {lists.recentAuditLogs.length === 0 ? (
          <EmptyState message="최근 수정 이력이 없습니다." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">대상</th>
                  <th className="px-3 py-3 text-left font-semibold">작업유형</th>
                  <th className="px-3 py-3 text-left font-semibold">수정자</th>
                  <th className="px-3 py-3 text-left font-semibold">수정일</th>
                </tr>
              </thead>
              <tbody>
                {lists.recentAuditLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t border-slate-200 transition hover:bg-slate-50"
                  >
                    <td className="px-3 py-3">{getTargetLabel(log.target_type)}</td>
                    <td className="px-3 py-3">{getActionLabel(log.action_type)}</td>
                    <td className="px-3 py-3">{log.changed_by_name}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {formatDateTime(log.changed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}