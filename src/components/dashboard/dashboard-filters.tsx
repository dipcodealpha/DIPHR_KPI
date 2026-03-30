import Link from "next/link";
import type { DashboardFilterOptions } from "@/lib/dashboard";

interface DashboardFiltersProps {
  filters: DashboardFilterOptions;
  selected: {
    year: string;
    projectId: string;
    manager: string;
  };
}

export function DashboardFilters({
  filters,
  selected
}: DashboardFiltersProps) {
  return (
    <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">연도</label>
          <select
            name="year"
            defaultValue={selected.year}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
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
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
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
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          >
            <option value="">전체</option>
            {filters.managers.map((manager) => (
              <option key={manager} value={manager}>
                {manager}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
          >
            필터 적용
          </button>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
          >
            초기화
          </Link>
        </div>
      </div>
    </form>
  );
}