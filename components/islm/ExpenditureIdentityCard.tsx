"use client";

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

function row(label: string, value: number, strong?: boolean) {
  return (
    <tr className={strong ? "border-t border-ink font-semibold" : "border-t border-rule"}>
      <td className="py-1.5 pr-4">{label}</td>
      <td className="num py-1.5 text-right">{value.toFixed(1)}</td>
    </tr>
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
    <section className="mt-10 max-w-lg border-t border-ink pt-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl">Expenditure accounting</h2>
        <div className="group relative inline-flex">
          <button
            type="button"
            aria-label="Show accounting methodology"
            className="inline-flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Info className="h-4 w-4" />
          </button>
          <div className="pointer-events-none absolute right-0 top-7 z-20 hidden w-[min(32rem,80vw)] border border-ink bg-paper p-3 text-xs leading-relaxed text-muted-foreground group-hover:block group-focus-within:block">
            {methodologyText}
          </div>
        </div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">In the index units of the figures.</p>
      {usingAlgebraic && (
        <p className="mt-2 text-sm text-lm">
          Equilibrium is outside the plotted window; <i>Y</i> uses the algebraic intersection.
        </p>
      )}
      <table className="mt-3 w-full text-sm">
        <tbody>
          {row("Consumption C", C)}
          {row("Investment I", I)}
          {row("Net exports NX", NX)}
          {row("Government G", G)}
          {row("Saving S (Y − C − G)", S)}
          {row("Interest rate r", rIndex)}
          {row("Output Y", Y, true)}
        </tbody>
      </table>
    </section>
  );
}
