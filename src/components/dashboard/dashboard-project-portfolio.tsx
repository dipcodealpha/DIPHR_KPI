"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, CheckCircle2, CircleDashed } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatNumber } from "@/lib/format";
import type { DashboardData } from "@/lib/dashboard";

interface DashboardProjectPortfolioProps {
  portfolio: DashboardData["portfolio"];
  selected: DashboardData["selected"];
}

function getConditionLabel(selected: DashboardData["selected"]) {
  const parts = [
    selected.year ? `${selected.year}년` : null,
    selected.manager ? selected.manager : null,
    selected.status ? selected.status : null
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : "전체 조건";
}

export function DashboardProjectPortfolio({
  portfolio,
  selected
}: DashboardProjectPortfolioProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const portfolioItems = useMemo(
    () =>
      portfolio.projects.filter(
        (project) => !selected.projectId || project.id === selected.projectId
      ),
    [portfolio.projects, selected.projectId]
  );

  const visibleYears = new Set(
    portfolioItems
      .map((project) => project.project_year)
      .filter((year) => Number.isFinite(year))
  );
  const shouldShowYear = !selected.year && visibleYears.size > 1;
  const maxProgramCount = Math.max(1, ...portfolioItems.map((project) => project.totalPrograms));
  const conditionLabel = getConditionLabel(selected);

  const handleSelectProject = (projectId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selected.projectId === projectId) {
      params.delete("projectId");
    } else {
      params.set("projectId", projectId);
    }

    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase text-slate-500">
            L2 Project Portfolio
          </div>
          <h2 className="mt-1 text-lg font-bold text-slate-950">사업 포트폴리오</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            현재 조회 조건에서 사업별 교육 수, 완료 교육, 예정 교육, 수료자 수를 같은 기준으로 비교합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            {conditionLabel}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            {formatNumber(portfolioItems.length)}개 사업
          </span>
        </div>
      </div>

      {portfolioItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          표시할 사업 데이터가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {portfolioItems.map((project) => {
            const selectedProject = selected.projectId === project.id;
            const hasPrograms = project.totalPrograms > 0;
            const completedRatio =
              project.totalPrograms > 0
                ? Math.round((project.completedPrograms / project.totalPrograms) * 100)
                : 0;
            const programRatio = Math.max(6, (project.totalPrograms / maxProgramCount) * 100);
            const metrics = [
              {
                label: "교육 수",
                value: formatNumber(project.totalPrograms),
                unit: "건",
                className: "text-slate-950"
              },
              {
                label: "완료 교육",
                value: formatNumber(project.completedPrograms),
                unit: "건",
                className: "text-emerald-700"
              },
              {
                label: "예정 교육",
                value: formatNumber(project.scheduledPrograms),
                unit: "건",
                className: "text-amber-700"
              },
              {
                label: "수료자 수",
                value: formatNumber(project.totalCompletionCount),
                unit: "명",
                className: "text-slate-950"
              }
            ];

            return (
              <article
                key={project.id}
                className={[
                  "rounded-lg border bg-white p-4 shadow-sm transition",
                  selectedProject
                    ? "border-slate-900 ring-1 ring-slate-900"
                    : "border-slate-200 hover:border-slate-300"
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3
                      className="truncate text-base font-bold text-slate-950"
                      title={project.project_name}
                    >
                      {project.project_name}
                    </h3>
                    {shouldShowYear ? (
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        사업연도 {project.project_year}
                      </p>
                    ) : null}
                  </div>

                  <StatusBadge tone={hasPrograms ? "success" : "muted"}>
                    {hasPrograms ? "교육 운영" : "조건 내 0건"}
                  </StatusBadge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs font-semibold text-slate-500">{metric.label}</div>
                      <div className={`mt-1 text-2xl font-bold ${metric.className}`}>
                        {metric.value}
                        <span className="ml-0.5 text-sm font-semibold">{metric.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>상대 교육 규모</span>
                    <span>완료 {formatNumber(completedRatio)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-700"
                      style={{ width: `${programRatio}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => handleSelectProject(project.id)}
                    aria-pressed={selectedProject}
                    className={[
                      "inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition",
                      selectedProject
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    ].join(" ")}
                  >
                    {selectedProject ? (
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <CircleDashed className="h-4 w-4" aria-hidden="true" />
                    )}
                    {selectedProject ? "선택됨" : "선택"}
                  </button>

                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    사업 정보
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
