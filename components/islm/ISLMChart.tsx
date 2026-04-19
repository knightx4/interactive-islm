"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  Customized,
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
  ALL_VIEW_TICK,
  ALL_VIEW_X_TICKS,
  ALL_VIEW_Y_TICKS,
  CHART_BASELINE_STROKE,
  CHART_BASELINE_STROKE_DASHARRAY,
  STANDALONE_CHART_MARGIN,
} from "@/components/islm/chartAllView";
import {
  buildStructuralIslmSeries,
  computeIslmAlgebraicIntersection,
  computeIslmEquilibrium,
  OUTPUT_GAP_TOLERANCE,
  type IslmChartPoint,
  type IslmCoreParams,
} from "@/lib/islmModel";

type IslmChartRow = IslmChartPoint;

interface ISLMChartProps {
  params: IslmCoreParams;
  /** Dotted comparison curves from “Set baseline”; same shape as `params`. */
  baselineParams?: IslmCoreParams | null;
  showEquilibriumGuides?: boolean;
  onEquilibriumChange: (equilibrium: { output: number; rate: number } | null) => void;
  compact?: boolean;
  /** Stretch to fill the “All” view left column so it lines up with the stacked thumbnails */
  allViewLayout?: boolean;
}

interface EquilibriumPoint {
  x: number;
  y: number;
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

const ISLM_CHART_MARGIN_ALL = { top: 9, right: 8, left: 26, bottom: 18 };
const ISLM_CHART_MARGIN_STANDALONE = { ...STANDALONE_CHART_MARGIN };

const ISLMChart: React.FC<ISLMChartProps> = ({
  params,
  baselineParams = null,
  showEquilibriumGuides = true,
  onEquilibriumChange,
  compact = false,
  allViewLayout = false,
}) => {
  const chartData = useMemo(
    (): IslmChartRow[] => buildStructuralIslmSeries(params),
    [params]
  );

  const baselineChartData = useMemo((): IslmChartRow[] | null => {
    if (!baselineParams) {
      return null;
    }
    return buildStructuralIslmSeries(baselineParams);
  }, [baselineParams]);

  const baselineSeries = useMemo((): BaselineSeries[] => {
    if (!baselineChartData) return [];
    return [
      {
        id: "baseline-is",
        points: baselineChartData.map((p) => ({ x: p.x, y: p.isY })),
      },
      {
        id: "baseline-lm",
        points: baselineChartData.map((p) => ({ x: p.x, y: p.lmY })),
      },
    ];
  }, [baselineChartData]);

  const [equilibrium, setEquilibrium] = useState<EquilibriumPoint | null>(null);
  const [outputGap, setOutputGap] = useState<number | null>(null);
  const guidePoint = useMemo(() => {
    const alg = computeIslmAlgebraicIntersection(params);
    return {
      x: Math.max(0, Math.min(100, alg.equilibriumX)),
      y: Math.max(0, Math.min(20, alg.equilibriumY)),
    };
  }, [params]);

  useEffect(() => {
    const alg = computeIslmAlgebraicIntersection(params);
    onEquilibriumChange({ output: alg.equilibriumX, rate: alg.equilibriumY });

    const eq = computeIslmEquilibrium(params);
    if (eq) {
      setEquilibrium({ x: eq.equilibriumX, y: eq.equilibriumY });
      setOutputGap(eq.outputGap);
    } else {
      setEquilibrium(null);
      setOutputGap(null);
    }
  }, [params, onEquilibriumChange]);

  const chartMargin = allViewLayout
    ? ISLM_CHART_MARGIN_ALL
    : ISLM_CHART_MARGIN_STANDALONE;

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
              ? "shrink-0 pb-0 pt-1 px-2.5"
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
            allViewLayout && "px-2 pb-2 pt-1"
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
                  tick={allViewLayout ? ALL_VIEW_TICK : { fontSize: 12 }}
                  ticks={allViewLayout ? [...ALL_VIEW_X_TICKS] : undefined}
                  tickMargin={allViewLayout ? 2 : undefined}
                  domain={[0, 100]}
                  allowDataOverflow={!allViewLayout}
                  height={allViewLayout ? 16 : compact ? 28 : 36}
                >
                  {!allViewLayout && (
                    <Label value="Y (output, index)" position="bottom" offset={5} />
                  )}
                </XAxis>
                <YAxis
                  tick={allViewLayout ? ALL_VIEW_TICK : { fontSize: 12 }}
                  ticks={allViewLayout ? [...ALL_VIEW_Y_TICKS] : undefined}
                  tickMargin={allViewLayout ? 2 : undefined}
                  domain={[0, 20]}
                  allowDataOverflow={!allViewLayout}
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
                {baselineSeries.length > 0 && (
                  <Customized component={<BaselinePaths series={baselineSeries} />} />
                )}
                <Line
                  key="live-is"
                  name="IS Curve"
                  type="monotone"
                  dataKey="isY"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />
                <Line
                  key="live-lm"
                  name="LM Curve"
                  type="monotone"
                  dataKey="lmY"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />
                {baselineParams && (
                  <ReferenceLine
                    x={baselineParams.fullEmployment}
                    stroke={CHART_BASELINE_STROKE}
                    strokeWidth={allViewLayout ? 1.5 : 2}
                    strokeDasharray={CHART_BASELINE_STROKE_DASHARRAY}
                  />
                )}
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
                {showEquilibriumGuides && (
                  <Customized
                    component={
                      <EquilibriumGuides
                        x={guidePoint.x}
                        y={guidePoint.y}
                      />
                    }
                  />
                )}
                {equilibrium && (
                  <>
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
