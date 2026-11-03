"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

type CauseSliderRowProps = {
  name: string
  /** The "through …" line: the channel by which this cause reaches its curve. */
  via: string
  /** Colour of the slider, normally the curve's token, e.g. "var(--c-is)". */
  color: string
  /** Current level, −3 to +3 in half steps by default. */
  value: number
  onValueChange: (value: number) => void
  /** Word at the left end, e.g. "falls". */
  low?: string
  /** Word at the right end, e.g. "rises". */
  high?: string
  min?: number
  max?: number
  step?: number
  active?: boolean
  className?: string
}

/** Fixed width of the value slot, so numbers such as "+2.5" never clip. */
export const CAUSE_VALUE_SLOT_PX = 44

export function formatLevel(v: number): string {
  if (v === 0) return "0"
  const s = Number.isInteger(v) ? String(Math.abs(v)) : Math.abs(v).toFixed(1)
  return (v > 0 ? "+" : "−") + s
}

/**
 * One cause: name, "through …" line, then falls / slider / rises / value.
 * The value sits in a fixed 44px slot.
 */
function CauseSliderRow({
  name,
  via,
  color,
  value,
  onValueChange,
  low = "falls",
  high = "rises",
  min = -3,
  max = 3,
  step = 0.5,
  active = false,
  className,
}: CauseSliderRowProps) {
  return (
    <div
      data-slot="cause-slider-row"
      className={cn(
        "flex min-w-0 flex-col gap-0.5 rounded-lg border px-3 py-2",
        active ? "border-rule-control bg-wash" : "border-transparent",
        className
      )}
    >
      <span className="text-sm font-medium">{name}</span>
      <span className="text-xs text-muted-foreground">{via}</span>
      <div
        className="grid items-center gap-2 text-xs text-muted-foreground"
        style={{ gridTemplateColumns: `auto minmax(0,1fr) auto ${CAUSE_VALUE_SLOT_PX}px` }}
      >
        <span>{low}</span>
        <Slider
          aria-label={name}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(v) => onValueChange(v[0])}
          style={{ "--slider-color": color } as React.CSSProperties}
        />
        <span>{high}</span>
        <span
          className="num text-right text-sm font-semibold text-ink"
          style={{ width: CAUSE_VALUE_SLOT_PX }}
          data-slot="cause-value"
        >
          {formatLevel(value)}
        </span>
      </div>
    </div>
  )
}

export { CauseSliderRow }
