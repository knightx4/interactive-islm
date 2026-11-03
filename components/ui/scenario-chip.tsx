import * as React from "react"

import { cn } from "@/lib/utils"

type ScenarioChipProps = React.ComponentProps<"button"> & {
  /** True while this scenario is the one playing or edited. */
  active?: boolean
}

/** Rounded chip that plays a named scenario (e.g. "2025 tariffs"). */
function ScenarioChip({ className, active = false, type = "button", ...props }: ScenarioChipProps) {
  return (
    <button
      type={type}
      data-slot="scenario-chip"
      aria-pressed={active}
      className={cn(
        "min-h-9 shrink-0 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-medium transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-rule-control bg-paper text-ink hover:border-ink",
        className
      )}
      {...props}
    />
  )
}

export { ScenarioChip }
