"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

export type CurveTab = {
  id: string
  label: string
  /** CSS colour for the label, e.g. "var(--c-is)". */
  color?: string
}

type CurveTabsProps = {
  tabs: CurveTab[]
  value: string
  onValueChange: (id: string) => void
  /** Accessible name for the tab strip. */
  label?: string
  className?: string
  /** Put a <CurveTabPanel value="…"> per tab here. */
  children?: React.ReactNode
}

/** The IS / LM / FE / Open tab strip; each label wears its curve's colour. */
function CurveTabs({ tabs, value, onValueChange, label = "Which curve to move", className, children }: CurveTabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="curve-tabs"
      value={value}
      onValueChange={onValueChange}
      className={cn("flex flex-col", className)}
    >
      <TabsPrimitive.List
        aria-label={label}
        className="flex border-b border-rule px-2"
      >
        {tabs.map((t) => (
          <TabsPrimitive.Trigger
            key={t.id}
            value={t.id}
            className="min-h-11 flex-1 border-b-2 border-transparent text-sm font-medium text-muted-foreground transition-colors data-[state=active]:border-ink data-[state=active]:text-ink"
          >
            <span style={t.color ? { color: t.color } : undefined}>{t.label}</span>
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {children}
    </TabsPrimitive.Root>
  )
}

function CurveTabPanel({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="curve-tab-panel" className={cn("outline-none", className)} {...props} />
}

export { CurveTabs, CurveTabPanel }
