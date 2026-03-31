"use client";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: {
      name?: string;
      value?: number;
    };
  }>;
  label?: string;
  valueLabel: string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  valueLabel
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const item = payload[0];
  const rawValue = typeof item?.value === "number" ? item.value : 0;
  const rawLabel = item?.payload?.name ?? label ?? "-";

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <div className="text-xs font-semibold text-slate-500">{rawLabel}</div>
      <div className="mt-1 text-sm font-medium text-slate-900">
        {valueLabel}: {rawValue.toLocaleString("ko-KR")}
      </div>
    </div>
  );
}