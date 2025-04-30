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

interface ISLMChartProps {
  params: {
    investment: number;
    savings: number;
    moneySupply: number;
    moneyDemand: number;
    fullEmployment: number;
  };
  onEquilibriumChange: (output: number | null) => void;
}

interface ChartDataPoint {
  x: number;
  isY: number;
  lmY: number;
}

interface EquilibriumPoint {
  x: number;
  y: number;
}

const ISLMChart: React.FC<ISLMChartProps> = ({ params, onEquilibriumChange }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [equilibrium, setEquilibrium] = useState<EquilibriumPoint | null>(null);
  const [outputGap, setOutputGap] = useState<number | null>(null);

  useEffect(() => {
    const newData: ChartDataPoint[] = [];

    // Convert slider values to shifts
    const isShift =
      ((params.investment + (100 - params.savings)) / 2 - 50) * 0.2; // Combined IS shift
    const lmShift =
      ((params.moneyDemand - params.moneySupply) / 2) * 0.2; // Corrected LM shift

    // Fixed slopes for both curves
    const isSlope = -0.15; // Negative slope for IS
    const lmSlope = 0.15; // Positive slope for LM

    // Calculate intercepts to meet at (50, 10) when parameters are neutral
    const isBaseIntercept = 10 - isSlope * 50; // Solve: 10 = slope * 50 + b
    const lmBaseIntercept = 10 - lmSlope * 50; // Solve: 10 = slope * 50 + b

    // Generate points
    for (let x = 0; x <= 100; x += 2) {
      const isY = isBaseIntercept + isShift + isSlope * x;
      const lmY = lmBaseIntercept + lmShift + lmSlope * x;

      newData.push({
        x: x,
        isY: Math.max(0, Math.min(20, isY)),
        lmY: Math.max(0, Math.min(20, lmY)),
      });
    }

    setChartData(newData);

    // Calculate equilibrium (intersection of IS and LM)
    const equilibriumX =
      (isBaseIntercept + isShift - (lmBaseIntercept + lmShift)) /
      (lmSlope - isSlope);
    const equilibriumY = isBaseIntercept + isShift + isSlope * equilibriumX;

    if (
      equilibriumX >= 0 &&
      equilibriumX <= 100 &&
      equilibriumY >= 0 &&
      equilibriumY <= 20
    ) {
      setEquilibrium({ x: equilibriumX, y: equilibriumY });

      // Calculate output gap
      const outputGap = equilibriumX - params.fullEmployment;
      setOutputGap(outputGap);

      // Pass equilibrium output back to parent
      onEquilibriumChange(equilibriumX);
    } else {
      setEquilibrium(null);
      setOutputGap(null);
      onEquilibriumChange(null);
    }
  }, [
    params.investment,
    params.savings,
    params.moneySupply,
    params.moneyDemand,
    params.fullEmployment,
    onEquilibriumChange,
  ]);

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
                  Math.abs(outputGap) < 5
                    ? "bg-green-100 text-green-800"
                    : outputGap > 0
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {outputGap > 0
                  ? `Inflationary gap: +${outputGap.toFixed(1)}`
                  : outputGap < 0
                  ? `Recessionary gap: ${outputGap.toFixed(1)}`
                  : "At full employment"}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
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
                  <Label value="Y (Output)" position="bottom" offset={5} />
                </XAxis>
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 20]}
                  allowDataOverflow={true}
                >
                  <Label value="r (Interest Rate)" angle={-90} position="left" />
                </YAxis>
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}`, ""]}
                  labelFormatter={(value: number) => `Output: ${value}`}
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
                    value: "Full Employment",
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
                          if (!viewBox || !("x" in viewBox) || !("y" in viewBox)) return null; // Ensure viewBox has x and y properties
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
