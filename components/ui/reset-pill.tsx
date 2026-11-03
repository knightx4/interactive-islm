import * as React from "react"
import { RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"

/** The prominent red Reset pill: #fdecea fill, #b42318 text, reset icon. */
function ResetPill({
  className,
  children = "Reset all",
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      data-slot="reset-pill"
      className={cn(
        "inline-flex min-h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--reset-border)] bg-[var(--reset-bg)] px-4 text-[13px] font-semibold text-[var(--reset-fg)] transition-colors hover:border-[var(--reset-fg)] hover:bg-[var(--reset-bg-hover)]",
        className
      )}
      {...props}
    >
      <RotateCcw aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
      {children}
    </button>
  )
}

export { ResetPill }
