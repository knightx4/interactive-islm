"use client";

import Chart, { type Arrow, type Mark, type RefLine, type Series } from "@/components/chart/Chart";
import { isR, lmR, Ystar, type Frame, type Params, type Simulation } from "@/lib/macro/model";
import type { View } from "@/lib/macro/view";

const X0 = 60, X1 = 140, R0 = 0, R1 = 10;

type Fns = { is: (y: number) => number; lm: (y: number) => number };
const curvesFor = (p: Params, fr: Frame): Fns => ({
  is: (y) => isR(p, y, fr.q),
  lm: (y) => lmR(p, y, fr.Meff / fr.P),
});
const ends = (f: (y: number) => number) => [{ x: X0, y: f(X0) }, { x: X1, y: f(X1) }];
/** Output on a (straight) curve at interest rate r. */
const xAt = (f: (y: number) => number, r: number) => {
  const f1 = f(X0), f2 = f(X1);
  return X0 + ((r - f1) * (X1 - X0)) / (f2 - f1);
};
const moved = (a: number, b: number) => Math.abs(a - b) > 0.05;

/** IS, LM and FE with ghosts of where they were, shift arrows, and the points A, B and C. */
export default function CurvesFigure({ sim, view, animateMs = 0, aspect }: { sim: Simulation; view: View; animateMs?: number; aspect?: number }) {
  const now = curvesFor(view.params, view.curveFrame);
  const base = curvesFor(sim.before, sim.baseline);
  const atB = curvesFor(sim.after, sim.impact);
  const a = sim.baseline, b = sim.impact, c = sim.longRun;
  const feNow = Ystar(view.params), feOld = Ystar(sim.before);
  const rMid = a.r;

  const series: Series[] = [];
  const refLines: RefLine[] = [];
  const arrows: Arrow[] = [];

  if (view.ghosts) {
    if (moved(base.is(100), now.is(100))) series.push({ id: "is0", curve: "is", points: ends(base.is), ghost: true, label: "IS₀" });
    if (moved(base.lm(100), now.lm(100))) series.push({ id: "lm0", curve: "lm", points: ends(base.lm), ghost: true, label: "LM₀" });
    if (moved(feOld, feNow)) refLines.push({ orientation: "v", value: feOld, curve: "fe", ghost: true });
    if (view.lmArrow && moved(atB.lm(100), now.lm(100))) series.push({ id: "lm1", curve: "lm", points: ends(atB.lm), ghost: true });
  }
  series.push({ id: "is", curve: "is", points: ends(now.is), label: "IS" }, { id: "lm", curve: "lm", points: ends(now.lm), label: "LM" });
  refLines.push({ orientation: "v", value: feNow, curve: "fe", label: "FE" });
  if (view.params.regime !== "closed" && view.params.mobility >= 1) {
    refLines.push({ orientation: "h", value: view.curveFrame.rp, curve: "ink", label: "r*", ghost: true });
  }

  if (view.shockArrow) {
    if (moved(base.is(100), now.is(100))) arrows.push({ curve: "is", from: { x: xAt(base.is, rMid + 1.3), y: rMid + 1.3 }, to: { x: xAt(now.is, rMid + 1.3), y: rMid + 1.3 } });
    if (moved(base.lm(100), now.lm(100))) arrows.push({ curve: "lm", from: { x: xAt(base.lm, rMid - 1.3), y: rMid - 1.3 }, to: { x: xAt(now.lm, rMid - 1.3), y: rMid - 1.3 } });
    if (moved(feOld, feNow)) arrows.push({ curve: "fe", from: { x: feOld, y: 9 }, to: { x: feNow, y: 9 } });
  }
  if (view.lmArrow && moved(atB.lm(100), now.lm(100))) {
    arrows.push({ curve: "lm", from: { x: xAt(atB.lm, rMid - 1.3), y: rMid - 1.3 }, to: { x: xAt(now.lm, rMid - 1.3), y: rMid - 1.3 } });
  }

  // the path from B toward C while prices adjust
  if (view.t >= 2) {
    const path = sim.frames.slice(1, view.t + 1).map((f) => ({ x: f.Y, y: f.r }));
    series.push({ id: "path", curve: "ink", points: path, trace: true });
  }

  const marks: Mark[] = [{ x: a.Y, y: a.r, label: "A", color: "var(--pt-a)", guides: false }];
  if (view.showB) marks.push({ x: b.Y, y: b.r, label: "B", color: "var(--pt-b)", guides: false });
  if (view.showC) marks.push({ x: c.Y, y: c.r, label: "C", color: "var(--pt-c)", guides: false });
  if (view.at === "moving") marks.push({ x: view.frame.Y, y: view.frame.r, color: "var(--ink)", hollow: true });

  return (
    <Chart
      title="IS, LM and FE curves with the points A, B and C"
      xLabel="Output, Y" yLabel="Interest rate, r (%)"
      xDomain={[X0, X1]} yDomain={[R0, R1]} xTicks={4} yTicks={5}
      series={series} refLines={refLines} marks={marks} arrows={arrows} animateMs={animateMs} aspect={aspect}
    />
  );
}
