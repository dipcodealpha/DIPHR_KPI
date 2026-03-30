interface MessageBoxProps {
  tone?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
}

const toneClassMap = {
  info: "border-slate-200 bg-slate-50 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  error: "border-red-200 bg-red-50 text-red-700"
} satisfies Record<NonNullable<MessageBoxProps["tone"]>, string>;

export function MessageBox({
  tone = "info",
  title,
  message
}: MessageBoxProps) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClassMap[tone]}`}>
      {title ? <p className="font-semibold">{title}</p> : null}
      <p className={title ? "mt-1" : ""}>{message}</p>
    </div>
  );
}