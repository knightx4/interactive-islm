"use client";

import Chart from "@/components/chart/Chart";
import { isR, lmR, type Frame, type Params, type Simulation } from "@/lib/macro/model";

const X0 = 60, X1 = 140, R0 = 0, R1 = 10;

function curvesFor(p: Params, fr: Frame) {
  return {
    is: (y: number) => isR(p, y, fr.q),
    lm: (y: number) => lmR(p, y, fr.Meff / fr.P),
  };
}

export default function CurvesFigure({ sim, index }: { sim: Simulation; index: number }) {
  const fr = sim.frames[index];
  const params = index === 0 ? sim.before : sim.after;
  const now = curvesFor(params, fr);
  const base = curvesFor(sim.before, sim.baseline);
  const open = params.regime !== "closed";

  const ends = (f: (y: number) => number) => [{ x: X0, y: f(X0) }, { x: X1, y: f(X1) }];
  return (
    <Chart
      title="IS, LM and FE curves with the current equilibrium"
      xLabel="Output, Y" yLabel="Interest rate, r (%)"
      xDomain={[X0, X1]} yDomain={[R0, R1]} xTicks={4} yTicks={5}
      series={[
        { id: "is0", curve: "is", points: ends(base.is), ghost: true },
        { id: "lm0", curve: "lm", points: ends(base.lm), ghost: true },
        { id: "is", curve: "is", points: ends(now.is), label: "IS" },
        { id: "lm", curve: "lm", points: ends(now.lm), label: "LM" },
      ]}
      refLines={[
        { orientation: "v", value: sim.baseline.Ystar, curve: "fe", ghost: true },
        { orientation: "v", value: fr.Ystar, curve: "fe", label: "FE" },
        ...(open && params.mobility >= 1 ? [{ orientation: "h" as const, value: fr.rp, curve: "ink" as const, label: "r*", ghost: true }] : []),
      ]}
      marks={[{ x: fr.Y, y: fr.r, label: "E" }]}
    />
  );
}
