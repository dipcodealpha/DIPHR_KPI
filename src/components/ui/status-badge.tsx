import type { ReactNode } from "react";

interface StatusBadgeProps {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "muted";
}

const toneClassName: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  default: "border-slate-300 bg-slate-100 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  muted: "border-slate-200 bg-slate-100 text-slate-600"
};

export function StatusBadge({
  children,
  tone = "default"
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none ${toneClassName[tone]}`}
    >
      {children}
    </span>
  );
}
