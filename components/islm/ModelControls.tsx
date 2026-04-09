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
}

export default function ModelControls({
  params,
  updateParam,
  equilibriumOutput,
  compact = false,
}: ModelControlsProps) {
  const [showSavingsComponents, setShowSavingsComponents] = useState(false);
  const [showInvestmentComponents, setShowInvestmentComponents] = useState(false);
  const [showMoneySupplyComponents, setShowMoneySupplyComponents] = useState(false);
  const [showMoneyDemandComponents, setShowMoneyDemandComponents] = useState(false);
  const [showFullEmploymentComponents, setShowFullEmploymentComponents] = useState(false);

  const updateSavingsComponent = (component: keyof ModelParams, value: number) => {
    const futureY = component === "futureY" ? value : params.futureY || 50;
    const wealth = component === "wealth" ? value : params.wealth || 50;
    const govSavings = component === "govSavings" ? value : params.govSavings || 50;

    const newSavings = Math.round(
      ((100 - futureY) + (100 - wealth) + govSavings) / 3
    );

    updateParam(component, value);
    updateParam("savings", newSavings);
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
    const mdWealth = component === "mdWealth" ? value : params.mdWealth || 50;
    const expectedInflation = component === "expectedInflation" ? value : params.expectedInflation || 50;
    const riskiness = component === "riskiness" ? value : params.riskiness || 50;
    const liquidity = component === "liquidity" ? value : params.liquidity || 50;

    const newMoneyDemand = Math.round(
      (mdWealth + (100 - expectedInflation) + riskiness + (100 - liquidity)) / 4
    );

    updateParam(component, value);
    updateParam("moneyDemand", newMoneyDemand);
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
    <Card className="flex w-full max-w-full min-h-0 flex-col gap-1.5 overflow-visible py-2.5 shadow-sm sm:gap-2.5 sm:py-3 sm:h-full sm:max-h-full sm:flex-1 sm:overflow-hidden">
      <CardHeader className="shrink-0 px-3.5 pb-0 pt-0 sm:px-4">
        <CardTitle className="text-[15px] sm:text-base">Model Parameters</CardTitle>
        <p className="text-[11px] leading-snug text-muted-foreground sm:text-xs">
          Core sliders are always visible. Expand sections for detailed drivers.
        </p>
      </CardHeader>
      <CardContent
        className={
          compact
            ? "flex min-h-[min(340px,52svh)] flex-col overflow-x-hidden overflow-y-auto px-3.5 pb-2.5 pt-0 sm:min-h-0 sm:flex-1 sm:basis-0 sm:overflow-hidden"
            : "flex min-h-[min(380px,58svh)] flex-col overflow-x-hidden overflow-y-auto px-3.5 pb-2.5 pt-1 sm:min-h-0 sm:flex-1 sm:basis-0 sm:overflow-hidden"
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
            <p className="text-xs text-gray-500">
              Higher = Investment curve shifts up
            </p>

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
                  <p className="text-xs text-gray-500">
                    Higher expected productivity increases investment
                  </p>
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
            <p className="text-xs text-gray-500">
              Higher = Savings curve shifts up
            </p>

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
                  <p className="text-xs text-gray-500">
                    Current output level from IS-LM equilibrium
                  </p>
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
                  <p className="text-xs text-gray-500">
                    Higher expectations reduce savings
                  </p>
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
                  <p className="text-xs text-gray-500">
                    Higher wealth reduces savings
                  </p>
                </div>

                {/* Government Savings */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="govSavings" className="text-xs font-medium">
                      Government Savings (Sg)
                    </Label>
                    <span className="text-xs font-semibold bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                      {params.govSavings || 50}
                    </span>
                  </div>
                  <Slider
                    id="govSavings"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.govSavings || 50]}
                    onValueChange={(val) => updateSavingsComponent("govSavings", val[0])}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Higher government savings increases total savings
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Fiscal policy — shifts combined IS in IS-LM */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Fiscal policy
            </div>
            <p className="text-xs text-gray-500">
              Higher government spending shifts the IS curve right; higher taxes shift it left (this
              toy model).
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="governmentSpending" className="text-sm font-medium">
                  Government spending (G)
                </Label>
                <span className="text-sm font-semibold bg-orange-100 text-orange-900 px-2 py-1 rounded">
                  {params.governmentSpending}
                </span>
              </div>
              <Slider
                id="governmentSpending"
                min={0}
                max={100}
                step={1}
                value={[params.governmentSpending]}
                onValueChange={(val) => updateParam("governmentSpending", val[0])}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="taxes" className="text-sm font-medium">
                  Taxes (T)
                </Label>
                <span className="text-sm font-semibold bg-orange-100 text-orange-900 px-2 py-1 rounded">
                  {params.taxes}
                </span>
              </div>
              <Slider
                id="taxes"
                min={0}
                max={100}
                step={1}
                value={[params.taxes]}
                onValueChange={(val) => updateParam("taxes", val[0])}
                className="cursor-pointer"
              />
            </div>
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
            <p className="text-xs text-gray-500">
              Shifts Money Supply line left/right
            </p>

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
                  <p className="text-xs text-gray-500">
                    Higher central bank supply increases real money supply.
                  </p>
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
                  <p className="text-xs text-gray-500">
                    Higher price level reduces real money supply (Ms/P).
                  </p>
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
            <p className="text-xs text-gray-500">
              Shifts Money Demand curve up/down
            </p>

            {/* Money Demand Components */}
            {showMoneyDemandComponents && (
              <div className={expandPanelClassName("border-amber-200")}>
                {/* Wealth */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="mdWealth" className="text-xs font-medium">
                      Wealth
                    </Label>
                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                      {params.mdWealth || 50}
                    </span>
                  </div>
                  <Slider
                    id="mdWealth"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.mdWealth || 50]}
                    onValueChange={(val) => updateMoneyDemandComponent("mdWealth", val[0])}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Higher wealth increases money demand.
                  </p>
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
                  <p className="text-xs text-gray-500">
                    Higher expected inflation decreases money demand.
                  </p>
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
            <p className="text-xs text-gray-500">
              Shifts Full Employment line left/right
            </p>

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
                  <p className="text-xs text-gray-500">
                    Higher productivity increases full employment output.
                  </p>
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
                  <p className="text-xs text-gray-500">
                    Higher capital increases full employment output.
                  </p>
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
                  <p className="text-xs text-gray-500">
                    Higher labor increases full employment output.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-200 pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
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

              (Object.keys(defaultParams) as Array<keyof ModelParams>).forEach((key) => {
                updateParam(key, defaultParams[key]);
              });

              setShowSavingsComponents(false);
              setShowInvestmentComponents(false);
              setShowMoneySupplyComponents(false);
              setShowMoneyDemandComponents(false);
              setShowFullEmploymentComponents(false);
            }}
          >
            Reset All Parameters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
