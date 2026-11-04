/** Output and prices through time, as percent from the start, for the over-time chart. Values come from the lesson model's path. */
import type { Frame, Simulation } from "./model";

/** Periods shown after the first move (B). Fixed, so slow and fast price adjustment look different. */
export const T_SPAN = 50;
/** Quiet periods drawn before the first move, so A has a place on the axis. */
export const LEAD = 2;

export type TimePoint = { tau: number; output: number; prices: number };
export type OverTime = {
  points: TimePoint[];
  /** Time of A, B and C on the axis (B is 0; A is before it; C where prices have settled). */
  at: { A: number; B: number; C: number };
  /** Largest absolute value, rounded up: the axis runs from -span to +span. */
  span: number;
};

const pct = (v: number, v0: number) => (v / v0 - 1) * 100;

export function overTime(sim: Simulation, settle: number): OverTime {
  const a = sim.baseline;
  const fr = sim.frames;
  const points: TimePoint[] = [];
  for (let tau = -LEAD; tau <= T_SPAN; tau++) {
    const f: Frame = tau < 0 ? a : fr[Math.min(tau + 1, fr.length - 1)];
    points.push({ tau, output: pct(f.Y, a.Y), prices: pct(f.P, a.P) });
  }
  const max = points.reduce((m, p) => Math.max(m, Math.abs(p.output), Math.abs(p.prices)), 0);
  return { points, at: { A: -LEAD, B: 0, C: Math.min(Math.max(settle - 1, 1), T_SPAN) }, span: Math.max(1, Math.ceil(max)) };
}

/** Where the cursor sits for a playback position (0 = A, 1 = B, last = C). */
export function cursorTau(t: number, length: number, ot: OverTime): number {
  if (t <= 0) return ot.at.A;
  if (t >= length - 1) return ot.at.C;
  return Math.min(t - 1, ot.at.C);
}
