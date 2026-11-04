import * as React from "react"

import { cn } from "@/lib/utils"

type PickButtonProps = React.ComponentProps<"button"> & {
  /** The reader's current choice. */
  chosen?: boolean
  /** After checking: this option is the model's answer. */
  right?: boolean
  /** After checking: this option was chosen and is wrong. */
  wrong?: boolean
}

/** A prediction choice such as ↑ / ↓ / –: ink ring when chosen, green when right, red when wrong. */
function PickButton({ className, chosen = false, right = false, wrong = false, type = "button", ...props }: PickButtonProps) {
  return (
    <button
      type={type}
      data-slot="pick-button"
      aria-pressed={chosen}
      data-state={right ? "right" : wrong ? "wrong" : chosen ? "chosen" : "idle"}
      className={cn(
        "min-h-10 min-w-11 rounded-lg border px-3 text-base font-semibold text-ink transition-colors disabled:cursor-default",
        right
          ? "border-[var(--right-border)] bg-[var(--right-bg)]"
          : wrong
            ? "border-[var(--wrong-border)] bg-[var(--wrong-bg)]"
            : chosen
              ? "border-ink shadow-[inset_0_0_0_1px_var(--ink)]"
              : "border-rule-control bg-paper enabled:hover:border-ink",
        className
      )}
      {...props}
    />
  )
}

export { PickButton }
