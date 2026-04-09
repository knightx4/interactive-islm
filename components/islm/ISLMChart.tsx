"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
  Label,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
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
}

interface EquilibriumPoint {
  x: number;
  y: number;
}

const ISLMChart: React.FC<ISLMChartProps> = ({ params, onEquilibriumChange }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>IS-LM Model</span>
            {outputGap !== null && (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  Math.abs(outputGap) < OUTPUT_GAP_TOLERANCE
                    ? "bg-green-100 text-green-800"
                    : outputGap > 0
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
                title={`Full employment band: within ±${OUTPUT_GAP_TOLERANCE} index units of Y*`}
              >
                {Math.abs(outputGap) < OUTPUT_GAP_TOLERANCE
                  ? `Near full employment (gap ${outputGap > 0 ? "+" : ""}${outputGap.toFixed(1)} index)`
                  : outputGap > 0
                  ? `Inflationary gap: +${outputGap.toFixed(1)} (index)`
                  : `Recessionary gap: ${outputGap.toFixed(1)} (index)`}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="x"
                  type="number"
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  allowDataOverflow={true}
                >
                  <Label value="Y (output, index)" position="bottom" offset={5} />
                </XAxis>
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 20]}
                  allowDataOverflow={true}
                >
                  <Label value="r (interest rate, index)" angle={-90} position="left" />
                </YAxis>
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}`, ""]}
                  labelFormatter={(value: number) => `Output (index): ${value}`}
                />
                <Legend verticalAlign="top" height={36} />
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
                  label={{
                    value: "Full employment Y*",
                    position: "insideTopRight",
                    fontSize: 11,
                  }}
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
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ISLMChart;
