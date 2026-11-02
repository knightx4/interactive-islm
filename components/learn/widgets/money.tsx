"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "@/components/chart/Chart";
import { Button } from "@/components/ui/button";
import { base, driverStep, lmR, moneyDemand, moneyForRate, multiplier, rounds } from "@/lib/learn/money";
import { lerpParams } from "@/lib/learn/saving";
import useReducedMotion from "../useReducedMotion";
import { Ctl, Fig, f1 } from "./ui";

const grid = (lo: number, hi: number, n = 40) => Array.from({ length: n + 1 }, (_, i) => lo + ((hi - lo) * i) / n);

/* ---------- Money multiplier ---------- */
export function MultiplierWidget() {
  const [rr, setRr] = useState(10);
  const [cu, setCu] = useState(0);
  const [n, setN] = useState(6);
  const rs = rounds(100, rr / 100, 30);
  const m = multiplier(rr / 100, cu / 100);
  const shown = rs.slice(0, n);
  const maxDep = 100;
  return (
    <Fig title="How banks create money" note="Someone deposits 100 of new reserves. Banks keep the required share and lend the rest; the loan is spent and ends up as a new deposit somewhere in the banking system. Index units.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-3">
        <Ctl id="mm-rr" label="Required reserve ratio" value={rr} min={2} max={40} step={1} show={`${rr}%`} onChange={setRr} />
        <Ctl id="mm-cu" label="Cash the public holds per unit of deposits" value={cu} min={0} max={50} step={5} show={`${cu}%`} onChange={setCu} />
        <Ctl id="mm-n" label="Rounds of lending shown" value={n} min={1} max={30} onChange={setN} />
      </div>
      <div className="mt-3 space-y-0.5" role="img" aria-label="New deposits created in each round of lending, shrinking each time">
        {shown.map((r, i) => (
          <div key={i} className="grid grid-cols-[3.5rem_1fr_5rem] items-center gap-2 text-xs">
            <span>Round {i + 1}</span>
            <span className="h-2.5 bg-wash"><span className="block h-2.5" style={{ width: `${(100 * r.deposit) / maxDep}%`, background: "var(--c-money)" }} /></span>
            <span className="num text-right">{r.deposit.toFixed(1)}</span>
          </div>
        ))}
      </div>
      <p className="num mt-2 text-sm" aria-live="polite">
        Deposits after {n} round{n > 1 ? "s" : ""}: <span className="font-semibold">{f1(shown[shown.length - 1].total)}</span>. Without end, they approach {f1(100 / (rr / 100))} (100 ÷ {rr / 100}).
        With the public holding {cu}% cash, the multiplier on reserves, (1 + c) ÷ (c + rr), is <span className="font-semibold">{m.toFixed(2)}</span>.
      </p>
      <p className="prose-text mt-1 text-sm">A lower reserve requirement means a bigger multiplier: the same reserves support more deposits. Holding cash instead of deposits leaks reserves out of the chain and lowers it.</p>
    </Fig>
  );
}

