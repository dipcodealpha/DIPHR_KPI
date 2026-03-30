"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  projectCreateSchema,
  projectDeactivateSchema,
  projectUpdateSchema
} from "@/lib/validators/project";
import {
  createProject,
  deactivateProject,
  updateProject
} from "@/lib/projects";

export async function createProjectAction(formData: FormData) {
  const parsed = projectCreateSchema.parse({
    project_year: formData.get("project_year"),
    project_name: formData.get("project_name"),
    department: formData.get("department"),
    note: formData.get("note"),
    changed_by_name: formData.get("changed_by_name")
  });

  await createProject(
    {
      project_year: parsed.project_year,
      project_name: parsed.project_name,
      department: parsed.department,
      note: parsed.note
    },
    parsed.changed_by_name
  );

  revalidatePath("/projects");
  revalidatePath("/programs/new");
  revalidatePath("/dashboard");
  redirect("/projects?success=created");
}

export async function updateProjectAction(formData: FormData) {
  const parsed = projectUpdateSchema.parse({
    id: formData.get("id"),
    project_year: formData.get("project_year"),
    project_name: formData.get("project_name"),
    department: formData.get("department"),
    note: formData.get("note"),
    changed_by_name: formData.get("changed_by_name")
  });

  await updateProject(
    parsed.id,
    {
      project_year: parsed.project_year,
      project_name: parsed.project_name,
      department: parsed.department,
      note: parsed.note
    },
    parsed.changed_by_name
  );

  revalidatePath("/projects");
  revalidatePath("/programs/new");
  revalidatePath("/dashboard");
  redirect("/projects?success=updated");
}

export async function deactivateProjectAction(formData: FormData) {
  const parsed = projectDeactivateSchema.parse({
    id: formData.get("id"),
    changed_by_name: formData.get("changed_by_name")
  });

  await deactivateProject(parsed.id, parsed.changed_by_name);

  revalidatePath("/projects");
  revalidatePath("/programs/new");
  revalidatePath("/dashboard");
  redirect("/projects?success=deactivated");
}