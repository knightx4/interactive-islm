"use client";

import { useEffect, useMemo, useState } from "react";
import Chart from "@/components/chart/Chart";
import { Button } from "@/components/ui/button";
import { rates, runScenario, scenarios, timeline, type ScenarioId } from "@/lib/learn/reunification";
import { viewFor } from "@/lib/macro/view";
import CurvesFigure from "../CurvesFigure";
import useReducedMotion from "../useReducedMotion";
import { Fig } from "./ui";

const stages = [{ step: 0, label: "A before" }, { step: 3, label: "B impact" }, { step: 7, label: "C prices adjusted" }];

/* ---------- Germany and the UK on linked curves ---------- */
export function GermanyUk() {
  const reduced = useReducedMotion();
  const [id, setId] = useState<ScenarioId>("fiscal");
  const [stage, setStage] = useState(1);
  const [playing, setPlaying] = useState(false);
  const sims = useMemo(() => {
    const w = runScenario(id);
    return { de: w.foreign!, uk: w.home };
  }, [id]);
  useEffect(() => {
    if (!playing) return;
    if (stage >= stages.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStage(stage + 1), 1500);
    return () => clearTimeout(t);
  }, [playing, stage]);
  const sc = scenarios.find((s) => s.id === id)!;
  const step = stages[stage].step;
  const deV = viewFor(sims.de, step, sims.de.frames.length - 1);
  const ukV = viewFor(sims.uk, step, sims.uk.frames.length - 1);
  const d = deV.frame, u = ukV.frame;
  const pegged = sc.uk === "fixed" && !sims.uk.frames.some((f) => f.devalued);
  return (
    <Fig title="Two economies, one exchange-rate system" note="Index units from a linked pair of toy economies: Germany floats and sets its own money supply; the UK starts pegged to it (except in the last scenario). Sizes are teaching assumptions. In the real episode the UK was already in recession before the German shocks.">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Scenario">
        {scenarios.map((s) => (
          <Button key={s.id} type="button" size="sm" variant={s.id === id ? "default" : "outline"} aria-pressed={s.id === id} onClick={() => { setId(s.id); setPlaying(false); }}>{s.label}</Button>
        ))}
      </div>
      <p className="prose-text mt-2 max-w-2xl text-sm">{sc.text}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Stage">
        {stages.map((s, i) => (
          <Button key={s.step} type="button" size="sm" variant={i === stage ? "default" : "outline"} aria-pressed={i === stage} onClick={() => { setStage(i); setPlaying(false); }}>{s.label}</Button>
        ))}
        <Button type="button" size="sm" variant="outline" onClick={() => { if (reduced) { setStage(2); return; } setStage(0); setPlaying(true); }}>{reduced ? "Jump to C" : "Play A to C"}</Button>
      </div>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div><h3 className="text-base">Germany</h3><CurvesFigure sim={sims.de} view={deV} /></div>
        <div><h3 className="text-base">United Kingdom{pegged ? " (pegged to the mark)" : sc.uk === "floating" ? " (floating)" : " (peg broken)"}</h3><CurvesFigure sim={sims.uk} view={ukV} /></div>
      </div>
      <table className="num mt-4 w-full max-w-xl text-sm" aria-live="polite">
        <caption className="sr-only">Values at the chosen stage</caption>
        <thead><tr className="border-b border-ink text-left"><th className="py-1 font-semibold">At this stage</th><th className="font-semibold">Germany</th><th className="font-semibold">UK</th></tr></thead>
        <tbody>
          <tr className="border-b border-rule"><td className="py-1">Output, Y</td><td>{d.Y.toFixed(1)}</td><td>{u.Y.toFixed(1)}</td></tr>
          <tr className="border-b border-rule"><td className="py-1">Real interest rate, r (%)</td><td>{d.r.toFixed(2)}</td><td>{u.r.toFixed(2)}</td></tr>
          <tr className="border-b border-rule"><td className="py-1">UK reserves</td><td>–</td><td>{u.Res.toFixed(1)}</td></tr>
          <tr className="border-b border-rule"><td className="py-1">Marks per pound, index (e)</td><td>–</td><td>{u.E.toFixed(2)}</td></tr>
        </tbody>
      </table>
      <p className="prose-text mt-2 max-w-2xl text-sm" aria-live="polite">
        {pegged
          ? `The peg constraint: the UK rate (${u.r.toFixed(2)}%) is pulled to the German rate (${d.r.toFixed(2)}%) whatever UK output (${u.Y.toFixed(1)}) would like. Output is ${u.Y < 100 ? "below" : "above"} its starting level, and reserves are ${u.Res < 40 ? "being drawn down" : "not falling"}.`
          : sc.uk === "floating" ? `With a float the UK rate (${u.r.toFixed(2)}%) is its own choice, and the pound adjusts instead.`
          : "After the exit the pound is lower and the UK sets its own rate again."}
      </p>
    </Fig>
  );
}

/* ---------- Dated history ---------- */
export function Timeline() {
  const t = rates.map((r) => r.t);
  return (
    <Fig title="The path to 16 September 1992" note="Rounded values from memory and approximate. Check against Bundesbank and Bank of England historical rate series and the Bank of England's own account of the episode.">
      <ol className="divide-y divide-rule border-y border-rule text-sm">
        {timeline.map((x) => (
          <li key={x.date} className="grid gap-x-4 py-2 md:grid-cols-[11rem_1fr]">
            <span className="num font-semibold">{x.date}</span>
            <span className="prose-text">{x.text}</span>
          </li>
        ))}
      </ol>
      <div className="mt-4 max-w-lg">
        <Chart
          series={[
            { id: "de", curve: "labour", label: "German", points: rates.map((r) => ({ x: r.t, y: r.de })) },
            { id: "uk", curve: "money", label: "UK", points: rates.map((r) => ({ x: r.t, y: r.uk })) },
          ]}
          xDomain={[Math.min(...t) - 0.1, Math.max(...t) + 0.3]} yDomain={[4, 16]} xLabel="Year (1990 to 1993)" yLabel="Policy rate (%)" xTicks={3} yTicks={6}
          title="German discount rate and UK base rate, 1990 to 1993, rounded and approximate"
        />
        <p className="mt-1 text-xs text-muted-foreground">German discount rate and UK base rate at a handful of dates, rounded. The UK rate falls toward the German one on joining; the German rate rises into 1992.</p>
      </div>
    </Fig>
  );
}
