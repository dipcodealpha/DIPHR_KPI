"use client";

interface ProjectDeactivateFormProps {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  projectName?: string;
  redirectTo: string;
  compact?: boolean;
}

export function ProjectDeactivateForm({
  action,
  id,
  projectName,
  redirectTo,
  compact = false
}: ProjectDeactivateFormProps) {
  const targetName = projectName?.trim() || "선택한 사업";
  const confirmMessage = [
    `"${targetName}" 사업을 비활성화하시겠습니까?`,
    "비활성화 후에는 새 교육 등록의 사업 선택 목록에서 제외되며, 활성 사업만 보는 화면에서 보이지 않을 수 있습니다.",
    "기존 데이터는 삭제되지 않지만, 되돌리기 기능은 현재 화면에 없습니다."
  ].join("\n\n");

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
