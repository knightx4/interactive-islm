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

interface LMChartProps {
  params: {
    moneySupply: number;
    moneyDemand: number;
  };
}

interface ChartDataPoint {
  x: number;
  moneyDemandY: number;
}

interface EquilibriumPoint {
  x: number;
  y: number;
}

export default function LMChart({ params }: LMChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [equilibrium, setEquilibrium] = useState<EquilibriumPoint | null>(null);

  useEffect(() => {
    const moneySupplyShift = params.moneySupply; // Direct position for vertical line
    const moneyDemandShift = (params.moneyDemand - 50) * 0.2; // Convert to shift range of ±10

    const newData: ChartDataPoint[] = [];
    const lSlope = -0.15;

    // Calculate intercept to pass through (50, 10) when parameters are neutral
    const lBaseIntercept = 10 - lSlope * 50; // Solve: 10 = slope * 50 + b

    for (let x = 0; x <= 100; x += 5) {
      // Money Demand curve - fixed negative slope, shifting up/down
      const moneyDemandY = lBaseIntercept + moneyDemandShift + lSlope * x;

      newData.push({
        x: x,
        moneyDemandY: Math.max(0, Math.min(20, moneyDemandY)),
      });
    }

    setChartData(newData);

    // Calculate equilibrium
    const equilibriumY = lBaseIntercept + moneyDemandShift + lSlope * moneySupplyShift;

    if (equilibriumY >= 0 && equilibriumY <= 20) {
      setEquilibrium({
        x: moneySupplyShift,
        y: equilibriumY,
      });
    } else {
      setEquilibrium(null);
    }
  }, [params.moneySupply, params.moneyDemand]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Money Market (LM)</CardTitle>
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
                  <Label value="Ms/P, L(Y)" position="bottom" offset={5} />
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
                  labelFormatter={(value) => `Value: ${value}`}
                />
                <Legend verticalAlign="top" height={36} />

                <Line
                  name="Money Demand L(Y)"
                  type="monotone"
                  dataKey="moneyDemandY"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />

                {/* Money Supply (Ms/P) - vertical line */}
                <ReferenceLine
                  x={params.moneySupply}
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  label={{
                    value: "Money Supply (Ms/P)",
                    position: "insideTopRight",
                    fontSize: 11,
                  }}
                />

                {/* Equilibrium lines */}
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
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
