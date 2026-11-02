"use client";

import { useState } from "react";
import Chart from "@/components/chart/Chart";
import { hurricaneRun, policyRun, us1970s } from "@/lib/learn/supply";
import { Ctl, Fig, f1 } from "./ui";
import { labWidget } from "./fullmodel";

export const OilLab = labWidget({
  regime: "closed",
  shocks: ["productivity-down", "productivity-up", "capital-down", "capital-up"],
  defaultShock: "productivity-down",
});

/* ---------- Policy after an adverse supply shock: three alternative paths ---------- */
export function PolicyDilemma() {
  const [pct, setPct] = useState(10);
  const none = policyRun(0), pol = policyRun(pct);
  const Y = (r: typeof none) => r.frames.map((f, t) => ({ x: t, y: f.Y }));
  const P = (r: typeof none) => r.frames.map((f, t) => ({ x: t, y: f.P }));
  const verdict =
    pct === 0 ? "No policy response: output starts above the new, lower FE and drifts down to it as prices rise."
    : pct > 0 ? "Easing: output is held higher for a while, but the full effect is a higher price level. Output still ends at the same lower FE."
    : pol.gapAtImpact < 0 ? "Tightening this hard puts output below the new FE: a deeper slump now, with prices that fall later. Output still ends at the same lower FE."
    : "Tightening: output falls sooner and the price level ends lower, but output still ends at the same lower FE.";
  return (
    <Fig title="After an oil shock: the central bank changes the money supply on impact" note="Index units. The faint line is no policy response. The money supply changes once, at the moment of the shock, by the percentage chosen. Periods are model time.">
      <Ctl id="pd-m" label="Change in the money supply" value={pct} min={-20} max={20} step={1} show={`${pct > 0 ? "+" : ""}${pct}%`} onChange={setPct} />
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <Chart
          title="Output by period, against the new full-employment level"
          xLabel="Periods after the shock" yLabel="Output, Y" xDomain={[0, 40]} yDomain={[88, 108]} xTicks={4} yTicks={4} aspect={0.8}
          series={[{ id: "y0", curve: "ink", ghost: true, points: Y(none) }, { id: "y", curve: "is", points: Y(pol) }]}
          refLines={[{ orientation: "h", value: pol.feAfter, curve: "fe", label: "new FE" }]}
        />
        <Chart
          title="Price level by period"
          xLabel="Periods after the shock" yLabel="Price level, P" xDomain={[0, 40]} yDomain={[0.9, 1.6]} xTicks={4} yTicks={4} aspect={0.8}
          series={[{ id: "p0", curve: "ink", ghost: true, points: P(none) }, { id: "p", curve: "lm", label: "P", points: P(pol) }]}
        />
      </div>
      <p className="num mt-2 text-sm" aria-live="polite">
        On impact output is {f1(pol.frames[1].Y)} against a new FE of {f1(pol.feAfter)}. Long-run price level {pol.sim.longRun.P.toFixed(2)} (no policy: {none.sim.longRun.P.toFixed(2)}).
      </p>
      <p className="prose-text mt-1 text-sm">{verdict}</p>
    </Fig>
  );
}

/* ---------- A hurricane: a supply loss and a demand loss at once ---------- */
export function HurricaneWidget() {
  const [cap, setCap] = useState(5);
  const [wl, setWl] = useState(30);
  const h = hurricaneRun(cap, wl);
  const dir = (x: number, base: number, up: string, down: string) => (Math.abs(x - base) < 0.005 * Math.abs(base) ? "about the same" : x > base ? up : down);
  return (
    <Fig title="A hurricane that destroys capital and also hits demand" note="Index units. Capital destroyed shifts FE left. The loss of household wealth shifts IS left (people save more) and LM right (they want less money). The two sizes are yours to choose.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="hu-k" label="Share of the capital stock destroyed" value={cap} min={0} max={10} step={1} show={`${cap}%`} onChange={setCap} />
        <Ctl id="hu-w" label="Fall in household wealth" value={wl} min={0} max={90} step={5} show={`${wl}`} onChange={setWl} />
      </div>
      <table className="num mt-3 w-full max-w-lg text-sm">
        <thead><tr className="border-b border-ink text-left text-xs text-muted-foreground"><th className="py-1 font-semibold">Variable</th><th className="text-right font-semibold">Start</th><th className="text-right font-semibold">On impact</th><th className="text-right font-semibold">Long run</th></tr></thead>
        <tbody>
          <tr className="border-b border-rule"><td className="py-1">Output Y</td><td className="text-right">100.0</td><td className="text-right">{f1(h.yImpact)}</td><td className="text-right">{f1(h.yLong)}</td></tr>
          <tr className="border-b border-rule"><td className="py-1">Real interest rate r</td><td className="text-right">5.00</td><td className="text-right">{h.rImpact.toFixed(2)}</td><td className="text-right">{h.rLong.toFixed(2)}</td></tr>
          <tr className="border-b border-rule"><td className="py-1">Price level P</td><td className="text-right">1.00</td><td className="text-right">1.00</td><td className="text-right">{h.pLong.toFixed(2)}</td></tr>
        </tbody>
      </table>
      <p className="prose-text mt-2 text-sm" aria-live="polite">
        Output ends lower in every mix, because capacity is lost. The price level ends {dir(h.pLong, 1, "higher", "lower")}: the capital loss pushes prices up and the fall in demand pushes them down, so which wins depends on the relative sizes. Try zero wealth loss, then zero capital loss, then both.
      </p>
    </Fig>
  );
}

/* ---------- US inflation and unemployment, 1970 to 1983 ---------- */
export function Us1970s() {
  return (
    <Fig title="US inflation and unemployment, 1970 to 1983 (approximate)" note="From memory and approximate: annual CPI inflation and the annual average unemployment rate, rounded. Check against the Bureau of Labor Statistics before relying on any single value.">
      <Chart
        title="US inflation and unemployment rate, percent, 1970 to 1983"
        xLabel="Year" yLabel="Percent" xDomain={[1970, 1983]} yDomain={[0, 15]} xTicks={4} yTicks={5} aspect={0.5}
        series={[
          { id: "inf", curve: "lm", label: "Inflation", points: us1970s.map((d) => ({ x: d.year, y: d.inflation })) },
          { id: "un", curve: "is", label: "Unemployment", points: us1970s.map((d) => ({ x: d.year, y: d.unemployment })) },
        ]}
        marks={[]}
      />
    </Fig>
  );
}
