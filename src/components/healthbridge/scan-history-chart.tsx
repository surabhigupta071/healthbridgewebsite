"use client";

import * as React from "react";
// imp Recharts components 4 bar chart visual
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, subDays } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ScanResult } from "@/lib/types";

// simple map: status string -> numeric val for chart
const statusToValue = {
  healthy: 1,
  monitor: 2,
  urgent: 3,
};

// reverse lookup for axis label formatting
const valueToStatus = ["", "Healthy", "Monitor", "Urgent"];

// chart config obj with labels and colors -- satisfies ChartConfig type :)
const chartConfig = {
  status: {
    label: "Status", // y-axis label
  },
  healthy: {
    label: "Healthy",
    color: "hsl(var(--alert-green))", // green for healthy
  },
  monitor: {
    label: "Monitor",
    color: "hsl(var(--alert-amber))", // amber for monitor
  },
  urgent: {
    label: "Urgent",
    color: "hsl(var(--destructive))", // red for urgent
  },
} satisfies ChartConfig;

// main component to show scan history as bar chart
export function ScanHistoryChart({ scans }: { scans: ScanResult[] }) {
  // memoize processed chart data for perf
  const chartData = React.useMemo(() => {
    // only last 7 days of scans r shown
    const sevenDaysAgo = subDays(new Date(), 7);
    return scans
      .filter((scan) => scan.timestamp >= sevenDaysAgo) // filter last week
      .map((scan) => ({
        date: format(scan.timestamp, "MMM d"), // format date label
        status: statusToValue[scan.status], // convert status to val
        fill: `var(--color-${scan.status})`, // color fill var per status
      }))
      .reverse(); // oldest date 1st on chart
  }, [scans]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis
          dataKey="status"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          domain={[0, 3]}
          ticks={[1, 2, 3]}
          tickFormatter={(value) => valueToStatus[value]} // show friendly status name
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(label, payload) => {
                const scan = payload[0]?.payload;
                if (!scan) return label;
                return (
                  <div>
                    <div>{label}</div>
                    <div className="text-muted-foreground font-normal">
                      Status: {valueToStatus[scan.status]}
                    </div>
                  </div>
                );
              }}
              indicator="dot"
            />
          }
        />
        <Bar dataKey="status" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
