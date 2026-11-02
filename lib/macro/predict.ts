import type { Frame, Regime, Simulation } from "./model";

export type Direction = "up" | "down" | "same";
export type Horizon = "short" | "long";

export type Variable = "Y" | "r" | "P" | "C" | "I" | "N" | "w" | "e" | "NX";

export const variables: { id: Variable; label: string; open?: boolean; read: (f: Frame) => number; floor: number }[] = [
  { id: "Y", label: "Output, Y", read: (f) => f.Y, floor: 1e-9 },
  { id: "r", label: "Real interest rate, r", read: (f) => f.r, floor: 1e-9 },
  { id: "P", label: "Price level, P", read: (f) => f.P, floor: 1e-9 },
  { id: "C", label: "Consumption, C", read: (f) => f.C, floor: 1e-9 },
  { id: "I", label: "Investment, I", read: (f) => f.I, floor: 1e-9 },
  { id: "N", label: "Employment, N", read: (f) => f.N, floor: 1e-9 },
  { id: "w", label: "Real wage, w", read: (f) => f.w, floor: 1e-9 },
  { id: "e", label: "Exchange rate, e (foreign per home)", open: true, read: (f) => f.E, floor: 1e-9 },
  { id: "NX", label: "Net exports, NX", open: true, read: (f) => f.NX, floor: 1 },
];

export type Question = {
  id: string;
  variable: Variable;
  horizon: Horizon;
  label: string;
  answer: Direction;
  from: number;
  to: number;
};

const EPS = 0.01; // relative change below this counts as "same"

/** Direction of a change. `floor` keeps a base near zero (like NX) from turning noise into a move. */
export function direction(from: number, to: number, eps = EPS, floor = 1e-9): Direction {
  const rel = (to - from) / Math.max(Math.abs(from), floor);
  return rel > eps ? "up" : rel < -eps ? "down" : "same";
}

/** Every variable in the check, short run (point B) and long run (point C), against the start (point A). */
export function questionsFor(sim: Simulation, regime: Regime): Question[] {
  const out: Question[] = [];
  for (const horizon of ["short", "long"] as const) {
    const to = horizon === "short" ? sim.impact : sim.longRun;
    for (const v of variables) {
      if (v.open && regime === "closed") continue;
      const from = v.read(sim.baseline), x = v.read(to);
      out.push({
        id: `${v.id}-${horizon}`,
        variable: v.id,
        horizon,
        label: `${v.label}, ${horizon === "short" ? "right after the shock (prices fixed)" : "once prices have fully adjusted"}`,
        answer: direction(from, x, 0.005, v.floor),
        from,
        to: x,
      });
    }
  }
  return out;
}
