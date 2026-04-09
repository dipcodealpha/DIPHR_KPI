import Link from "next/link";
import type { DashboardFilterOptions } from "@/lib/dashboard";

interface DashboardFiltersProps {
  filters: DashboardFilterOptions;
  selected: {
    year: string;
    projectId: string;
    manager: string;
    status: string;
  };
}

export function DashboardFilters({
  filters,
  selected
}: DashboardFiltersProps) {
  return (
    <form className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          FILTER
        </div>
        <p className="mt-2 text-sm font-medium text-slate-800">
          사업연도와 조건을 선택한 뒤 대시보드 결과를 확인합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">사업연도</label>
          <select
            name="year"
            defaultValue={selected.year}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
          >
            <option value="">전체</option>
            {filters.years.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">사업</label>
          <select
            name="projectId"
            defaultValue={selected.projectId}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
          >
            <option value="">전체</option>
            {filters.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">담당자</label>
          <select
            name="manager"
            defaultValue={selected.manager}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
          >
            <option value="">전체</option>
            {filters.managers.map((manager) => (
              <option key={manager} value={manager}>
                {manager}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">상태</label>
          <select
            name="status"
            defaultValue={selected.status}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
          >
            <option value="">전체</option>
            {filters.statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded-lg border border-slate-800 bg-slate-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            필터 적용
          </button>

          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            초기화
          </Link>
        </div>
      </div>
    </form>
  );
}
