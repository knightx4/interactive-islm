"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ModelParams } from "@/lib/islmModel";
import { cn } from "@/lib/utils";

/** Nested driver lists: fixed cap + scroll so expanding doesn’t resize the whole controls card */
function expandPanelClassName(borderClass: string) {
  return cn(
    "mt-1.5 max-h-[min(220px,42svh)] space-y-3 overflow-y-auto overflow-x-hidden overscroll-contain border-l-2 pl-3 pr-0.5 [scrollbar-gutter:stable]",
    borderClass
  );
}

interface ModelControlsProps {
  params: ModelParams;
  updateParam: (key: keyof ModelParams, value: number) => void;
  equilibriumOutput: number | null;
  compact?: boolean;
  /** Snapshot current sliders as dotted baseline on charts. */
  onSetBaseline?: () => void;
  /** Called after reset defaults so baseline overlay can be cleared. */
  onAfterReset?: () => void;
}

export default function ModelControls({
  params,
  updateParam,
  equilibriumOutput,
  compact = false,
  onSetBaseline,
  onAfterReset,
}: ModelControlsProps) {
  const [showSavingsComponents, setShowSavingsComponents] = useState(false);
  const [showInvestmentComponents, setShowInvestmentComponents] = useState(false);
  const [showMoneySupplyComponents, setShowMoneySupplyComponents] = useState(false);
  const [showMoneyDemandComponents, setShowMoneyDemandComponents] = useState(false);
  const [showFullEmploymentComponents, setShowFullEmploymentComponents] = useState(false);

  const updateSavingsComponent = (component: keyof ModelParams, value: number) => {
    const futureY = component === "futureY" ? value : params.futureY || 50;
    const wealth = component === "wealth" ? value : params.wealth || 50;
    const governmentSavings =
      component === "governmentSpending" ? value : params.governmentSpending ?? 0;

    const newSavings = Math.round(
      ((100 - futureY) + (100 - wealth) + (governmentSavings + 50)) / 3
    );

    updateParam(component, value);
    updateParam("savings", newSavings);

    if (component === "wealth") {
      const expectedInflation = params.expectedInflation || 50;
      const riskiness = params.riskiness || 50;
      const liquidity = params.liquidity || 50;
      const newMoneyDemand = Math.round(
        (value + (100 - expectedInflation) + riskiness + (100 - liquidity)) / 4
      );
      updateParam("moneyDemand", newMoneyDemand);
    }
  };

  const updateInvestmentComponent = (component: keyof ModelParams, value: number) => {
    const futureMPK = component === "futureMPK" ? value : params.futureMPK || 50;

    const newInvestment = futureMPK;

    updateParam(component, value);
    updateParam("investment", newInvestment);
  };

  const updateMoneySupplyComponent = (component: keyof ModelParams, value: number) => {
    const centralBankSupply = component === "centralBankSupply" ? value : params.centralBankSupply || 50;
    const priceLevel = component === "priceLevel" ? value : params.priceLevel || 50;

    const newMoneySupply = Math.round(
      (centralBankSupply * (100 - priceLevel)) / 50
    );

    updateParam(component, value);
    updateParam("moneySupply", newMoneySupply);
  };

  const updateMoneyDemandComponent = (component: keyof ModelParams, value: number) => {
    const wealth = component === "wealth" ? value : params.wealth || 50;
    const expectedInflation = component === "expectedInflation" ? value : params.expectedInflation || 50;
    const riskiness = component === "riskiness" ? value : params.riskiness || 50;
    const liquidity = component === "liquidity" ? value : params.liquidity || 50;

    const newMoneyDemand = Math.round(
      (wealth + (100 - expectedInflation) + riskiness + (100 - liquidity)) / 4
    );

    updateParam(component, value);
    updateParam("moneyDemand", newMoneyDemand);

    if (component === "wealth") {
      const futureY = params.futureY || 50;
      const governmentSavings = params.governmentSpending ?? 0;
      const newSavings = Math.round(
        ((100 - futureY) + (100 - value) + (governmentSavings + 50)) / 3
      );
      updateParam("savings", newSavings);
    }
  };

  const updateFullEmploymentComponent = (component: keyof ModelParams, value: number) => {
    const productivity = component === "productivity" ? value : params.productivity || 50;
    const capital = component === "capital" ? value : params.capital || 50;
    const labor = component === "labor" ? value : params.labor || 50;

    const newFullEmployment = Math.round(
      (productivity + capital + labor) / 3
    );

    updateParam(component, value);
    updateParam("fullEmployment", newFullEmployment);
  };

  return (
    <Card className="flex w-full max-w-full min-h-0 flex-col gap-1.5 overflow-hidden py-2.5 shadow-sm max-sm:flex-1 max-sm:min-h-0 sm:gap-2.5 sm:py-3 sm:h-full sm:max-h-full sm:flex-1">
      <CardHeader className="shrink-0 px-3.5 pb-0 pt-0 sm:px-4">
        <CardTitle className="text-[15px] sm:text-base">Model Parameters</CardTitle>
      </CardHeader>
      <CardContent
        className={
          compact
            ? "flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain px-3.5 pb-2.5 pt-0 sm:basis-0 sm:overflow-hidden"
            : "flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain px-3.5 pb-2.5 pt-1 sm:basis-0 sm:overflow-hidden"
        }
      >
        <div
          className={
            compact
              ? "space-y-2 pr-0.5 sm:min-h-0 sm:flex-1 sm:basis-0 sm:overflow-y-auto sm:overscroll-contain"
              : "space-y-2.5 pr-0.5 sm:min-h-0 sm:flex-1 sm:basis-0 sm:overflow-y-auto sm:overscroll-contain"
          }
        >
          {/* Investment Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Label htmlFor="investment" className="text-sm font-medium">
                  Investment (I)
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={() => setShowInvestmentComponents(!showInvestmentComponents)}
                >
                  {showInvestmentComponents ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {params.investment}
              </span>
            </div>
            <Slider
              id="investment"
              min={0}
              max={100}
              step={1}
              value={[params.investment]}
              onValueChange={(val) => updateParam("investment", val[0])}
              className="cursor-pointer"
            />

            {/* Investment Components */}
            {showInvestmentComponents && (
              <div className={expandPanelClassName("border-blue-200")}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="futureMPK" className="text-xs font-medium">
                      Future Marginal Productivity of Capital
                    </Label>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                      {params.futureMPK || 50}
                    </span>
                  </div>
                  <Slider
                    id="futureMPK"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.futureMPK || 50]}
                    onValueChange={(val) => updateInvestmentComponent("futureMPK", val[0])}
                    className="cursor-pointer"
                  />
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="netExports" className="text-xs font-medium">
                        Net exports (NX)
                      </Label>
                      <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                        {params.netExports ?? 0}
                      </span>
                    </div>
                    <p className="text-[10px] leading-snug text-muted-foreground">
                      Positive = trade surplus, negative = deficit. Shifts IS with I in I + NX = S.
                    </p>
                    <Slider
                      id="netExports"
                      min={-50}
                      max={50}
                      step={1}
                      value={[params.netExports ?? 0]}
                      onValueChange={(val) => updateParam("netExports", val[0])}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Savings Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Label htmlFor="savings" className="text-sm font-medium">
                  Savings (S)
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={() => setShowSavingsComponents(!showSavingsComponents)}
                >
                  {showSavingsComponents ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              <span className="text-sm font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
                {params.savings}
              </span>
            </div>
            <Slider
              id="savings"
              min={0}
              max={100}
              step={1}
              value={[params.savings]}
              onValueChange={(val) => updateParam("savings", val[0])}
              className="cursor-pointer"
            />

            {/* Savings Components */}
            {showSavingsComponents && (
              <div className={expandPanelClassName("border-green-200")}>
                {/* Current Income */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium">
                      Current Income (Y)
                    </Label>
                    <span className="text-xs font-semibold bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                      {equilibriumOutput ? equilibriumOutput.toFixed(1) : "50.0"}
                    </span>
                  </div>
                </div>

                {/* Future Income */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="futureY" className="text-xs font-medium">
                      Expected Future Income (Yf)
                    </Label>
                    <span className="text-xs font-semibold bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                      {params.futureY || 50}
                    </span>
                  </div>
                  <Slider
                    id="futureY"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.futureY || 50]}
                    onValueChange={(val) => updateSavingsComponent("futureY", val[0])}
                    className="cursor-pointer"
                  />
                </div>

                {/* Wealth */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="wealth" className="text-xs font-medium">
                      Wealth
                    </Label>
                    <span className="text-xs font-semibold bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                      {params.wealth || 50}
                    </span>
                  </div>
                  <Slider
                    id="wealth"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.wealth || 50]}
                    onValueChange={(val) => updateSavingsComponent("wealth", val[0])}
                    className="cursor-pointer"
                  />
                </div>

                {/* Government savings */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="governmentSpending" className="text-xs font-medium">
                      Government savings (T-G)
                    </Label>
                    <span className="text-xs font-semibold bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                      {params.governmentSpending}
                    </span>
                  </div>
                  <Slider
                    id="governmentSpending"
                    min={-50}
                    max={50}
                    step={1}
                    value={[params.governmentSpending]}
                    onValueChange={(val) =>
                      updateSavingsComponent("governmentSpending", val[0])
                    }
                    className="cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Money Supply section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Label htmlFor="moneySupply" className="text-sm font-medium">
                  Money Supply (Ms/P)
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={() => setShowMoneySupplyComponents(!showMoneySupplyComponents)}
                >
                  {showMoneySupplyComponents ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              <span className="text-sm font-semibold bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {params.moneySupply}
              </span>
            </div>
            <Slider
              id="moneySupply"
              min={0}
              max={100}
              step={1}
              value={[params.moneySupply]}
              onValueChange={(val) => updateParam("moneySupply", val[0])}
              className="cursor-pointer"
            />

            {/* Money Supply Components */}
            {showMoneySupplyComponents && (
              <div className={expandPanelClassName("border-purple-200")}>
                {/* Central Bank Supply */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="centralBankSupply" className="text-xs font-medium">
                      Central Bank Designated Supply (Ms)
                    </Label>
                    <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                      {params.centralBankSupply || 50}
                    </span>
                  </div>
                  <Slider
                    id="centralBankSupply"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.centralBankSupply || 50]}
                    onValueChange={(val) => updateMoneySupplyComponent("centralBankSupply", val[0])}
                    className="cursor-pointer"
                  />
                </div>

                {/* Price Level */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="priceLevel" className="text-xs font-medium">
                      Price Level (P)
                    </Label>
                    <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                      {params.priceLevel || 50}
                    </span>
                  </div>
                  <Slider
                    id="priceLevel"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.priceLevel || 50]}
                    onValueChange={(val) => updateMoneySupplyComponent("priceLevel", val[0])}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Money Demand section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Label htmlFor="moneyDemand" className="text-sm font-medium">
                  Money Demand (L)
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={() => setShowMoneyDemandComponents(!showMoneyDemandComponents)}
                >
                  {showMoneyDemandComponents ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              <span className="text-sm font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                {params.moneyDemand}
              </span>
            </div>
            <Slider
              id="moneyDemand"
              min={0}
              max={100}
              step={1}
              value={[params.moneyDemand]}
              onValueChange={(val) => updateParam("moneyDemand", val[0])}
              className="cursor-pointer"
            />

            {/* Money Demand Components */}
            {showMoneyDemandComponents && (
              <div className={expandPanelClassName("border-amber-200")}>
                {/* Wealth (same as Savings → Wealth) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="wealth-money-demand" className="text-xs font-medium">
                      Wealth
                    </Label>
                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                      {params.wealth || 50}
                    </span>
                  </div>
                  <Slider
                    id="wealth-money-demand"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.wealth || 50]}
                    onValueChange={(val) => updateMoneyDemandComponent("wealth", val[0])}
                    className="cursor-pointer"
                  />
                </div>

                {/* Expected Inflation */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="expectedInflation" className="text-xs font-medium">
                      Expected Inflation
                    </Label>
                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                      {params.expectedInflation || 50}
                    </span>
                  </div>
                  <Slider
                    id="expectedInflation"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.expectedInflation || 50]}
                    onValueChange={(val) => updateMoneyDemandComponent("expectedInflation", val[0])}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Full Employment section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Label htmlFor="fullEmployment" className="text-sm font-medium">
                  Full Employment (FE)
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={() => setShowFullEmploymentComponents(!showFullEmploymentComponents)}
                >
                  {showFullEmploymentComponents ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              <span className="text-sm font-semibold bg-red-100 text-red-800 px-2 py-1 rounded">
                {params.fullEmployment}
              </span>
            </div>
            <Slider
              id="fullEmployment"
              min={0}
              max={100}
              step={1}
              value={[params.fullEmployment]}
              onValueChange={(val) => updateParam("fullEmployment", val[0])}
              className="cursor-pointer"
            />

            {/* Full Employment Components */}
            {showFullEmploymentComponents && (
              <div className={expandPanelClassName("border-red-200")}>
                {/* Productivity */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="productivity" className="text-xs font-medium">
                      Productivity
                    </Label>
                    <span className="text-xs font-semibold bg-red-50 text-red-700 px-1.5 py-0.5 rounded">
                      {params.productivity || 50}
                    </span>
                  </div>
                  <Slider
                    id="productivity"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.productivity || 50]}
                    onValueChange={(val) => updateFullEmploymentComponent("productivity", val[0])}
                    className="cursor-pointer"
                  />
                </div>

                {/* Capital */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="capital" className="text-xs font-medium">
                      Capital
                    </Label>
                    <span className="text-xs font-semibold bg-red-50 text-red-700 px-1.5 py-0.5 rounded">
                      {params.capital || 50}
                    </span>
                  </div>
                  <Slider
                    id="capital"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.capital || 50]}
                    onValueChange={(val) => updateFullEmploymentComponent("capital", val[0])}
                    className="cursor-pointer"
                  />
                </div>

                {/* Labor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="labor" className="text-xs font-medium">
                      Labor
                    </Label>
                    <span className="text-xs font-semibold bg-red-50 text-red-700 px-1.5 py-0.5 rounded">
                      {params.labor || 50}
                    </span>
                  </div>
                  <Slider
                    id="labor"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.labor || 50]}
                    onValueChange={(val) => updateFullEmploymentComponent("labor", val[0])}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 space-y-2 border-t border-gray-200 pt-2">
          {onSetBaseline && (
            <Button
              type="button"
              variant="default"
              className="w-full"
              onClick={() => onSetBaseline()}
            >
              Set baseline
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
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

              (Object.keys(defaultParams) as Array<keyof ModelParams>).forEach((key) => {
                updateParam(key, defaultParams[key]);
              });

              onAfterReset?.();

              setShowSavingsComponents(false);
              setShowInvestmentComponents(false);
              setShowMoneySupplyComponents(false);
              setShowMoneyDemandComponents(false);
              setShowFullEmploymentComponents(false);
            }}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
