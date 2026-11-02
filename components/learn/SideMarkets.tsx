"use client";

import { sideMarkets, type Simulation } from "@/lib/macro/model";

function Bar({ label, a, b, aLabel, bLabel, max, color }: { label: string; a: number; b: number; aLabel: string; bLabel: string; max: number; color: string }) {
  const w = (v: number) => `${Math.max(0, Math.min(100, (Math.abs(v) / max) * 100))}%`;
  return (
    <div className="space-y-1">
      <div className="text-sm font-semibold">{label}</div>
      {[{ l: aLabel, v: a, c: color, o: 1 }, { l: bLabel, v: b, c: color, o: 0.45 }].map((r) => (
        <div key={r.l} className="flex items-center gap-2 text-sm">
          <span className="w-32 shrink-0 text-muted-foreground">{r.l}</span>
          <div className="h-2 flex-1 border-b border-rule">
            <div className="h-2" style={{ width: w(r.v), background: r.c, opacity: r.o, transition: "width 120ms linear" }} />
          </div>
          <span className="num w-12 text-right">{r.v.toFixed(1)}</span>
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
        a={s.privateSaving + s.publicSaving} b={s.investment + s.netExports} max={40} color="var(--c-is)" />
      <Bar label="Money market (real)" aLabel="Supply M/P" bLabel="Demand" a={s.moneySupplyReal} b={s.moneyDemand} max={60} color="var(--c-money)" />
      <Bar label="Labour market: employment" aLabel="Employment N" bLabel="At full employment" a={s.employment} b={s.employmentFE} max={120} color="var(--c-labour)" />
      <Bar label="Labour market: real wage" aLabel="Real wage w" bLabel="At full employment" a={s.realWage} b={s.realWageFE} max={1.5} color="var(--c-labour)" />
    </div>
  );
}
