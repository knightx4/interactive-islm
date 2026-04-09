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
  buildLaborSeries,
  computeIslmAlgebraicIntersection,
  computeLaborEquilibrium,
  OUTPUT_GAP_TOLERANCE,
  type IslmCoreParams,
} from "@/lib/islmModel";

interface LaborChartProps {
  params: IslmCoreParams;
}

interface EquilibriumPoint {
  x: number;
  y: number;
  gap: number;
}

export default function LaborChart({ params }: LaborChartProps) {
  const [chartData, setChartData] = useState<
    { x: number; supplyY: number; demandY: number }[]
  >([]);
  const [equilibrium, setEquilibrium] = useState<EquilibriumPoint | null>(null);

  useEffect(() => {
    const { outputGap } = computeIslmAlgebraicIntersection(params);
    setChartData(buildLaborSeries(outputGap));
    setEquilibrium(computeLaborEquilibrium(outputGap));
  }, [params]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Labor Market</span>
            {equilibrium && (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  Math.abs(equilibrium.gap) < OUTPUT_GAP_TOLERANCE
                    ? "bg-green-100 text-green-800"
                    : equilibrium.gap > 0
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
                title={`Aligned with IS-LM output gap; band ±${OUTPUT_GAP_TOLERANCE} index units`}
              >
                {Math.abs(equilibrium.gap) < OUTPUT_GAP_TOLERANCE
                  ? "Near full employment (labor market, index)"
                  : equilibrium.gap > 0
                  ? "Excess labor demand (positive output gap)"
                  : "Excess labor supply (negative output gap)"}
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
                  <Label value="L (labor, index)" position="bottom" offset={5} />
                </XAxis>
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 20]}
                  allowDataOverflow={true}
                >
                  <Label value="w (real wage, index)" angle={-90} position="left" />
                </YAxis>
                <Tooltip
                  formatter={(value) => {
                    if (typeof value === "number") {
                      return [`${value.toFixed(2)}`, ""];
                    }
                    return [value ?? "", ""];
                  }}
                  labelFormatter={(value) => `Labor (index): ${value}`}
                />
                <Legend verticalAlign="top" height={36} />

                <Line
                  name="Labor Supply"
                  type="monotone"
                  dataKey="supplyY"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />
                <Line
                  name="Labor Demand"
                  type="monotone"
                  dataKey="demandY"
                  stroke="#3b82f6"
                  strokeWidth={2}
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
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
