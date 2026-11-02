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
            <div className="mt-2 space-y-1">
              {p.options.map((o, k) => {
                const chosen = pick[i] === k;
                const mark = open ? (k === p.answer ? "border-fe" : chosen ? "border-lm" : "border-transparent") : chosen ? "border-ink" : "border-transparent";
                return (
                  <label key={k} className={`flex cursor-pointer items-start gap-2 border-l-2 pl-2 text-sm ${mark}`}>
                    <input type="radio" name={`pred-${p.q}`} disabled={open} checked={chosen}
                      onChange={() => setPick((s) => ({ ...s, [i]: k }))} className="mt-1 accent-[var(--ink)]" />
                    <span>{o}{open && k === p.answer ? " (correct)" : ""}</span>
                  </label>
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
