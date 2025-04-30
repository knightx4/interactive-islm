
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ModelControls({ params, updateParam, equilibriumOutput }) {
  const [showSavingsComponents, setShowSavingsComponents] = useState(false);
  const [showInvestmentComponents, setShowInvestmentComponents] = useState(false);
  const [showMoneySupplyComponents, setShowMoneySupplyComponents] = useState(false);
  const [showMoneyDemandComponents, setShowMoneyDemandComponents] = useState(false);
  const [showFullEmploymentComponents, setShowFullEmploymentComponents] = useState(false);

  // Update individual savings component and recalculate overall savings
  const updateSavingsComponent = (component, value) => {
    // Get current values of all components
    const futureY = component === "futureY" ? value : params.futureY || 50;
    const wealth = component === "wealth" ? value : params.wealth || 50;
    const govSavings = component === "govSavings" ? value : params.govSavings || 50;
    
    // Calculate new savings value - weighted average with individual effects
    // futureY and wealth decrease savings (inverse relationship)
    // govSavings increases savings (direct relationship)
    const newSavings = Math.round(
      ((100 - futureY) + (100 - wealth) + govSavings) / 3
    );
    
    // Update both the component and the overall savings
    updateParam(component, value);
    updateParam("savings", newSavings);
  };

  // Update investment components and recalculate overall investment
  const updateInvestmentComponent = (component, value) => {
    // Get current value
    const futureMPK = component === "futureMPK" ? value : params.futureMPK || 50;
    
    // Calculate new investment value - direct relationship
    // Higher expected MPK increases investment
    const newInvestment = futureMPK;
    
    // Update both the component and the overall investment
    updateParam(component, value);
    updateParam("investment", newInvestment);
  };

  const updateMoneySupplyComponent = (component, value) => {
    // Get current values
    const centralBankSupply = component === "centralBankSupply" ? value : params.centralBankSupply || 50;
    const priceLevel = component === "priceLevel" ? value : params.priceLevel || 50;
    
    // Calculate new money supply value
    // Higher central bank supply increases money supply
    // Higher price level decreases money supply (Ms/P)
    const newMoneySupply = Math.round(
      (centralBankSupply * (100 - priceLevel)) / 50
    );
    
    // Update both the component and the overall money supply
    updateParam(component, value);
    updateParam("moneySupply", newMoneySupply);
  };

  // Add moneyDemand component update function
  const updateMoneyDemandComponent = (component, value) => {
    // Get current values of all components
    const mdWealth = component === "mdWealth" ? value : params.mdWealth || 50;
    const expectedInflation = component === "expectedInflation" ? value : params.expectedInflation || 50;
    const riskiness = component === "riskiness" ? value : params.riskiness || 50;
    const liquidity = component === "liquidity" ? value : params.liquidity || 50;
    
    // Calculate new money demand value
    // mdWealth increases money demand
    // expectedInflation decreases money demand
    // riskiness increases money demand (flight to safety)
    // liquidity decreases money demand (substitution effect)
    const newMoneyDemand = Math.round(
      (mdWealth + (100 - expectedInflation) + riskiness + (100 - liquidity)) / 4
    );
    
    // Update both the component and the overall money demand
    updateParam(component, value);
    updateParam("moneyDemand", newMoneyDemand);
  };

  // Add fullEmployment component update function
  const updateFullEmploymentComponent = (component, value) => {
    // Get current values of all components
    const productivity = component === "productivity" ? value : params.productivity || 50;
    const capital = component === "capital" ? value : params.capital || 50;
    const labor = component === "labor" ? value : params.labor || 50;
    
    // Calculate new full employment value (average of all factors)
    // All factors have a positive relationship with full employment
    const newFullEmployment = Math.round(
      (productivity + capital + labor) / 3
    );
    
    // Update both the component and the overall full employment
    updateParam(component, value);
    updateParam("fullEmployment", newFullEmployment);
  };

  // Function to calculate price level based on output gap
  const getPrice = (fullEmployment, equilibriumOutput) => {
    if (!equilibriumOutput) return "1.00";
    
    const outputGap = equilibriumOutput - fullEmployment;
    // Price increases when output > full employment (inflationary gap)
    // Price decreases when output < full employment (recessionary gap)
    const priceAdjustment = 1 + (outputGap / 100);
    return priceAdjustment.toFixed(2);
  };

  return (
    <Card className="sticky top-6 h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle>Model Parameters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        {/* All sliders sections */}
        <div className="space-y-6 flex-grow">
          {/* Investment section */}
          <div className="space-y-3">
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
                  {showInvestmentComponents ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  }
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
              <div className="mt-2 pl-4 border-l-2 border-blue-200 space-y-4">
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

          {/* Savings section */}
          <div className="space-y-3">
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
                  {showSavingsComponents ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  }
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
              Higher = Savings curve shifts down
            </p>

            {/* Savings Components */}
            {showSavingsComponents && (
              <div className="mt-2 pl-4 border-l-2 border-green-200 space-y-4">
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

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="futureY" className="text-xs font-medium">
                      Expected Future Income (Y')
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
                    Higher govt savings increases total savings
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Money Supply section */}
          <div className="space-y-3">
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
                  {showMoneySupplyComponents ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  }
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
              <div className="mt-2 pl-4 border-l-2 border-purple-200 space-y-4">
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
                    Higher central bank supply increases real money supply
                  </p>
                </div>

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
                    Higher price level reduces real money supply (Ms/P)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Money Demand section */}
          <div className="space-y-3">
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
                  {showMoneyDemandComponents ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  }
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
              <div className="mt-2 pl-4 border-l-2 border-amber-200 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium">
                      Current Income (Y)
                    </Label>
                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                      {equilibriumOutput ? equilibriumOutput.toFixed(1) : "50.0"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Higher income increases money demand (transactions motive)
                  </p>
                </div>

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
                    Higher wealth increases money demand
                  </p>
                </div>

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
                    Higher expected inflation decreases money demand
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="riskiness" className="text-xs font-medium">
                      Riskiness of Other Assets
                    </Label>
                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                      {params.riskiness || 50}
                    </span>
                  </div>
                  <Slider
                    id="riskiness"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.riskiness || 50]}
                    onValueChange={(val) => updateMoneyDemandComponent("riskiness", val[0])}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Higher riskiness increases money demand (safety)
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="liquidity" className="text-xs font-medium">
                      Liquidity of Other Assets
                    </Label>
                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                      {params.liquidity || 50}
                    </span>
                  </div>
                  <Slider
                    id="liquidity"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.liquidity || 50]}
                    onValueChange={(val) => updateMoneyDemandComponent("liquidity", val[0])}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Higher liquidity decreases money demand (substitution)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Full Employment section */}
          <div className="space-y-3">
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
                  {showFullEmploymentComponents ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  }
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
              <div className="mt-2 pl-4 border-l-2 border-red-200 space-y-4">
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
                    Higher productivity increases full employment output
                  </p>
                </div>

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
                    Higher capital increases full employment output
                  </p>
                </div>

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
                    Higher labor increases full employment output
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reset Button now in separate div at bottom */}
        <div className="pt-4 mt-auto border-t border-gray-200">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => {
              const defaultParams = {
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
              };
              
              Object.keys(defaultParams).forEach(key => {
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
