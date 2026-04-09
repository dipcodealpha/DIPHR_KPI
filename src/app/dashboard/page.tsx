import { KpiCard } from "@/components/dashboard/kpi-card";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardTables } from "@/components/dashboard/dashboard-tables";
import { MessageBox } from "@/components/ui/message-box";
import {
  getDashboardData,
  type DashboardKpiComparisonValue
} from "@/lib/dashboard";
import { formatNumber } from "@/lib/format";

interface DashboardPageProps {
  searchParams?: Promise<{
    year?: string;
    projectId?: string;
    manager?: string;
    status?: string;
  }>;
}

function getComparisonTrend(comparison: DashboardKpiComparisonValue) {
  const { baseline, current } = comparison;

  if (baseline === 0) {
    return {
      label: "비교 없음",
      direction: "neutral" as const
    };
  }

  const ratio = Math.round((current / baseline) * 100);

  if (current > baseline) {
    return {
      label: `${ratio}%`,
      direction: "up" as const
    };
  }

  if (current < baseline) {
    return {
      label: `${ratio}%`,
      direction: "down" as const
    };
  }

  return {
    label: "100%",
    direction: "neutral" as const
  };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  let data;

  try {
    data = await getDashboardData({
      year: resolvedSearchParams.year,
      projectId: resolvedSearchParams.projectId,
      manager: resolvedSearchParams.manager,
      status: resolvedSearchParams.status
    });
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

  return (
    <div className="space-y-6">
      <DashboardFilters filters={data.filters} selected={data.selected} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          eyebrow="운영 현황"
          title="총 교육 수"
          value={`${formatNumber(data.kpi.totalPrograms)}건`}
          trend={getComparisonTrend(data.comparisons.totalPrograms)}
          subValue={
            data.kpi.totalProjects > 0
              ? `${formatNumber(data.kpi.totalProjects)}개 사업 기준`
              : "집계된 사업이 없습니다."
          }
          description="선택된 조건 기준 전체 교육 운영 건수"
        />

        <KpiCard
          eyebrow="성과 지표"
          title="총 수료자 수"
          value={`${formatNumber(data.kpi.totalCompletionCount)}명`}
          trend={getComparisonTrend(data.comparisons.totalCompletionCount)}
          subValue={
            data.kpi.totalPrograms > 0
              ? `${formatNumber(data.kpi.totalPrograms)}개 교육 기준`
              : "집계된 교육이 없습니다."
          }
          description="선택된 조건 기준 누적 수료자 수"
        />

        <KpiCard
          eyebrow="평균 지표"
          title="회당 평균 수료자 수"
          value={`${formatNumber(data.kpi.averageCompletionPerProgram)}명`}
          subValue={
            data.kpi.totalPrograms > 0
              ? "교육 1건당 평균 수료자"
              : "계산 가능한 교육 데이터가 없습니다."
          }
          description="총 수료자 수를 총 교육 수로 나눈 평균값"
        />

        <KpiCard
          eyebrow="운영 규모"
          title="총 교육시수"
          value={`${formatNumber(data.kpi.totalHours)}시간`}
          trend={getComparisonTrend(data.comparisons.totalHours)}
          subValue={
            data.kpi.totalPrograms > 0
              ? `회당 평균 ${formatNumber(data.kpi.averageHoursPerProgram)}시간`
              : "계산 가능한 교육 데이터가 없습니다."
          }
          description="선택된 조건 기준 누적 교육 시수"
        />
      </section>

      <DashboardCharts charts={data.charts} selected={data.selected} />
      <DashboardTables lists={data.lists} />
    </div>
  );
}
