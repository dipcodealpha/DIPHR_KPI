interface ExecutiveMetric {
  id: string;
  label: string;
  value: string;
  helper: string;
  comparison: string;
}

interface DashboardExecutiveSummaryProps {
  title: string;
  description: string;
  primaryMetric: ExecutiveMetric;
  metrics: ExecutiveMetric[];
  contextLabel: string;
}

export function DashboardExecutiveSummary({
  title,
  description,
  primaryMetric,
  metrics,
  contextLabel
}: DashboardExecutiveSummaryProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.85fr)]">
        <div className="border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="text-xs font-semibold uppercase text-slate-300">
            L1 Executive Summary
          </div>
          <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{description}</p>

          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.06] p-4">
            <div className="text-xs font-semibold uppercase text-slate-400">
              {primaryMetric.label}
            </div>
            <div className="mt-2 text-4xl font-bold text-white">{primaryMetric.value}</div>
            <p className="mt-2 text-sm text-slate-300">{primaryMetric.helper}</p>
            <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-slate-200">
              {primaryMetric.comparison}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-400">
                Portfolio Control
              </div>
              <h3 className="mt-1 text-base font-bold text-white">통합 운영 지표</h3>
            </div>
            <div className="w-fit rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-slate-300">
              {contextLabel}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="text-xs font-semibold uppercase text-slate-400">
                  {metric.label}
                </div>
                <div className="mt-2 text-2xl font-bold text-white">{metric.value}</div>
                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-300">
                  {metric.helper}
                </p>
                <div className="mt-3 rounded-md border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-semibold leading-5 text-slate-200">
                  {metric.comparison}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
