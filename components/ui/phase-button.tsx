import * as React from "react"

import { cn } from "@/lib/utils"

type PhaseButtonProps = Omit<React.ComponentProps<"button">, "children"> & {
  /** "A", "B" or "C". */
  letter: string
  /** Short name, e.g. "Short run, prices fixed". */
  name: string
  /** Colour of the letter; use the point tokens (--pt-a, --pt-b, --pt-c). */
  color?: string
  active?: boolean
}

/** One of the A / B / C phase buttons under the chart. */
function PhaseButton({
  className,
  letter,
  name,
  color = "var(--ink)",
  active = false,
  type = "button",
  ...props
}: PhaseButtonProps) {
  return (
    <button
      type={type}
      data-slot="phase-button"
      aria-pressed={active}
      className={cn(
        "flex min-h-11 min-w-0 flex-1 flex-col items-start gap-0.5 rounded-lg border bg-paper px-3.5 py-2.5 text-left text-ink transition-colors",
        active ? "border-ink shadow-[inset_0_0_0_1px_var(--ink)]" : "border-rule-control hover:border-ink",
        className
      )}
      {...props}
    >
      <span className="text-xs font-semibold" style={{ color }}>
        {letter}
      </span>
      <span className="text-sm font-medium">{name}</span>
    </button>
  )
}

export { PhaseButton }
