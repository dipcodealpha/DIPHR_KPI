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
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase text-slate-500">
            {eyebrow}
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-700">{title}</p>
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-950">
        {value}
      </p>

      {subValue ? (
        <p className="mt-2 text-sm font-medium text-slate-600">{subValue}</p>
      ) : null}

      {comparison ? (
        <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold leading-5 text-slate-700">
          {comparison}
        </p>
      ) : null}

      {description ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
      ) : null}
    </section>
  );
}
