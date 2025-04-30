import React from "react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const colorMap = {
  investment: "blue",
  savings: "green",
  moneySupply: "purple",
  moneyDemand: "amber",
  fullEmployment: "red",
};

interface ModelControlsProps {
  params: Record<"investment" | "savings" | "moneySupply" | "moneyDemand" | "fullEmployment", number>;
  updateParam: (key: "investment" | "savings" | "moneySupply" | "moneyDemand" | "fullEmployment", value: number) => void;
}

export default function ModelControls({ params, updateParam }: ModelControlsProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle>Model Parameters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(params).map(([key, value]) => {
          const color = colorMap[key as keyof typeof colorMap] || "gray";
          return (
            <div className="space-y-3" key={key}>
              <div className="flex justify-between items-center">
                <Label htmlFor={key} className="text-sm font-medium">
                  {
                    {
                      investment: "Investment (I)",
                      savings: "Savings (S)",
                      moneySupply: "Money Supply (Ms/P)",
                      moneyDemand: "Money Demand (L)",
                      fullEmployment: "Full Employment (FE)",
                    }[key as keyof typeof colorMap]
                  }
                </Label>
                <span
                  className={`text-sm font-semibold bg-${color}-100 text-${color}-800 px-2 py-1 rounded`}
                >
                  {value}
                </span>
              </div>
              <Slider
                id={key}
                min={0}
                max={100}
                step={1}
                value={[value]}
                onValueChange={(val) => updateParam(key as keyof typeof colorMap, val[0])}
                className="cursor-pointer"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
