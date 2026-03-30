"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import type { DashboardData } from "@/lib/dashboard";
import { ChartCard } from "@/components/dashboard/chart-card";

interface DashboardChartsProps {
  charts: DashboardData["charts"];
}

function EmptyChart() {
  return (
    <div className="flex h-[320px] w-full min-w-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
      표시할 데이터가 없습니다.
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[320px] w-full rounded-lg border border-dashed border-slate-300 bg-slate-50" />
  );
}

function ChartContainer({
  data
}: {
  data: Array<{
    name: string;
    value: number;
  }>;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const update = () => {
      const nextWidth = Math.floor(element.getBoundingClientRect().width);
      setWidth(nextWidth > 0 ? nextWidth : 0);
    };

    update();

    const observer = new ResizeObserver(() => {
      update();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const chartWidth = width > 0 ? Math.max(width - 8, 280) : 0;

  return (
    <div ref={wrapperRef} className="h-[320px] w-full min-w-0 overflow-hidden">
      {chartWidth > 0 ? (
        <BarChart
          width={chartWidth}
          height={320}
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          <XAxis
            dataKey="name"
            className="text-xs"
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
          />
          <YAxis
            allowDecimals={false}
            className="text-xs"
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
          />
          <Tooltip />
          <Bar dataKey="value" fill="#475569" radius={[2, 2, 0, 0]} />
        </BarChart>
      ) : (
        <ChartSkeleton />
      )}
    </div>
  );
}

export function DashboardCharts({ charts }: DashboardChartsProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
      <ChartCard title="연도별 교육건수" description="선택된 조건 기준 연도별 교육 건수">
        {charts.byYear.length === 0 ? <EmptyChart /> : <ChartContainer data={charts.byYear} />}
      </ChartCard>

      <ChartCard title="연도별 교육인원" description="선택된 조건 기준 연도별 교육 인원">
        {charts.byYearParticipants.length === 0 ? (
          <EmptyChart />
        ) : (
          <ChartContainer data={charts.byYearParticipants} />
        )}
      </ChartCard>

      <ChartCard title="사업별 교육건수" description="사업별 운영 교육 건수">
        {charts.byProject.length === 0 ? (
          <EmptyChart />
        ) : (
          <ChartContainer data={charts.byProject} />
        )}
      </ChartCard>

      <ChartCard title="사업별 교육인원" description="사업별 누적 교육 인원">
        {charts.byProjectParticipants.length === 0 ? (
          <EmptyChart />
        ) : (
          <ChartContainer data={charts.byProjectParticipants} />
        )}
      </ChartCard>
    </div>
  );
}