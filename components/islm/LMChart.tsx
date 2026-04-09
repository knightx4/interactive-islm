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
import InfoHint from "@/components/islm/layout/InfoHint";
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
  buildLmChartSeries,
  computeLmMoneyMarketEquilibrium,
  computeMoneyDemandShift,
} from "@/lib/islmModel";

interface LMChartProps {
  params: {
    moneySupply: number;
    moneyDemand: number;
  };
  compact?: boolean;
  frameClassName?: string;
  allView?: boolean;
}

interface EquilibriumPoint {
  x: number;
  y: number;
}

export default function LMChart({
  params,
  compact = false,
  frameClassName,
  allView = false,
}: LMChartProps) {
  const [chartData, setChartData] = useState<{ x: number; moneyDemandY: number }[]>([]);
  const [equilibrium, setEquilibrium] = useState<EquilibriumPoint | null>(null);

  useEffect(() => {
    const moneyDemandShift = computeMoneyDemandShift(params.moneyDemand);
    setChartData(buildLmChartSeries(moneyDemandShift));
    setEquilibrium(
      computeLmMoneyMarketEquilibrium(params.moneySupply, moneyDemandShift)
    );
  }, [params.moneySupply, params.moneyDemand]);

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
            Money Market (LM)
          </CardTitle>
          {allView && (
            <AllViewLegendRow>
              <AllViewLegendItem color="#f59e0b" label="Md" />
              <AllViewLegendItem color="#8b5cf6" label="Ms/P" vertical />
            </AllViewLegendRow>
          )}
          {!allView && (
            <InfoHint
              text="This panel is the money market: vertical real money supply Ms/P and money demand L(r, Y). The IS-LM diagram below plots the LM curve in (Y, r) space instead."
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
                  {!allView && <Label value="Ms/P, L" position="bottom" offset={5} />}
                </XAxis>
                <YAxis
                  tick={allView ? ALL_VIEW_TICK : { fontSize: 12 }}
                  ticks={allView ? [...ALL_VIEW_Y_TICKS] : undefined}
                  domain={[0, 20]}
                  allowDataOverflow={!allView}
                  width={allView ? 18 : compact ? 44 : 56}
                  tickMargin={allView ? 2 : undefined}
                >
                  {!allView && <Label value="r (index)" angle={-90} position="left" />}
                </YAxis>
                <Tooltip
                  formatter={(value, name) => {
                    if (typeof value === "number") {
                      if (allView && name === "Md") {
                        return [`${value.toFixed(2)}`, "Money demand L(Y)"];
                      }
                      return [`${value.toFixed(2)}`, ""];
                    }
                    return [value ?? "", ""];
                  }}
                  labelFormatter={(value) =>
                    allView ? `Real balances ${value} · r (index)` : `Index: ${value}`
                  }
                />
                {!allView && <Legend verticalAlign="top" height={28} />}

                <Line
                  name={allView ? "Md" : "Money Demand L(Y)"}
                  type="monotone"
                  dataKey="moneyDemandY"
                  stroke="#f59e0b"
                  strokeWidth={allView ? 1.5 : 2}
                  dot={false}
                  animationDuration={500}
                />

                <ReferenceLine
                  x={params.moneySupply}
                  stroke="#8b5cf6"
                  strokeWidth={allView ? 1.5 : 2}
                  label={
                    allView
                      ? {
                          value: "Ms/P",
                          position: "insideTopRight",
                          fontSize: 8,
                          fill: "#6b7280",
                        }
                      : {
                          value: "Money Supply (Ms/P)",
                          position: "insideTopRight",
                          fontSize: 11,
                        }
                  }
                />

                {equilibrium && (
                  <>
                    <ReferenceLine
                      y={equilibrium.y}
                      stroke="#6b7280"
                      strokeDasharray="3 3"
                    />
                    <ReferenceLine
                      x={equilibrium.x}
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
