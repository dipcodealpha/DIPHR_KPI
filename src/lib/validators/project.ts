import { z } from "zod";

function emptyToNull(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

const nullableText = z.preprocess(emptyToNull, z.string().nullable());

export const projectCreateSchema = z.object({
  project_year: z.coerce.number().int(),
  project_name: z.string().trim().min(1, "사업명을 입력해주세요."),
  department: nullableText,
  note: nullableText,
  changed_by_name: z.string().trim().min(1, "처리자명을 입력해주세요.")
});

export const projectUpdateSchema = projectCreateSchema.extend({
  id: z.string().uuid("유효한 사업 ID가 아닙니다.")
});

export const projectDeactivateSchema = z.object({
  id: z.string().uuid("유효한 사업 ID가 아닙니다."),
  changed_by_name: z.string().trim().min(1, "처리자명을 입력해주세요.")
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type ProjectDeactivateInput = z.infer<typeof projectDeactivateSchema>;