
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, 
  ResponsiveContainer, Label, Scatter
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ISLMChart({ params }) {
  const [chartData, setChartData] = useState([]);
  const [equilibrium, setEquilibrium] = useState(null);
  const [outputGap, setOutputGap] = useState(null);

  useEffect(() => {
    const newData = [];
    
    // Convert slider values to shifts
    // Invert savings for consistency with IS chart
    const isShift = ((params.investment + (100 - params.savings)) / 2 - 50) * 0.2;  // Combined IS shift
    const lmShift = ((params.moneySupply + params.moneyDemand) / 2 - 50) * 0.2; // Combined LM shift
    
    // Fixed slopes for both curves
    const isSlope = -0.15;  // Negative slope for IS
    const lmSlope = 0.15;   // Positive slope for LM
    
    // Calculate intercepts to meet at (50, 10) when parameters are neutral
    const isBaseIntercept = 10 - (isSlope * 50);    // Solve: 10 = slope * 50 + b
    const lmBaseIntercept = 10 - (lmSlope * 50);    // Solve: 10 = slope * 50 + b
    
    // Generate points
    for (let x = 0; x <= 100; x += 2) {
      // IS curve with fixed slope and shifting intercept
      const isY = (isBaseIntercept + isShift) + (isSlope * x);
      
      // LM curve with fixed slope and shifting intercept
      const lmY = (lmBaseIntercept + lmShift) + (lmSlope * x);
      
      newData.push({
        x: x,
        isY: Math.max(0, Math.min(20, isY)),
        lmY: Math.max(0, Math.min(20, lmY))
      });
    }
    
    setChartData(newData);
    
    // Calculate equilibrium (intersection of IS and LM)
    const equilibriumX = ((isBaseIntercept + isShift) - (lmBaseIntercept + lmShift)) / (lmSlope - isSlope);
    const equilibriumY = (isBaseIntercept + isShift) + (isSlope * equilibriumX);
    
    if (equilibriumX >= 0 && equilibriumX <= 100 && equilibriumY >= 0 && equilibriumY <= 20) {
      setEquilibrium({
        x: equilibriumX,
        y: equilibriumY
      });
      
      // Calculate output gap
      const outputGap = equilibriumX - params.fullEmployment;
      setOutputGap(outputGap);
    } else {
      setEquilibrium(null);
      setOutputGap(null);
    }
  }, [params.investment, params.savings, params.moneySupply, params.moneyDemand, params.fullEmployment]);

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
              <span className={`text-xs px-2 py-1 rounded ${
                Math.abs(outputGap) < 5 ? 'bg-green-100 text-green-800' : 
                  outputGap > 0 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {outputGap > 0 ? `Inflationary gap: +${outputGap.toFixed(1)}` : 
                 outputGap < 0 ? `Recessionary gap: ${outputGap.toFixed(1)}` : 'At full employment'}
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
                  formatter={(value) => [`${value.toFixed(2)}`, ""]}
                  labelFormatter={(value) => `Output: ${value}`}
                />
                <Legend verticalAlign="top" height={36} />
                
                <Line
                  name="IS Curve"
                  type="monotone"
                  dataKey="isY"
                  stroke="#3b82f6"  // Blue color (investment)
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />
                <Line
                  name="LM Curve"
                  type="monotone"
                  dataKey="lmY"
                  stroke="#8b5cf6"  // Purple color (money supply)
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />
                
                {/* Full Employment vertical line */}
                <ReferenceLine
                  x={params.fullEmployment}
                  stroke="#ef4444"  // Red color to match fullEmployment parameter
                  strokeWidth={2}
                  label={{
                    value: "Full Employment",
                    position: "insideTopRight",
                    fontSize: 11
                  }}
                />

                {/* Equilibrium horizontal line */}
                {equilibrium && (
                  <ReferenceLine
                    y={equilibrium.y}
                    stroke="#6b7280"
                    strokeDasharray="3 3"
                  />
                )}
                
                {/* Equilibrium vertical line */}
                {equilibrium && (
                  <ReferenceLine
                    x={equilibrium.x}
                    stroke="#6b7280"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Equilibrium point */}
                {equilibrium && (
                  <Scatter
                    data={[{ x: equilibrium.x, y: equilibrium.y }]}
                    fill="#047857"
                    shape="circle"
                    name="Equilibrium"
                  >
                    <Label
                      content={({ viewBox }) => {
                        const { x, y } = viewBox;
                        return (
                          <g>
                            <circle cx={x} cy={y} r={6} fill="#047857" />
                            <text
                              x={x + 8}
                              y={y - 8}
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
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
