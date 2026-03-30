import { KpiCard } from "@/components/dashboard/kpi-card";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardTables } from "@/components/dashboard/dashboard-tables";
import { MessageBox } from "@/components/ui/message-box";
import { getDashboardData } from "@/lib/dashboard";
import { formatNumber } from "@/lib/format";

interface DashboardPageProps {
  searchParams?: Promise<{
    year?: string;
    projectId?: string;
    manager?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  try {
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const data = await getDashboardData({
      year: resolvedSearchParams.year,
      projectId: resolvedSearchParams.projectId,
      manager: resolvedSearchParams.manager
    });

    return (
      <div className="space-y-6">
        <DashboardFilters filters={data.filters} selected={data.selected} />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="총 사업 수"
            value={formatNumber(data.kpi.totalProjects)}
            description="선택된 조건 기준 활성 사업 수"
          />
          <KpiCard
            title="총 교육 수"
            value={formatNumber(data.kpi.totalPrograms)}
            description="선택된 조건 기준 교육 건수"
          />
          <KpiCard
            title="총 교육시수"
            value={formatNumber(data.kpi.totalHours)}
            description="선택된 조건 기준 누적 교육시수"
          />
          <KpiCard
            title="총 수료자 수"
            value={formatNumber(data.kpi.totalCompletionCount)}
            description="선택된 조건 기준 누적 수료자 수"
          />
        </section>

        <DashboardCharts charts={data.charts} />
        <DashboardTables lists={data.lists} />
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-6">
        <MessageBox
          tone="error"
          title="대시보드 조회 실패"
          message={error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요."}
        />
      </div>
    );
  }
}