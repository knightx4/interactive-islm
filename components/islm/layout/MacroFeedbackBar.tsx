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
    <div className="mb-3">
      <p className="text-sm">
        {equilibriumOutput !== null && gap !== null && (
          <>
            Output is{" "}
            <span
              className={
                nearFullEmployment
                  ? "font-semibold text-fe"
                  : gap > 0
                    ? "font-semibold text-lm"
                    : "font-semibold text-is"
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
              <span className="text-muted-foreground num">
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
