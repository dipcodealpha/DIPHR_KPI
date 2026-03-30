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

function appendSuccessParam(path: string, success: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}success=${success}`;
}

function getRedirectTarget(formData: FormData, fallbackPath: string) {
  const redirectTo = formData.get("redirect_to");
  return typeof redirectTo === "string" && redirectTo.trim() ? redirectTo : fallbackPath;
}

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

  redirect(appendSuccessParam("/projects", "created"));
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

  const redirectPath = getRedirectTarget(formData, "/projects");

  revalidatePath("/projects");
  revalidatePath("/programs/new");
  revalidatePath("/dashboard");

  if (redirectPath.startsWith("/projects/")) {
    revalidatePath(redirectPath);
  }

  redirect(appendSuccessParam(redirectPath, "updated"));
}

export async function deactivateProjectAction(formData: FormData) {
  const parsed = projectDeactivateSchema.parse({
    id: formData.get("id"),
    changed_by_name: formData.get("changed_by_name")
  });

  await deactivateProject(parsed.id, parsed.changed_by_name);

  const redirectPath = getRedirectTarget(formData, "/projects");

  revalidatePath("/projects");
  revalidatePath("/programs/new");
  revalidatePath("/dashboard");

  if (redirectPath.startsWith("/projects/")) {
    revalidatePath(redirectPath);
  }

  redirect(appendSuccessParam(redirectPath, "deactivated"));
}