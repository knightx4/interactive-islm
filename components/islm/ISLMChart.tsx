"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Scatter,
  Label,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import ChartFrame from "@/components/islm/layout/ChartFrame";
import { cn } from "@/lib/utils";
import {
  AllViewLegendItem,
  AllViewLegendRow,
} from "@/components/islm/layout/AllViewChartLegend";
import {
  buildIslmSeries,
  computeIslmEquilibrium,
  computeIsShift,
  computeLmShift,
  OUTPUT_GAP_TOLERANCE,
  type IslmChartPoint,
  type IslmCoreParams,
} from "@/lib/islmModel";

interface ISLMChartProps {
  params: IslmCoreParams;
  onEquilibriumChange: (output: number | null) => void;
  compact?: boolean;
  /** Stretch to fill the “All” view left column so it lines up with the stacked thumbnails */
  allViewLayout?: boolean;
}

interface EquilibriumPoint {
  x: number;
  y: number;
}

const ISLM_CHART_MARGIN_ALL = { top: 0, right: 2, left: 26, bottom: 14 };
const ISLM_CHART_MARGIN_STANDALONE = { top: 6, right: 12, left: 40, bottom: 26 };

const ISLMChart: React.FC<ISLMChartProps> = ({
  params,
  onEquilibriumChange,
  compact = false,
  allViewLayout = false,
}) => {
  const [chartData, setChartData] = useState<IslmChartPoint[]>([]);
  const [equilibrium, setEquilibrium] = useState<EquilibriumPoint | null>(null);
  const [outputGap, setOutputGap] = useState<number | null>(null);

  useEffect(() => {
    const isShift = computeIsShift(
      params.investment,
      params.savings,
      params.governmentSpending,
      params.taxes
    );
    const lmShift = computeLmShift(params.moneyDemand, params.moneySupply);
    setChartData(buildIslmSeries(isShift, lmShift));

    const eq = computeIslmEquilibrium(params);
    if (eq) {
      setEquilibrium({ x: eq.equilibriumX, y: eq.equilibriumY });
      setOutputGap(eq.outputGap);
      onEquilibriumChange(eq.equilibriumX);
    } else {
      setEquilibrium(null);
      setOutputGap(null);
      onEquilibriumChange(null);
    }
  }, [params, onEquilibriumChange]);

  const chartMargin = allViewLayout
    ? ISLM_CHART_MARGIN_ALL
    : ISLM_CHART_MARGIN_STANDALONE;

  const yDomainAllView = useMemo<[number, number]>(() => {
    if (!chartData.length) return [0, 20];
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    for (const point of chartData) {
      minY = Math.min(minY, point.isY, point.lmY);
      maxY = Math.max(maxY, point.isY, point.lmY);
    }
    const paddedMin = Math.max(0, minY - 1.2);
    const paddedMax = Math.min(20, maxY + 1.2);
    if (paddedMin >= paddedMax) return [0, 20];
    return [paddedMin, paddedMax];
  }, [chartData]);

  return (
    <motion.div
      initial={allViewLayout ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: allViewLayout ? 0 : 0.5 }}
      className="flex h-full min-h-0 w-full flex-1 flex-col"
    >
      <Card
        className={
          allViewLayout
            ? "flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden border shadow-sm"
            : "flex h-full min-h-0 flex-1 flex-col overflow-hidden"
        }
      >
        <CardHeader
          className={
            allViewLayout
              ? "shrink-0 pb-0 pt-0.5 px-2"
              : "shrink-0 flex items-center justify-between gap-1 px-3 pt-1 pb-1"
          }
        >
          <CardTitle
            className={`${
              allViewLayout ? "text-sm" : compact ? "text-base" : "text-lg"
            } flex justify-between items-center gap-2`}
          >
            <span>IS-LM Model</span>
            {outputGap !== null && (
              <span
                className={`rounded ${
                  allViewLayout ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
                } ${
                  Math.abs(outputGap) < OUTPUT_GAP_TOLERANCE
                    ? "bg-green-100 text-green-800"
                    : outputGap > 0
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
                title={`Full employment band: within ±${OUTPUT_GAP_TOLERANCE} index units of Y*`}
              >
                {Math.abs(outputGap) < OUTPUT_GAP_TOLERANCE
                  ? allViewLayout
                    ? "Near Y*"
                    : `Near full employment (gap ${outputGap > 0 ? "+" : ""}${outputGap.toFixed(1)} index)`
                  : outputGap > 0
                  ? allViewLayout
                    ? "Y > Y*"
                    : `Inflationary gap: +${outputGap.toFixed(1)} (index)`
                  : allViewLayout
                    ? "Y < Y*"
                    : `Recessionary gap: ${outputGap.toFixed(1)} (index)`}
              </span>
            )}
          </CardTitle>
          {allViewLayout && (
            <AllViewLegendRow>
              <AllViewLegendItem color="#3b82f6" label="IS" />
              <AllViewLegendItem color="#8b5cf6" label="LM" />
            </AllViewLegendRow>
          )}
        </CardHeader>
        <CardContent
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden",
            allViewLayout && "px-1 pb-1 pt-0"
          )}
        >
          <ChartFrame compact={allViewLayout ? false : compact} fill={allViewLayout}>
              <LineChart
                data={chartData}
                margin={chartMargin}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="x"
                  type="number"
                  tick={{ fontSize: allViewLayout ? 10 : 12 }}
                  domain={[0, 100]}
                  allowDataOverflow={true}
                  height={allViewLayout ? 16 : compact ? 28 : 36}
                >
                  {!allViewLayout && (
                    <Label value="Y (output, index)" position="bottom" offset={5} />
                  )}
                </XAxis>
                <YAxis
                  tick={{ fontSize: allViewLayout ? 10 : 12 }}
                  domain={allViewLayout ? yDomainAllView : [0, 20]}
                  allowDataOverflow={true}
                  width={allViewLayout ? 30 : compact ? 44 : 56}
                >
                  {!allViewLayout && (
                    <Label value="r (interest rate, index)" angle={-90} position="left" />
                  )}
                </YAxis>
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}`, ""]}
                  labelFormatter={(value: number) => `Output (index): ${value}`}
                />
                {!allViewLayout && (
                  <Legend verticalAlign="top" height={32} wrapperStyle={{ paddingBottom: 4 }} />
                )}
                <Line
                  name="IS Curve"
                  type="monotone"
                  dataKey="isY"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />
                <Line
                  name="LM Curve"
                  type="monotone"
                  dataKey="lmY"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />
                <ReferenceLine
                  x={params.fullEmployment}
                  stroke="#ef4444"
                  strokeWidth={2}
                  label={
                    allViewLayout
                      ? {
                          value: "Y*",
                          position: "insideTopRight",
                          fontSize: 10,
                        }
                      : {
                          value: "Full employment Y*",
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
                    <Scatter
                      data={[{ x: equilibrium.x, y: equilibrium.y }]}
                      fill="#047857"
                      shape="circle"
                      name="Equilibrium"
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (!viewBox || !("x" in viewBox) || !("y" in viewBox)) return null;
                          const cx = (viewBox.x ?? 0) + (viewBox.width ?? 0) / 2;
                          const cy = (viewBox.y ?? 0) + (viewBox.height ?? 0) / 2;
                          return (
                            <g>
                              <circle cx={cx} cy={cy} r={6} fill="#047857" />
                              <text
                                x={cx + 8}
                                y={cy - 8}
                                textAnchor="start"
                                fill="#047857"
                                fontSize={12}
                                fontWeight="bold"
                              >
                                Equilibrium
                              </text>
                            </g>
                          );
                        }}
                      />
                    </Scatter>
                  </>
                )}
              </LineChart>
          </ChartFrame>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ISLMChart;
