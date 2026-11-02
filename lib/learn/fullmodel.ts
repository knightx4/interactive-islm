/** Arithmetic behind the full-model lessons (general equilibrium, shocks, recessions). Index units, not data. */
import { baselineEconomy, isR, lmR, moneyDemand, shortRun, simulate, Ystar, type Frame, type Params } from "../macro/model";

export const economy: Params = baselineEconomy("closed");

/** The price-adjustment speeds the slider offers; above about 2 the toy model's price rule overshoots. */
export const SPEED_MIN = 0.05;
export const SPEED_MAX = 2;

/** Frames of a shock played out at price-adjustment speed phi: frames[0] is the old resting point, frames[1] the impact. */
export function pathAt(shock: (p: Params) => Params, phi: number, steps = 40, from: Params = economy): Frame[] {
  return simulate({ ...from, phi }, shock, steps).frames;
}

/** Fully flexible prices: prices jump to their long-run level at once, so output never leaves FE. */
export function instantPath(shock: (p: Params) => Params, steps = 40, from: Params = economy): Frame[] {
  const sim = simulate(from, shock, steps);
  return sim.frames.map((f, t) => (t === 0 ? f : { ...sim.longRun, t }));
}

/** Price of a one-year bond that pays 100 at maturity, when the nominal interest rate is i percent. */
export const bondPrice = (i: number) => 100 / (1 + i / 100);

/** The nominal interest rate: the real rate plus expected inflation. */
export const nominalRate = (p: Params, r: number) => r + p.piE;

/** The short-run point at price level P, for an economy whose spending is shifted by dG. */
export function pointAt(P: number, dG: number) {
  const p: Params = { ...economy, G: economy.G + dG };
  const pt = shortRun(p, P);
  const fe = Ystar(p);
  return { p, Y: pt.Y, r: pt.r, fe, gap: pt.Y - fe, i: nominalRate(p, pt.r) };
}

export type Region = "slack" | "scarcity" | "balance";
/** Where the IS-LM point sits against FE. A band of 0.25 output units counts as on FE. */
export const regionOf = (gap: number): Region => (gap < -0.25 ? "slack" : gap > 0.25 ? "scarcity" : "balance");

/** The price level that puts the IS-LM point on FE when spending is shifted by dG (the long-run price). */
export function longRunPrice(dG: number) {
  const p: Params = { ...economy, G: economy.G + dG };
  const fe = Ystar(p);
  const r = isR(p, fe);
  return p.M / moneyDemand(p, fe, r);
}

/**
 * Money demand along LM. Moving to a different output on a fixed LM raises demand through income
 * and lowers it through the interest rate; the two exactly offset, so total demand stays at M/P.
 */
export function lmPuzzle(Y: number, p: Params = economy) {
  const Y0 = Ystar(p);
  const r0 = lmR(p, Y0, p.M);
  const r = lmR(p, Y, p.M);
  const fromIncome = p.kY * (Y - Y0);
  const fromRate = -p.h * (r - r0);
  return { r, fromIncome, fromRate, total: fromIncome + fromRate, demand: moneyDemand(p, Y, r), supply: p.M };
}
