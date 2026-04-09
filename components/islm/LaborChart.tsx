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
import {
  ALL_VIEW_MARGIN,
  ALL_VIEW_TICK,
  ALL_VIEW_X_TICKS,
  ALL_VIEW_Y_TICKS,
} from "@/components/islm/chartAllView";
import ChartFrame from "@/components/islm/layout/ChartFrame";
import {
  AllViewLegendItem,
  AllViewLegendRow,
} from "@/components/islm/layout/AllViewChartLegend";
import {
  buildLaborSeries,
  computeIslmAlgebraicIntersection,
  computeLaborEquilibrium,
  OUTPUT_GAP_TOLERANCE,
  type IslmCoreParams,
} from "@/lib/islmModel";

interface LaborChartProps {
  params: IslmCoreParams;
  compact?: boolean;
  frameClassName?: string;
  allView?: boolean;
}

interface EquilibriumPoint {
  x: number;
  y: number;
  gap: number;
}

export default function LaborChart({
  params,
  compact = false,
  frameClassName,
  allView = false,
}: LaborChartProps) {
  const [chartData, setChartData] = useState<
    { x: number; supplyY: number; demandY: number }[]
  >([]);
  const [equilibrium, setEquilibrium] = useState<EquilibriumPoint | null>(null);

  useEffect(() => {
    const { outputGap } = computeIslmAlgebraicIntersection(params);
    setChartData(buildLaborSeries(outputGap));
    setEquilibrium(computeLaborEquilibrium(outputGap));
  }, [params]);

  const chartMargin = allView ? ALL_VIEW_MARGIN : { top: 6, right: 12, left: 40, bottom: 26 };

  const badgeLong =
    equilibrium &&
    (Math.abs(equilibrium.gap) < OUTPUT_GAP_TOLERANCE
      ? "Near full employment (labor market, index)"
      : equilibrium.gap > 0
        ? "Excess labor demand (positive output gap)"
        : "Excess labor supply (negative output gap)");

  const badgeShort =
    equilibrium &&
    (Math.abs(equilibrium.gap) < OUTPUT_GAP_TOLERANCE
      ? "Near Y*"
      : equilibrium.gap > 0
        ? "Y > Y*"
        : "Y < Y*");

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
            className={`${
              allView ? "min-w-0 flex-1 text-[10px] font-semibold leading-tight" : compact ? "text-base" : "text-lg"
            } flex items-center justify-between gap-1`}
          >
            <span className={allView ? "min-w-0 truncate" : undefined}>
              {allView ? "Labor" : "Labor Market"}
            </span>
            {equilibrium && (
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 ${
                  allView ? "text-[9px] px-1" : "text-xs sm:text-xs"
                } ${
                  Math.abs(equilibrium.gap) < OUTPUT_GAP_TOLERANCE
                    ? "bg-green-100 text-green-800"
                    : equilibrium.gap > 0
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                }`}
                title={`Aligned with IS-LM output gap; band ±${OUTPUT_GAP_TOLERANCE} index units`}
              >
                {allView ? badgeShort : badgeLong}
              </span>
            )}
          </CardTitle>
          {allView && (
            <AllViewLegendRow>
              <AllViewLegendItem color="#22c55e" label="LS" />
              <AllViewLegendItem color="#3b82f6" label="LD" />
            </AllViewLegendRow>
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
                  {!allView && <Label value="L (index)" position="bottom" offset={5} />}
                </XAxis>
                <YAxis
                  tick={allView ? ALL_VIEW_TICK : { fontSize: 12 }}
                  ticks={allView ? [...ALL_VIEW_Y_TICKS] : undefined}
                  domain={[0, 20]}
                  allowDataOverflow={!allView}
                  width={allView ? 18 : compact ? 44 : 56}
                  tickMargin={allView ? 2 : undefined}
                >
                  {!allView && <Label value="w (index)" angle={-90} position="left" />}
                </YAxis>
                <Tooltip
                  formatter={(value, name) => {
                    if (typeof value === "number") {
                      if (allView) {
                        const series =
                          name === "LS"
                            ? "Labor Supply"
                            : name === "LD"
                              ? "Labor Demand"
                              : String(name ?? "");
                        return [`${value.toFixed(2)}`, series];
                      }
                      return [`${value.toFixed(2)}`, ""];
                    }
                    return [value ?? "", ""];
                  }}
                  labelFormatter={(value) =>
                    allView ? `Labor ${value} · w (index)` : `Labor (index): ${value}`
                  }
                />
                {!allView && <Legend verticalAlign="top" height={28} />}

                <Line
                  name={allView ? "LS" : "Labor Supply"}
                  type="monotone"
                  dataKey="supplyY"
                  stroke="#22c55e"
                  strokeWidth={allView ? 1.5 : 2}
                  dot={false}
                  animationDuration={500}
                />
                <Line
                  name={allView ? "LD" : "Labor Demand"}
                  type="monotone"
                  dataKey="demandY"
                  stroke="#3b82f6"
                  strokeWidth={allView ? 1.5 : 2}
                  dot={false}
                  animationDuration={500}
                />

                {equilibrium && (
                  <>
                    <ReferenceLine
                      x={equilibrium.x}
                      stroke="#6b7280"
                      strokeDasharray="3 3"
                    />
                    <ReferenceLine
                      y={equilibrium.y}
                      stroke="#6b7280"
                      strokeDasharray="3 3"
                    />
                  </>
                )}
              </LineChart>
          </ChartFrame>
        </CardContent>
      </Card>
    </motion.div>
  );
}
