"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ChainCase } from "@/lib/learn/lessons";
import CauseChain from "./CauseChain";
import useReducedMotion from "./useReducedMotion";

/** One real case as a cause chain that lights up link by link. Reduced motion shows the whole chain at once. */
function One({ c }: { c: ChainCase }) {
  const reduced = useReducedMotion();
  const n = c.links.length;
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (step >= n - 1) { setPlaying(false); return; }
    const id = setTimeout(() => setStep(step + 1), 900);
    return () => clearTimeout(id);
  }, [playing, step, n]);
  const play = () => { if (reduced) { setStep(n - 1); return; } setStep(0); setPlaying(true); };
  const links = c.links.map((text, i) => ({ text, step: i }));
  return (
    <aside className="max-w-3xl border-t border-rule pt-3" aria-label={`Case: ${c.heading}`}>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.when}</div>
      <h3 className="mt-0.5 text-lg">{c.heading}</h3>
      <p className="prose-text mt-1 max-w-2xl text-sm">{c.text}</p>
      <div className="mt-3">
        <CauseChain links={links} step={step} />
        <div className="mt-2 flex items-center gap-3">
          <Button type="button" size="sm" variant="outline" onClick={playing ? () => setPlaying(false) : play}>
            {playing ? "Pause" : reduced ? "Show the chain" : step >= n - 1 ? "Replay" : "Play the chain"}
          </Button>
          <span className="text-xs text-muted-foreground" aria-live="polite">{step < 0 ? "Not started" : `Link ${Math.min(step + 1, n)} of ${n}`}</span>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{c.curves}</p>
      <p className="mt-1 text-xs text-muted-foreground">{c.approx}</p>
    </aside>
  );
}

export default function CaseChains({ cases }: { cases: ChainCase[] }) {
  return <div className="space-y-8">{cases.map((c) => <One key={c.heading} c={c} />)}</div>;
}
