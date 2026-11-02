"use client";

import type { Simulation } from "@/lib/macro/model";

function Spark({ title, values, guide, cursor }: { title: string; values: number[]; guide?: number[]; cursor: number }) {
  const W = 200, H = 70;
  const all = [...values, ...(guide ?? [])];
  const lo = Math.min(...all), hi = Math.max(...all);
  const span = hi - lo || 1;
  const x = (i: number) => (i / (values.length - 1)) * W;
  const y = (v: number) => H - 6 - ((v - lo) / span) * (H - 12);
  const path = (vs: number[]) => vs.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const c = Math.min(cursor, values.length - 1);
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${title}, now ${values[c].toFixed(2)}`}>
        {guide && <path d={path(guide)} fill="none" stroke="var(--c-fe)" strokeWidth="1.5" strokeDasharray="3 3" />}
        <path d={path(values)} fill="none" stroke="var(--ink)" strokeWidth="2" />
        <line x1={x(c)} x2={x(c)} y1={0} y2={H} stroke="var(--rule)" />
        <circle cx={x(c)} cy={y(values[c])} r="3.5" fill="var(--ink)" />
      </svg>
      <div className="num text-sm text-muted-foreground">{values[c].toFixed(2)}</div>
    </div>
  );
}

/** Time paths of the main variables after the shock; the cursor follows the lab. */
export default function TimePath({ sim, index }: { sim: Simulation; index: number }) {
  const f = sim.frames;
  const open = sim.after.regime !== "closed";
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Spark title="Output Y (dashed: FE)" values={f.map((x) => x.Y)} guide={f.map((x) => x.Ystar)} cursor={index} />
      <Spark title="Price level P" values={f.map((x) => x.P)} cursor={index} />
      <Spark title="Interest rate r (%)" values={f.map((x) => x.r)} cursor={index} />
      {open ? <Spark title="Exchange rate e" values={f.map((x) => x.E)} cursor={index} /> : <Spark title="Employment N" values={f.map((x) => x.N)} cursor={index} />}
    </div>
  );
}
