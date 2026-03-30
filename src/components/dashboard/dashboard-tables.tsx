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

function TableSection({
  title,
  rows
}: {
  title: string;
  rows: DashboardData["lists"]["scheduled"] | DashboardData["lists"]["completed"];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-slate-900">{title}</h3>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
          표시할 데이터가 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">사업</th>
                <th className="px-3 py-2 text-left">교육명</th>
                <th className="px-3 py-2 text-left">기간</th>
                <th className="px-3 py-2 text-left">시수</th>
                <th className="px-3 py-2 text-left">수료자수</th>
                <th className="px-3 py-2 text-left">담당자</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((program) => (
                <tr key={program.id} className="border-t border-slate-200">
                  <td className="px-3 py-2">
                    {program.project_year} / {program.project_name}
                  </td>
                  <td className="px-3 py-2">{program.program_name}</td>
                  <td className="px-3 py-2">
                    {formatDate(program.start_date)} ~ {formatDate(program.end_date)}
                  </td>
                  <td className="px-3 py-2">{program.hours}</td>
                  <td className="px-3 py-2">{program.completion_count ?? "-"}</td>
                  <td className="px-3 py-2">{program.manager_name}</td>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-slate-900">
          최근 수정 목록 10건
        </h3>

        {lists.recentAuditLogs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
            최근 수정 이력이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">대상</th>
                  <th className="px-3 py-2 text-left">작업유형</th>
                  <th className="px-3 py-2 text-left">수정자</th>
                  <th className="px-3 py-2 text-left">수정일</th>
                </tr>
              </thead>
              <tbody>
                {lists.recentAuditLogs.map((log) => (
                  <tr key={log.id} className="border-t border-slate-200">
                    <td className="px-3 py-2">{getTargetLabel(log.target_type)}</td>
                    <td className="px-3 py-2">{getActionLabel(log.action_type)}</td>
                    <td className="px-3 py-2">{log.changed_by_name}</td>
                    <td className="px-3 py-2">{formatDateTime(log.changed_at)}</td>
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