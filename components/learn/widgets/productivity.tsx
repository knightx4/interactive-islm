"use client";

import { useState } from "react";
import Chart from "@/components/chart/Chart";
import { Button } from "@/components/ui/button";
import { hireUntil, mpl, out, presets, profit, sources, type Growth } from "@/lib/learn/growth";
import { baselineEconomy, Ystar } from "@/lib/macro/model";
import { Ctl, Fig, f1 } from "./ui";

const grid = (lo: number, hi: number, n = 40) => Array.from({ length: n + 1 }, (_, i) => lo + ((hi - lo) * i) / n);
const base = { A: 1, K: 100, a: 0.3 };

/* ---------- Production function: output against labour ---------- */
export function ProductionFunctionWidget() {
  const [A, setA] = useState(1);
  const [K, setK] = useState(100);
  const [a, setA2] = useState(0.3);
  const [N, setN] = useState(100);
  const t = { A, K, a };
  const slope = mpl(t, N), y0 = out(t, N);
  const tan = [{ x: Math.max(0, N - 40), y: y0 - slope * Math.min(40, N) }, { x: N + 40, y: y0 + slope * 40 }];
  const xs = grid(5, 200);
  return (
    <Fig title="Output against labour" note="Y = A × K^a × N^(1−a), in index units. Dashed: the starting curve (A = 1, K = 100, a = 0.3). The straight dotted line is the tangent: its slope is the marginal product of labour.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="pf-A" label="Productivity, A" value={A} min={0.7} max={1.5} step={0.05} onChange={setA} />
        <Ctl id="pf-K" label="Capital, K" value={K} min={40} max={250} step={10} onChange={setK} />
        <Ctl id="pf-a" label="Capital share, a" value={a} min={0.1} max={0.6} step={0.05} onChange={setA2} />
        <Ctl id="pf-N" label="Workers, N" value={N} min={20} max={190} step={10} onChange={setN} />
      </div>
      <Chart
        series={[
          { id: "base", curve: "ink", ghost: true, points: xs.map((x) => ({ x, y: out(base, x) })) },
          { id: "y", curve: "fe", label: "Y", points: xs.map((x) => ({ x, y: out(t, x) })) },
          { id: "tan", curve: "labour", trace: true, points: tan },
        ]}
        marks={[{ x: N, y: y0, label: `Y = ${f1(y0)}`, dy: 18 }]}
        xDomain={[0, 200]} yDomain={[0, 260]} xLabel="Workers, N" yLabel="Output, Y"
        title="The production function: output rises with workers, but more slowly each time" aspect={0.6}
      />
      <p className="num mt-1 text-sm" aria-live="polite">
        At N = {N}: output {f1(y0)}, output per worker {f1(y0 / N)}, marginal product of the next worker <span className="font-semibold">{mpl(t, N).toFixed(2)}</span>.
        Move N up and watch the marginal product shrink while the tangent flattens.
      </p>
    </Fig>
  );
}

/* ---------- Hire until MPL equals the wage ---------- */
export function HiringWidget() {
  const [w, setW] = useState(0.7);
  const [N, setN] = useState(60);
  const nStar = hireUntil(base, w);
  const xs = grid(10, 300, 58);
  const p = profit(base, N, w), pStar = profit(base, nStar, w);
  const next = mpl(base, N + 1);
  const verdict = Math.abs(N - nStar) < 8 ? "Close to the best choice: the last worker adds about what the wage costs."
    : N < nStar ? "Hire more: the next worker adds more output than they cost." : "Too many: the last workers cost more than they add.";
  return (
    <Fig title="A firm's hiring decision" note="One firm with K = 100, A = 1, a = 0.3, and a real wage w in units of output. Profit is output minus the wage bill. Index units.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="hi-w" label="Real wage, w" value={w} min={0.55} max={1} step={0.05} show={w.toFixed(2)} onChange={setW} />
        <Ctl id="hi-n" label="Workers hired, N" value={N} min={10} max={290} step={5} onChange={setN} />
      </div>
      <Chart
        series={[{ id: "mpl", curve: "labour", label: "MPL", points: xs.map((x) => ({ x, y: mpl(base, x) })) }]}
        refLines={[{ orientation: "h", value: w, curve: "ink", label: "w" }]}
        marks={[{ x: nStar, y: w, label: "best N", dy: -10 }, { x: N, y: mpl(base, N), hollow: true, color: "var(--c-labour)", guides: false }]}
        xDomain={[0, 300]} yDomain={[0, 1.6]} xLabel="Workers, N" yLabel="Real wage and marginal product"
        title="Marginal product of labour against the wage: hire until the curve meets the wage line" aspect={0.55}
      />
      <p className="num mt-1 text-sm" aria-live="polite">
        N = {N}: next worker adds {next.toFixed(2)} against a wage of {w.toFixed(2)}. Profit {f1(p)} (best possible {f1(pStar)} at N ≈ {Math.round(nStar)}). {verdict}
      </p>
      <p className="prose-text mt-1 text-sm">Because the marginal product curve is the firm&apos;s demand for labour at each wage, this is also how labour demand is built.</p>
    </Fig>
  );
}

