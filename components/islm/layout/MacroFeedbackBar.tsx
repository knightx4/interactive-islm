"use client";

import { OUTPUT_GAP_TOLERANCE } from "@/lib/islmModel";
import type { ActiveChart } from "@/components/islm/layout/PrimaryChartPanel";

interface MacroFeedbackBarProps {
  equilibriumOutput: number | null;
  fullEmployment: number;
  activeChart: ActiveChart;
}

export default function MacroFeedbackBar({
  equilibriumOutput,
  fullEmployment,
  activeChart,
}: MacroFeedbackBarProps) {
  const gap =
    equilibriumOutput !== null ? equilibriumOutput - fullEmployment : null;
  const nearFullEmployment =
    gap !== null && Math.abs(gap) < OUTPUT_GAP_TOLERANCE;
  const chartHints: Record<ActiveChart, string> = {
    all: "Compare the combined view with each market in isolation.",
    islm: "Track Y vs Y*: this is the main macro intuition loop.",
    is: "Changes here move goods-market equilibrium first, then IS-LM.",
    lm: "LM shifts mainly work through the interest-rate channel.",
    labor: "Labor outcomes here are downstream of the output gap.",
  };

  return (
    <div className="border-t border-border/70 pt-2">
      <p className="text-[11px] leading-snug text-gray-700 sm:text-xs">
        {equilibriumOutput !== null && gap !== null && (
          <>
            Output is{" "}
            <span
              className={
                nearFullEmployment
                  ? "font-semibold text-green-600"
                  : gap > 0
                    ? "font-semibold text-red-600"
                    : "font-semibold text-blue-600"
              }
            >
              {nearFullEmployment
                ? "near full employment"
                : gap > 0
                  ? "above Y*"
                  : "below Y*"}
            </span>
            {` (Y=${equilibriumOutput.toFixed(1)}, Y*=${fullEmployment}). `}
            {nearFullEmployment ? (
              <span className="text-muted-foreground">
                Within +/-{OUTPUT_GAP_TOLERANCE} index units.
              </span>
            ) : (
              <span className="text-muted-foreground">
                {gap > 0 ? "Inflationary" : "Recessionary"} gap:{" "}
                {gap > 0 ? "+" : ""}
                {gap.toFixed(1)}.
              </span>
            )}
          </>
        )}
        {equilibriumOutput === null && (
          <span className="text-muted-foreground">
            Equilibrium is outside the plotted range.
          </span>
        )}
      </p>
      <p className="mt-1 text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
        {chartHints[activeChart]}
      </p>
    </div>
  );
}
