import type { Frame, Params, Simulation } from "./model";

/** What the figures show at a given recipe step (0-7) and time index (used while prices adjust). */
export type View = {
  params: Params;
  /** The frame whose equilibrium and price level the curves are drawn at. */
  curveFrame: Frame;
  /** The frame the side markets and time cursor show. */
  frame: Frame;
  showB: boolean;
  showC: boolean;
  /** Ghost positions and the shift arrow for the shock, steps 2 to 5. */
  shockArrow: boolean;
  /** Ghost of the original curves is shown from step 2. */
  ghosts: boolean;
  /** Price-driven LM shift (impact to now) drawn in steps 6 and 7. */
  lmArrow: boolean;
  /** Index into sim.frames of the current time (1 = impact). */
  t: number;
  /** Which point the cursor is at: A, B, C or in transit. */
  at: "A" | "B" | "C" | "moving";
};

export const STEPS = 8;

export function viewFor(sim: Simulation, step: number, t: number): View {
  const last = sim.frames.length - 1;
  const tt = Math.min(last, Math.max(1, t));
  const moved = step >= 2;
  const params = moved ? sim.after : sim.before;
  if (step <= 1) {
    return { params, curveFrame: sim.baseline, frame: sim.baseline, showB: false, showC: false, shockArrow: false, ghosts: false, lmArrow: false, t: 0, at: "A" };
  }
  if (step === 2) {
    return { params, curveFrame: sim.impact, frame: sim.baseline, showB: false, showC: false, shockArrow: true, ghosts: true, lmArrow: false, t: 0, at: "A" };
  }
  if (step <= 5) {
    return { params, curveFrame: sim.impact, frame: sim.impact, showB: true, showC: false, shockArrow: true, ghosts: true, lmArrow: false, t: 1, at: "B" };
  }
  if (step === 6) {
    const f = sim.frames[tt];
    return { params, curveFrame: f, frame: f, showB: true, showC: false, shockArrow: false, ghosts: true, lmArrow: true, t: tt, at: tt <= 1 ? "B" : "moving" };
  }
  return { params: sim.final, curveFrame: sim.longRun, frame: sim.longRun, showB: true, showC: true, shockArrow: false, ghosts: true, lmArrow: true, t: last, at: "C" };
}
