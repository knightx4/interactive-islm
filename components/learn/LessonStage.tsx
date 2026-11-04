"use client";

import Link from "next/link";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import CurvesFigure from "./CurvesFigure";
import OverTime from "@/components/islm/OverTime";
import { ScenarioChip } from "@/components/ui/scenario-chip";
import { STAGES, stageOfSection, type FigureSpec } from "@/lib/learn/figures";
import { baselineEconomy, simulate } from "@/lib/macro/model";
import { overTime } from "@/lib/macro/overtime";
import { settleIndex } from "@/lib/macro/playback";
import { recipeFor } from "@/lib/macro/recipe";
import { shockById } from "@/lib/macro/shocks";
import { simulatorLinkForShock } from "@/lib/macro/simUrl";
import { viewFor } from "@/lib/macro/view";

type Ctx = { stage: number; setStage: (n: number) => void; figureRef: React.RefObject<HTMLElement | null> };
const StageContext = createContext<Ctx | null>(null);
const useStage = () => {
  const c = useContext(StageContext);
  if (!c) throw new Error("LessonStage components must sit inside LessonStageProvider");
  return c;
};

/** Holds which stage (start, shock, short run, long run) the lesson's figure shows. */
export function LessonStageProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState(0);
  const figureRef = useRef<HTMLElement | null>(null);
  return <StageContext.Provider value={{ stage, setStage, figureRef }}>{children}</StageContext.Provider>;
}

/** The "Show this" button of one section: moves the figure to that section's stage. */
export function ShowThis({ index, count }: { index: number; count: number }) {
  const { stage, setStage, figureRef } = useStage();
  const target = stageOfSection(index, count);
  const active = stage === target;
  return (
    <button type="button" aria-pressed={active}
      onClick={() => {
        setStage(target);
        // on a narrow screen the figure sits below the text: bring it into view
        const el = figureRef.current;
        if (el && el.getBoundingClientRect().top > window.innerHeight) el.scrollIntoView({ block: "center", behavior: "smooth" });
      }}
      className={`min-h-10 shrink-0 rounded-lg border px-3.5 font-sans text-sm font-medium transition-colors ${active ? "border-ink bg-ink text-paper" : "border-rule-control bg-paper text-ink hover:border-ink"}`}>
      {active ? "Showing" : "Show this"}
    </button>
  );
}

/** The figure that stays in view beside the reading column, with the over-time strip under it. */
export function StickyFigure({ spec }: { spec: FigureSpec }) {
  const { stage, setStage, figureRef } = useStage();
  const shock = shockById(spec.shockId)!;
  const mobility = spec.mobility ?? (spec.regime === "closed" ? 1 : 0.5);
  const sim = useMemo(() => simulate(baselineEconomy(spec.regime, mobility), shock.apply, 60), [spec.regime, mobility, shock]);
  const ot = useMemo(() => overTime(sim, settleIndex(sim)), [sim]);
  const st = STAGES[stage];
  const length = sim.frames.length + 1;
  const last = length - 1;
  const t = st.at === "A" ? 0 : st.at === "B" ? 1 : last;
  const view = viewFor(sim, st.step, sim.frames.length - 1);
  const text = recipeFor(sim, spec.regime, shock)[st.step].text;
  const href = simulatorLinkForShock(spec.shockId, spec.regime);
  return (
    <aside ref={figureRef} aria-label="Figure for this lesson" className="flex flex-col gap-3">
      <figure className="panel px-3 pb-1 pt-3">
        <CurvesFigure sim={sim} view={view} animateMs={500} aspect={0.74} />
      </figure>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Stage of the figure">
        {STAGES.map((s, i) => <ScenarioChip key={s.label} active={stage === i} onClick={() => setStage(i)}>{s.label}</ScenarioChip>)}
      </div>
      <OverTime ot={ot} t={t} length={length} moved atOnce={false} compact caption={`· ${shock.label}`} />
      <p className="font-sans text-sm leading-relaxed text-ink-soft" aria-live="polite">{text}</p>
      {href && <Link href={href} className="font-sans text-sm underline underline-offset-4">Open this shock in the simulator</Link>}
    </aside>
  );
}
