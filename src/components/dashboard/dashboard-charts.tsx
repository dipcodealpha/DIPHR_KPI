"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { DashboardData } from "@/lib/dashboard";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { ProjectBarChart } from "@/components/dashboard/project-bar-chart";

interface DashboardChartsProps {
  charts: DashboardData["charts"];
  selected: DashboardData["selected"];
}

function EmptyChart() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
      표시할 데이터가 없습니다.
    </div>
  );
}

function TrendChart({
  data,
  valueLabel
}: {
  data: Array<{
    name: string;
    value: number;
  }>;
  valueLabel: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={{ stroke: "#cbd5e1" }}
          className="text-xs"
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={{ stroke: "#cbd5e1" }}
          className="text-xs"
        />
        <Tooltip content={<ChartTooltip valueLabel={valueLabel} />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#334155"
          strokeWidth={3}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function SummaryBarChart({
  data,
  valueLabel
}: {
  data: Array<{
    name: string;
    value: number;
  }>;
  valueLabel: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={{ stroke: "#cbd5e1" }}
          className="text-xs"
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={{ stroke: "#cbd5e1" }}
          className="text-xs"
        />
        <Tooltip content={<ChartTooltip valueLabel={valueLabel} />} />
        <Bar dataKey="value" fill="#475569" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DashboardCharts({ charts, selected }: DashboardChartsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSummary = useMemo(() => {
    const summaryItems = [
      selected.year ? `사업연도 ${selected.year}` : null,
      selected.manager ? `담당자 ${selected.manager}` : null,
      selected.status ? `상태 ${selected.status}` : null
    ].filter(Boolean);

    return summaryItems.length > 0 ? summaryItems.join(" · ") : "전체 조건";
  }, [selected.year, selected.manager, selected.status]);

  const selectedProjectName = useMemo(() => {
    if (!selected.projectId) return "";

    const foundProject =
      charts.byProject.find((item) => item.id === selected.projectId) ??
      charts.byProjectParticipants.find((item) => item.id === selected.projectId);

    return foundProject?.name ?? "";
  }, [charts.byProject, charts.byProjectParticipants, selected.projectId]);

  const handleSelectProject = (projectId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selected.projectId === projectId) {
      params.delete("projectId");
    } else {
      params.set("projectId", projectId);
    }

    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const projectMeta = selected.projectId
    ? `선택 사업: ${selectedProjectName || "현재 선택됨"}`
    : "클릭하여 사업 필터 적용";

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
      <ChartCard
        eyebrow="SUMMARY"
        title="실시연도별 교육건수"
        description="사업연도 등 현재 필터를 적용한 뒤, 교육 시작일 기준 연도별 운영 건수로 집계합니다."
        meta="보조 요약 차트"
      >
        {charts.byYear.length === 0 ? (
          <EmptyChart />
        ) : (
          <SummaryBarChart data={charts.byYear} valueLabel="교육건수" />
        )}
      </ChartCard>

      <ChartCard
        eyebrow="SUMMARY"
        title="실시연도별 수료자 수"
        description="사업연도 등 현재 필터를 적용한 뒤, 교육 시작일 기준 연도별 누적 수료자 수로 집계합니다."
        meta="보조 요약 차트"
      >
        {charts.byYearParticipants.length === 0 ? (
          <EmptyChart />
        ) : (
          <SummaryBarChart data={charts.byYearParticipants} valueLabel="수료자 수" />
        )}
      </ChartCard>

      <ChartCard
        eyebrow="TREND"
        title="월별 교육건수"
        description="사업연도 등 현재 필터를 적용한 뒤, 교육 시작일 기준 월별 교육 건수로 집계합니다."
        meta={currentSummary}
      >
        {charts.byMonthPrograms.length === 0 ? (
          <EmptyChart />
        ) : (
          <TrendChart data={charts.byMonthPrograms} valueLabel="교육건수" />
        )}
      </ChartCard>

      <ChartCard
        eyebrow="TREND"
        title="월별 수료자 수"
        description="사업연도 등 현재 필터를 적용한 뒤, 교육 시작일 기준 월별 누적 수료자 수로 집계합니다."
        meta={currentSummary}
      >
        {charts.byMonthCompletions.length === 0 ? (
          <EmptyChart />
        ) : (
          <TrendChart data={charts.byMonthCompletions} valueLabel="수료자 수" />
        )}
      </ChartCard>

      <ChartCard
        eyebrow="PROJECT"
        title="사업별 교육건수"
        description="운영 건수가 큰 순서대로 비교합니다. 같은 막대를 다시 클릭하면 사업 선택이 해제됩니다."
        meta={projectMeta}
      >
        {charts.byProject.length === 0 ? (
          <EmptyChart />
        ) : (
          <ProjectBarChart
            data={charts.byProject}
            valueLabel="교육건수"
            selectedProjectId={selected.projectId}
            onSelectProject={handleSelectProject}
          />
        )}
      </ChartCard>

      <ChartCard
        eyebrow="PROJECT"
        title="사업별 수료자 수"
        description="누적 수료자 수가 큰 순서대로 비교합니다. 같은 막대를 다시 클릭하면 사업 선택이 해제됩니다."
        meta={projectMeta}
      >
        {charts.byProjectParticipants.length === 0 ? (
          <EmptyChart />
        ) : (
          <ProjectBarChart
            data={charts.byProjectParticipants}
            valueLabel="수료자 수"
            selectedProjectId={selected.projectId}
            onSelectProject={handleSelectProject}
          />
        )}
      </ChartCard>
    </div>
  );
}
