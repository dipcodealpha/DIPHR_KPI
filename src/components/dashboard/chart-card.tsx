import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  eyebrow?: string;
  meta?: string;
  children: ReactNode;
}

export function ChartCard({
  title,
  description,
  eyebrow = "CHART",
  meta,
  children
}: ChartCardProps) {
  return (
    <section className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {eyebrow}
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          ) : null}
        </div>

        {meta ? (
          <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {meta}
          </div>
        ) : null}
      </div>

      <div className="relative h-[360px] min-h-[360px] w-full">{children}</div>
    </section>
  );
}