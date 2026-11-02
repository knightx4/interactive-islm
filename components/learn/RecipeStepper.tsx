"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { RecipeStep } from "@/lib/macro/recipe";

export default function RecipeStepper({ steps, chain }: { steps: RecipeStep[]; chain: string[] }) {
  const [n, setN] = useState(0);
  return (
    <div className="space-y-4">
      <ol className="space-y-2">
        {steps.map((s, k) => (
          <li key={k} className={`border-l-2 py-1 pl-3 text-sm ${k === n ? "border-ink" : k < n ? "border-rule" : "border-transparent opacity-50"}`}>
            <div className="font-semibold">{k + 1}. {s.title}</div>
            {k <= n && <p className="mt-1 text-foreground/85">{s.text}</p>}
          </li>
        ))}
      </ol>
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" disabled={n === 0} onClick={() => setN(n - 1)}>Back</Button>
        <Button type="button" size="sm" disabled={n >= steps.length - 1} onClick={() => setN(n + 1)}>Next step</Button>
      </div>
      <div>
        <div className="mb-1 text-sm font-semibold">Cause chain</div>
        <div className="flex flex-wrap items-center gap-1 text-sm">
          {chain.map((c, k) => (
            <span key={k} className="flex items-center gap-1">
              <span className="border-b border-ink px-1 py-0.5">{c}</span>
              {k < chain.length - 1 && <span aria-hidden>→</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
