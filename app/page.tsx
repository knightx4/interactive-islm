"use client";

import { useState, useCallback, useEffect } from "react";
import ISChart from "@/components/islm/ISChart";
import LMChart from "@/components/islm/LMChart";
import ISLMChart from "@/components/islm/ISLMChart";
import LaborChart from "@/components/islm/LaborChart";
import ModelControls from "@/components/islm/ModelControls";
import AllChartsView from "@/components/islm/layout/AllChartsView";
import ControlsRail from "@/components/islm/layout/ControlsRail";
import MacroFeedbackBar from "@/components/islm/layout/MacroFeedbackBar";
import PrimaryChartPanel, {
  type ActiveChart,
} from "@/components/islm/layout/PrimaryChartPanel";
import WorkspaceShell from "@/components/islm/layout/WorkspaceShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ModelParams } from "@/lib/islmModel";

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
  const [activeChart, setActiveChart] = useState<ActiveChart>("all");
  const [isCompactControls, setIsCompactControls] = useState(false);

  const [equilibriumOutput, setEquilibriumOutput] = useState<number | null>(50);

  const updateParam = (key: keyof ModelParams, value: number) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  const handleEquilibriumChange = useCallback((output: number | null) => {
    setEquilibriumOutput(output);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const setDensity = () => {
      setIsCompactControls(window.innerHeight < 860);
    };
    setDensity();
    window.addEventListener("resize", setDensity);
    return () => window.removeEventListener("resize", setDensity);
  }, []);

  const primaryChart = (() => {
    if (activeChart === "all") {
      return (
        <AllChartsView
          params={params}
          onEquilibriumChange={handleEquilibriumChange}
        />
      );
    }
    if (activeChart === "is") return <ISChart params={params} compact />;
    if (activeChart === "lm") return <LMChart params={params} compact />;
    if (activeChart === "labor") return <LaborChart params={params} compact />;
    return (
      <ISLMChart
        params={params}
        onEquilibriumChange={handleEquilibriumChange}
        compact
      />
    );
  })();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-sm md:p-6 md:text-base">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl min-h-0 flex-1 flex-col overflow-x-auto overflow-y-auto">
        <header className="mb-4 shrink-0 md:mb-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Interactive IS-LM economic model
          </h1>
          <p className="mt-2 max-w-3xl text-gray-600">
            Best used on a larger screen. All horizontal and vertical values are{" "}
            <strong>model index units</strong>, not real-world billions or percentage points. Adjust
            the sliders to see how equilibrium moves; use the chevrons to open component sliders.
          </p>
        </header>

        {/* Stable workspace: fixed chart zone + separate controls flow below/aside. */}
        <div className="flex w-full min-w-0 flex-1 basis-0 flex-col overflow-hidden min-h-[min(84svh,920px)]">
          <WorkspaceShell
            className="min-h-0 flex-1 basis-0 overflow-hidden sm:h-full sm:max-h-full sm:min-h-0"
            controls={
              <ControlsRail>
                <ModelControls
                  params={params}
                  updateParam={updateParam}
                  equilibriumOutput={equilibriumOutput}
                  compact={isCompactControls}
                />
              </ControlsRail>
            }
            chartArea={
              <PrimaryChartPanel
                activeChart={activeChart}
                onActiveChartChange={setActiveChart}
                feedbackBar={
                  <MacroFeedbackBar
                    equilibriumOutput={equilibriumOutput}
                    fullEmployment={params.fullEmployment}
                    activeChart={activeChart}
                  />
                }
              >
                {primaryChart}
              </PrimaryChartPanel>
            }
          />
        </div>

        <div className="mt-6 shrink-0 pb-4 md:mt-8">
          <Card>
            <CardHeader className="py-3 md:py-4">
              <CardTitle className="text-base md:text-lg">About this model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 md:space-y-4">
              <p>
                The <strong>IS curve</strong> summarizes goods-market equilibrium (planned spending
                equals income): higher autonomous demand shifts IS right. The <strong>LM curve</strong>{" "}
                summarizes money-market equilibrium for a given price level: higher real money supply
                shifts LM right/down in (Y, r) space.
              </p>
              <p>
                The <strong>money market</strong> panel above shows a vertical real money supply{" "}
                <code className="rounded bg-gray-100 px-1 text-xs">Ms/P</code> and a downward-sloping
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
