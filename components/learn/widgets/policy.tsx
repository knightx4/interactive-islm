"use client";

import { useState } from "react";
import Chart from "@/components/chart/Chart";
import { Button } from "@/components/ui/button";
import { briefs, contributions2008, impliedInflation, recessionRows, R_STAR, TARGET, taylor, totalContribution, usPolicy, withFloor } from "@/lib/learn/policy";
import { shockById, type Curve } from "@/lib/macro/shocks";
import { Ctl, Fig, f1 } from "./ui";
import { labWidget } from "./fullmodel";

export const RecessionLab = labWidget({
  regime: "closed",
  shocks: ["taxes-up", "wealth-down", "money-supply-down", "productivity-down", "capital-down"],
  defaultShock: "wealth-down",
});

const sgn = (x: number, d = 1) => `${x > 0.005 ? "+" : x < -0.005 ? "−" : ""}${Math.abs(x).toFixed(d)}`;

/* ---------- Three ways for output to fall ---------- */
export function RecessionTypes() {
  const rows = recessionRows();
  return (
    <Fig title="Three ways for output to fall, run through the model" note="Index units; the baseline is output 100 and price level 1. 'Impact' is point B with prices fixed; 'long run' is point C.">
      <div className="overflow-x-auto">
        <table className="num w-full min-w-[34rem] text-sm">
          <thead>
            <tr className="border-b border-ink text-left text-xs text-muted-foreground">
              <th className="py-1 font-semibold">Curve that moves left</th><th className="font-semibold">Example</th><th className="text-right font-semibold">Output on impact</th><th className="text-right font-semibold">Output in the long run</th><th className="text-right font-semibold">Price level in the long run</th><th className="pl-3 font-semibold">Kind</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.curve} className="border-b border-rule">
                <td className="py-1.5 font-semibold">{r.curve}</td><td>{r.label}</td>
                <td className="text-right">{sgn(r.yImpact)}</td><td className="text-right">{sgn(r.yLong)}</td><td className="text-right">{sgn(r.pLong, 2)}</td>
                <td className="pl-3">{r.kind}, {r.origin.toLowerCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="prose-text mt-2 text-sm">
        An IS or LM recession is a demand recession: output is below FE, there is slack, and prices fall as the economy recovers. An FE recession is a supply recession: output was above the new FE to start with, prices rise as it falls. So inflation rising during a downturn points to supply, and inflation falling points to demand. A recession that starts with money (LM) is nominal: once prices adjust, nothing real has changed. One that starts with spending or capacity (IS or FE) is real.
      </p>
    </Fig>
  );
}

/* ---------- The classifier ---------- */
const order: Curve[] = ["IS", "LM", "FE"];
export function Classifier() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<Curve | null>(null);
  const [score, setScore] = useState({ right: 0, tried: 0 });
  const b = briefs[i % briefs.length];
  const s = shockById(b.shockId)!;
  const done = pick !== null;
  const choose = (c: Curve) => {
    if (done) return;
    setPick(c);
    setScore((x) => ({ right: x.right + (c === s.curve ? 1 : 0), tried: x.tried + 1 }));
  };
  const next = () => { setI(i + 1); setPick(null); };
  const kind = s.curve === "FE" ? "supply recession, real" : s.curve === "LM" ? "demand recession, nominal" : "demand recession, real";
  return (
    <Fig title={`Recession classifier: brief ${(i % briefs.length) + 1} of ${briefs.length}`} note="The briefs are invented examples. Read one, then say which curve moved left.">
      <p className="prose-text text-base">{b.text}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Which curve moved left">
        {order.map((c) => (
          <Button key={c} type="button" size="sm" variant={pick === c ? "default" : "outline"} aria-pressed={pick === c} disabled={done && pick !== c} onClick={() => choose(c)}>{c} moves left</Button>
        ))}
      </div>
      <div aria-live="polite" className="mt-3 text-sm">
        {done && (
          <>
            <p className="font-semibold">{pick === s.curve ? "Correct." : `Not quite: it is ${s.curve}.`} A {kind} recession.</p>
            <p className="prose-text mt-1">{b.why}</p>
            <Button type="button" size="sm" className="mt-2" onClick={next}>Next brief</Button>
          </>
        )}
      </div>
      <p className="num mt-2 text-xs text-muted-foreground">Score: {score.right} of {score.tried}</p>
    </Fig>
  );
}

/* ---------- 2008 and 2009 by component ---------- */
export function Contributions2008() {
  const total = totalContribution();
  const max = 2;
  return (
    <Fig title="What fell in 2008 and 2009, by component of GDP (approximate)" note="From memory and approximate: contributions to the change in US real GDP, in percentage points, from the end of 2007 to the middle of 2009, rounded. They add to the total because Y = C + I + G + NX. Check against BEA table 1.1.2 before relying on any one of them.">
      <div className="space-y-1" role="img" aria-label="Contribution of each component of GDP to the fall in output">
        {contributions2008.map((c) => (
          <div key={c.name} className="grid grid-cols-[11rem_1fr_3.5rem] items-center gap-2 text-sm">
            <span>{c.name}</span>
            <span className="relative h-3 bg-wash">
              <span className="absolute top-0 h-3" style={{ left: c.pp < 0 ? `${50 + (100 * c.pp) / (2 * max)}%` : "50%", width: `${(100 * Math.abs(c.pp)) / (2 * max)}%`, background: c.pp < 0 ? "var(--c-lm)" : "var(--c-is)" }} />
              <span className="absolute left-1/2 top-0 h-3 w-px bg-ink" />
            </span>
            <span className="num text-right">{sgn(c.pp)}</span>
          </div>
        ))}
        <div className="grid grid-cols-[11rem_1fr_3.5rem] gap-2 border-t border-rule pt-1 text-sm font-semibold">
          <span>Real GDP</span><span /><span className="num text-right">{sgn(total)}</span>
        </div>
      </div>
      <p className="prose-text mt-2 text-sm">
        Most of the fall came from investment, especially housing, and from consumption, with a boost from falling imports and from government. A fall in housing investment and in consumption is what a fall in wealth and in expected returns would produce: IS moving left.
      </p>
    </Fig>
  );
}

