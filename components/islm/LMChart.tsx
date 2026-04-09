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
  buildLmChartSeries,
  computeLmMoneyMarketEquilibrium,
  computeMoneyDemandShift,
} from "@/lib/islmModel";

interface LMChartProps {
  params: {
    moneySupply: number;
    moneyDemand: number;
  };
}

interface EquilibriumPoint {
  x: number;
  y: number;
}

export default function LMChart({ params }: LMChartProps) {
  const [chartData, setChartData] = useState<{ x: number; moneyDemandY: number }[]>([]);
  const [equilibrium, setEquilibrium] = useState<EquilibriumPoint | null>(null);

  useEffect(() => {
    const moneyDemandShift = computeMoneyDemandShift(params.moneyDemand);
    setChartData(buildLmChartSeries(moneyDemandShift));
    setEquilibrium(
      computeLmMoneyMarketEquilibrium(params.moneySupply, moneyDemandShift)
    );
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
          <p className="text-xs text-muted-foreground font-normal">
            This panel is the money market: vertical real money supply Ms/P and money demand L(r,
            Y). The IS-LM diagram below plots the LM curve in (Y, r) space instead.
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
                  <Label value="Ms/P, L (index)" position="bottom" offset={5} />
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
                  name="Money Demand L(Y)"
                  type="monotone"
                  dataKey="moneyDemandY"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />

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
