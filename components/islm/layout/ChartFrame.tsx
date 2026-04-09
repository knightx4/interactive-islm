"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import ClientOnlyChart from "@/components/islm/layout/ClientOnlyChart";
import MeasuredRechartsChart from "@/components/islm/layout/MeasuredRechartsChart";

interface ChartFrameProps {
  compact?: boolean;
  /**
   * Use inside flex layouts (e.g. “All” view sidebar) so the plot gets a real height.
   * Do not combine with classNames that set `min-h-0` or strip aspect without replacing height.
   */
  fill?: boolean;
  /** Pass a single Recharts *Chart (e.g. LineChart) — not ResponsiveContainer */
  children: ReactNode;
  className?: string;
}

function RechartsSlot({
  children,
  compact,
  fill,
}: {
  children: ReactNode;
  compact: boolean;
  fill: boolean;
}) {
  const skeletonClassName = fill
    ? compact
      ? "min-h-[72px]"
      : "min-h-[120px]"
    : compact
      ? "min-h-[160px]"
      : "min-h-[200px]";

  const inner = (
    <ClientOnlyChart skeletonClassName={skeletonClassName}>
      <MeasuredRechartsChart>{children}</MeasuredRechartsChart>
    </ClientOnlyChart>
  );

  /** Fill mode still participates in flex height so the plot area cannot collapse to zero. */
  if (fill) {
    const minHeightClassName = compact ? "min-h-[72px]" : "min-h-[120px]";
    return (
      <div className={cn("relative flex h-full w-full min-w-0 flex-1 flex-col overflow-hidden", minHeightClassName)}>
        {inner}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
      {inner}
    </div>
  );
}

export default function ChartFrame({
  compact = false,
  fill = false,
  children,
  className,
}: ChartFrameProps) {
  return (
    <div
      className={cn(
        "w-full max-w-full mx-auto rounded-lg",
        fill
          ? "relative flex min-h-0 w-full min-w-0 flex-1 basis-0 flex-col overflow-hidden"
          : "relative flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden",
        className
      )}
    >
      {fill ? (
        <div className={cn("relative flex w-full min-w-0 flex-1 basis-0 flex-col", compact ? "min-h-[72px]" : "min-h-[120px]")}>
          <RechartsSlot compact={compact} fill={fill}>
            {children}
          </RechartsSlot>
        </div>
      ) : (
        <RechartsSlot compact={compact} fill={false}>
          {children}
        </RechartsSlot>
      )}
    </div>
  );
}
