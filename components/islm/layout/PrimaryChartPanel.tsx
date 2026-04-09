"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import InfoHint from "@/components/islm/layout/InfoHint";

export type ActiveChart = "all" | "islm" | "is" | "lm" | "labor";

interface PrimaryChartPanelProps {
  activeChart: ActiveChart;
  onActiveChartChange: (chart: ActiveChart) => void;
  feedbackBar: ReactNode;
  children: ReactNode;
  className?: string;
}

const chartTabs: Array<{ id: ActiveChart; label: string }> = [
  { id: "all", label: "All" },
  { id: "islm", label: "IS-LM" },
  { id: "is", label: "IS" },
  { id: "lm", label: "LM" },
  { id: "labor", label: "Labor" },
];

const chartMicrocopy: Record<ActiveChart, string> = {
  all: "",
  islm: "IS right or LM right typically raises Y in this linear toy model.",
  is: "Observe how investment and savings schedules move equilibrium in the goods market.",
  lm: "LM money-market shifts alter the interest rate for a given liquidity position.",
  labor:
    "Labor demand here is linked to the IS-LM output gap to connect macro and labor outcomes.",
};

export default function PrimaryChartPanel({
  activeChart,
  onActiveChartChange,
  feedbackBar,
  children,
  className,
}: PrimaryChartPanelProps) {
  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-1 flex-col gap-2 overflow-hidden sm:min-h-0",
        className
      )}
    >
      <Card className="shrink-0 py-0 shadow-sm">
        <CardContent className="space-y-2 px-3 py-2 sm:px-3 sm:py-2.5">
          <div className="flex items-start justify-between gap-2">
            <Tabs
              value={activeChart}
              onValueChange={(value) => onActiveChartChange(value as ActiveChart)}
              className="gap-2"
            >
              <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 sm:w-fit">
                {chartTabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="min-w-12 shrink-0 px-2.5 py-1 text-xs sm:text-sm">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            {chartMicrocopy[activeChart] && (
              <InfoHint text={chartMicrocopy[activeChart]} className="mt-1 shrink-0" />
            )}
          </div>
          {feedbackBar}
        </CardContent>
      </Card>
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden [&>*]:h-full [&>*]:min-h-0 [&>*]:flex-1 [&>*]:flex [&>*]:flex-col">
        {children}
      </div>
    </section>
  );
}
