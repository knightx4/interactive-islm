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
    futureY: 50,
    wealth: 50,
    govSavings: 50,
    futureMPK: 50,
    moneySupply: 50,
    moneyDemand: 50,
    mdWealth: 50,
    expectedInflation: 50,
    riskiness: 50,
    liquidity: 50,
    fullEmployment: 50,
    centralBankSupply: 50,
    priceLevel: 50, // Added price level parameter
    productivity: 50,
    capital: 50,
    labor: 50,
  });

  const [equilibriumOutput, setEquilibriumOutput] = useState(50);

  const updateParam = (key: keyof typeof params, value: number) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interactive ISLM Economic Model</h1>
          <p className="text-gray-600 mt-2">
            Adjust the sliders to see real-time changes in the macroeconomic equilibrium. Use the dropdown to adjust the components of each curve.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Section */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <ModelControls
              params={params}
              updateParam={updateParam}
              equilibriumOutput={equilibriumOutput}
            />
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
                <ISLMChart
                  params={params}
                  onEquilibriumChange={(output: number | null) => setEquilibriumOutput(output)}
                />
              </div>
              <div>
                <LaborChart params={params} />
              </div>
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Economic Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {equilibriumOutput && (
                      <>
                        The economy is currently producing
                        <span
                          className={`font-semibold mx-1 ${
                            Math.abs(equilibriumOutput - params.fullEmployment) < 5
                              ? "text-green-600"
                              : equilibriumOutput > params.fullEmployment
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        >
                          {Math.abs(equilibriumOutput - params.fullEmployment) < 5
                            ? "at"
                            : equilibriumOutput > params.fullEmployment
                            ? "above"
                            : "below"}
                        </span>
                        its full employment level of output (Y* = {params.fullEmployment}).
                        {Math.abs(equilibriumOutput - params.fullEmployment) >= 5 && (
                          <>
                            {" "}
                            This creates a
                            <span className="font-semibold mx-1">
                              {equilibriumOutput > params.fullEmployment
                                ? "positive output gap, leading to inflationary pressure"
                                : "negative output gap, leading to deflationary pressure"}
                            </span>
                            in the economy.
                          </>
                        )}
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
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
