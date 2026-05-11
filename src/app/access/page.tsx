import { AccessForm } from "@/components/access/access-form";

interface AccessPageProps {
  searchParams?: Promise<{
    redirect?: string;
  }>;
}

export default async function AccessPage({ searchParams }: AccessPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const redirectTo = resolvedSearchParams.redirect || "/dashboard";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">입장 비밀번호</h1>
          <p className="text-sm text-slate-600">
            내부 페이지 접근을 위해 공통 비밀번호를 입력하세요.
          </p>
        </div>

        <AccessForm redirectTo={redirectTo} />
      </div>
    </main>
  );
}
