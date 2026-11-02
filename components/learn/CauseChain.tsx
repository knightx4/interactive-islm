"use client";

import type { ChainLink } from "@/lib/macro/recipe";

/** The cause-and-effect chain. Links light up one after another as the recipe reaches their step. */
export default function CauseChain({ links, step }: { links: ChainLink[]; step: number }) {
  return (
    <div>
      <div className="mb-1 text-sm font-semibold">Cause chain</div>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm" aria-label="Cause chain">
        {links.map((l, i) => {
          const lit = l.step <= step;
          // stagger the links that light together, so the chain reads link by link
          const rank = links.slice(0, i).filter((x) => x.step === l.step).length;
          return (
            <li key={i} data-lit={lit} className="flex items-center gap-1">
              <span
                className={`border-b-2 px-1 py-0.5 transition-colors duration-300 ${lit ? "border-ink font-semibold text-foreground" : "border-rule text-muted-foreground opacity-60"}`}
                style={{ transitionDelay: lit ? `${rank * 120}ms` : "0ms" }}
              >
                {l.text}
              </span>
              {i < links.length - 1 && <span aria-hidden className={lit ? "text-foreground" : "text-muted-foreground opacity-60"}>→</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
