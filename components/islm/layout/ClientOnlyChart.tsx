"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Recharts output depends on browser layout (sizes, clipPath ids, tick positions).
 * Rendering it during SSR produces HTML that does not match the client → hydration errors.
 * Server + first client paint: skeleton. After mount: real chart.
 */
export default function ClientOnlyChart({
  children,
  skeletonClassName,
}: {
  children: ReactNode;
  /** Extra classes for the loading block (should reserve rough chart height) */
  skeletonClassName?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-full w-full min-h-[2px] min-w-[2px] rounded-sm bg-muted/25",
          skeletonClassName
        )}
        aria-busy
        aria-label="Loading chart"
      />
    );
  }

  return <>{children}</>;
}
