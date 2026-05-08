interface KpiCardProps {
  title: string;
  value: string | number;
  comparison?: string;
  description?: string;
  eyebrow?: string;
  subValue?: string;
}

export function KpiCard({
  title,
  value,
  comparison,
  description,
  eyebrow = "KPI",
  subValue
}: KpiCardProps) {
  return (
    <section className="rounded-xl border border-slate-300 bg-white px-5 py-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {eyebrow}
      </div>

      <p className="mt-2 text-sm font-medium text-slate-700">{title}</p>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">
        {value}
      </p>

      {subValue ? (
        <p className="mt-2 text-sm font-medium text-slate-600">{subValue}</p>
      ) : null}

      {comparison ? (
        <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
          {comparison}
        </p>
      ) : null}

      {description ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
      ) : null}
    </section>
  );
}
