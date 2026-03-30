import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { getProjectOptions } from "@/lib/projects";
import { getProgramById } from "@/lib/programs";
import { updateProgramAction } from "@/app/programs/actions";
import { ProgramForm } from "@/components/programs/program-form";

interface ProgramEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProgramEditPage({ params }: ProgramEditPageProps) {
  const { id } = await params;

  try {
    const [program, projectOptions] = await Promise.all([
      getProgramById(id),
      getProjectOptions()
    ]);

    const mergedProjectOptions = [...projectOptions];

    const hasCurrentProject = mergedProjectOptions.some(
      (project) => project.id === program.project_id
    );

    if (!hasCurrentProject && program.projects) {
      mergedProjectOptions.unshift({
        id: program.project_id,
        project_year: program.projects.project_year,
        project_name: program.projects.project_name,
        label: `${program.projects.project_year} / ${program.projects.project_name}`
      });
    }

    return (
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <PageTitle description="기존 교육 정보를 수정합니다." />

          <Link
            href="/programs"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
          >
            목록으로
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            현재 상태: {program.completion_count === null ? "예정" : "완료"}
          </div>

          <ProgramForm
            mode="edit"
            action={updateProgramAction}
            projectOptions={mergedProjectOptions}
            defaultValues={{
              id: program.id,
              project_id: program.project_id,
              program_name: program.program_name,
              start_date: program.start_date,
              end_date: program.end_date,
              hours: program.hours,
              completion_count: program.completion_count,
              manager_name: program.manager_name,
              updated_by_name: program.updated_by_name ?? "",
              note: program.note ?? ""
            }}
          />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}