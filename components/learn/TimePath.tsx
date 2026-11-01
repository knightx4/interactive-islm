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
  return (
    <div>
      <div className="text-xs font-medium text-gray-700">{title}</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {guide && <path d={path(guide)} fill="none" stroke="#86efac" strokeWidth="1.5" strokeDasharray="3 3" />}
        <path d={path(values)} fill="none" stroke="#2563eb" strokeWidth="2" />
        <line x1={x(cursor)} x2={x(cursor)} y1={0} y2={H} stroke="#9ca3af" />
        <circle cx={x(cursor)} cy={y(values[cursor])} r="3.5" fill="#111827" />
      </svg>
      <div className="text-xs tabular-nums text-gray-600">{values[cursor].toFixed(2)}</div>
    </div>
  );
}

export default function TimePath({ sim, index }: { sim: Simulation; index: number }) {
  const f = sim.frames;
  const open = sim.after.regime !== "closed";
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Spark title="Output Y (dashed: FE)" values={f.map((x) => x.Y)} guide={f.map((x) => x.Ystar)} cursor={index} />
      <Spark title="Price level P" values={f.map((x) => x.P)} cursor={index} />
      <Spark title="Interest rate r (%)" values={f.map((x) => x.r)} cursor={index} />
      {open ? (
        <Spark title="Real exchange rate q" values={f.map((x) => x.q)} cursor={index} />
      ) : (
        <Spark title="Output gap (%)" values={f.map((x) => x.gap * 100)} cursor={index} />
      )}
    </div>
  );
}