/* ---------- Money market panel tracing LM ---------- */
export function MoneyMarketLM() {
  const [Y, setY] = useState(100);
  const [piE, setPiE] = useState(2);
  const [W, setW] = useState(100);
  const [risk, setRisk] = useState(1);
  const [liq, setLiq] = useState(1);
  const [tech, setTech] = useState(1);
  const [Mpct, setM] = useState(0);
  const [P, setP] = useState(1);
  const [pts, setPts] = useState<number[]>([]);
  const p = { ...base, piE, W, risk, liq, tech, M: base.M * (1 + Mpct / 100) };
  const mp = p.M / P;
  const r = lmR(p, Y, mp);
  const rs = grid(-2, 14, 32);
  const Ys = grid(85, 120);
  const sorted = [...pts].sort((a, b) => a - b);
  return (
    <Fig title="The money market, and the LM curve it traces" note="Left: real money demand L (falls as the nominal interest rate r + expected inflation rises) and the real money supply M/P (vertical). Right: LM, one point per output level. Nominal demand is P × L. Index units: baseline P = 1.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="mk-y" label="Output (income), Y: the traced variable" value={Y} min={85} max={120} onChange={setY} />
        <Ctl id="mk-p" label="Price level, P" value={P} min={0.8} max={1.25} step={0.05} show={P.toFixed(2)} onChange={setP} />
        <Ctl id="mk-m" label="Nominal money supply, M" value={Mpct} min={-30} max={30} step={5} show={`${Mpct > 0 ? "+" : ""}${Mpct}%`} onChange={setM} />
        <Ctl id="mk-e" label="Expected inflation" value={piE} min={0} max={8} step={0.5} show={`${piE}%`} onChange={setPiE} />
        <Ctl id="mk-w" label="Wealth" value={W} min={50} max={200} step={10} onChange={setW} />
        <Ctl id="mk-r" label="Riskiness of alternative assets" value={risk} min={0} max={3} step={0.25} show={risk.toFixed(2)} onChange={setRisk} />
        <Ctl id="mk-l" label="Liquidity of alternative assets" value={liq} min={0} max={3} step={0.25} show={liq.toFixed(2)} onChange={setLiq} />
        <Ctl id="mk-t" label="Payment technology (cards, apps)" value={tech} min={0} max={3} step={0.25} show={tech.toFixed(2)} onChange={setTech} />
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <Chart
          series={[
            { id: "l0", curve: "ink", ghost: true, points: rs.map((q) => ({ x: moneyDemand(base, 100, q), y: q })) },
            { id: "l", curve: "money", label: "L", points: rs.map((q) => ({ x: moneyDemand(p, Y, q), y: q })) },
          ]}
          refLines={[{ orientation: "v", value: mp, curve: "lm", label: "M/P" }]}
          marks={[{ x: mp, y: r, label: `r = ${r.toFixed(1)}`, dx: 8, dy: -10 }]}
          xDomain={[0, 70]} yDomain={[-2, 14]} xLabel="Real money balances" yLabel="Real interest rate, r (%)" aspect={0.8} xTicks={4}
          title="Money demand and the real money supply: the interest rate adjusts until they are equal"
        />
        <Chart
          series={[
            { id: "lm0", curve: "lm", ghost: true, points: Ys.map((y) => ({ x: y, y: lmR(base, y, base.M) })) },
            { id: "lm", curve: "lm", label: "LM", trace: pts.length < 3, points: sorted.length > 1 ? sorted.map((y) => ({ x: y, y: lmR(p, y, mp) })) : [] },
          ]}
          marks={[
            ...pts.map((y) => ({ x: y, y: lmR(p, y, mp), color: "var(--c-lm)", guides: false })),
            { x: Y, y: r, hollow: true, label: `Y = ${Y}`, dy: -10 },
          ]}
          xDomain={[85, 120]} yDomain={[-2, 14]} xLabel="Output, Y" yLabel="Real interest rate, r (%)" aspect={0.8} xTicks={3}
          title="Points on the LM curve collected from the money market on the left"
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" onClick={() => setPts((a) => (a.includes(Y) ? a : [...a, Y]))}>Add this point to LM</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setPts([85, 92, 100, 108, 114, 120])}>Fill in the curve</Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setPts([])}>Clear</Button>
        <span className="num text-sm text-muted-foreground">r = {r.toFixed(2)}; nominal rate r + expected inflation = {(r + piE).toFixed(2)}</span>
      </div>
      <p className="prose-text mt-2 text-sm">
        Raise Y first, with the other sliders at their start: people want more money to pay for more transactions, so L shifts right, the interest rate must rise to bring demand back down to the fixed supply, and each (Y, r) pair is a point on LM. Then move any other slider and watch the whole curve shift: that is every LM shifter in one place. Changing any of them at a fixed Y and P moves LM; changing Y only moves you along it.
      </p>
    </Fig>
  );
}

/* ---------- Animated LM shifters ---------- */
type Opt = { id: string; label: string; up: string[]; down: string[]; priceLevel?: boolean };
const opts: Opt[] = [
  {
    id: "money-supply", label: "Money supply (M)",
    up: ["The central bank increases the money supply", "Real balances exceed what people want to hold", "People buy bonds, so the interest rate falls", "At every output the rate that clears the market is lower", "LM moves right"],
    down: ["The central bank reduces the money supply", "Real balances fall short of what people want", "People sell bonds, so the interest rate rises", "At every output the rate that clears the market is higher", "LM moves left"],
  },
  {
    id: "price-level", label: "Price level (P)", priceLevel: true,
    up: ["The price level rises with M unchanged", "Real balances M/P fall", "People want more money than exists at the old rate", "The rate that clears the market rises at every output", "LM moves left"],
    down: ["The price level falls with M unchanged", "Real balances M/P rise", "People hold more money than they want at the old rate", "The rate that clears the market falls at every output", "LM moves right"],
  },
  {
    id: "expected-inflation", label: "Expected inflation",
    up: ["People expect prices to rise faster", "The nominal rate, r + expected inflation, is higher at the old r", "Holding money costs more, so money demand falls", "The real rate that clears the market falls", "LM moves right"],
    down: ["People expect prices to rise more slowly", "The nominal rate is lower at the old r", "Holding money costs less, so money demand rises", "The real rate that clears the market rises", "LM moves left"],
  },
  {
    id: "wealth", label: "Wealth",
    up: ["Households own more assets", "They want to hold more money alongside them", "Money demand rises at each r and Y", "The rate that clears the market is higher", "LM moves left"],
    down: ["Households own fewer assets", "They want to hold less money", "Money demand falls at each r and Y", "The rate that clears the market is lower", "LM moves right"],
  },
  {
    id: "alt-risk", label: "Riskiness of alternative assets",
    up: ["Shares and bonds become riskier", "People shift toward safe money", "Money demand rises at each r and Y", "The rate that clears the market is higher", "LM moves left"],
    down: ["Shares and bonds become safer", "People need less safe money", "Money demand falls at each r and Y", "The rate that clears the market is lower", "LM moves right"],
  },
  {
    id: "alt-liquidity", label: "Liquidity of alternative assets",
    up: ["Other assets become easier to sell quickly", "People need less money for emergencies and purchases", "Money demand falls at each r and Y", "The rate that clears the market is lower", "LM moves right"],
    down: ["Other assets become harder to sell quickly", "People need more money on hand", "Money demand rises at each r and Y", "The rate that clears the market is higher", "LM moves left"],
  },
  {
    id: "payment-tech", label: "Payment technology",
    up: ["Cards and apps make paying easier", "People need to hold less cash for purchases", "Money demand falls at each r and Y", "The rate that clears the market is lower", "LM moves right"],
    down: ["Payment methods get worse or less trusted", "People need to hold more cash for purchases", "Money demand rises at each r and Y", "The rate that clears the market is higher", "LM moves left"],
  },
];

