interface KpiTrend {
  label: string;
  direction?: "up" | "down" | "neutral";
}

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  eyebrow?: string;
  subValue?: string;
  trend?: KpiTrend;
}

function getTrendTone(direction?: "up" | "down" | "neutral") {
  if (direction === "up") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (direction === "down") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function getTrendIcon(direction?: "up" | "down" | "neutral") {
  if (direction === "up") return "▲";
  if (direction === "down") return "▼";
  return "•";
}

export function KpiCard({
  title,
  value,
  description,
  eyebrow = "KPI",
  subValue,
  trend
}: KpiCardProps) {
  return (
    <section className="rounded-xl border border-slate-300 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {eyebrow}
        </div>

        {trend ? (
          <div
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium ${getTrendTone(
              trend.direction
            )}`}
          >
            <span>{getTrendIcon(trend.direction)}</span>
            <span>{trend.label}</span>
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-sm font-medium text-slate-700">{title}</p>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">
        {value}
      </p>

      {subValue ? (
        <p className="mt-2 text-sm font-medium text-slate-600">{subValue}</p>
      ) : null}

      {description ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
      ) : null}
    </section>
  );
}