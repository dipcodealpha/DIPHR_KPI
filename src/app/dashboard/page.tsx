import { KpiCard } from "@/components/dashboard/kpi-card";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardTables } from "@/components/dashboard/dashboard-tables";
import { MessageBox } from "@/components/ui/message-box";
import { getDashboardData } from "@/lib/dashboard";
import { formatNumber } from "@/lib/format";

const DATA_QUERY_GUIDANCE =
  "Supabase 프로젝트가 일시 중지되었거나 Vercel 환경변수, 네트워크, DB 조회 권한에 문제가 있을 수 있습니다. Supabase 프로젝트 상태와 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 값을 확인해 주세요.";

interface DashboardPageProps {
  searchParams?: Promise<{
    year?: string;
    projectId?: string;
    manager?: string;
    status?: string;
  }>;
}

function formatDecimal(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
}

function formatSignedDecimal(value: number) {
  const rounded = Number(value.toFixed(1));

  if (rounded === 0) {
    return "0.0";
  }

  return `${rounded > 0 ? "+" : "-"}${formatDecimal(Math.abs(rounded))}`;
}

function buildTotalComparisonText({
  basisLabel,
  current,
  total,
  unit
}: {
  basisLabel: string;
  current: number;
  total: number;
  unit: string;
}) {
  if (total <= 0) {
    return `${basisLabel}: 비교 기준 없음`;
  }

  const ratio = (current / total) * 100;

  return `${basisLabel}: ${formatNumber(total)}${unit} 중 ${formatNumber(current)}${unit} · ${formatDecimal(ratio)}%`;
}

function buildAverageComparisonText({
  basisLabel,
  current,
  average,
  unit
}: {
  basisLabel: string;
  current: number;
  average: number;
  unit: string;
}) {
  if (average <= 0) {
    return `${basisLabel}: 비교 기준 없음`;
  }

  const difference = current - average;

  return `${basisLabel}: 전체 평균 ${formatDecimal(average)}${unit} 대비 ${formatSignedDecimal(difference)}${unit}`;
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
          message={`${error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요."} ${DATA_QUERY_GUIDANCE}`}
        />
      </div>
    );
  }

  const comparisonBasisLabel = data.kpiComparison.basisLabel;
  const comparisonKpi = data.kpiComparison.kpi;

  return (
    <div className="space-y-6">
      <DashboardFilters filters={data.filters} selected={data.selected} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          eyebrow="운영 현황"
          title="총 교육 수"
          value={`${formatNumber(data.kpi.totalPrograms)}건`}
          comparison={buildTotalComparisonText({
            basisLabel: comparisonBasisLabel,
            current: data.kpi.totalPrograms,
            total: comparisonKpi.totalPrograms,
            unit: "건"
          })}
          subValue={
            data.kpi.totalProjects > 0
              ? `${formatNumber(data.kpi.totalProjects)}개 사업 기준`
              : "집계된 사업이 없습니다."
          }
          description="현재 선택된 필터 기준의 전체 교육 운영 건수"
        />

        <KpiCard
          eyebrow="성과 지표"
          title="총 수료자 수"
          value={`${formatNumber(data.kpi.totalCompletionCount)}명`}
          comparison={buildTotalComparisonText({
            basisLabel: comparisonBasisLabel,
            current: data.kpi.totalCompletionCount,
            total: comparisonKpi.totalCompletionCount,
            unit: "명"
          })}
          subValue={
            data.kpi.totalPrograms > 0
              ? `${formatNumber(data.kpi.totalPrograms)}개 교육 기준`
              : "집계된 교육이 없습니다."
          }
          description="현재 선택된 필터 기준의 누적 수료자 수"
        />

        <KpiCard
          eyebrow="평균 지표"
          title="회당 평균 수료자 수"
          value={`${formatNumber(data.kpi.averageCompletionPerProgram)}명`}
          comparison={buildAverageComparisonText({
            basisLabel: comparisonBasisLabel,
            current: data.kpi.averageCompletionPerProgram,
            average: comparisonKpi.averageCompletionPerProgram,
            unit: "명"
          })}
          subValue={
            data.kpi.totalPrograms > 0
              ? "교육 1건당 평균 수료자"
              : "계산 가능한 교육 데이터가 없습니다."
          }
          description="현재 선택된 필터 기준 총 수료자 수를 총 교육 수로 나눈 평균값"
        />

        <KpiCard
          eyebrow="운영 규모"
          title="총 교육시수"
          value={`${formatNumber(data.kpi.totalHours)}시간`}
          comparison={buildTotalComparisonText({
            basisLabel: comparisonBasisLabel,
            current: data.kpi.totalHours,
            total: comparisonKpi.totalHours,
            unit: "시간"
          })}
          subValue={
            data.kpi.totalPrograms > 0
              ? `회당 평균 ${formatNumber(data.kpi.averageHoursPerProgram)}시간`
              : "계산 가능한 교육 데이터가 없습니다."
          }
          description="현재 선택된 필터 기준의 누적 교육 시수"
        />
      </section>

      <DashboardCharts charts={data.charts} selected={data.selected} />
      <DashboardTables lists={data.lists} />
    </div>
  );
}
