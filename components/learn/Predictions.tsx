"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Prediction } from "@/lib/learn/lessons";

/** Prediction checks: commit to an answer first; the explanation appears after. */
export default function Predictions({ items }: { items: Prediction[] }) {
  const [pick, setPick] = useState<Record<number, number>>({});
  const [shown, setShown] = useState<Record<number, boolean>>({});
  const right = items.filter((p, i) => shown[i] && pick[i] === p.answer).length;
  const done = items.filter((_, i) => shown[i]).length;
  return (
    <div className="space-y-6">
      {items.map((p, i) => {
        const open = shown[i];
        return (
          <fieldset key={i} className="max-w-2xl">
            <legend className="prose-text font-semibold">{i + 1}. {p.q}</legend>
            <div className="mt-2 flex flex-col gap-1.5" role="radiogroup" aria-label={p.q}>
              {p.options.map((o, k) => {
                const chosen = pick[i] === k;
                return (
                  <button key={k} type="button" role="radio" aria-checked={chosen} disabled={open}
                    onClick={() => setPick((s) => ({ ...s, [i]: k }))}
                    data-state={open && k === p.answer ? "right" : open && chosen ? "wrong" : chosen ? "chosen" : "idle"}
                    className={`min-h-10 rounded-lg border px-3 py-2 text-left font-sans text-sm text-ink transition-colors disabled:cursor-default ${
                      open && k === p.answer ? "border-[var(--right-border)] bg-[var(--right-bg)]"
                      : open && chosen ? "border-[var(--wrong-border)] bg-[var(--wrong-bg)]"
                      : chosen ? "border-ink shadow-[inset_0_0_0_1px_var(--ink)]" : "border-rule-control bg-paper hover:border-ink"}`}>
                    {o}{open && k === p.answer ? " (correct)" : ""}
                  </button>
                );
              })}
            </div>
            {open ? (
              <p className="prose-text mt-2 text-sm" role="status">{pick[i] === p.answer ? "Right. " : "Not quite. "}{p.why}</p>
            ) : (
              <Button type="button" size="sm" className="mt-2" disabled={pick[i] === undefined} onClick={() => setShown((s) => ({ ...s, [i]: true }))}>Check</Button>
            )}
          </fieldset>
        );
      })}
      {done > 0 && <p className="text-sm font-medium" aria-live="polite">{right} of {done} checked so far correct.</p>}
    </div>
  );
}
