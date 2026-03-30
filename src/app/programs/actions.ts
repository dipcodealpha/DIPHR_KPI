"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  programCreateSchema,
  programUpdateSchema
} from "@/lib/validators/program";
import { createProgram, updateProgram } from "@/lib/programs";

export async function createProgramAction(formData: FormData) {
  const parsed = programCreateSchema.parse({
    project_id: formData.get("project_id"),
    program_name: formData.get("program_name"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
    hours: formData.get("hours"),
    completion_count: formData.get("completion_count"),
    manager_name: formData.get("manager_name"),
    created_by_name: formData.get("created_by_name"),
    note: formData.get("note")
  });

  await createProgram(parsed);

  revalidatePath("/programs");
  revalidatePath("/programs/new");
  redirect("/programs");
}

export async function updateProgramAction(formData: FormData) {
  const parsed = programUpdateSchema.parse({
    id: formData.get("id"),
    project_id: formData.get("project_id"),
    program_name: formData.get("program_name"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
    hours: formData.get("hours"),
    completion_count: formData.get("completion_count"),
    manager_name: formData.get("manager_name"),
    updated_by_name: formData.get("updated_by_name"),
    note: formData.get("note")
  });

  await updateProgram(parsed.id, parsed);

  revalidatePath("/programs");
  revalidatePath(`/programs/${parsed.id}`);
  redirect("/programs");
}