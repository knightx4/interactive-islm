"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { answers, beyond, econs, record, simulateTariff, type Kind, type Policy } from "@/lib/learn/tariffs";
import type { Direction } from "@/lib/macro/predict";
import { viewFor } from "@/lib/macro/view";
import CurvesFigure from "../CurvesFigure";
import useReducedMotion from "../useReducedMotion";
import { Fig } from "./ui";

const kinds: { id: Kind; label: string; text: string }[] = [
  { id: "supply", label: "Supply: costlier inputs", text: "FE shifts left. Output at impact stays where it was, so it now sits above capacity and prices rise." },
  { id: "demand", label: "Demand: weaker exports and confidence", text: "IS shifts left. Output and the real rate fall; with slack, prices drift down." },
  { id: "uncertainty", label: "Uncertainty: investment waits", text: "IS shifts left again as firms postpone projects. Output and the real rate fall." },
  { id: "all", label: "All three together", text: "FE left and IS left at once: output falls and prices are pushed both ways. Which wins depends on the economy." },
];
const stages = [{ step: 0, label: "A before" }, { step: 3, label: "B impact" }, { step: 7, label: "C prices adjusted" }];

/* ---------- The three shocks, separately and together, on three economies ---------- */
export function TariffShocks() {
  const reduced = useReducedMotion();
  const [kind, setKind] = useState<Kind>("supply");
  const [stage, setStage] = useState(1);
  const [playing, setPlaying] = useState(false);
  const sims = useMemo(() => econs.map((e) => simulateTariff(e, kind)), [kind]);
  useEffect(() => {
    if (!playing) return;
    if (stage >= stages.length - 1) { setPlaying(false); return; }
    const id = setTimeout(() => setStage(stage + 1), 1500);
    return () => clearTimeout(id);
  }, [playing, stage]);
  const k = kinds.find((x) => x.id === kind)!;
  return (
    <Fig title="One tariff, three shocks" note="Index units from a toy economy; the sizes of the shocks are teaching assumptions, not estimates. Dashed lines show where each curve was. The US and euro area float; China is modelled as a tightly managed rate (a peg).">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Shock">
        {kinds.map((x) => (
          <Button key={x.id} type="button" size="sm" variant={x.id === kind ? "default" : "outline"} aria-pressed={x.id === kind} onClick={() => { setKind(x.id); setPlaying(false); }}>{x.label}</Button>
        ))}
      </div>
      <p className="prose-text mt-2 text-sm">{k.text}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Stage">
        {stages.map((s, i) => (
          <Button key={s.step} type="button" size="sm" variant={i === stage ? "default" : "outline"} aria-pressed={i === stage} onClick={() => { setStage(i); setPlaying(false); }}>{s.label}</Button>
        ))}
        <Button type="button" size="sm" variant="outline" onClick={() => { if (reduced) { setStage(2); return; } setStage(0); setPlaying(true); }}>{reduced ? "Jump to C" : "Play A to C"}</Button>
      </div>
      <div className="mt-4 grid gap-6 md:grid-cols-3">
        {econs.map((e, i) => {
          const sim = sims[i];
          const view = viewFor(sim, stages[stage].step, sim.frames.length - 1);
          const f = view.frame;
          return (
            <div key={e.id}>
              <h3 className="text-base">{e.name}</h3>
              <CurvesFigure sim={sim} view={view} />
              <p className="num text-xs" aria-live="polite">Y {f.Y.toFixed(1)} · r {f.r.toFixed(2)}% · P {f.P.toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    </Fig>
  );
}

/* ---------- Chief economist: predict Y, r, P and the policy rate ---------- */
type Pick = { Y?: Direction; r?: Direction; P?: Direction; policy?: Policy };
const dirOpts: { v: Direction; l: string }[] = [{ v: "up", l: "up" }, { v: "same", l: "same" }, { v: "down", l: "down" }];
const polOpts: { v: Policy; l: string }[] = [{ v: "cut", l: "cut" }, { v: "hold", l: "hold" }, { v: "raise", l: "raise" }];

function Row<T extends string>({ id, label, opts, val, onPick, truth, shown }: { id: string; label: string; opts: { v: T; l: string }[]; val?: T; onPick: (v: T) => void; truth: T; shown: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="w-52 shrink-0">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex gap-1">
        {opts.map((o) => {
          const chosen = val === o.v;
          const mark = shown ? (o.v === truth ? "border-fe font-semibold" : chosen ? "border-lm" : "border-rule text-muted-foreground") : chosen ? "border-ink font-semibold" : "border-rule text-muted-foreground";
          return <button key={o.v} type="button" role="radio" aria-checked={chosen} disabled={shown} onClick={() => onPick(o.v)} className={`border-b-2 px-2 ${mark}`} id={`${id}-${o.v}`}>{o.l}</button>;
        })}
      </div>
      {shown && <span className="text-xs text-muted-foreground">{val === truth ? "matches the model" : `model: ${truth}`}</span>}
    </div>
  );
}

export function TariffPredict() {
  const [picks, setPicks] = useState<Record<string, Pick>>({});
  const [shown, setShown] = useState(false);
  const [eased, setEased] = useState(false);
  const base = useMemo(() => econs.map((e) => simulateTariff(e, "all")), []);
  const ans = base.map(answers);
  const complete = econs.every((e) => { const p = picks[e.id]; return p && p.Y && p.r && p.P && p.policy; });
  const set = (id: string, k: keyof Pick, v: string) => setPicks((s) => ({ ...s, [id]: { ...s[id], [k]: v } }));
  const score = econs.reduce((n, e, i) => n + (["Y", "r", "P", "policy"] as const).filter((k) => picks[e.id]?.[k] === ans[i][k]).length, 0);
  return (
    <Fig title="You are the chief economist" note="Predict with all three shocks together. Y and r are read right after the shock (point B, prices fixed); P is read once prices have adjusted (point C). The policy call uses a teaching rule built from the model's own results: see the text below the answers.">
      <div className="space-y-6">
        {econs.map((e, i) => (
          <div key={e.id} className="border-t border-rule pt-3">
            <h3 className="text-base">{e.name}</h3>
            <p className="text-xs text-muted-foreground">{e.blurb}</p>
            <div className="mt-2 space-y-1.5">
              <Row id={`${e.id}-y`} label="Output, Y" opts={dirOpts} val={picks[e.id]?.Y} onPick={(v) => set(e.id, "Y", v)} truth={ans[i].Y} shown={shown} />
              <Row id={`${e.id}-r`} label="Real interest rate, r" opts={dirOpts} val={picks[e.id]?.r} onPick={(v) => set(e.id, "r", v)} truth={ans[i].r} shown={shown} />
              <Row id={`${e.id}-p`} label="Price level, P (long run)" opts={dirOpts} val={picks[e.id]?.P} onPick={(v) => set(e.id, "P", v)} truth={ans[i].P} shown={shown} />
              <Row id={`${e.id}-pol`} label={`What does ${e.bank} do?`} opts={polOpts} val={picks[e.id]?.policy} onPick={(v) => set(e.id, "policy", v)} truth={ans[i].policy} shown={shown} />
            </div>
          </div>
        ))}
      </div>
      {!shown ? (
        <Button type="button" size="sm" className="mt-4" disabled={!complete} onClick={() => setShown(true)}>Reveal the model</Button>
      ) : (
        <div className="mt-4 space-y-3 text-sm" aria-live="polite">
          <p className="font-semibold">{score} of 12 match the model.</p>
          <div className="space-y-1">
            {econs.map((e, i) => (
              <p key={e.id} className="num">{e.name}: output {(100 * ans[i].dY).toFixed(1)}% at impact, price pressure {(100 * ans[i].pressure).toFixed(0)}% over the long run → {e.bank}: {ans[i].policy}.</p>
            ))}
          </div>
          <p className="prose-text text-sm">
            The rule: if the long-run price pressure is above 3 percent, a central bank that eases would feed inflation, so it holds (or raises, if output is not falling). If pressure is small and output is falling, it cuts. The US is boxed in because the input-cost shock pushes prices up while demand weakens; the euro area has little input shock, so weaker demand wins; China faces the largest export hit under a tight rate, so prices and output both fall.
          </p>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={eased} onChange={(e) => setEased(e.target.checked)} className="accent-[var(--ink)]" />
            <span>Replay with each bank easing (model version: {econs.map((e) => `${e.name}: ${e.easing.toLowerCase()}`).join("; ")})</span>
          </label>
          {eased && (
            <div className="num space-y-0.5 text-xs">
              {econs.map((e, i) => { const s = simulateTariff(e, "all", true); return (
                <p key={e.id}>{e.name}: Y at impact {base[i].impact.Y.toFixed(1)} → {s.impact.Y.toFixed(1)}; long-run P {base[i].longRun.P.toFixed(2)} → {s.longRun.P.toFixed(2)}. Easing lifts output now and raises prices later, which is the cost the US cannot afford.</p>
              ); })}
            </div>
          )}
        </div>
      )}
    </Fig>
  );
}

/* ---------- Compare with 2025 ---------- */
export function TariffRecord() {
  return (
    <Fig title="Model against 2025" note="From memory and approximate; written in our own words. Treat each line as a prompt to check against public reporting, not as a data source.">
      <div className="space-y-5">
        {record.map((r) => {
          const e = econs.find((x) => x.id === r.id)!;
          return (
            <div key={r.id} className="border-t border-rule pt-3 text-sm">
              <h3 className="text-base">{e.name}</h3>
              <p className="prose-text mt-1"><span className="font-semibold">What happened:</span> {r.happened}</p>
              <p className="mt-1 text-xs text-muted-foreground">{r.sources}</p>
            </div>
          );
        })}
      </div>
      <p className="prose-text mt-4 text-sm"><span className="font-semibold">Where the model misses.</span> It says a float should appreciate when a country imposes tariffs and capital is mobile; in 2025 the dollar fell. Tariff news also raised doubts about US policy and assets, which looks more like a risk premium on the home currency (the lab&apos;s &lsquo;devaluation fear&rsquo; shock) than like an export-demand shock. The shape of the policy responses fits better than the exchange-rate call.</p>
      <p className="mt-2 text-xs text-muted-foreground">{beyond}</p>
    </Fig>
  );
}
