"use client";

import { useState } from "react";
import Chart from "@/components/chart/Chart";
import type { LabSpec } from "@/lib/learn/lessons";
import { bondPrice, economy, instantPath, lmPuzzle, longRunPrice, pathAt, pointAt, regionOf, SPEED_MAX, SPEED_MIN } from "@/lib/learn/fullmodel";
import { isR, lmR, Ystar, type Params } from "@/lib/macro/model";
import { shiftTable, shockById } from "@/lib/macro/shocks";
import LessonLab from "../LessonLab";
import { Ctl, Fig, f1 } from "./ui";

const grid = (lo: number, hi: number, n = 20) => Array.from({ length: n + 1 }, (_, i) => lo + ((hi - lo) * i) / n);

/** A full recipe lab inside a lesson section. */
export const labWidget = (lab: LabSpec) => function LabWidget() { return <LessonLab lab={lab} />; };

export const RecipeTwoShocks = labWidget({ regime: "closed", shocks: ["money-supply-up", "gov-spending-up"], defaultShock: "money-supply-up" });
export const GeSandbox = labWidget({ regime: "closed", shocks: shiftTable.map((s) => s.id), defaultShock: "taxes-up" });

/* ---------- The three curves, and what a price change does to LM ---------- */
export function PriceLM() {
  const [P, setP] = useState(1);
  const [dG, setDG] = useState(0);
  const a = pointAt(1, 0);
  const now = pointAt(P, dG);
  const p: Params = now.p;
  const region = regionOf(now.gap);
  const Ys = grid(80, 125);
  const lrP = longRunPrice(dG);
  const msg =
    region === "balance" ? "On FE: nothing pushes prices either way, so this is where the economy rests."
    : region === "slack" ? "Left of FE: slack. Workers and machines sit idle, so prices are expected to fall. Falling P raises real money, which shifts LM right and slides the point toward FE."
    : "Right of FE: scarcity. Firms bid for more labour and capital than are normally available, so prices are expected to rise. Rising P cuts real money, which shifts LM left and slides the point toward FE.";
  return (
    <Fig title="IS, LM and FE, with the price level as a dial" note="Index units: the baseline has P = 1, Y* = 100, r = 5%. Moving government spending shifts IS (a demand change); moving P moves only LM. Bond price is a one-year bond paying 100, priced off the nominal rate r + expected inflation.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="plm-p" label="Price level, P" value={P} min={0.8} max={1.4} step={0.01} show={P.toFixed(2)} onChange={setP} />
        <Ctl id="plm-g" label="Government spending, change from baseline (shifts IS)" value={dG} min={-15} max={15} step={1} show={`${dG > 0 ? "+" : ""}${dG}`} onChange={setDG} />
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Chart
          title="IS, LM and FE at the chosen price level"
          xLabel="Output, Y" yLabel="Real interest rate, r (%)" xDomain={[80, 125]} yDomain={[0, 10]} xTicks={3} yTicks={5} aspect={0.85}
          series={[
            { id: "lm0", curve: "lm", ghost: true, points: Ys.map((y) => ({ x: y, y: lmR(economy, y, economy.M) })) },
            { id: "is", curve: "is", label: "IS", points: Ys.map((y) => ({ x: y, y: isR(p, y) })) },
            { id: "lm", curve: "lm", label: "LM", points: Ys.map((y) => ({ x: y, y: lmR(p, y, p.M / P) })) },
          ]}
          refLines={[{ orientation: "v", value: now.fe, curve: "fe", label: "FE" }]}
          marks={[{ x: now.Y, y: now.r, label: "IS-LM point", dx: 8, dy: -10, color: "var(--ink)" }]}
        />
        <div className="space-y-2 text-sm">
          <p className="num" aria-live="polite">
            Y = <span className="font-semibold">{f1(now.Y)}</span> against Y* = {f1(now.fe)} (gap {now.gap > 0 ? "+" : ""}{f1(now.gap)})
            <br />r = <span className="font-semibold">{now.r.toFixed(2)}%</span> (was {a.r.toFixed(2)}%)
            <br />Real money M/P = {f1(p.M / P)} (was {f1(economy.M)})
            <br />Bond price = <span className="font-semibold">{bondPrice(now.i).toFixed(2)}</span> (was {bondPrice(a.i).toFixed(2)})
          </p>
          <p className="prose-text">{msg}</p>
          <p className="text-muted-foreground">With this much spending, prices settle where the point lands on FE, at P of about {lrP.toFixed(2)}.</p>
        </div>
      </div>
      <p className="prose-text mt-2 text-sm">
        Raise P and watch three things move together: real money M/P shrinks, the interest rate rises, and the bond price falls. Lower P and all three reverse. That is the whole story of how prices pull LM.
      </p>
    </Fig>
  );
}

