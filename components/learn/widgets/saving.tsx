"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "@/components/chart/Chart";
import { Button } from "@/components/ui/button";
import {
  base, desiredInvestment, desiredSaving, driverStep, isR, lerpParams, smooth, taxCut,
} from "@/lib/learn/saving";
import { shortRun } from "@/lib/macro/model";
import useReducedMotion from "../useReducedMotion";
import { Ctl, Fig, f1 } from "./ui";

const grid = (lo: number, hi: number, n = 40) => Array.from({ length: n + 1 }, (_, i) => lo + ((hi - lo) * i) / n);

/* ---------- Consumption smoothing ---------- */
type Kind = "income" | "permanent" | "wealth";
const kinds: { id: Kind; label: string }[] = [
  { id: "income", label: "Income shock, this year only" },
  { id: "permanent", label: "Income shock, every year" },
  { id: "wealth", label: "Wealth shock, once" },
];
export function SmoothingWidget() {
  const [kind, setKind] = useState<Kind>("income");
  const [size, setSize] = useState(50);
  const n = 10;
  const flat = Array<number>(n).fill(100);
  const income = flat.map((y, i) => (kind === "income" ? (i === 0 ? y + size : y) : kind === "permanent" ? y + size : y));
  const wealth = kind === "wealth" ? size : 0;
  const { c, saving } = smooth(income, wealth);
  const c0 = smooth(flat, 0).c;
  const yrs = grid(1, n, n - 1);
  return (
    <Fig title="How a household reacts to a shock" note="A household lives for ten years, earns 100 a year, and wants to spend about the same each year. No interest, to keep the arithmetic plain. Index units.">
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Kind of shock">
        {kinds.map((k) => <Button key={k.id} type="button" size="sm" variant={kind === k.id ? "default" : "outline"} aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>{k.label}</Button>)}
      </div>
      <Ctl id="sm-s" label="Size of the shock" value={size} min={0} max={100} step={10} onChange={setSize} />
      <Chart
        series={[
          { id: "inc", curve: "labour", label: "Income", points: yrs.map((x, i) => ({ x, y: income[i] })) },
          { id: "c", curve: "is", label: "Spending", points: yrs.map((x) => ({ x, y: c })) },
        ]}
        xDomain={[1, n]} yDomain={[0, 200]} xLabel="Year" yLabel="Per year" aspect={0.5} xTicks={9}
        title="Income by year against smoothed spending"
      />
      <p className="num mt-1 text-sm" aria-live="polite">
        Spending per year {f1(c0)} → <span className="font-semibold">{f1(c)}</span>; saving this year {f1(saving[0])}.
      </p>
      <p className="prose-text mt-1 text-sm">
        {kind === "income" && "A shock that lasts one year moves spending by only a tenth of its size. Almost all of it is saved, to be spent over the years ahead."}
        {kind === "permanent" && "A shock that lasts every year moves spending one for one. Nothing needs to be saved, because the extra income is there each year."}
        {kind === "wealth" && "A windfall of wealth is spread across all the years left, so spending rises by a tenth of it each year, and this year's saving rises too."}
      </p>
    </Fig>
  );
}

/* ---------- Saving-investment market tracing IS ---------- */
export function SavingMarketIS() {
  const [Y, setY] = useState(100);
  const [pts, setPts] = useState<number[]>([]);
  const rs = grid(0, 10);
  const r = isR(base, Y);
  const r0 = isR(base, 100);
  const Ys = grid(85, 115);
  const S = (y: number) => rs.map((q) => ({ x: desiredSaving(base, y, q), y: q }));
  const I = rs.map((q) => ({ x: desiredInvestment(base, q), y: q }));
  const sorted = [...pts].sort((a, b) => a - b);
  return (
    <Fig title="Tracing the IS curve from the saving and investment market" note="Left: desired saving S (rises with r and with income Y) and desired investment I (falls with r). Right: the IS curve, built one point at a time. Index units.">
      <Ctl id="si-y" label="Output (income), Y" value={Y} min={85} max={115} onChange={setY} />
      <div className="mt-2 grid gap-4 md:grid-cols-2">
        <Chart
          series={[
            { id: "s0", curve: "ink", ghost: true, points: S(100) },
            { id: "s", curve: "ink", label: "S", points: S(Y) },
            { id: "i", curve: "labour", label: "I", points: I },
          ]}
          marks={[{ x: desiredInvestment(base, r), y: r, label: `r = ${r.toFixed(1)}`, dy: -10 }]}
          xDomain={[0, 60]} yDomain={[0, 10]} xLabel="Saving and investment" yLabel="Real interest rate, r (%)" aspect={0.8} xTicks={4}
          title="The saving and investment market: higher income shifts saving right and lowers the market-clearing interest rate"
        />
        <Chart
          series={[
            { id: "is", curve: "is", label: "IS", trace: pts.length < 3, points: sorted.length > 1 ? sorted.map((y) => ({ x: y, y: isR(base, y) })) : [] },
          ]}
          marks={[
            ...pts.map((y) => ({ x: y, y: isR(base, y), color: "var(--c-is)", guides: false })),
            { x: Y, y: r, hollow: true, color: "var(--ink)", label: `Y = ${Y}`, dy: -10 },
          ]}
          xDomain={[85, 115]} yDomain={[0, 10]} xLabel="Output, Y" yLabel="Real interest rate, r (%)" aspect={0.8} xTicks={3}
          title="Points on the IS curve collected from the market on the left"
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" onClick={() => setPts((p) => (p.includes(Y) ? p : [...p, Y]))}>Add this point to IS</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setPts(Ys.filter((_, i) => i % 6 === 0).map(Math.round))}>Fill in the curve</Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setPts([])}>Clear</Button>
        <span className="num text-sm text-muted-foreground">Y = {Y}: r = {r.toFixed(2)} (at Y = 100, r = {r0.toFixed(2)})</span>
      </div>
      <p className="prose-text mt-2 text-sm">
        Raise Y and households save more at every r, so S shifts right. To keep investment equal to saving, r has to fall. Each pair of output and interest rate that clears the market is one point on IS. That is why IS slopes down.
      </p>
    </Fig>
  );
}

