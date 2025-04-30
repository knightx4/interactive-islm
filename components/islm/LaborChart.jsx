
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
  ResponsiveContainer, Label
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LaborChart({ params }) {
  const [chartData, setChartData] = useState([]);
  const [equilibrium, setEquilibrium] = useState(null);

  useEffect(() => {
    // Get output from ISLM model
    const isShift = ((params.investment + (100 - params.savings)) / 2 - 50) * 0.2;
    const lmShift = ((params.moneySupply + params.moneyDemand) / 2 - 50) * 0.2;
    
    // Calculate ISLM equilibrium output
    const isBaseIntercept = 17.5;
    const lmBaseIntercept = 2.5;
    const isSlope = -0.15;
    const lmSlope = 0.15;
    
    const islmOutput = ((isBaseIntercept + isShift) - (lmBaseIntercept + lmShift)) / (lmSlope - isSlope);
    const outputGap = islmOutput - params.fullEmployment;
    const laborDemandShift = outputGap * 0.1;

    // Define curve parameters for centered equilibrium at (50, 10)
    const supplySlope = 0.15;      // Slope of supply curve
    const demandSlope = -0.15;     // Slope of demand curve, matching supply slope magnitude
    
    // Calculate intercepts that will make curves cross at (50, 10) when in equilibrium
    const supplyIntercept = 10 - (supplySlope * 50);     // Solve: 10 = slope * 50 + b
    const demandIntercept = 10 - (demandSlope * 50);     // Solve: 10 = slope * 50 + b
    
    // Generate chart data points
    const newData = [];
    for (let x = 0; x <= 100; x += 5) {
      const supplyY = (supplySlope * x) + supplyIntercept;
      const demandY = (demandSlope * x) + demandIntercept + laborDemandShift;
      
      newData.push({
        x: x,
        supplyY: Math.max(0, Math.min(20, supplyY)),
        demandY: Math.max(0, Math.min(20, demandY))
      });
    }
    
    setChartData(newData);

    // Calculate equilibrium
    const equilibriumX = (demandIntercept + laborDemandShift - supplyIntercept) / (supplySlope - demandSlope);
    const equilibriumY = (supplySlope * equilibriumX) + supplyIntercept;

    // Set equilibrium if it's within valid range
    if (equilibriumX >= 0 && equilibriumX <= 100 && equilibriumY >= 0 && equilibriumY <= 20) {
      setEquilibrium({
        x: equilibriumX,
        y: equilibriumY,
        gap: outputGap
      });
    } else {
      setEquilibrium(null);
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
            <span>Labor Market</span>
            {equilibrium && (
              <span className={`text-xs px-2 py-1 rounded ${
                Math.abs(equilibrium.gap) < 5 ? 'bg-green-100 text-green-800' : 
                  equilibrium.gap > 0 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {equilibrium.gap > 0 ? 'Excess Labor Demand' : 
                 equilibrium.gap < 0 ? 'Excess Labor Supply' : 'Labor Market Equilibrium'}
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
                  <Label value="L (Labor)" position="bottom" offset={5} />
                </XAxis>
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={[0, 20]}
                  allowDataOverflow={true}
                >
                  <Label value="w (Real Wage)" angle={-90} position="left" />
                </YAxis>
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)}`, ""]}
                  labelFormatter={(value) => `Labor: ${value}`}
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

                {/* Equilibrium lines */}
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
          <div className="text-center mt-2 text-sm text-gray-500">
            {equilibrium && `Equilibrium Wage: ${equilibrium.y.toFixed(2)}, Labor: ${equilibrium.x.toFixed(2)}`}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