/* ---------- Taylor rule ---------- */
export function TaylorRule() {
  const [pi, setPi] = useState(2);
  const [gap, setGap] = useState(0);
  const [target, setTarget] = useState(TARGET);
  const [floor, setFloor] = useState(true);
  const i = taylor(pi, gap, target);
  const years = usPolicy.map((d) => d.year);
  const rule = usPolicy.map((d) => ({ x: d.year, y: floor ? withFloor(taylor(d.inflation, d.gap, target)) : taylor(d.inflation, d.gap, target) }));
  const actual = usPolicy.map((d) => ({ x: d.year, y: d.funds }));
  const lo = Math.min(...rule.map((r) => r.y), 0), hi = Math.max(...rule.map((r) => r.y), ...actual.map((a) => a.y)) + 1;
  return (
    <Fig title="A Taylor rule calculator" note={`The rule: i = inflation + r* + 0.5 (inflation − target) + 0.5 (output gap), with r* = ${R_STAR}. All in percent. Both the rule and the data are rounded.`}>
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-3">
        <Ctl id="tr-p" label="Inflation" value={pi} min={-2} max={10} step={0.5} show={`${pi}%`} onChange={setPi} />
        <Ctl id="tr-g" label="Output gap (percent of potential)" value={gap} min={-8} max={4} step={0.5} show={`${gap}%`} onChange={setGap} />
        <Ctl id="tr-t" label="Inflation target" value={target} min={0} max={4} step={0.5} show={`${target}%`} onChange={setTarget} />
      </div>
      <p className="num mt-3 text-sm" aria-live="polite">
        i = {pi} + {R_STAR} + 0.5 × ({pi} − {target}) + 0.5 × ({gap}) = <span className="font-semibold">{f1(i)}%</span>
        {i < 0 && " (a negative rate cannot be set; the floor is zero)"}
      </p>
      <p className="prose-text mt-1 text-sm">Raise inflation by one point and the rule raises the nominal rate by 1.5 points, so the real rate rises too. A one-point deeper output gap lowers it by half a point.</p>
      <div className="mt-4">
        <label className="mb-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={floor} onChange={(e) => setFloor(e.target.checked)} className="accent-[var(--ink)]" />
          Clip the rule at zero (the nominal rate cannot go below it)
        </label>
        <Chart
          title={`The rule against the actual federal funds rate, ${years[0]} to ${years[years.length - 1]} (approximate)`}
          xLabel="Year" yLabel="Percent" xDomain={[years[0], years[years.length - 1]]} yDomain={[Math.floor(lo), Math.ceil(hi)]} xTicks={5} yTicks={5} aspect={0.5}
          series={[
            { id: "rule", curve: "lm", label: "Rule", points: rule },
            { id: "act", curve: "is", label: "Actual", points: actual },
          ]}
          refLines={[{ orientation: "h", value: 0, curve: "ink", ghost: true }]}
        />
        <p className="mt-1 text-xs text-muted-foreground">From memory and approximate: annual inflation, the output gap and the annual average federal funds rate. The rule was computed from those rounded inputs, so differences of a point or less are not meaningful.</p>
      </div>
    </Fig>
  );
}

/* ---------- Nominal GDP targeting ---------- */
export function NgdpTarget() {
  const [g, setG] = useState(2);
  const [tgt, setTgt] = useState(4);
  const infl = impliedInflation(tgt, g);
  return (
    <Fig title="Nominal GDP targeting against inflation targeting" note="Index units. Nominal growth is approximately real growth plus inflation.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="ng-t" label="Target growth of nominal GDP" value={tgt} min={2} max={8} step={0.5} show={`${tgt}%`} onChange={setTgt} />
        <Ctl id="ng-g" label="Real growth this year" value={g} min={-6} max={5} step={0.5} show={`${g}%`} onChange={setG} />
      </div>
      <p className="num mt-3 text-sm" aria-live="polite">
        Inflation that keeps nominal GDP on target: <span className="font-semibold">{f1(infl)}%</span>. An inflation target of 2% would instead ask the bank to hold inflation at 2% whatever real growth is, which means {infl > 2 ? "tightening when the target says to allow more inflation" : infl < 2 ? "easing when the target says to allow less" : "the same thing here"}.
      </p>
      <p className="prose-text mt-1 text-sm">With a nominal GDP target, a supply shock that lowers real growth is allowed to show up as higher prices, and a demand shock that cuts nominal spending is met with easing. That is why its supporters like it. Its critics point to the difficulty of measuring nominal GDP promptly and to how unfamiliar it is.</p>
    </Fig>
  );
}
