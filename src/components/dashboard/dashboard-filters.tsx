import Link from "next/link";
import { Filter, RotateCcw } from "lucide-react";
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

function parseProjectLabel(label: string) {
  const match = label.match(/^(\d{4})\s*\/\s*(.+)$/);

  if (!match) {
    return {
      year: "",
      name: label
    };
  }

  return {
    year: match[1],
    name: match[2].trim()
  };
}

export function DashboardFilters({
  filters,
  selected
}: DashboardFiltersProps) {
  const selectedFilterCount = [
    selected.year,
    selected.projectId,
    selected.manager,
    selected.status
  ].filter(Boolean).length;

  const projectNameYears = filters.projects.reduce((acc, project) => {
    const parsed = parseProjectLabel(project.label);
    const years = acc.get(parsed.name) ?? new Set<string>();

    if (parsed.year) {
      years.add(parsed.year);
    }

    acc.set(parsed.name, years);
    return acc;
  }, new Map<string, Set<string>>());

  const getProjectDisplayLabel = (label: string) => {
    const parsed = parseProjectLabel(label);
    const hasRepeatedYears = (projectNameYears.get(parsed.name)?.size ?? 0) > 1;

    if (!parsed.year || selected.year || !hasRepeatedYears) {
      return parsed.name;
    }

    return `${parsed.name} (${parsed.year})`;
  };

  return (
    <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase text-slate-500">
            FILTER
          </div>
          <h2 className="mt-1 text-base font-bold text-slate-950">조회 조건</h2>
        </div>

        <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          적용 조건 {selectedFilterCount}개
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[minmax(132px,0.7fr)_minmax(240px,1.4fr)_minmax(160px,1fr)_minmax(132px,0.7fr)_auto] xl:items-end">
        <div className="space-y-2">
          <label htmlFor="dashboard-year" className="text-sm font-semibold text-slate-700">
            사업연도
          </label>
          <select
            id="dashboard-year"
            name="year"
            defaultValue={selected.year}
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
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
          <label htmlFor="dashboard-project" className="text-sm font-semibold text-slate-700">
            사업
          </label>
          <select
            id="dashboard-project"
            name="projectId"
            defaultValue={selected.projectId}
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
          >
            <option value="">전체</option>
            {filters.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {getProjectDisplayLabel(project.label)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="dashboard-manager" className="text-sm font-semibold text-slate-700">
            담당자
          </label>
          <select
            id="dashboard-manager"
            name="manager"
            defaultValue={selected.manager}
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
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
          <label htmlFor="dashboard-status" className="text-sm font-semibold text-slate-700">
            상태
          </label>
          <select
            id="dashboard-status"
            name="status"
            defaultValue={selected.status}
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
          >
            <option value="">전체</option>
            {filters.statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2 md:col-span-2 xl:col-span-1">
          <button
            type="submit"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 xl:flex-none"
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            필터 적용
          </button>

          <Link
            href="/dashboard"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 xl:flex-none"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            초기화
          </Link>
        </div>
      </div>
    </form>
  );
}
