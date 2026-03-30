interface MessageBoxProps {
  tone?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
}

const toneClassMap = {
  info: "border-slate-300 bg-slate-50 text-slate-700",
  success: "border-emerald-200 bg-emerald-50/60 text-emerald-800",
  warning: "border-amber-200 bg-amber-50/70 text-amber-800",
  error: "border-red-200 bg-red-50/70 text-red-800"
} satisfies Record<NonNullable<MessageBoxProps["tone"]>, string>;

export function MessageBox({
  tone = "info",
  title,
  message
}: MessageBoxProps) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${toneClassMap[tone]}`}>
      {title ? <p className="font-semibold leading-6">{title}</p> : null}
      <p className={title ? "mt-1 leading-6" : "leading-6"}>{message}</p>
    </div>
  );
}