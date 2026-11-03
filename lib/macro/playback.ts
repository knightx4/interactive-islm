/** Phase and playback helpers for the Workbench: A (start), B (prices fixed), C (prices adjusted). */
import type { Simulation } from "./model";
import { isBaseline, type SimState } from "./sim";

export type Phase = "A" | "B" | "C";

/** "Slowly" keeps the lessons' price speed; "at once" is the fastest the model allows. */
export const SPEED_SLOW = 50;
export const SPEED_FAST = 100;
export const adjustsAtOnce = (speed: number) => speed >= 90;

/** First playback position from which output is within `tol` of its long-run value. */
export function settleIndex(sim: Simulation, tol = 0.05): number {
  const last = sim.frames.length;
  for (let i = 1; i < sim.frames.length; i++) {
    if (Math.abs(sim.frames[i].Y - sim.longRun.Y) <= tol && Math.abs(sim.frames[i].P - sim.longRun.P) <= tol / 50) return i;
  }
  return last;
}

/** Playback position of each phase for a run of `length` positions. */
export const positionOf = (phase: Phase, length: number) => (phase === "A" ? 0 : phase === "B" ? 1 : length - 1);

/** The phase a position belongs to; positions between B and C count as "moving". */
export function phaseAt(t: number, length: number): Phase | "moving" {
  return t <= 0 ? "A" : t === 1 ? "B" : t >= length - 1 ? "C" : "moving";
}

const TOL = 0.01;

/** The headline over the chart: where the economy is. */
export function headlineFor(st: SimState, at: Phase | "moving", Y: number, Ystar: number): string {
  if (isBaseline(st)) return "The economy at rest";
  if (at === "A") return "Before the change";
  const gap = (Y - Ystar) / Ystar;
  if (at === "C" || (at === "moving" && Math.abs(gap) < TOL / 10)) return "Long run: back at full employment";
  const prefix = at === "B" ? "Short run" : "Prices adjusting";
  if (gap > TOL) return `${prefix}: running hot`;
  if (gap < -TOL) return `${prefix}: slack`;
  return at === "B" ? "Short run: at full employment" : "Prices adjusting";
}
