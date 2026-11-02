/** Arithmetic behind the demand shocks lesson. Index units, not data. */
import { simulate, type Frame, type Params } from "../macro/model";
import { shockById } from "../macro/shocks";
import { economy } from "./fullmodel";

/**
 * A stylised sketch of the zero lower bound (not the lab economy, whose curves are too steep to reach it at sensible output).
 * IS: r = r0 - 0.3 (x - g), where x is output relative to FE, r0 the real rate that would clear the goods market at FE, g a fiscal push.
 * LM: r = 1 + 0.1 x - 0.08 m, where m is the percent rise in the money supply; it bends flat at the floor.
 * The floor is zero: the nominal rate cannot go below zero, and expected inflation is taken as zero.
 */
export const TRAP = { isSlope: 0.3, lmSlope: 0.1, lmBase: 1, lmMoney: 0.08, floor: 0 } as const;

export type Trap = { x: number; r: number; atFloor: boolean; xFree: number; rFree: number };

export function trap(r0: number, m: number, g: number): Trap {
  const { isSlope: a, lmSlope: b, lmBase, lmMoney, floor } = TRAP;
  // intersection of IS and the sloping part of LM
  const xFree = (r0 + a * g - lmBase + lmMoney * m) / (a + b);
  const rFree = r0 - a * (xFree - g);
  const atFloor = rFree < floor;
  if (!atFloor) return { x: xFree, r: rFree, atFloor, xFree, rFree };
  return { x: g + (r0 - floor) / a, r: floor, atFloor, xFree, rFree };
}

export const isLine = (r0: number, g: number, x: number) => r0 - TRAP.isSlope * (x - g);
export const lmLine = (m: number, x: number) => Math.max(TRAP.floor, TRAP.lmBase + TRAP.lmSlope * x - TRAP.lmMoney * m);

/** The economy after a demand shock of size `wealthFall`, with a one-off fiscal stimulus dG at the moment of the shock. */
export function stimulusRun(wealthFall: number, dG: number, phi = 0.3, steps = 40, fromSlack = true): Frame[] {
  const apply = (p: Params): Params => {
    const q = fromSlack ? { ...p, W: p.W - wealthFall } : p;
    return { ...q, G: q.G + dG };
  };
  return simulate({ ...economy, phi }, apply, steps).frames;
}

/** Textbook spending rounds: each round, a share c of the last round's income is spent. */
export const multiplierSimple = (c: number) => 1 / (1 - c);
export const roundsOf = (c: number, n: number) => Array.from({ length: n }, (_, i) => Math.pow(c, i));

/** Short-run change in output per unit of fiscal change in the toy economy, with the interest rate free to respond. */
export function modelMultiplier(kind: "spending" | "tax-cut") {
  const id = kind === "spending" ? "gov-spending-up" : "taxes-down";
  const s = simulate(economy, shockById(id)!.apply, 2);
  const size = 10;
  return (s.impact.Y - s.baseline.Y) / size;
}
