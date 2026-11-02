"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { LabSpec } from "@/lib/learn/lessons";
import { baselineEconomy, simulate, type Regime } from "@/lib/macro/model";
import { questionsFor } from "@/lib/macro/predict";
import { chainFor, recipeFor } from "@/lib/macro/recipe";
import { shockById, shocksFor } from "@/lib/macro/shocks";
import { STEPS, viewFor } from "@/lib/macro/view";
import CauseChain from "./CauseChain";
import CurvesFigure from "./CurvesFigure";
import NewsToModel from "./NewsToModel";
import PredictCheck from "./PredictCheck";
import RealWorldCard from "./RealWorldCard";
import RecipeStepper from "./RecipeStepper";
import SideMarkets from "./SideMarkets";
import TimePath from "./TimePath";
import useReducedMotion from "./useReducedMotion";

const OPEN_MOBILITY = 0.5;
const StepMs = 1600;
const TickMs = 100;

/** Pick a shock, predict, then walk the eight recipe steps over the curves, side markets and time path. */
export default function LessonLab({ lab }: { lab: LabSpec }) {
  const reduced = useReducedMotion();
  const [regime, setRegime] = useState<Regime>(lab.regime);
  const [shockId, setShockId] = useState(lab.defaultShock);
  const [revealed, setRevealed] = useState(false);
  const [step, setStep] = useState(0);
  const [t, setT] = useState(1);
  const [playing, setPlaying] = useState(false);

  const toggle: Regime[] | null = lab.regimes ?? (lab.regime === "closed" ? ["closed", "floating"] : null);
  const mobility = lab.mobility ?? (regime === "closed" ? 1 : OPEN_MOBILITY);
  const available = lab.shocks.map((id) => shockById(id)!).filter((s) => shocksFor(regime).includes(s));
  const shock = available.find((s) => s.id === shockId) ?? available[0];
  const sim = simulate(baselineEconomy(regime, regime === lab.regime ? mobility : OPEN_MOBILITY), shock.apply, 60);
  const last = sim.frames.length - 1;
  const questions = questionsFor(sim, regime);
  const steps = recipeFor(sim, regime, shock);
  const chain = chainFor(sim, regime, shock);
  // with reduced motion the figure jumps: step 6 shows the end of the adjustment, not the path
  const view = viewFor(sim, step, reduced && step === 6 ? last : t);

  useEffect(() => {
    if (!playing || reduced) return;
    const id = setTimeout(() => {
      if (step === 6) {
        if (t >= last) setStep(7);
        else setT(t + 1);
      } else if (step >= STEPS - 1) setPlaying(false);
      else {
        setStep(step + 1);
        if (step + 1 === 6) setT(1);
      }
    }, step === 6 ? TickMs : StepMs);
    return () => clearTimeout(id);
  }, [playing, reduced, step, t, last]);

  function reset() {
    setRevealed(false);
    setStep(0);
    setT(1);
    setPlaying(false);
  }
  const pick = (id: string) => { setShockId(id); reset(); };
  const pickRegime = (r: Regime) => { setRegime(r); reset(); };
  const goStep = (n: number) => { setPlaying(false); setStep(n); if (n === 6) setT(1); };
  const play = () => {
    if (reduced) return goStep(STEPS - 1);
    if (step >= STEPS - 1) { setStep(0); setT(1); }
    setPlaying(true);
  };

  const label =
    view.at === "A" ? "Point A: before the shock" : view.at === "B" ? "Point B: impact, prices not yet moved" :
    view.at === "C" ? "Point C: prices fully adjusted" : `Prices adjusting: period ${view.t}`;

  return (
    <div className="space-y-8">
      <section className="border-t border-ink pt-4">
        <h2 className="text-xl">1. Choose a shock</h2>
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Shock">
            {available.map((s) => (
              <Button key={s.id} type="button" size="sm" variant={s.id === shock.id ? "default" : "outline"} aria-pressed={s.id === shock.id} onClick={() => pick(s.id)}>
                {s.label}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{shock.blurb}</p>
          {toggle && (
            <div className="flex items-center gap-2 text-sm" role="group" aria-label="Economy">
              <span className="text-muted-foreground">Economy:</span>
              {toggle.map((r) => (
                <Button key={r} type="button" size="sm" variant={regime === r ? "default" : "outline"} aria-pressed={regime === r} onClick={() => pickRegime(r)}>
                  {r === "closed" ? "Closed" : r === "floating" ? "Open, floating rate" : "Open, pegged rate"}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-ink pt-4">
        <h2 className="text-xl">2. Predict first</h2>
        <div className="mt-3">
          <PredictCheck key={`${shock.id}-${regime}`} questions={questions} revealed={revealed} onReveal={() => setRevealed(true)} />
        </div>
      </section>

      <section className="border-t border-ink pt-4">
        <h2 className="text-xl">3. Work it through the recipe</h2>
        <div className="mt-3 space-y-4">
          <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="space-y-4">
              <RecipeStepper steps={steps} step={step} onStep={goStep} enabled={revealed} />
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" size="sm" variant="outline" disabled={!revealed} onClick={playing ? () => setPlaying(false) : play}>
                  {playing ? "Pause" : reduced ? "Jump to C" : step >= STEPS - 1 ? "Replay" : "Play all steps"}
                </Button>
                {step === 6 && !reduced && (
                  <label className="flex flex-1 items-center gap-2 text-sm">
                    <span className="whitespace-nowrap">Period</span>
                    <input type="range" min={1} max={last} value={t} disabled={!revealed} aria-label="Period"
                      onChange={(e) => { setPlaying(false); setT(Number(e.target.value)); }} className="flex-1 accent-[var(--ink)]" />
                  </label>
                )}
              </div>
              {reduced && <p className="text-xs text-muted-foreground">Reduced motion is on: the figures jump between A, B and C instead of animating.</p>}
            </div>
            <div>
              <CurvesFigure sim={sim} view={view} />
              <p className="num mt-1 text-sm font-semibold" aria-live="polite">{label}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                <span className="font-semibold" style={{ color: "var(--pt-a)" }}>A</span> black: start.{" "}
                <span className="font-semibold" style={{ color: "var(--pt-b)" }}>B</span> red: impact.{" "}
                <span className="font-semibold" style={{ color: "var(--pt-c)" }}>C</span> blue: long run. Dashed lines show where curves were; arrows show the shift. Index units, not real data.
              </p>
            </div>
          </div>
          <CauseChain links={chain} step={revealed ? step : -1} />
          {!revealed && <p className="text-sm text-muted-foreground">Make your predictions above, then reveal to unlock the recipe.</p>}
        </div>
      </section>

      <section className="border-t border-ink pt-4">
        <h2 className="text-xl">4. The markets behind the curves</h2>
        <div className="mt-3 space-y-6">
          <SideMarkets sim={sim} view={view} />
          <TimePath sim={sim} index={view.t} />
        </div>
      </section>

      <section className="space-y-8">
        <RealWorldCard shockId={shock.id} />
        <NewsToModel activeShock={shock.id} />
      </section>
    </div>
  );
}
