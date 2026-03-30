import { z } from "zod";

function emptyToNull(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function emptyNumberToNull(value: unknown) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return value;
}

const nullableText = z.preprocess(emptyToNull, z.string().nullable());

const baseProgramSchema = z
  .object({
    project_id: z.string().uuid("사업을 선택해주세요."),
    program_name: z.string().trim().min(1, "교육명을 입력해주세요."),
    start_date: z.string().trim().min(1, "시작일을 입력해주세요."),
    end_date: z.string().trim().min(1, "종료일을 입력해주세요."),
    hours: z.coerce.number().int().positive("교육시수는 1 이상이어야 합니다."),
    completion_count: z.preprocess(
      emptyNumberToNull,
      z.coerce.number().int().min(0).nullable()
    ),
    manager_name: z.string().trim().min(1, "담당자명을 입력해주세요."),
    note: nullableText
  })
  .refine(
    (data) => {
      return new Date(data.end_date).getTime() >= new Date(data.start_date).getTime();
    },
    {
      message: "종료일은 시작일보다 빠를 수 없습니다.",
      path: ["end_date"]
    }
  );

export const programCreateSchema = baseProgramSchema.extend({
  created_by_name: z.string().trim().min(1, "등록자명을 입력해주세요.")
});

export const programUpdateSchema = baseProgramSchema.extend({
  id: z.string().uuid("유효한 교육 ID가 아닙니다."),
  updated_by_name: z.string().trim().min(1, "수정자명을 입력해주세요.")
});

export type ProgramCreateInput = z.infer<typeof programCreateSchema>;
export type ProgramUpdateInput = z.infer<typeof programUpdateSchema>;