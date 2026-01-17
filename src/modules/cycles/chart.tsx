import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Area,
  ReferenceLine,
  Dot,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Chartdata {
  date: string;
  completed: number;
  remaining: number;
  issue_progress: number;
}
// const chartData = [
//   { date: "Jan 5", scope: 135, started: 20, completed: 5 },
//   { date: "Jan 8", scope: 125, started: 35, completed: 8 },
//   { date: "Jan 10", scope: 120, started: 50, completed: 12 },
//   { date: "Jan 12", scope: 118, started: 65, completed: 15 }, // Today
//   { date: "Jan 14", scope: 115, started: 80, completed: 20 },
//   { date: "Jan 16", scope: 110, started: 95, completed: 25 },
// ];

const chartConfig = {
  remaining: {
    label: "Remaining",
    color: "#6B7280",
  },
  issue_progress: {
    label: "In Progress",
    color: "#8B7A3E",
  },
  completed: {
    label: "Completed",
    color: "#4A5FD9",
  },
};

interface chartDataProps {
  chartData : Chartdata[]
}

export function LinearStyleChart({chartData}:chartDataProps) {
  console.log("CHART DATA", chartData);

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="remainingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B7A3E" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8B7A3E" stopOpacity={0} />
            </linearGradient>

            <pattern
              id="projection-pattern"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke="#374151"
                strokeWidth="1"
                opacity="0.3"
              />
            </pattern>

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            dy={10}
            tickFormatter={(value) => {
              // Format date: "2026-01-09" -> "Jan 9"
              const date = new Date(value);
              const month = date.toLocaleDateString('en-US', { month: 'short' });
              const day = date.getDate();
              return `${month} ${day}`;
            }}
            interval="preserveStartEnd"
          />

          <YAxis hide domain={[0, 'auto']} />

          <ChartTooltip content={<ChartTooltipContent />} />

          <Area
            type="natural"
            dataKey="remaining"
            stroke="none"
            fill="url(#remainingGradient)"
            fillOpacity={1}
          />

          <Line
            type="natural"
            dataKey="completed"
            stroke={chartConfig.completed.color}
            strokeWidth={2.5}
            dot={false}
            style={{ filter: "url(#glow)" }}
          />

          <Line
            type="natural"
            dataKey="issue_progress"
            stroke={chartConfig.issue_progress.color}
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="natural"
            dataKey="remaining"
            stroke={chartConfig.remaining.color}
            strokeWidth={2}
            dot={false}
            strokeDasharray="3 3"
            opacity={0.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
