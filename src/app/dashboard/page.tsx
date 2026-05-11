import Link from "next/link";
import { FolderPlus, Plus } from "lucide-react";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { DashboardExecutiveSummary } from "@/components/dashboard/dashboard-executive-summary";
import { DashboardProjectPortfolio } from "@/components/dashboard/dashboard-project-portfolio";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import {
  DashboardAuditLog,
  DashboardProgramList
} from "@/components/dashboard/dashboard-tables";
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
  const executiveMetrics = [
    {
      id: "completion",
      label: "총 수료자 수",
      value: `${formatNumber(data.kpi.totalCompletionCount)}명`,
      helper:
        data.kpi.totalPrograms > 0
          ? `${formatNumber(data.kpi.totalPrograms)}개 교육 기준`
          : "집계된 교육이 없습니다.",
      comparison: buildTotalComparisonText({
        basisLabel: comparisonBasisLabel,
        current: data.kpi.totalCompletionCount,
        total: comparisonKpi.totalCompletionCount,
        unit: "명"
      })
    },
    {
      id: "average-completion",
      label: "회당 평균 수료자",
      value: `${formatNumber(data.kpi.averageCompletionPerProgram)}명`,
      helper:
        data.kpi.totalPrograms > 0
          ? "교육 1건당 평균 수료자"
          : "계산 가능한 교육 데이터가 없습니다.",
      comparison: buildAverageComparisonText({
        basisLabel: comparisonBasisLabel,
        current: data.kpi.averageCompletionPerProgram,
        average: comparisonKpi.averageCompletionPerProgram,
        unit: "명"
      })
    },
    {
      id: "hours",
      label: "총 교육시수",
      value: `${formatNumber(data.kpi.totalHours)}시간`,
      helper:
        data.kpi.totalPrograms > 0
          ? `회당 평균 ${formatNumber(data.kpi.averageHoursPerProgram)}시간`
          : "계산 가능한 교육 데이터가 없습니다.",
      comparison: buildTotalComparisonText({
        basisLabel: comparisonBasisLabel,
        current: data.kpi.totalHours,
        total: comparisonKpi.totalHours,
        unit: "시간"
      })
    }
  ];

  return (
    <div className="space-y-5">
      <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase text-slate-500">
              Education Business Control Tower
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              교육사업 통합관리 대시보드
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              여러 교육사업의 운영 규모, 수료 성과, 사업별 분포를 한 화면에서 비교합니다.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href="/programs/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold !text-white shadow-sm transition hover:bg-slate-800"
              style={{ color: "#ffffff" }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              교육 등록
            </Link>
            <Link
              href="/projects/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FolderPlus className="h-4 w-4" aria-hidden="true" />
              사업 등록
            </Link>
          </div>
        </div>
      </header>

      <DashboardFilters filters={data.filters} selected={data.selected} />

      <DashboardExecutiveSummary
        title="전체 포트폴리오 현황"
        description="현재 조회 조건 기준으로 사업 범위, 교육 운영 규모, 수료 성과를 통합해서 봅니다."
        contextLabel={comparisonBasisLabel}
        primaryMetric={{
          id: "programs",
          label: "총 교육 수",
          value: `${formatNumber(data.kpi.totalPrograms)}건`,
          helper:
            data.kpi.totalProjects > 0
              ? `${formatNumber(data.kpi.totalProjects)}개 사업 기준`
              : "집계된 사업이 없습니다.",
          comparison: buildTotalComparisonText({
            basisLabel: comparisonBasisLabel,
            current: data.kpi.totalPrograms,
            total: comparisonKpi.totalPrograms,
            unit: "건"
          })
        }}
        metrics={executiveMetrics}
      />

      <DashboardProjectPortfolio portfolio={data.portfolio} selected={data.selected} />
      <DashboardProgramList lists={data.lists} />
      <DashboardCharts charts={data.charts} selected={data.selected} />
      <DashboardAuditLog logs={data.lists.recentAuditLogs} />
    </div>
  );
}