/* ---------- Money neutrality and the speed of price adjustment ---------- */
export function priceSpeedWidget(shockId: string, title: string, note: string, range = 8) {
  return function PriceSpeed() {
    const [speed, setSpeed] = useState(0.3);
    const [instant, setInstant] = useState(false);
    const shock = shockById(shockId)!;
    const frames = instant ? instantPath(shock.apply, 40) : pathAt(shock.apply, speed, 40);
    const slowest = pathAt(shock.apply, SPEED_MIN, 40);
    const a = frames[0], c = frames[frames.length - 1];
    const peak = Math.max(...frames.map((f) => Math.abs(f.Y - a.Y)));
    const Ydev = frames.map((f, t) => ({ x: t, y: f.Y - a.Y }));
    const Pidx = frames.map((f, t) => ({ x: t, y: f.P }));
    return (
      <Fig title={title} note={note}>
        <div className="grid items-end gap-x-8 gap-y-3 md:grid-cols-2">
          <Ctl id={`ps-${shockId}`} label="How fast prices adjust (slow to fast)" value={speed} min={SPEED_MIN} max={SPEED_MAX} step={0.05} show={instant ? "instant" : speed.toFixed(2)} onChange={(v) => { setInstant(false); setSpeed(v); }} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={instant} onChange={(e) => setInstant(e.target.checked)} className="accent-[var(--ink)]" />
            Instant: prices jump to their long-run level at once (the classical case)
          </label>
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <Chart
            title="Output relative to its starting level, by period"
            xLabel="Periods after the shock" yLabel="Change in Y" xDomain={[0, 40]} yDomain={[-range, range]} xTicks={4} yTicks={4} aspect={0.8}
            series={[
              { id: "slow", curve: "ink", ghost: true, points: slowest.map((f, t) => ({ x: t, y: f.Y - slowest[0].Y })) },
              { id: "y", curve: "is", label: "Y", points: Ydev },
            ]}
            refLines={[{ orientation: "h", value: 0, curve: "ink", ghost: true }]}
          />
          <Chart
            title="Price level by period"
            xLabel="Periods after the shock" yLabel="Price level, P" xDomain={[0, 40]} yDomain={[0.7, 1.5]} xTicks={4} yTicks={4} aspect={0.8}
            series={[
              { id: "slowp", curve: "ink", ghost: true, points: slowest.map((f, t) => ({ x: t, y: f.P })) },
              { id: "p", curve: "lm", label: "P", points: Pidx },
            ]}
            refLines={[{ orientation: "h", value: 1, curve: "ink", ghost: true }]}
          />
        </div>
        <p className="num mt-2 text-sm" aria-live="polite">
          Output deviates by at most <span className="font-semibold">{f1(peak)}</span> from its start. Price level ends at <span className="font-semibold">{c.P.toFixed(2)}</span>, output at <span className="font-semibold">{f1(c.Y)}</span>.
          {instant ? " Output never leaves its starting level, because prices do all the adjusting." : ""}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">The faint line is the slowest speed. Periods are model time, not months or years.</p>
      </Fig>
    );
  };
}
export const MoneyNeutrality = priceSpeedWidget(
  "money-supply-up",
  "A 10 percent rise in the money supply, at different price speeds",
  "Index units. Slide toward fast and the effect on output shrinks until only prices move: money is neutral. Slide toward slow and output stays above its starting level for a long time: money matters in the short run.",
);

/* ---------- The money-demand puzzle ---------- */
export function LmPuzzle() {
  const [Y, setY] = useState(112);
  const z = lmPuzzle(Y);
  const fe = Ystar(economy);
  const sgn = (x: number) => `${x >= 0 ? "+" : "−"}${Math.abs(x).toFixed(2)}`;
  return (
    <Fig title="Why money demand does not change along LM" note="Index units. Starting at Y* with the money supply fixed, move to another point on the same LM curve and keep track of the two forces on money demand.">
      <Ctl id="lmp-y" label="Move along LM to output Y" value={Y} min={85} max={120} onChange={setY} />
      <table className="num mt-3 w-full max-w-md text-sm">
        <tbody>
          <tr className="border-b border-rule"><td className="py-1">Output Y (start {f1(fe)})</td><td className="text-right">{Y}</td></tr>
          <tr className="border-b border-rule"><td className="py-1">Interest rate r on LM</td><td className="text-right">{z.r.toFixed(2)}%</td></tr>
          <tr className="border-b border-rule"><td className="py-1">Change in money demand from higher income</td><td className="text-right">{sgn(z.fromIncome)}</td></tr>
          <tr className="border-b border-rule"><td className="py-1">Change in money demand from the interest rate</td><td className="text-right">{sgn(z.fromRate)}</td></tr>
          <tr className="border-b border-ink font-semibold"><td className="py-1">Total change in money demand</td><td className="text-right">{sgn(z.total)}</td></tr>
          <tr><td className="py-1">Money demand vs real money supply</td><td className="text-right">{f1(z.demand)} vs {f1(z.supply)}</td></tr>
        </tbody>
      </table>
      <p className="prose-text mt-2 text-sm">
        Higher income pushes demand up and the higher interest rate pushes it down, by exactly the same amount. LM is made of the pairs of Y and r for which that cancellation happens, so demand always equals the fixed supply. Change anything that is not Y or r, such as P or M, and the cancellation breaks: LM itself moves.
      </p>
    </Fig>
  );
}
