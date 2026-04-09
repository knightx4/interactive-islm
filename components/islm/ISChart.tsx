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
}

interface EquilibriumPoint {
  x: number;
  y: number;
}

export default function ISChart({ params }: ISChartProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Investment & Savings (IS)</CardTitle>
          <p className="text-xs text-muted-foreground font-normal">
            Fiscal policy (G, T) shifts the combined IS curve in the IS-LM panel below, not these
            decomposed schedules.
          </p>
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
                  <Label value="Activity (index)" position="bottom" offset={5} />
                </XAxis>
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 20]}
                  allowDataOverflow={true}
                >
                  <Label value="r (interest rate, index)" angle={-90} position="left" />
                </YAxis>
                <Tooltip
                  formatter={(value) => {
                    if (typeof value === "number") {
                      return [`${value.toFixed(2)}`, ""];
                    }
                    return [value ?? "", ""];
                  }}
                  labelFormatter={(value) => `Index: ${value}`}
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
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
