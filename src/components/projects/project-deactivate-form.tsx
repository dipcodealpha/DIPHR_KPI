"use client";

interface ProjectDeactivateFormProps {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  redirectTo: string;
  compact?: boolean;
}

export function ProjectDeactivateForm({
  action,
  id,
  redirectTo,
  compact = false
}: ProjectDeactivateFormProps) {
  const confirmMessage = "정말로 이 사업을 비활성화하시겠습니까?";

  return (
    <form
      action={action}
      className={compact ? undefined : "mt-4 flex gap-2"}
      onSubmit={(event) => {
        const form = event.currentTarget;
        const changedByName = new FormData(form).get("changed_by_name");

        if (typeof changedByName !== "string" || !changedByName.trim()) {
          return;
        }

        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="redirect_to" value={redirectTo} />

      {compact ? (
        <div className="flex w-[160px] flex-col gap-2">
          <input
            name="changed_by_name"
            placeholder="처리자명"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100"
          >
            비활성화
          </button>
        </div>
      ) : (
        <>
          <input
            name="changed_by_name"
            placeholder="비활성화 처리자명"
            className="w-full max-w-xs rounded-xl border border-slate-300 px-4 py-3 text-sm"
            required
          />
          <button
            type="submit"
            className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
          >
            비활성화
          </button>
        </>
      )}
    </form>
  );
}
