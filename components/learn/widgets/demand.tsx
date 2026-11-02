"use client";

import { useState } from "react";
import Chart from "@/components/chart/Chart";
import { isLine, lmLine, modelMultiplier, multiplierSimple, roundsOf, stimulusRun, trap } from "@/lib/learn/demand";
import { Ctl, Fig, f1 } from "./ui";
import { labWidget, priceSpeedWidget } from "./fullmodel";

export const DemandLab = labWidget({
  regime: "closed",
  shocks: ["investment-outlook-down", "future-income-down", "wealth-down", "taxes-up", "expected-inflation-down", "money-supply-down"],
  defaultShock: "wealth-down",
});

export const IsDemandSpeed = priceSpeedWidget(
  "taxes-up",
  "A tighter budget (an IS shock), at different price speeds",
  "Index units. Taxes rise, so IS shifts left. Prices must fall to pull LM right and bring output back. Slow prices mean a long slump; instant prices mean no slump at all. Periods are model time.",
  12,
);
export const LmDemandSpeed = priceSpeedWidget(
  "expected-inflation-down",
  "Lower expected inflation (an LM shock), at different price speeds",
  "Index units. Lower expected inflation lowers the nominal rate at any real rate, so money is cheaper to hold, people want more of it, and LM shifts left. Prices are again what bring output back.",
  12,
);

/* ---------- Stimulus: same push, different starting points ---------- */
export function StimulusTiming() {
  const [dG, setDG] = useState(4);
  const [speed, setSpeed] = useState(0.3);
  const slump = stimulusRun(60, 0, speed), cured = stimulusRun(60, dG, speed), boom = stimulusRun(0, dG, speed, 40, false);
  const Y = (f: typeof slump) => f.map((x, t) => ({ x: t, y: x.Y }));
  const P = (f: typeof slump) => f.map((x, t) => ({ x: t, y: x.P }));
  return (
    <Fig title="The same stimulus in a slump and at full employment" note="Index units. The slump is a 60-point fall in household wealth (an IS and LM shock). The stimulus is a one-off rise in government spending at the moment of the shock. Dashed: the slump with no stimulus. Blue: the slump with the stimulus. Red: the same stimulus applied to an economy that was not in a slump.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="st-g" label="Stimulus: rise in government spending" value={dG} min={0} max={15} step={1} show={`+${dG}`} onChange={setDG} />
        <Ctl id="st-s" label="How fast prices adjust" value={speed} min={0.05} max={1} step={0.05} show={speed.toFixed(2)} onChange={setSpeed} />
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <Chart title="Output by period" xLabel="Periods after the shock" yLabel="Output, Y" xDomain={[0, 40]} yDomain={[94, 112]} xTicks={4} yTicks={4} aspect={0.8}
          series={[
            { id: "s", curve: "ink", ghost: true, points: Y(slump) },
            { id: "c", curve: "is", points: Y(cured) },
            { id: "b", curve: "lm", points: Y(boom) },
          ]}
          refLines={[{ orientation: "h", value: 100, curve: "fe", label: "FE" }]} />
        <Chart title="Price level by period" xLabel="Periods after the shock" yLabel="Price level, P" xDomain={[0, 40]} yDomain={[0.9, 1.6]} xTicks={4} yTicks={4} aspect={0.8}
          series={[
            { id: "sp", curve: "ink", ghost: true, points: P(slump) },
            { id: "cp", curve: "is", points: P(cured) },
            { id: "bp", curve: "lm", points: P(boom) },
          ]} />
      </div>
      <p className="num mt-2 text-sm" aria-live="polite">
        Lowest output: {f1(Math.min(...slump.map((x) => x.Y)))} with no stimulus, {f1(Math.min(...cured.map((x) => x.Y)))} with it. After 10 periods: {f1(slump[10].Y)} against {f1(cured[10].Y)}. Stimulus alone puts output at {f1(boom[1].Y)} on impact and the price level at {boom[40].P.toFixed(2)} by period 40.
      </p>
      <p className="prose-text mt-1 text-sm">In a slump the stimulus fills the gap that falling prices would fill more slowly. At full employment the same spending has no gap to fill: it pushes output above FE, then prices rise and crowd the extra output out again.</p>
    </Fig>
  );
}

