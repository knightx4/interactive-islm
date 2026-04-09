"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Label,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChartFrame from "@/components/islm/layout/ChartFrame";
import InfoHint from "@/components/islm/layout/InfoHint";
import {
  AllViewLegendItem,
  AllViewLegendRow,
} from "@/components/islm/layout/AllViewChartLegend";
import {
  ALL_VIEW_MARGIN,
  ALL_VIEW_TICK,
  ALL_VIEW_X_TICKS,
  ALL_VIEW_Y_TICKS,
} from "@/components/islm/chartAllView";
import {
  buildIsChartSeries,
  computeInvestmentShift,
  computeIsPanelEquilibrium,
  computeSavingsShift,
} from "@/lib/islmModel";

interface ISChartProps {
  params: {
    investment: number;
    savings: number;
  };
  compact?: boolean;
  /** Merged into ChartFrame (e.g. tighter sidebar layout in “All” view). */
  frameClassName?: string;
  /** Compact card + fill-height chart for the combined “All” dashboard column */
  allView?: boolean;
}

interface EquilibriumPoint {
  x: number;
  y: number;
}

export default function ISChart({
  params,
  compact = false,
  frameClassName,
  allView = false,
}: ISChartProps) {
  const [chartData, setChartData] = useState<
    { x: number; investmentY: number; savingsY: number }[]
  >([]);
  const [equilibrium, setEquilibrium] = useState<EquilibriumPoint | null>(null);

  useEffect(() => {
    const investmentShift = computeInvestmentShift(params.investment);
    const savingsShift = computeSavingsShift(params.savings);
    setChartData(buildIsChartSeries(investmentShift, savingsShift));
    setEquilibrium(computeIsPanelEquilibrium(investmentShift, savingsShift));
  }, [params.investment, params.savings]);

  const chartMargin = allView ? ALL_VIEW_MARGIN : { top: 6, right: 12, left: 40, bottom: 26 };

  return (
    <motion.div
      initial={allView ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: allView ? 0 : 0.5 }}
      className="flex h-full min-h-0 w-full flex-1 flex-col"
    >
      <Card
        className={
          allView
            ? "flex h-full min-h-0 w-full min-w-0 flex-col gap-0 overflow-hidden border py-0 shadow-sm"
            : "flex h-full min-h-0 flex-1 flex-col overflow-hidden"
        }
      >
        <CardHeader
          className={
            allView
              ? "flex flex-row flex-wrap items-center justify-between gap-x-1 gap-y-0.5 space-y-0 px-1 pb-0 pt-0"
              : "shrink-0 flex items-center justify-between gap-1 px-3 pt-1 pb-1"
          }
        >
          <CardTitle
            className={
              allView
                ? "min-w-0 flex-1 truncate text-[10px] font-semibold leading-tight"
                : compact
                  ? "text-base"
                  : "text-lg"
            }
          >
            Investment & Savings (IS)
          </CardTitle>
          {allView && (
            <AllViewLegendRow>
              <AllViewLegendItem color="#3b82f6" label="I" />
              <AllViewLegendItem color="#10b981" label="S" />
            </AllViewLegendRow>
          )}
          {!allView && (
            <InfoHint
              text="Fiscal policy (G, T) shifts the combined IS curve in the IS-LM panel below, not these decomposed schedules."
              className="ml-auto"
            />
          )}
        </CardHeader>
        <CardContent
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden",
            allView && "px-0.5 pb-0 pt-0"
          )}
        >
          <ChartFrame
            compact={allView ? true : compact}
            fill={allView}
            className={allView ? undefined : frameClassName}
          >
              <LineChart
                data={chartData}
                margin={chartMargin}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="x"
                  type="number"
                  tick={allView ? ALL_VIEW_TICK : { fontSize: 12 }}
                  ticks={allView ? [...ALL_VIEW_X_TICKS] : undefined}
                  domain={[0, 100]}
                  allowDataOverflow={!allView}
                  height={allView ? 12 : compact ? 28 : 36}
                  tickMargin={allView ? 2 : undefined}
                >
                  {!allView && (
                    <Label
                      value="Activity (index)"
                      position="bottom"
                      offset={5}
                    />
                  )}
                </XAxis>
                <YAxis
                  tick={allView ? ALL_VIEW_TICK : { fontSize: 12 }}
                  ticks={allView ? [...ALL_VIEW_Y_TICKS] : undefined}
                  domain={[0, 20]}
                  allowDataOverflow={!allView}
                  width={allView ? 18 : compact ? 44 : 56}
                  tickMargin={allView ? 2 : undefined}
                >
                  {!allView && (
                    <Label value="r (index)" angle={-90} position="left" />
                  )}
                </YAxis>
                <Tooltip
                  formatter={(value, name) => {
                    if (typeof value === "number") {
                      if (allView) {
                        const series =
                          name === "I"
                            ? "Investment (I)"
                            : name === "S"
                              ? "Savings (S)"
                              : String(name ?? "");
                        return [`${value.toFixed(2)}`, series];
                      }
                      return [`${value.toFixed(2)}`, ""];
                    }
                    return [value ?? "", ""];
                  }}
                  labelFormatter={(value) =>
                    allView ? `Activity ${value} · r (index)` : `Index: ${value}`
                  }
                />
                {!allView && <Legend verticalAlign="top" height={28} />}

                <Line
                  name={allView ? "I" : "Investment (I)"}
                  type="monotone"
                  dataKey="investmentY"
                  stroke="#3b82f6"
                  strokeWidth={allView ? 1.5 : 2}
                  dot={false}
                  animationDuration={500}
                />
                <Line
                  name={allView ? "S" : "Savings (S)"}
                  type="monotone"
                  dataKey="savingsY"
                  stroke="#10b981"
                  strokeWidth={allView ? 1.5 : 2}
                  dot={false}
                  animationDuration={500}
                />

                {equilibrium && (
                  <ReferenceLine
                    x={equilibrium.x}
                    stroke="#6b7280"
                    strokeDasharray="3 3"
                  />
                )}

                {equilibrium && (
                  <ReferenceLine
                    y={equilibrium.y}
                    stroke="#6b7280"
                    strokeDasharray="3 3"
                  />
                )}
              </LineChart>
          </ChartFrame>
        </CardContent>
      </Card>
    </motion.div>
  );
}
