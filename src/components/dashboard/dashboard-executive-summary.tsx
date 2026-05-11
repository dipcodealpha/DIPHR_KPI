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
    <section className="overflow-hidden rounded-lg bg-[#020617] text-[#F8FAFC] shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.85fr)]">
        <div className="border-b border-[#1E293B] p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="text-xs font-semibold uppercase text-[#BFDBFE]">
            L1 Executive Summary
          </div>
          <h2 className="mt-2 text-2xl font-bold !text-[#F8FAFC]">{title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#CBD5E1]">{description}</p>

          <div className="mt-6 rounded-lg border border-[#334155] bg-[#0F172A] p-4">
            <div className="text-xs font-semibold uppercase text-[#BFDBFE]">
              {primaryMetric.label}
            </div>
            <div className="mt-2 text-4xl font-bold text-white">{primaryMetric.value}</div>
            <p className="mt-2 text-sm text-[#CBD5E1]">{primaryMetric.helper}</p>
            <div className="mt-4 inline-flex rounded-full border border-[#475569] bg-[#1E293B] px-3 py-1 text-xs font-semibold text-[#F8FAFC]">
              {primaryMetric.comparison}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase text-[#BFDBFE]">
                Portfolio Control
              </div>
              <h3 className="mt-1 text-base font-bold !text-[#F8FAFC]">통합 운영 지표</h3>
            </div>
            <div className="w-fit rounded-full border border-[#475569] bg-[#1E293B] px-3 py-1 text-xs font-semibold text-[#F8FAFC]">
              {contextLabel}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-lg border border-[#334155] bg-[#0F172A] p-4"
              >
                <div className="text-xs font-semibold uppercase text-[#BFDBFE]">
                  {metric.label}
                </div>
                <div className="mt-2 text-2xl font-bold text-white">{metric.value}</div>
                <p className="mt-2 min-h-10 text-sm leading-5 text-[#CBD5E1]">
                  {metric.helper}
                </p>
                <div className="mt-3 rounded-md border border-[#475569] bg-[#1E293B] px-3 py-2 text-xs font-semibold leading-5 text-[#F8FAFC]">
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
