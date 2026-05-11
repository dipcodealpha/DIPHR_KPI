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
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase text-slate-500">
            {eyebrow}
          </div>
          <h3 className="mt-1 text-base font-bold text-slate-950">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          ) : null}
        </div>

        {meta ? (
          <div className="w-fit max-w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            {meta}
          </div>
        ) : null}
      </div>

      <div className="relative h-[300px] min-h-[300px] w-full sm:h-[340px] sm:min-h-[340px]">
        {children}
      </div>
    </section>
  );
}
