"use client";

import { Button } from "@/components/ui/button";
import type { RecipeStep } from "@/lib/macro/recipe";

/** The eight recipe steps. The current step drives the figures; earlier steps stay readable. */
export default function RecipeStepper({
  steps, step, onStep, enabled,
}: { steps: RecipeStep[]; step: number; onStep: (n: number) => void; enabled: boolean }) {
  return (
    <div className="space-y-3">
      <ol className="space-y-1">
        {steps.map((s, k) => (
          <li key={k} className={`border-l-2 pl-3 text-sm ${k === step ? "border-ink" : k < step ? "border-rule" : "border-transparent opacity-50"}`}>
            <button type="button" disabled={!enabled} onClick={() => onStep(k)} aria-current={k === step ? "step" : undefined}
              className="text-left font-semibold enabled:hover:underline underline-offset-4">
              {k + 1}. {s.title}
            </button>
            {k === step && <p className="mt-1 text-foreground/85" aria-live="polite">{s.text}</p>}
          </li>
        ))}
      </ol>
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" disabled={!enabled || step === 0} onClick={() => onStep(step - 1)}>Back</Button>
        <Button type="button" size="sm" disabled={!enabled || step >= steps.length - 1} onClick={() => onStep(step + 1)}>Next step</Button>
      </div>
    </div>
  );
}
