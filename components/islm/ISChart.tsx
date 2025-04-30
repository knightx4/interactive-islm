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
  ResponsiveContainer,
  Label,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the type for the params prop
interface ISChartProps {
  params: {
    investment: number;
    savings: number;
  };
}

interface ChartDataPoint {
  x: number;
  investmentY: number;
  savingsY: number;
}

interface EquilibriumPoint {
  x: number;
  y: number;
}

export default function ISChart({ params }: ISChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [equilibrium, setEquilibrium] = useState<EquilibriumPoint | null>(null);

  // Compute chart data based on parameters
  useEffect(() => {
    const investmentShift = (params.investment - 50) * 0.2; // Convert to shift range of ±10
    const savingsShift = (50 - params.savings) * 0.2; // Inverted: lower slider = higher savings curve

    const newData: ChartDataPoint[] = [];
    const isSlope = -0.15;
    const sSlope = 0.15;

    // Calculate intercepts to meet at (50, 10) when parameters are neutral
    const isBaseIntercept = 10 - isSlope * 50; // Solve: 10 = slope * 50 + b
    const sBaseIntercept = 10 - sSlope * 50; // Solve: 10 = slope * 50 + b

    for (let x = 0; x <= 100; x += 5) {
      // Investment curve - fixed negative slope, shifting up/down
      const investmentY = isBaseIntercept + investmentShift + isSlope * x;

      // Savings curve - fixed positive slope, shifting up/down
      const savingsY = sBaseIntercept + savingsShift + sSlope * x;

      newData.push({
        x: x,
        investmentY: Math.max(0, Math.min(20, investmentY)),
        savingsY: Math.max(0, Math.min(20, savingsY)),
      });
    }

    setChartData(newData);

    // Calculate equilibrium
    const equilibriumX =
      (isBaseIntercept + investmentShift - (sBaseIntercept + savingsShift)) /
      (sSlope - isSlope);
    const equilibriumY = isBaseIntercept + investmentShift + isSlope * equilibriumX;

    if (
      equilibriumX >= 0 &&
      equilibriumX <= 100 &&
      equilibriumY >= 0 &&
      equilibriumY <= 20
    ) {
      setEquilibrium({
        x: equilibriumX,
        y: equilibriumY,
      });
    } else {
      setEquilibrium(null);
    }
  }, [params.investment, params.savings]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Investment & Savings (IS)</CardTitle>
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
                  <Label value="I, S" position="bottom" offset={5} />
                </XAxis>
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 20]}
                  allowDataOverflow={true}
                >
                  <Label value="r (Interest Rate)" angle={-90} position="left" />
                </YAxis>
                <Tooltip
                  formatter={(value) => {
                    if (typeof value === "number") {
                      return [`${value.toFixed(2)}`, ""];
                    }
                    return [value ?? "", ""];
                  }}
                  labelFormatter={(value) => `I,S: ${value}`}
                />
                <Legend verticalAlign="top" height={36} />

                <Line
                  name="Investment (I)"
                  type="monotone"
                  dataKey="investmentY"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />
                <Line
                  name="Savings (S)"
                  type="monotone"
                  dataKey="savingsY"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />

                {/* Vertical equilibrium line */}
                {equilibrium && (
                  <ReferenceLine
                    x={equilibrium.x}
                    stroke="#6b7280"
                    strokeDasharray="3 3"
                    label={
                      <Label
                        content={({ viewBox }) => {
                          if (!viewBox || !("x" in viewBox) || !("y" in viewBox)) return null; // Ensure viewBox has x and y properties
                          const { x = 0, y = 0, width = 0, height = 0 } = viewBox as { x: number; y: number; width: number; height: number };
                          const cx = x + width / 2;
                          const cy = y + height / 2;
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

                              </text>
                            </g>
                          );
                        }}
                      />
                    }
                  />
                )}

                {/* Horizontal equilibrium line */}
                {equilibrium && (
                  <ReferenceLine
                    y={equilibrium.y}
                    stroke="#6b7280"
                    strokeDasharray="3 3"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
