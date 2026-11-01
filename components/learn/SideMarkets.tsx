"use client";

import { sideMarkets, type Simulation } from "@/lib/macro/model";

function Bar({ label, a, b, aLabel, bLabel, max }: { label: string; a: number; b: number; aLabel: string; bLabel: string; max: number }) {
  const w = (v: number) => `${Math.max(0, Math.min(100, (Math.abs(v) / max) * 100))}%`;
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-gray-700">{label}</div>
      {[{ l: aLabel, v: a, c: "bg-blue-500" }, { l: bLabel, v: b, c: "bg-amber-500" }].map((r) => (
        <div key={r.l} className="flex items-center gap-2 text-xs">
          <span className="w-28 shrink-0 text-gray-600">{r.l}</span>
          <div className="h-3 flex-1 rounded bg-gray-100">
            <div className={`h-3 rounded ${r.c}`} style={{ width: w(r.v), transition: "width 120ms linear" }} />
          </div>
          <span className="w-12 text-right tabular-nums">{r.v.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}

export default function SideMarkets({ sim, index }: { sim: Simulation; index: number }) {
  const p = index === 0 ? sim.before : sim.after;
  const s = sideMarkets(p, sim.frames[index]);
  const open = p.regime !== "closed";
  return (
    <div className="grid gap-4">
      <Bar label="Saving and investment" aLabel="Total saving" bLabel={open ? "Investment + net exports" : "Investment"}
        a={s.privateSaving + s.publicSaving} b={s.investment + s.netExports} max={40} />
      <Bar label="Money market (real)" aLabel="Supply M/P" bLabel="Demand" a={s.moneySupplyReal} b={s.moneyDemand} max={60} />
      <Bar label="Labor market" aLabel="Employment" bLabel="Full employment" a={s.labor} b={s.laborFull} max={120} />
    </div>
  );
}
