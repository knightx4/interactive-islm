"use client";

import type { Frame } from "@/lib/macro/model";

/** Within this share of full employment, output counts as "near" it. */
const TOLERANCE = 0.01;

/** Where output is against Y* at the point on show. */
export default function MacroFeedbackBar({ frame }: { frame: Frame }) {
  const gap = frame.Y - frame.Ystar;
  const near = Math.abs(gap) / frame.Ystar < TOLERANCE;
  return (
    <div className="mb-3">
      <p className="text-sm">
        Output is{" "}
        <span className={near ? "font-semibold text-fe" : gap > 0 ? "font-semibold text-lm" : "font-semibold text-is"}>
          {near ? "at full employment" : gap > 0 ? "above Y*" : "below Y*"}
        </span>
        {` (Y=${frame.Y.toFixed(1)}, Y*=${frame.Ystar.toFixed(1)}). `}
        {!near && (
          <span className="text-muted-foreground">
            {gap > 0 ? "Inflationary" : "Recessionary"} gap: {gap > 0 ? "+" : ""}{gap.toFixed(1)}, so prices {gap > 0 ? "rise" : "fall"}.
          </span>
        )}
      </p>
    </div>
  );
}
