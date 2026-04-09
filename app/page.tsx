"use client";

import { useState, useCallback } from "react";
import ISChart from "@/components/islm/ISChart";
import LMChart from "@/components/islm/LMChart";
import ISLMChart from "@/components/islm/ISLMChart";
import LaborChart from "@/components/islm/LaborChart";
import ModelControls from "@/components/islm/ModelControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OUTPUT_GAP_TOLERANCE, type ModelParams } from "@/lib/islmModel";

const defaultParams: ModelParams = {
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
  priceLevel: 50,
  productivity: 50,
  capital: 50,
  labor: 50,
  governmentSpending: 50,
  taxes: 50,
};

export default function HomePage() {
  const [params, setParams] = useState<ModelParams>(defaultParams);

  const [equilibriumOutput, setEquilibriumOutput] = useState<number | null>(50);

  const updateParam = (key: keyof ModelParams, value: number) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  const handleEquilibriumChange = useCallback((output: number | null) => {
    setEquilibriumOutput(output);
  }, []);

  const gap =
    equilibriumOutput !== null
      ? equilibriumOutput - params.fullEmployment
      : null;
  const nearFullEmployment =
    gap !== null && Math.abs(gap) < OUTPUT_GAP_TOLERANCE;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 text-sm md:text-base">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Interactive IS-LM economic model
          </h1>
          <p className="text-gray-600 mt-2 max-w-3xl">
            Best used on a larger screen. All horizontal and vertical values are{" "}
            <strong>model index units</strong>, not real-world billions or percentage points. Adjust
            the sliders to see how equilibrium moves; use the chevrons to open component sliders.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 flex flex-col justify-between">
            <ModelControls
              params={params}
              updateParam={updateParam}
              equilibriumOutput={equilibriumOutput}
            />
          </div>

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
                <ISLMChart params={params} onEquilibriumChange={handleEquilibriumChange} />
              </div>
              <div>
                <LaborChart params={params} />
              </div>
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current economic status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {equilibriumOutput !== null && gap !== null && (
                      <>
                        The economy is currently producing{" "}
                        <span
                          className={`font-semibold mx-1 ${
                            nearFullEmployment
                              ? "text-green-600"
                              : equilibriumOutput > params.fullEmployment
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        >
                          {nearFullEmployment
                            ? "near"
                            : equilibriumOutput > params.fullEmployment
                            ? "above"
                            : "below"}
                        </span>{" "}
                        its full employment level of output (Y* = {params.fullEmployment}, index).{" "}
                        {!nearFullEmployment && (
                          <>
                            The output gap is{" "}
                            <span className="font-semibold">
                              {gap > 0 ? "positive (inflationary pressure)" : "negative (deflationary pressure)"}
                            </span>
                            {`: ${gap > 0 ? "+" : ""}${gap.toFixed(1)} index units versus Y*.`}
                          </>
                        )}
                        {nearFullEmployment && (
                          <span className="text-gray-600">
                            {" "}
                            (Within ±{OUTPUT_GAP_TOLERANCE} index units of Y*, treated as “at full
                            employment” for this demo.)
                          </span>
                        )}
                      </>
                    )}
                    {equilibriumOutput === null && (
                      <span className="text-gray-600">
                        IS-LM intersection is outside the plotted range; adjust parameters to bring
                        equilibrium back on the chart.
                      </span>
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
              <CardTitle>About this model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                The <strong>IS curve</strong> summarizes goods-market equilibrium (planned spending
                equals income): higher autonomous demand shifts IS right. The <strong>LM curve</strong>{" "}
                summarizes money-market equilibrium for a given price level: higher real money supply
                shifts LM right/down in (Y, r) space.
              </p>
              <p>
                The <strong>money market</strong> panel above shows a vertical real money supply{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">Ms/P</code> and a downward-sloping
                money demand curve in (quantity, interest rate) space. The <strong>IS-LM</strong>{" "}
                diagram instead plots the upward-sloping LM curve in <strong>(Y, r)</strong> space;
                both are consistent stories at different levels of detail.
              </p>
              <p>
                Axes are <strong>index or model units</strong> for teaching, not calibrated data.
                Fiscal sliders (G, T) move the combined IS schedule in the IS-LM view; the
                investment–savings panel shows private I and S only (see note on that card).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