/* ---------- Animated IS shifters with cause chains ---------- */
type Opt = { id: string; label: string; up: string[]; down: string[] };
const opts: Opt[] = [
  {
    id: "investment-outlook", label: "Higher expected future productivity of capital",
    up: ["Firms expect capital to be more productive next period", "Desired investment rises at each r", "I curve moves right", "At the old r, investment exceeds saving", "r rises and IS moves right"],
    down: ["Firms expect capital to be less productive next period", "Desired investment falls at each r", "I curve moves left", "At the old r, saving exceeds investment", "r falls and IS moves left"],
  },
  {
    id: "future-income", label: "Higher expected future income",
    up: ["Households expect to be richer later", "They smooth by spending more now", "Desired saving falls at each r: S moves left", "At the old r, investment exceeds saving", "r rises and IS moves right"],
    down: ["Households expect to be poorer later", "They cut back now to protect the future", "Desired saving rises at each r: S moves right", "At the old r, saving exceeds investment", "r falls and IS moves left"],
  },
  {
    id: "wealth", label: "Higher wealth",
    up: ["Households own more assets", "They spend more out of current income", "Desired saving falls at each r: S moves left", "At the old r, investment exceeds saving", "r rises and IS moves right"],
    down: ["Households own fewer assets", "They spend less out of current income", "Desired saving rises at each r: S moves right", "At the old r, saving exceeds investment", "r falls and IS moves left"],
  },
  {
    id: "gov-spending", label: "Higher government purchases (G)",
    up: ["The government buys more and taxes are unchanged", "Public saving, T − G, falls", "Total desired saving falls at each r: S moves left", "At the old r, investment exceeds saving", "r rises and IS moves right"],
    down: ["The government buys less and taxes are unchanged", "Public saving, T − G, rises", "Total desired saving rises at each r: S moves right", "At the old r, saving exceeds investment", "r falls and IS moves left"],
  },
  {
    id: "taxes", label: "Higher taxes (T)",
    up: ["Taxes rise, G unchanged", "Public saving rises by the full tax; private saving falls by less", "Total desired saving rises at each r: S moves right", "At the old r, saving exceeds investment", "r falls and IS moves left"],
    down: ["Taxes fall, G unchanged", "Public saving falls by the full tax; private saving rises by less", "Total desired saving falls at each r: S moves left", "At the old r, investment exceeds saving", "r rises and IS moves right"],
  },
];