export function LmShifters() {
  const reduced = useReducedMotion();
  const [id, setId] = useState(opts[0].id);
  const [dir, setDir] = useState<"up" | "down">("up");
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const opt = opts.find((o) => o.id === id)!;
  const sign = dir === "up" ? 1 : -1;
  const after = opt.priceLevel ? base : driverStep(id, sign, base);
  const cur = lerpParams(base, after, t);
  const Pcur = opt.priceLevel ? 1 + t * (sign > 0 ? 0.1 : -0.1) : 1;
  const mp = cur.M / Pcur;
  const chain = opt[dir];

  useEffect(() => {
    if (!playing) return;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const k = Math.min(1, (now - start) / 3000);
      setT(k);
      if (k < 1) raf.current = requestAnimationFrame(tick); else setPlaying(false);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);
  const reset = () => { setPlaying(false); setT(0); };
  const rs = grid(-2, 14, 32);
  const Ys = grid(85, 120);
  const Y0 = 100;
  const r0 = lmR(base, Y0, base.M), r = lmR(cur, Y0, mp);
  const lit = (i: number) => t >= (i + 0.5) / chain.length;
  return (
    <Fig title="Every LM shifter, with its cause chain" note="Pick a driver and a direction, then play. Dashed lines show where the curves started. Index units, with the price level at 1 unless it is the driver.">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Driver">
        {opts.map((o) => <Button key={o.id} type="button" size="sm" variant={o.id === id ? "default" : "outline"} aria-pressed={o.id === id} onClick={() => { setId(o.id); reset(); }}>{o.label}</Button>)}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm" role="group" aria-label="Direction">
        {(["up", "down"] as const).map((d) => <Button key={d} type="button" size="sm" variant={dir === d ? "default" : "outline"} aria-pressed={dir === d} onClick={() => { setDir(d); reset(); }}>{d === "up" ? "Rises" : "Falls"}</Button>)}
        <Button type="button" size="sm" variant="outline" onClick={() => { if (reduced) setT(1); else { setT(0); setPlaying(true); } }}>{reduced ? "Jump to the result" : "Play"}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={reset}>Reset</Button>
        {!reduced && <label className="flex items-center gap-2"><span>Scrub</span>
          <input type="range" min={0} max={1} step={0.01} value={t} aria-label="Progress of the shift" onChange={(e) => { setPlaying(false); setT(Number(e.target.value)); }} className="accent-[var(--ink)]" /></label>}
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <Chart
          series={[
            { id: "l0", curve: "ink", ghost: true, points: rs.map((q) => ({ x: moneyDemand(base, Y0, q), y: q })) },
            { id: "l", curve: "money", label: "L", points: rs.map((q) => ({ x: moneyDemand(cur, Y0, q), y: q })) },
          ]}
          refLines={[
            { orientation: "v", value: base.M, curve: "lm", ghost: true },
            { orientation: "v", value: mp, curve: "lm", label: "M/P" },
          ]}
          marks={[{ x: mp, y: r, label: `r ${r.toFixed(1)}`, dx: 8, dy: -10 }]}
          xDomain={[0, 70]} yDomain={[-2, 14]} xLabel="Real money balances (at Y = 100)" yLabel="Real interest rate, r (%)" aspect={0.8} xTicks={4}
          title="Money market while the driver changes"
        />
        <Chart
          series={[
            { id: "lm0", curve: "lm", ghost: true, points: Ys.map((y) => ({ x: y, y: lmR(base, y, base.M) })) },
            { id: "lm", curve: "lm", label: "LM", points: Ys.map((y) => ({ x: y, y: lmR(cur, y, mp) })) },
          ]}
          marks={[{ x: Y0, y: r0, hollow: true, guides: false }, { x: Y0, y: r, label: "now", dy: -10, guides: false }]}
          xDomain={[85, 120]} yDomain={[-2, 14]} xLabel="Output, Y" yLabel="Real interest rate, r (%)" aspect={0.8} xTicks={3}
          title="The LM curve moves with the money market"
        />
      </div>
      <ol className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-2 text-sm" aria-label="Cause chain">
        {chain.map((c, i) => (
          <li key={c} data-lit={lit(i)} className="flex items-center gap-1">
            <span className={`border-b-2 px-1 py-0.5 transition-colors duration-300 ${lit(i) ? "border-ink font-semibold" : "border-rule text-muted-foreground opacity-60"}`}>{c}</span>
            {i < chain.length - 1 && <span aria-hidden className={lit(i) ? "" : "text-muted-foreground opacity-60"}>→</span>}
          </li>
        ))}
      </ol>
      <p className="num mt-2 text-sm" aria-live="polite">Rate that clears the money market at Y = 100: {r0.toFixed(2)} → {r.toFixed(2)}.</p>
    </Fig>
  );
}

/* ---------- Central bank tools: what "the Fed raised rates" means ---------- */
export function PolicyRateWidget() {
  const i0 = 5 + base.piE;
  const [i, setI] = useState(i0);
  const M = moneyForRate(base, 100, i);
  const after = { ...base, M };
  const Ys = grid(85, 120);
  const pct = (100 * (M / base.M - 1));
  return (
    <Fig title="What it means to raise the policy rate" note="A central bank that targets a short-term nominal rate i adjusts the money supply until the money market clears at that rate. Index units, expected inflation 2%, Y = 100, P = 1.">
      <Ctl id="pr-i" label="Nominal policy rate, i" value={i} min={3} max={11} step={0.25} show={`${i.toFixed(2)}%`} onChange={setI} />
      <Chart
        series={[
          { id: "lm0", curve: "lm", ghost: true, points: Ys.map((y) => ({ x: y, y: lmR(base, y, base.M) })) },
          { id: "lm", curve: "lm", label: "LM", points: Ys.map((y) => ({ x: y, y: lmR(after, y, after.M) })) },
        ]}
        marks={[{ x: 100, y: i - base.piE, label: `r = ${(i - base.piE).toFixed(2)}`, dx: 8, dy: -10 }]}
        xDomain={[85, 120]} yDomain={[-2, 14]} xLabel="Output, Y" yLabel="Real interest rate, r (%)" aspect={0.5} xTicks={5}
        title="Choosing the policy rate means choosing where LM passes through the current output"
      />
      <p className="num text-sm" aria-live="polite">
        To hold i at {i.toFixed(2)}% the central bank must set the money supply {pct >= 0 ? "up" : "down"} {Math.abs(pct).toFixed(1)}% from baseline. {i > i0 ? "Raising the rate is a tighter money supply: LM moves left." : i < i0 ? "Cutting the rate is a looser money supply: LM moves right." : "At the starting rate no change is needed."}
      </p>
      <table className="mt-3 w-full text-left text-sm">
        <caption className="pb-1 text-left font-serif text-lg font-semibold">The central bank&apos;s tools</caption>
        <thead>
          <tr className="border-b border-ink text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="py-1 pr-3 font-semibold">Tool</th><th scope="col" className="py-1 pr-3 font-semibold">What it does</th><th scope="col" className="py-1 font-semibold">Effect on M and on LM</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Open market operation", "Buys or sells government bonds in the market, paying with or taking in reserves.", "Buying raises reserves and the money supply, moving LM right. Selling does the opposite."],
            ["Policy rate", "Sets the short-term rate at which banks lend reserves to each other, by supplying the reserves needed.", "A higher rate means a smaller money supply, moving LM left."],
            ["Discount rate", "The rate at which the central bank lends reserves directly to banks.", "A lower rate encourages borrowed reserves, raising M. A higher rate discourages it."],
            ["Reserve requirement", "The share of deposits banks must hold back.", "A lower requirement raises the multiplier and M. A higher one lowers them."],
          ].map((r) => (
            <tr key={r[0]} className="border-b border-rule align-top"><th scope="row" className="py-1.5 pr-3 font-semibold">{r[0]}</th><td className="py-1.5 pr-3">{r[1]}</td><td className="py-1.5">{r[2]}</td></tr>
          ))}
        </tbody>
      </table>
    </Fig>
  );
}
