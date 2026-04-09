interface ProjectFormProps {
  action: (formData: FormData) => void | Promise<void>;
}

export function ProjectForm({ action }: ProjectFormProps) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">사업연도</label>
        <input
          name="project_year"
          type="number"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">사업명</label>
        <input
          name="project_name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">부서</label>
        <input
          name="department"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">처리자명</label>
        <input
          name="changed_by_name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          required
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-slate-700">비고</label>
        <textarea
          name="note"
          rows={4}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
        />
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          사업 등록
        </button>
      </div>
    </form>
  );
}
