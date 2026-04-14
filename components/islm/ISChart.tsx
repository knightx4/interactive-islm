"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  Customized,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ChartFrame from "@/components/islm/layout/ChartFrame";
import {
  AllViewLegendItem,
  AllViewLegendRow,
} from "@/components/islm/layout/AllViewChartLegend";
import {
  ALL_VIEW_MARGIN,
  ALL_VIEW_TICK,
  ALL_VIEW_X_TICKS,
  ALL_VIEW_Y_TICKS,
  CHART_BASELINE_STROKE,
  CHART_BASELINE_STROKE_DASHARRAY,
  STANDALONE_CHART_MARGIN,
} from "@/components/islm/chartAllView";
import {
  buildIsChartSeries,
  computeIsPanelEquilibrium,
  computeOpenEconomyInvestmentSideShift,
  computeSavingsShift,
} from "@/lib/islmModel";

type IsChartDriverParams = {
  investment: number;
  savings: number;
  netExports: number;
};

interface ISChartProps {
  params: IsChartDriverParams;
  baselineParams?: IsChartDriverParams | null;
  showEquilibriumGuides?: boolean;
  compact?: boolean;
  /** Merged into ChartFrame (e.g. tighter sidebar layout in “All” view). */
  frameClassName?: string;
  /** Compact card + fill-height chart for the combined “All” dashboard column */
  allView?: boolean;
}

type BaselinePoint = { x: number; y: number };
type BaselineSeries = { id: string; points: BaselinePoint[] };

function BaselinePaths({
  series,
  xAxisMap,
  yAxisMap,
}: {
  series: BaselineSeries[];
  xAxisMap?: Record<string, { scale?: (v: number) => number }>;
  yAxisMap?: Record<string, { scale?: (v: number) => number }>;
}) {
  const xAxis = xAxisMap?.["0"] ?? Object.values(xAxisMap ?? {})[0];
  const yAxis = yAxisMap?.["0"] ?? Object.values(yAxisMap ?? {})[0];
  if (!xAxis?.scale || !yAxis?.scale) return null;

  return (
    <g>
      {series.map((s) => {
        if (s.points.length < 2) return null;
        const d = s.points
          .map((p, i) => `${i === 0 ? "M" : "L"} ${xAxis.scale!(p.x)} ${yAxis.scale!(p.y)}`)
          .join(" ");
        return (
          <path
            key={s.id}
            d={d}
            fill="none"
            stroke={CHART_BASELINE_STROKE}
            strokeWidth={2}
            strokeDasharray={CHART_BASELINE_STROKE_DASHARRAY}
          />
        );
      })}
    </g>
  );
}

function EquilibriumGuides({
  x,
  y,
  xAxisMap,
  yAxisMap,
}: {
  x: number;
  y: number;
  xAxisMap?: Record<string, { scale?: (v: number) => number }>;
  yAxisMap?: Record<string, { scale?: (v: number) => number }>;
}) {
  const xAxis = xAxisMap?.["0"] ?? Object.values(xAxisMap ?? {})[0];
  const yAxis = yAxisMap?.["0"] ?? Object.values(yAxisMap ?? {})[0];
  if (!xAxis?.scale || !yAxis?.scale) return null;
  const xScale = xAxis.scale;
  const yScale = yAxis.scale;

  const xCoord = xScale(Math.max(0, Math.min(100, x)));
  const yCoord = yScale(Math.max(0, Math.min(20, y)));
  const xMin = Math.min(xScale(0), xScale(100));
  const xMax = Math.max(xScale(0), xScale(100));
  const yMin = Math.min(yScale(0), yScale(20));
  const yMax = Math.max(yScale(0), yScale(20));

  return (
    <g>
      <path
        d={`M ${xCoord} ${yMin} L ${xCoord} ${yMax}`}
        fill="none"
        stroke="#6b7280"
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />
      <path
        d={`M ${xMin} ${yCoord} L ${xMax} ${yCoord}`}
        fill="none"
        stroke="#6b7280"
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />
    </g>
  );
}

type IsChartRow = {
  x: number;
  investmentY: number;
  savingsY: number;
};

export default function ISChart({
  params,
  baselineParams = null,
  showEquilibriumGuides = true,
  compact = false,
  frameClassName,
  allView = false,
}: ISChartProps) {
  const investmentShift = computeOpenEconomyInvestmentSideShift(
    params.investment,
    params.netExports ?? 0
  );
  const savingsShift = computeSavingsShift(params.savings);

  const chartData = useMemo(
    (): IsChartRow[] => buildIsChartSeries(investmentShift, savingsShift),
    [investmentShift, savingsShift]
  );

  const baselineChartData = useMemo((): IsChartRow[] | null => {
    if (!baselineParams) {
      return null;
    }
    const bInv = computeOpenEconomyInvestmentSideShift(
      baselineParams.investment,
      baselineParams.netExports ?? 0
    );
    const bSav = computeSavingsShift(baselineParams.savings);
    return buildIsChartSeries(bInv, bSav);
  }, [baselineParams]);

  const baselineSeries = useMemo((): BaselineSeries[] => {
    if (!baselineChartData) return [];
    return [
      {
        id: "baseline-i-plus-nx",
        points: baselineChartData.map((p) => ({ x: p.x, y: p.investmentY })),
      },
      {
        id: "baseline-s",
        points: baselineChartData.map((p) => ({ x: p.x, y: p.savingsY })),
      },
    ];
  }, [baselineChartData]);

  const equilibrium = useMemo(
    () => computeIsPanelEquilibrium(investmentShift, savingsShift),
    [investmentShift, savingsShift]
  );

  const chartMargin = allView ? ALL_VIEW_MARGIN : STANDALONE_CHART_MARGIN;

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
              ? "flex flex-row flex-wrap items-center justify-between gap-x-1 gap-y-0.5 space-y-0 px-2 pb-0 pt-1"
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
            I + NX and S (IS)
          </CardTitle>
          {allView && (
            <AllViewLegendRow>
              <AllViewLegendItem color="#3b82f6" label="I+NX" />
              <AllViewLegendItem color="#10b981" label="S" />
            </AllViewLegendRow>
          )}
        </CardHeader>
        <CardContent
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden",
            allView && "px-2 pb-1.5 pt-1"
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
                          name === "I+NX" || name === "I"
                            ? "I + NX (planned)"
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

                {baselineSeries.length > 0 && (
                  <Customized component={<BaselinePaths series={baselineSeries} />} />
                )}
                <Line
                  key="live-i-plus-nx"
                  name={allView ? "I+NX" : "I + NX (planned)"}
                  type="monotone"
                  dataKey="investmentY"
                  stroke="#3b82f6"
                  strokeWidth={allView ? 1.5 : 2}
                  dot={false}
                  animationDuration={500}
                />
                <Line
                  key="live-s"
                  name={allView ? "S" : "Savings (S)"}
                  type="monotone"
                  dataKey="savingsY"
                  stroke="#10b981"
                  strokeWidth={allView ? 1.5 : 2}
                  dot={false}
                  animationDuration={500}
                />

                {showEquilibriumGuides && equilibrium && (
                  <Customized
                    component={
                      <EquilibriumGuides
                        x={equilibrium.x}
                        y={equilibrium.y}
                      />
                    }
                  />
                )}
              </LineChart>
          </ChartFrame>
        </CardContent>
      </Card>
    </motion.div>
  );
}
