"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { baselineEconomy, simulate, type Regime } from "@/lib/macro/model";
import { questionsFor } from "@/lib/macro/predict";
import { chainFor, recipeFor } from "@/lib/macro/recipe";
import { shockById, shocksFor } from "@/lib/macro/shocks";
import CurvesFigure from "./CurvesFigure";
import RecipeStepper from "./RecipeStepper";
import PredictCheck from "./PredictCheck";
import SideMarkets from "./SideMarkets";
import TimePath from "./TimePath";

export default function LessonLab({ regime, defaultShock }: { regime: Regime; defaultShock: string }) {
  const available = shocksFor(regime);
  const [shockId, setShockId] = useState(defaultShock);
  const [revealed, setRevealed] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const shock = shockById(shockId) ?? available[0];
  const sim = simulate(baselineEconomy(regime), shock.apply, 60);
  const questions = questionsFor(sim, regime);
  const last = sim.frames.length - 1;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setIndex((i) => {
        if (i >= last) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 120);
    return () => clearInterval(id);
  }, [playing, last]);

  function pick(id: string) {
    setShockId(id);
    setRevealed(false);
    setIndex(0);
    setPlaying(false);
  }
  function reveal() {
    setRevealed(true);
    setIndex(0);
    setPlaying(true);
  }
  function replay() {
    setIndex(0);
    setPlaying(true);
  }

  const label = index === 0 ? "Before the shock" : index === 1 ? "Impact: prices not yet moved" : `Period ${index}`;

  return (
    <div className="space-y-8">
      <section className="border-t border-ink pt-4"><h2 className="text-xl">1. Choose a shock</h2><div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-2">
            {available.map((s) => (
              <Button key={s.id} type="button" size="sm" variant={s.id === shock.id ? "default" : "outline"} onClick={() => pick(s.id)}>
                {s.label}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{shock.blurb}</p>
        </div>
      </section>

      <section className="border-t border-ink pt-4"><h2 className="text-xl">2. Predict first</h2><div className="mt-3">
          <PredictCheck key={shock.id} questions={questions} revealed={revealed} onReveal={reveal} />
        </div>
      </section>

      <section className="border-t border-ink pt-4"><h2 className="text-xl">Recipe: work it out step by step</h2><div className="mt-3">
          <RecipeStepper key={shock.id} steps={recipeFor(sim, regime, shock.label)} chain={chainFor(sim, regime)} />
        </div>
      </section>

      <section className="border-t border-ink pt-4"><h2 className="text-xl">3. Watch the economy adjust</h2><div className="mt-3 space-y-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <CurvesFigure sim={sim} index={index} />
              <p className="mt-1 text-sm text-muted-foreground">Dashed lines show where the curves started. Index units, not real data.</p>
            </div>
            <div className="space-y-3">
              <SideMarkets sim={sim} index={index} />
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" disabled={!revealed} onClick={playing ? () => setPlaying(false) : replay}>
                  {playing ? "Pause" : index >= last ? "Replay" : "Play"}
                </Button>
                <input type="range" min={0} max={last} value={index} disabled={!revealed} aria-label="Time"
                  onChange={(e) => { setPlaying(false); setIndex(Number(e.target.value)); }} className="flex-1 accent-[var(--ink)]" />
              </div>
              <div className="num text-sm font-semibold">{label}</div>
            </div>
          </div>
          <TimePath sim={sim} index={index} />
          {!revealed && <p className="text-sm text-muted-foreground">Make your predictions above, then reveal to unlock the animation.</p>}
        </div>
      </section>
    </div>
  );
}
