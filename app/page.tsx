"use client";

import { useState } from "react";
import ISChart from "@/components/islm/ISChart";
import LMChart from "@/components/islm/LMChart";
import ISLMChart from "@/components/islm/ISLMChart";
import LaborChart from "@/components/islm/LaborChart";
import ModelControls from "@/components/islm/ModelControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const [params, setParams] = useState({
    investment: 50,
    savings: 50,
    moneySupply: 50,
    moneyDemand: 50,
    fullEmployment: 50,
  });

  const updateParam = (key: keyof typeof params, value: number) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interactive ISLM Economic Model</h1>
          <p className="text-gray-600 mt-2">
            Adjust the sliders to see real-time changes in the macroeconomic equilibrium
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Section */}
          <div className="lg:col-span-3">
            <ModelControls params={params} updateParam={updateParam} />
          </div>

          {/* Main Chart Area */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <ISChart params={params} />
              </div>
              <div>
                <LMChart params={params} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ISLMChart params={params} />
              </div>
              <div>
                <LaborChart params={params} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>About the ISLM Model</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                The IS-LM model is a macroeconomic tool that shows the relationship between interest rates and 
                real output in the goods and services market and the money market. The IS curve represents the 
                equilibrium in the goods market, while the LM curve represents the equilibrium in the money market.
              </p>
              <p className="text-gray-700 mt-4">
                Use the sliders on the left to adjust different economic variables and observe how they affect 
                the equilibrium in both markets.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