/* ---------- The multiplier ---------- */
export function MultiplierDemo() {
  const [c, setC] = useState(0.6);
  const [n, setN] = useState(6);
  const rs = roundsOf(c, n);
  const total = rs.reduce((a, b) => a + b, 0);
  const g = modelMultiplier("spending"), t = modelMultiplier("tax-cut");
  return (
    <Fig title="One dollar of extra spending, round by round" note="Index units. Each round, people spend the share c of what they just received. The textbook line holds the interest rate fixed; the toy economy lets it respond.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="mu-c" label="Share of each extra dollar that is spent, c" value={c} min={0.2} max={0.9} step={0.05} show={c.toFixed(2)} onChange={setC} />
        <Ctl id="mu-n" label="Rounds shown" value={n} min={1} max={15} onChange={setN} />
      </div>
      <div className="mt-3 space-y-0.5" role="img" aria-label="Spending in each round, shrinking by the factor c each time">
        {rs.map((x, i) => (
          <div key={i} className="grid grid-cols-[3.5rem_1fr_3rem] items-center gap-2 text-xs">
            <span>Round {i + 1}</span>
            <span className="h-2.5 bg-wash"><span className="block h-2.5" style={{ width: `${100 * x}%`, background: "var(--c-money)" }} /></span>
            <span className="num text-right">{x.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <p className="num mt-2 text-sm" aria-live="polite">
        Total after {n} rounds: <span className="font-semibold">{total.toFixed(2)}</span>. Without end it approaches 1 ÷ (1 − c) = <span className="font-semibold">{multiplierSimple(c).toFixed(2)}</span>.
      </p>
      <p className="prose-text mt-1 text-sm">
        In the toy economy, with the interest rate free to rise, a rise in government spending lifts output on impact by only about {g.toFixed(2)} per unit, and a tax cut of the same size by about {t.toFixed(2)}: higher interest rates crowd out some investment, and part of a tax cut is saved. The multiplier is larger when the central bank holds the rate down and when people spend most of what they receive.
      </p>
    </Fig>
  );
}

/* ---------- The zero lower bound ---------- */
export function LiquidityTrap() {
  const [r0, setR0] = useState(-4);
  const [m, setM] = useState(0);
  const [g, setG] = useState(0);
  const t = trap(r0, m, g);
  const xs = [-40, -30, -20, -10, 0, 10, 20];
  return (
    <Fig title="When the interest rate cannot fall any further" note="A stylised sketch, not the lab economy. x is output relative to FE. The floor is a zero nominal interest rate, with expected inflation taken as zero. r0 is the real rate that would clear the goods market at full employment: the weaker private demand is, the lower it is.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-3">
        <Ctl id="lt-r" label="Strength of private demand, r0 (%)" value={r0} min={-6} max={4} step={0.5} show={r0.toFixed(1)} onChange={setR0} />
        <Ctl id="lt-m" label="Rise in the money supply" value={m} min={0} max={100} step={5} show={`${m}%`} onChange={setM} />
        <Ctl id="lt-g" label="Fiscal push (output units)" value={g} min={0} max={15} step={1} show={`+${g}`} onChange={setG} />
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Chart title="IS and LM with a floor on the interest rate" xLabel="Output relative to FE, x" yLabel="Interest rate, r (%)" xDomain={[-40, 20]} yDomain={[-4, 8]} xTicks={3} yTicks={4} aspect={0.85}
          series={[
            { id: "is", curve: "is", label: "IS", points: xs.map((x) => ({ x, y: isLine(r0, g, x) })) },
            { id: "lm", curve: "lm", label: "LM", points: xs.map((x) => ({ x, y: lmLine(m, x) })) },
          ]}
          refLines={[{ orientation: "v", value: 0, curve: "fe", label: "FE" }, { orientation: "h", value: 0, curve: "ink", ghost: true }]}
          marks={[{ x: t.x, y: t.r, label: t.atFloor ? "at the floor" : "IS-LM point", dx: 8, dy: -10, color: "var(--ink)" }]} />
        <div className="space-y-2 text-sm">
          <p className="num" aria-live="polite">Output gap x = <span className="font-semibold">{f1(t.x)}</span><br />Interest rate r = <span className="font-semibold">{t.r.toFixed(2)}%</span></p>
          <p className="prose-text">{t.atFloor
            ? "The rate is stuck at the floor. More money only adds to idle balances; try raising it and watch x stay put. Only a rise in spending shifts the IS curve and lifts output."
            : "The rate is above the floor, so more money lowers it and raises output. Lower r0 until the point reaches the floor, then try again."}</p>
        </div>
      </div>
    </Fig>
  );
}

/* ---------- The 2008 wealth shock ---------- */
const rows: [string, string][] = [
  ["US house prices, national index, mid-2006 peak to early 2012 trough", "fell by roughly a quarter"],
  ["US household net worth, 2007 peak to early 2009 trough", "fell by roughly a fifth, about 14 trillion dollars"],
  ["US household saving rate, before the crisis and in 2009", "rose from about 2 percent to about 6 percent of income"],
  ["US real consumer spending, 2008 to 2009", "fell by roughly 2 percent, unusual for consumption"],
];
export function Wealth2008() {
  return (
    <Fig title="The 2008 wealth shock (approximate)" note="From memory and approximate: every value is rounded, and the dates are approximate. Check against the Case-Shiller index, the Federal Reserve's financial accounts and the Bureau of Economic Analysis before relying on any of them.">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a} className="border-b border-rule align-top"><td className="py-1.5 pr-4">{a}</td><td className="py-1.5 font-semibold">{b}</td></tr>
          ))}
        </tbody>
      </table>
      <p className="prose-text mt-2 text-sm">In the model, a fall in wealth lowers consumption by raising saving (IS shifts left) and lowers money demand (LM shifts right). Output falls on impact and prices fall later. Use the lab above with the wealth shock to watch both curves move.</p>
    </Fig>
  );
}
