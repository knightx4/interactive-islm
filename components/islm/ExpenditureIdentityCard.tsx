"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  computeIslmAlgebraicIntersection,
  type IslmCoreParams,
} from "@/lib/islmModel";

interface ExpenditureIdentityCardProps {
  params: IslmCoreParams;
  /** IS–LM equilibrium output on the graph in index units. */
  equilibriumOutput: number | null;
}

function row(label: string, value: number, accent?: string) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-mono tabular-nums font-semibold ${accent ?? "text-gray-900"}`}
      >
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default function ExpenditureIdentityCard({
  params,
  equilibriumOutput,
}: ExpenditureIdentityCardProps) {
  const algebraicEq = computeIslmAlgebraicIntersection(params);
  const YIndex =
    equilibriumOutput ??
    algebraicEq.equilibriumX;
  const rIndex = algebraicEq.equilibriumY;

  // Keep accounting in the same index units shown on the graph so Y always matches.
  const Y = YIndex;
  const I = params.investment;
  const savingsInput = params.savings;
  const governmentSavings = params.governmentSpending;
  const NX = params.netExports ?? 0;
  const taxRate = 0.2;
  // Start from chart equilibrium output:
  // Y = C + I + G + NX  =>  C + G = Y - I - NX
  // Then split C and G using:
  // T = tau * C, (T-G) given by slider, G = T - (T-G)
  // => C + (tau*C - (T-G)) = Y - I - NX
  // => C = (Y - I - NX + (T-G)) / (1 + tau)
  const privatePlusGov = Y - I - NX;
  const C = (privatePlusGov + governmentSavings) / (1 + taxRate);
  const taxes = taxRate * C;
  const G = taxes - governmentSavings;
  const S = Y - C - G;
  const methodologyText =
    "Start from chart equilibrium Y = C + I + G + NX, so C + G = Y - I - NX. " +
    "Then split with T = 0.2C and slider (T-G); thus G = T - (T-G). " +
    `Savings S below is implied national saving (Y - C - G), while the savings slider is an IS-shift input shown here in index units as ${savingsInput.toFixed(1)}. ` +
    "Values are displayed in the same index units as the IS–LM graph and anchored to equilibrium Y from the IS–LM block (algebraic Y when the dot is off-chart).";

  const usingAlgebraic = equilibriumOutput === null;

  return (
    <Card className="mt-4 shrink-0 shadow-sm md:mt-6">
      <CardHeader className="py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base md:text-lg">
            Expenditure accounting (graph index units)
          </CardTitle>
          <div className="group relative inline-flex">
            <button
              type="button"
              aria-label="Show accounting methodology"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Info className="h-4 w-4" />
            </button>
            <div className="pointer-events-none absolute right-0 top-7 z-20 hidden w-[min(32rem,80vw)] rounded-md border bg-background p-2 text-xs leading-relaxed text-muted-foreground shadow-md group-hover:block group-focus-within:block">
              {methodologyText}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 border-t border-border/60 pt-3 md:pt-4">
        {usingAlgebraic && (
          <p className="text-xs text-amber-800 dark:text-amber-200">
            Equilibrium is outside the plotted IS–LM window;{" "}
            <strong>Y</strong> below uses the same algebraic intersection as the charts.
          </p>
        )}
        <div className="grid max-w-md grid-cols-1 gap-2 rounded-lg border bg-muted/30 p-3 sm:max-w-lg">
          {row("Consumption C", C, "text-violet-700 dark:text-violet-300")}
          {row("Investment I", I, "text-blue-700 dark:text-blue-300")}
          {row("Net exports NX", NX, "text-teal-700 dark:text-teal-300")}
          {row("Government G", G, "text-slate-700 dark:text-slate-300")}
          {row("Savings S", S, "text-blue-700 dark:text-blue-300")}
          {row("Interest rate r (IS–LM index)", rIndex, "text-gray-700 dark:text-gray-300")}
          <div className="my-1 border-t border-dashed border-border" />
          {row("Output Y (IS–LM)", Y, "text-gray-900 dark:text-gray-100")}
        </div>
      </CardContent>
    </Card>
  );
}
