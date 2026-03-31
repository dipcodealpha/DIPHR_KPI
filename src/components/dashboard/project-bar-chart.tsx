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
  onSelectProject?: (projectId: string) => void;
}

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
  onSelectProject
}: ProjectBarChartProps) {
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
            if (entry?.id && onSelectProject) {
              onSelectProject(entry.id);
            }
          }}
          className={onSelectProject ? "cursor-pointer" : ""}
        >
          {data.map((item, index) => (
            <Cell
              key={`${item.name}-${index}`}
              fill={BAR_COLORS[index % BAR_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}