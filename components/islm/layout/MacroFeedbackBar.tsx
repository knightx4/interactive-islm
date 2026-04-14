"use client";

import { OUTPUT_GAP_TOLERANCE } from "@/lib/islmModel";

interface MacroFeedbackBarProps {
  equilibriumOutput: number | null;
  fullEmployment: number;
}

export default function MacroFeedbackBar({
  equilibriumOutput,
  fullEmployment,
}: MacroFeedbackBarProps) {
  const gap =
    equilibriumOutput !== null ? equilibriumOutput - fullEmployment : null;
  const nearFullEmployment =
    gap !== null && Math.abs(gap) < OUTPUT_GAP_TOLERANCE;

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
    </div>
  );
}
