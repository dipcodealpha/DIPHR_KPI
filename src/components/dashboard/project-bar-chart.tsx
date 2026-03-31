"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { DashboardChartItem } from "@/lib/dashboard";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";

interface ProjectBarChartProps {
  data: DashboardChartItem[];
  valueLabel: string;
  selectedProjectId?: string;
  onSelectProject?: (projectId: string) => void;
}

const DEFAULT_BAR_COLOR = "#94a3b8";
const ACTIVE_BAR_COLOR = "#0f172a";
const BAR_COLORS = [
  "#334155",
  "#475569",
  "#64748b",
  "#0f766e",
  "#0369a1",
  "#6d28d9",
  "#b45309",
  "#be123c"
];

export function ProjectBarChart({
  data,
  valueLabel,
  selectedProjectId,
  onSelectProject
}: ProjectBarChartProps) {
  const hasSelectedProject = Boolean(selectedProjectId);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
        <XAxis
          type="number"
          allowDecimals={false}
          tickLine={false}
          axisLine={{ stroke: "#cbd5e1" }}
          className="text-xs"
        />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tickLine={false}
          axisLine={{ stroke: "#cbd5e1" }}
          className="text-xs"
        />
        <Tooltip content={<ChartTooltip valueLabel={valueLabel} />} />
        <Bar
          dataKey="value"
          radius={[0, 6, 6, 0]}
          onClick={(entry) => {
            if (!entry?.id || !onSelectProject) return;
            onSelectProject(entry.id);
          }}
          className={onSelectProject ? "cursor-pointer" : ""}
        >
          {data.map((item, index) => {
            const isActive = selectedProjectId === item.id;

            let fill = BAR_COLORS[index % BAR_COLORS.length];

            if (hasSelectedProject) {
              fill = isActive ? ACTIVE_BAR_COLOR : DEFAULT_BAR_COLOR;
            }

            return (
              <Cell
                key={`${item.name}-${index}`}
                fill={fill}
                fillOpacity={hasSelectedProject && !isActive ? 0.45 : 1}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}