/* ---------- Growth accounting calculator ---------- */
export function GrowthCalculator() {
  const [g, setG] = useState<Growth>(presets[0].g);
  const [pre, setPre] = useState<string>(presets[0].id);
  const s = sources(g);
  const set = (k: keyof Growth) => (v: number) => { setPre(""); setG((x) => ({ ...x, [k]: v })); };
  const rows = [
    { name: "Capital", v: s.capital, tone: "var(--c-is)" },
    { name: "Workers", v: s.labour, tone: "var(--c-labour)" },
    { name: "Schooling", v: s.schooling, tone: "var(--c-money)" },
    { name: "TFP (what is left)", v: s.tfp, tone: "var(--c-fe)" },
  ];
  const scale = Math.max(g.gY, 1);
  const note = presets.find((p) => p.id === pre)?.note;
  return (
    <Fig title="Where did growth come from" note="Rates are percent per year. Presets are stylised and rounded, to echo published findings; they are not a dataset.">
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Preset">
        {presets.map((p) => (
          <Button key={p.id} type="button" size="sm" variant={pre === p.id ? "default" : "outline"} aria-pressed={pre === p.id} onClick={() => { setPre(p.id); setG(p.g); }}>{p.label}</Button>
        ))}
      </div>
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="ga-y" label="Output growth" value={g.gY} min={0} max={12} step={0.1} show={`${g.gY.toFixed(1)}%`} onChange={set("gY")} />
        <Ctl id="ga-k" label="Capital growth" value={g.gK} min={0} max={14} step={0.5} show={`${g.gK}%`} onChange={set("gK")} />
        <Ctl id="ga-n" label="Employment growth" value={g.gN} min={0} max={6} step={0.1} show={`${g.gN.toFixed(1)}%`} onChange={set("gN")} />
        <Ctl id="ga-h" label="Growth in schooling per worker" value={g.gH} min={0} max={4} step={0.1} show={`${g.gH.toFixed(1)}%`} onChange={set("gH")} />
        <Ctl id="ga-a" label="Capital share, a" value={g.a} min={0.2} max={0.6} step={0.05} show={g.a.toFixed(2)} onChange={set("a")} />
      </div>
      <div className="mt-4 space-y-1.5" aria-live="polite">
        {rows.map((r) => (
          <div key={r.name} className="grid grid-cols-[9rem_1fr_6.5rem] items-center gap-2 text-sm">
            <span>{r.name}</span>
            <span className="h-3 bg-wash" aria-hidden><span className="block h-3" style={{ width: `${Math.min(100, Math.max(0, (100 * r.v) / scale))}%`, background: r.tone }} /></span>
            <span className="num text-right font-semibold">{r.v.toFixed(2)} pts ({g.gY > 0 ? Math.round((100 * r.v) / g.gY) : 0}%)</span>
          </div>
        ))}
      </div>
      <p className="prose-text mt-2 text-sm">
        Growth = TFP growth + a × capital growth + (1 − a) × (employment growth + schooling growth). TFP is the residual: whatever growth the inputs do not explain.
        {s.tfp < 0 && " A negative residual means output grew less than the inputs alone would suggest."}
      </p>
      {note && <p className="prose-text mt-1 text-sm font-medium">{note}</p>}
    </Fig>
  );
}

/* ---------- Hand-off: a rise in A moves FE right ---------- */
export function FEHandoff() {
  const [pct, setPct] = useState(5);
  const p0 = baselineEconomy("closed");
  const p1 = { ...p0, A: p0.A * (1 + pct / 100) };
  const y0 = Ystar(p0), y1 = Ystar(p1);
  return (
    <Fig title="A rise in A moves FE to the right" note="Full-employment output Y* is the output firms make when the labour market clears. Index units: baseline Y* = 100.">
      <Ctl id="fe-a" label="Rise in productivity, A" value={pct} min={0} max={10} show={`${pct}%`} onChange={setPct} />
      <Chart
        series={[]}
        refLines={[
          { orientation: "v", value: y0, curve: "fe", ghost: true, label: "FE" },
          { orientation: "v", value: y1, curve: "fe", label: "FE′" },
        ]}
        arrows={y1 - y0 > 0.05 ? [{ from: { x: y0, y: 3 }, to: { x: y1, y: 3 }, curve: "fe" }] : []}
        xDomain={[90, 115]} yDomain={[0, 10]} xLabel="Output, Y" yLabel="Real interest rate, r (%)"
        title="The full-employment line before and after a rise in productivity" aspect={0.5}
      />
      <p className="num text-sm" aria-live="polite">A up {pct}%: full-employment output {f1(y0)} → {f1(y1)}. Output rises by a little more than A itself, because employment rises as well. How the wage and employment settle is the next lesson.</p>
    </Fig>
  );
}
