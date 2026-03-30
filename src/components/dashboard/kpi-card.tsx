interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export function KpiCard({ title, value, description }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-xs text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}