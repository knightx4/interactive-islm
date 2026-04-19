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
import ExpenditureIdentityCard from "@/components/islm/ExpenditureIdentityCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  computeIslmAlgebraicIntersection,
  computeIslmEquilibrium,
  type ModelParams,
} from "@/lib/islmModel";

type SolvedEquilibrium = { output: number; rate: number };

const defaultParams: ModelParams = {
  investment: 50,
  savings: 50,
  futureY: 50,
  wealth: 50,
  futureMPK: 50,
  moneySupply: 50,
  moneyDemand: 50,
  expectedInflation: 50,
  riskiness: 50,
  liquidity: 50,
  fullEmployment: 50,
  centralBankSupply: 50,
  priceLevel: 50,
  productivity: 50,
  capital: 50,
  labor: 50,
  governmentSpending: 0,
  netExports: 0,
};

export default function HomePage() {
  const [params, setParams] = useState<ModelParams>(defaultParams);
  const [activeChart, setActiveChart] = useState<ActiveChart>("all");
  const [isCompactControls, setIsCompactControls] = useState(false);
  const [showEquilibriumGuides, setShowEquilibriumGuides] = useState(true);

  const [solvedEquilibrium, setSolvedEquilibrium] =
    useState<SolvedEquilibrium | null>({
      output: 50,
      rate: 10,
    });
  const [baselineParams, setBaselineParams] = useState<ModelParams | null>(null);

  const updateParam = (key: keyof ModelParams, value: number) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  const handleEquilibriumChange = useCallback(
    (equilibrium: SolvedEquilibrium | null) => {
      setSolvedEquilibrium(equilibrium);
    },
    []
  );

  useEffect(() => {
    const bounded = computeIslmEquilibrium(params);
    if (bounded) {
      setSolvedEquilibrium({
        output: bounded.equilibriumX,
        rate: bounded.equilibriumY,
      });
      return;
    }

    const algebraic = computeIslmAlgebraicIntersection(params);
    setSolvedEquilibrium({
      output: algebraic.equilibriumX,
      rate: algebraic.equilibriumY,
    });
  }, [params]);

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
          baselineParams={baselineParams}
          showEquilibriumGuides={showEquilibriumGuides}
          onEquilibriumChange={handleEquilibriumChange}
          solvedEquilibrium={solvedEquilibrium}
        />
      );
    }
    if (activeChart === "is")
      return (
        <ISChart
          params={params}
          baselineParams={baselineParams}
          showEquilibriumGuides={showEquilibriumGuides}
          equilibrium={solvedEquilibrium}
          compact
        />
      );
    if (activeChart === "lm")
      return (
        <LMChart
          params={params}
          baselineParams={baselineParams}
          showEquilibriumGuides={showEquilibriumGuides}
          equilibrium={solvedEquilibrium}
          compact
        />
      );
    if (activeChart === "labor")
      return (
        <LaborChart
          params={params}
          baselineParams={baselineParams}
          showEquilibriumGuides={showEquilibriumGuides}
          compact
        />
      );
    return (
      <ISLMChart
        params={params}
        baselineParams={baselineParams}
        showEquilibriumGuides={showEquilibriumGuides}
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
            <strong>model index units</strong>, not real-world billions or percentage points. The
            open-economy goods market uses{" "}
            <strong className="font-semibold">I + NX = S</strong>; the expenditure box below the
            charts shows <strong>Y = C + I + G + NX</strong> with implied <strong>C</strong>. Adjust
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
                  equilibriumOutput={solvedEquilibrium?.output ?? null}
                  compact={isCompactControls}
                  onSetBaseline={() => setBaselineParams({ ...params })}
                  onAfterReset={() => setBaselineParams(null)}
                />
              </ControlsRail>
            }
            chartArea={
              <PrimaryChartPanel
                activeChart={activeChart}
                onActiveChartChange={setActiveChart}
                showEquilibriumGuides={showEquilibriumGuides}
                onToggleEquilibriumGuides={() =>
                  setShowEquilibriumGuides((visible) => !visible)
                }
                feedbackBar={
                  <MacroFeedbackBar
                    equilibriumOutput={solvedEquilibrium?.output ?? null}
                    fullEmployment={params.fullEmployment}
                  />
                }
              >
                {primaryChart}
              </PrimaryChartPanel>
            }
          />
        </div>

        <ExpenditureIdentityCard
          params={params}
          equilibriumOutput={solvedEquilibrium?.output ?? null}
        />

        <div className="mt-6 shrink-0 pb-4 md:mt-8">
          <Card>
            <CardHeader className="py-3 md:py-4">
              <CardTitle className="text-base md:text-lg">About this model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 md:space-y-4">
              <p>
                The <strong>IS curve</strong> summarizes open-economy goods-market equilibrium in{" "}
                <strong>(Y, r)</strong> space: planned spending meets income with{" "}
                <strong>I + NX = S</strong> (net exports <strong>NX</strong> shifts the schedule
                with investment). The <strong>LM curve</strong> summarizes money-market equilibrium
                for a given price level: higher real money supply shifts LM right/down.
              </p>
              <p>
                The <strong>money market</strong> panel shows a vertical real money supply{" "}
                <code className="rounded bg-gray-100 px-1 text-xs">Ms/P</code> and a downward-sloping
                money demand curve in (quantity, interest rate) space. The <strong>IS-LM</strong>{" "}
                diagram plots IS and LM in <strong>(Y, r)</strong> space; the <strong>IS</strong>{" "}
                thumbnail plots <strong>I + NX</strong> against <strong>S</strong>.
              </p>
              <p>
                Axes are <strong>index or model units</strong> for teaching, not calibrated data.
                Fiscal <strong>G</strong> and components under Savings still move the combined IS
                schedule in the IS-LM view; use <strong>Net exports</strong> under Investment for{" "}
                <strong>NX</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
