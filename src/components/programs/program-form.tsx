"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectOption } from "@/types";
import { SubmitButton } from "@/components/ui/submit-button";

type ProgramFormMode = "create" | "edit";

interface ProgramFormValues {
  id?: string;
  project_id?: string;
  program_name?: string;
  start_date?: string;
  end_date?: string;
  hours?: number | string;
  completion_count?: number | string | null;
  manager_name?: string;
  created_by_name?: string;
  updated_by_name?: string | null;
  note?: string | null;
}

interface ProgramFormProps {
  mode: ProgramFormMode;
  action: (formData: FormData) => void | Promise<void>;
  projectOptions: ProjectOption[];
  defaultValues?: ProgramFormValues;
}

interface DuplicateCheckResponse {
  exists: boolean;
  count: number;
  message?: string;
}

export function ProgramForm({
  mode,
  action,
  projectOptions,
  defaultValues
}: ProgramFormProps) {
  const [projectId, setProjectId] = useState(defaultValues?.project_id ?? "");
  const [programName, setProgramName] = useState(defaultValues?.program_name ?? "");
  const [startDate, setStartDate] = useState(defaultValues?.start_date ?? "");
  const [endDate, setEndDate] = useState(defaultValues?.end_date ?? "");
  const [hours, setHours] = useState(
    defaultValues?.hours === undefined ? "" : String(defaultValues.hours)
  );
  const [completionCount, setCompletionCount] = useState(
    defaultValues?.completion_count === null || defaultValues?.completion_count === undefined
      ? ""
      : String(defaultValues.completion_count)
  );
  const [managerName, setManagerName] = useState(defaultValues?.manager_name ?? "");
  const [createdByName, setCreatedByName] = useState(defaultValues?.created_by_name ?? "");
  const [updatedByName, setUpdatedByName] = useState(defaultValues?.updated_by_name ?? "");
  const [note, setNote] = useState(defaultValues?.note ?? "");
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [duplicateErrorMessage, setDuplicateErrorMessage] = useState("");

  const invalidDateRange = useMemo(() => {
    if (!startDate || !endDate) {
      return false;
    }

    return new Date(endDate).getTime() < new Date(startDate).getTime();
  }, [startDate, endDate]);

  useEffect(() => {
    const shouldCheck = projectId && programName.trim() && startDate;

    if (!shouldCheck) {
      setDuplicateMessage("");
      setDuplicateErrorMessage("");
      setIsCheckingDuplicate(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setIsCheckingDuplicate(true);
        setDuplicateErrorMessage("");

        const params = new URLSearchParams({
          project_id: projectId,
          program_name: programName.trim(),
          start_date: startDate
        });

        if (mode === "edit" && defaultValues?.id) {
          params.set("exclude_id", defaultValues.id);
        }

        const response = await fetch(`/api/programs/check-duplicate?${params.toString()}`, {
          signal: controller.signal
        });

        const data = (await response.json()) as DuplicateCheckResponse;

        if (!response.ok) {
          setDuplicateErrorMessage(data.message || "중복 확인 중 오류가 발생했습니다.");
          setDuplicateMessage("");
          return;
        }

        setDuplicateMessage(data.exists ? data.message || "중복 가능성이 있습니다." : "");
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        setDuplicateErrorMessage("중복 확인 중 오류가 발생했습니다.");
        setDuplicateMessage("");
      } finally {
        setIsCheckingDuplicate(false);
      }
    }, 400);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [projectId, programName, startDate, mode, defaultValues?.id]);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      {mode === "edit" && defaultValues?.id ? (
        <input type="hidden" name="id" value={defaultValues.id} />
      ) : null}

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-slate-700">사업 선택</label>
        <select
          name="project_id"
          value={projectId}
          onChange={(event) => setProjectId(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          required
        >
          <option value="" disabled>
            사업을 선택해 주세요.
          </option>
          {projectOptions.map((project) => (
            <option key={project.id} value={project.id}>
              {project.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-slate-700">교육명</label>
        <input
          name="program_name"
          value={programName}
          onChange={(event) => setProgramName(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="교육명을 입력해 주세요."
          aria-describedby="program-form-status"
          required
        />
      </div>

      {(duplicateMessage || duplicateErrorMessage || isCheckingDuplicate) ? (
        <div
          id="program-form-status"
          className="md:col-span-2"
          role={duplicateErrorMessage ? "alert" : "status"}
          aria-live={duplicateErrorMessage ? "assertive" : "polite"}
          aria-atomic="true"
        >
          {isCheckingDuplicate ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              중복 여부를 확인하는 중입니다...
            </div>
          ) : null}

          {duplicateMessage ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              중복 경고: {duplicateMessage} 중복 기준은 동일 사업·동일 교육명·동일 시작일입니다.
              등록은 차단되지 않으므로 실제로 다른 회차인지 확인한 뒤 저장해 주세요.
            </div>
          ) : null}

          {duplicateErrorMessage ? (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {duplicateErrorMessage}
            </div>
          ) : null}
        </div>
      ) : (
        <div id="program-form-status" className="sr-only" aria-live="polite" aria-atomic="true">
          교육 등록 상태 메시지 영역
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">시작일</label>
        <input
          name="start_date"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">종료일</label>
        <input
          name="end_date"
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          aria-invalid={invalidDateRange ? "true" : "false"}
          aria-describedby={invalidDateRange ? "program-form-date-error" : undefined}
          required
        />
      </div>

      {invalidDateRange ? (
        <div
          id="program-form-date-error"
          className="md:col-span-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          종료일은 시작일보다 빠를 수 없습니다.
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">교육시수</label>
        <input
          name="hours"
          type="number"
          min={1}
          step={1}
          value={hours}
          onChange={(event) => setHours(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="1 이상의 정수"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">수료자수</label>
        <input
          name="completion_count"
          type="number"
          min={0}
          step={1}
          value={completionCount}
          onChange={(event) => setCompletionCount(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="비워두면 예정"
          aria-describedby="program-form-completion-help"
        />
        <p id="program-form-completion-help" className="text-xs leading-5 text-slate-500">
          비워두면 예정 교육으로 표시됩니다. 0을 입력하면 완료 교육이며 수료자 0명으로 집계됩니다.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">담당자명</label>
        <input
          name="manager_name"
          value={managerName}
          onChange={(event) => setManagerName(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="담당자명을 입력해 주세요."
          required
        />
      </div>

      {mode === "create" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">최초입력자명</label>
          <input
            name="created_by_name"
            value={createdByName}
            onChange={(event) => setCreatedByName(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
            placeholder="최초입력자명을 입력해 주세요."
            required
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">최종수정자명</label>
          <input
            name="updated_by_name"
            value={updatedByName}
            onChange={(event) => setUpdatedByName(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
            placeholder="최종수정자명을 입력해 주세요."
            required
          />
        </div>
      )}

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-slate-700">비고</label>
        <textarea
          name="note"
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="추가 메모가 있으면 입력해 주세요."
        />
      </div>

      <div className="md:col-span-2">
        <SubmitButton
          idleText={mode === "create" ? "교육 등록" : "교육 수정 저장"}
          pendingText={mode === "create" ? "교육 등록 중..." : "교육 수정 저장 중..."}
          disabled={invalidDateRange}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </form>
  );
}
