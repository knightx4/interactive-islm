"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  computeIslmAlgebraicIntersection,
  type IslmCoreParams,
} from "@/lib/islmModel";

interface ExpenditureIdentityCardProps {
  params: IslmCoreParams;
  /** IS–LM equilibrium output on the chart, or null when off-chart. */
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

  // Accounting layer uses scaled units so baseline composition is realistic.
  const OUTPUT_UNIT_SCALE = 2;
  const COMPONENT_UNIT_SCALE = 0.2;

  const Y = YIndex * OUTPUT_UNIT_SCALE;
  const I = params.investment * COMPONENT_UNIT_SCALE;
  const S = params.savings * COMPONENT_UNIT_SCALE;
  const governmentSavings = params.governmentSpending * COMPONENT_UNIT_SCALE;
  const NX = (params.netExports ?? 0) * COMPONENT_UNIT_SCALE;
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

  const usingAlgebraic = equilibriumOutput === null;

  return (
    <Card className="mt-4 shrink-0 shadow-sm md:mt-6">
      <CardHeader className="py-3 md:py-4">
        <CardTitle className="text-base md:text-lg">
          Expenditure accounting (index units)
        </CardTitle>
        <p className="text-xs text-muted-foreground md:text-sm">
          Start from chart equilibrium{" "}
          <span className="font-mono">
            Y = C + I + G + NX
          </span>
          , so{" "}
          <span className="font-mono">
            C + G = Y - I - NX
          </span>
          . Then split with{" "}
          <span className="font-mono">
            T = 0.2C
          </span>{" "}
          and slider{" "}
          <span className="font-mono">
            (T-G)
          </span>
          ; thus{" "}
          <span className="font-mono">
            G = T - (T-G)
          </span>
          . Values are displayed in accounting units (scaled from index sliders) and anchored to equilibrium{" "}
          <strong>Y</strong> from the IS–LM block (algebraic{" "}
          <strong>Y</strong> when the dot is off-chart).
        </p>
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
