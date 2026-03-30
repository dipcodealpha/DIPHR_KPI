interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export function KpiCard({ title, value, description }: KpiCardProps) {
  return (
    <section className="rounded-xl border border-slate-300 bg-white px-5 py-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        KPI
      </div>
      <p className="mt-2 text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
      ) : null}
    </section>
  );
}