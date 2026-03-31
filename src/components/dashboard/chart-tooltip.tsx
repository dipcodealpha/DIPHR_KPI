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

function getUnit(valueLabel: string) {
  if (valueLabel.includes("건수")) return "건";
  if (valueLabel.includes("수료자")) return "명";
  if (valueLabel.includes("시수")) return "시간";
  return "";
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
  const unit = getUnit(valueLabel);

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <div className="text-xs font-semibold text-slate-500">{rawLabel}</div>
      <div className="mt-1 text-sm font-medium text-slate-900">
        {valueLabel}: {rawValue.toLocaleString("ko-KR")}
        {unit}
      </div>
    </div>
  );
}