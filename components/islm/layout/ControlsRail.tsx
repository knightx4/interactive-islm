"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ControlsRailProps {
  children: ReactNode;
  className?: string;
}

export default function ControlsRail({ children, className }: ControlsRailProps) {
  return (
    <section
      className={cn(
        "overscroll-contain",
        // Mobile / vertical stack: fill the grid row and scroll parameters inside this pane
        "max-sm:flex max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col max-sm:overflow-y-auto max-sm:rounded-lg max-sm:border max-sm:border-border max-sm:bg-card max-sm:p-1.5 max-sm:shadow-sm",
        "sm:flex sm:h-full sm:min-h-0 sm:max-h-full sm:flex-1 sm:flex-col sm:overflow-y-auto sm:overscroll-contain",
        className
      )}
    >
      {children}
    </section>
  );
}