export function IsShifters() {
  const reduced = useReducedMotion();
  const [id, setId] = useState(opts[0].id);
  const [dir, setDir] = useState<"up" | "down">("up");
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const opt = opts.find((o) => o.id === id)!;
  const sign = dir === "up" ? 1 : -1;
  const after = driverStep(id, sign, base);
  const cur = lerpParams(base, after, t);
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
  const rs = grid(0, 10);
  const Ys = grid(85, 120);
  const Y0 = 100;
  const rM = isR(cur, Y0);
  const lit = (i: number) => t >= (i + 0.5) / chain.length || (reduced && t >= 1);
  const yShort = shortRun(cur, 1).Y;
  return (
    <Fig title="Every IS shifter, with its cause chain" note="Pick a driver and a direction, then play. Dashed lines show where the curves started. Index units. 'Later' in the open-economy lessons: a change in net exports is another IS shifter, through the exchange rate and foreign demand.">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Driver">
        {opts.map((o) => <Button key={o.id} type="button" size="sm" variant={o.id === id ? "default" : "outline"} aria-pressed={o.id === id} onClick={() => { setId(o.id); reset(); }}>{o.label}</Button>)}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm" role="group" aria-label="Direction">
        {(["up", "down"] as const).map((d) => <Button key={d} type="button" size="sm" variant={dir === d ? "default" : "outline"} aria-pressed={dir === d} onClick={() => { setDir(d); reset(); }}>{d === "up" ? "Rises" : "Falls"}</Button>)}
        <Button type="button" size="sm" variant="outline" onClick={() => { if (reduced) { setT(1); } else { setT(0); setPlaying(true); } }}>{reduced ? "Jump to the result" : "Play"}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={reset}>Reset</Button>
        {!reduced && <label className="flex items-center gap-2"><span>Scrub</span>
          <input type="range" min={0} max={1} step={0.01} value={t} aria-label="Progress of the shift" onChange={(e) => { setPlaying(false); setT(Number(e.target.value)); }} className="accent-[var(--ink)]" /></label>}
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <Chart
          series={[
            { id: "s0", curve: "ink", ghost: true, points: rs.map((q) => ({ x: desiredSaving(base, Y0, q), y: q })) },
            { id: "i0", curve: "labour", ghost: true, points: rs.map((q) => ({ x: desiredInvestment(base, q), y: q })) },
            { id: "s", curve: "ink", label: "S", points: rs.map((q) => ({ x: desiredSaving(cur, Y0, q), y: q })) },
            { id: "i", curve: "labour", label: "I", points: rs.map((q) => ({ x: desiredInvestment(cur, q), y: q })) },
          ]}
          marks={[{ x: desiredInvestment(cur, rM), y: rM, label: `r ${rM.toFixed(1)}`, dy: -10 }]}
          xDomain={[0, 60]} yDomain={[0, 10]} xLabel="Saving and investment (at Y = 100)" yLabel="Real interest rate, r (%)" aspect={0.8} xTicks={4}
          title="Saving and investment market while the driver changes"
        />
        <Chart
          series={[
            { id: "is0", curve: "is", ghost: true, points: Ys.map((y) => ({ x: y, y: isR(base, y) })) },
            { id: "is", curve: "is", label: "IS", points: Ys.map((y) => ({ x: y, y: isR(cur, y) })) },
          ]}
          marks={[{ x: Y0, y: isR(base, Y0), hollow: true, guides: false }, { x: Y0, y: rM, label: "now", dy: -10, guides: false }]}
          xDomain={[85, 120]} yDomain={[0, 10]} xLabel="Output, Y" yLabel="Real interest rate, r (%)" aspect={0.8} xTicks={3}
          title="The IS curve moves with the saving and investment market"
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
      <p className="num mt-2 text-sm" aria-live="polite">Market rate at Y = 100: {isR(base, Y0).toFixed(2)} → {rM.toFixed(2)}. With prices not yet adjusted and LM unchanged, output would go to {f1(yShort)}.</p>
    </Fig>
  );
}

/* ---------- Ricardian equivalence ---------- */
export function RicardianWidget() {
  const [f, setF] = useState(0.4);
  const cut = 10;
  const { dS, dY } = taxCut(cut, f, base.sY);
  const Ys = grid(85, 130);
  return (
    <Fig title="A tax cut, and what households do with it" note="A tax cut of 10 with government spending unchanged, financed by borrowing. f is the share of the cut that households save. Index units.">
      <Ctl id="ri-f" label="Share of the tax cut that households save" value={f} min={0} max={1} step={0.05} show={`${Math.round(f * 100)}%`} onChange={setF} />
      <Chart
        series={[
          { id: "is0", curve: "is", ghost: true, points: Ys.map((y) => ({ x: y, y: isR(base, y) })) },
          { id: "is", curve: "is", label: "IS", points: Ys.map((y) => ({ x: y, y: isR(base, y - dY) })) },
        ]}
        xDomain={[85, 130]} yDomain={[0, 10]} xLabel="Output, Y" yLabel="Real interest rate, r (%)" aspect={0.5} xTicks={5}
        title="IS shifts right by less the more of the tax cut households save"
      />
      <p className="num mt-1 text-sm" aria-live="polite">
        Public saving −{cut}, private saving +{f1(f * cut)}, total saving {dS >= 0 ? "+" : ""}{f1(dS)}. IS moves right by {f1(dY)} units of output.
      </p>
      <p className="prose-text mt-1 text-sm">
        If households save all of it (100%), they are setting aside the money to pay the taxes the borrowing will require later, and nothing moves. That is Ricardian equivalence. If they save little, total saving falls and IS shifts right. Which is closer to the truth is an open question that the evidence below informs but does not settle.
      </p>
    </Fig>
  );
}
