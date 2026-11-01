import type { Regime, Simulation } from "./model";

export type Direction = "up" | "down" | "same";

export type Question = { id: string; label: string; answer: Direction };

const EPS = 0.01; // relative change below this counts as "same"

export function direction(from: number, to: number): Direction {
  const rel = (to - from) / Math.max(Math.abs(from), 1e-9);
  return rel > EPS ? "up" : rel < -EPS ? "down" : "same";
}

/** Questions for the predict-then-reveal check, answered from the simulation itself. */
export function questionsFor(sim: Simulation, regime: Regime): Question[] {
  const b = sim.baseline;
  const qs: Question[] = [
    { id: "Y-short", label: "Output right after the shock (prices not yet moved)", answer: direction(b.Y, sim.impact.Y) },
    { id: "r-short", label: "Real interest rate right after the shock", answer: direction(b.r, sim.impact.r) },
    { id: "Y-long", label: "Output once prices have fully adjusted", answer: direction(b.Y, sim.longRun.Y) },
    { id: "P-long", label: "Price level once prices have fully adjusted", answer: direction(b.P, sim.longRun.P) },
  ];
  if (regime !== "closed") {
    qs.push({ id: "q-long", label: "Real exchange rate in the long run", answer: direction(b.q, sim.longRun.q) });
  }
  return qs;
}
