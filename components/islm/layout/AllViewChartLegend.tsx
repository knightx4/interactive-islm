"use client";

import type { ReactNode } from "react";

/** Micro-legend for “All” tab thumbnails — lives in the card header so Recharts keeps no bottom legend margin. */

export function AllViewLegendItem({
  color,
  label,
  vertical,
}: {
  color: string;
  label: string;
  /** Vertical swatch (e.g. money supply line) */
  vertical?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[7px] font-medium tabular-nums text-muted-foreground">
      <span
        className={vertical ? "inline-block h-2 w-px rounded-sm" : "inline-block h-px w-2 rounded-sm"}
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

export function AllViewLegendRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-x-2 gap-y-0.5">{children}</div>
  );
}
