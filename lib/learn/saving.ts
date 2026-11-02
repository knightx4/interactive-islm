/** Arithmetic behind the saving, investment and IS lesson. Index units, not data. */
import { baselineEconomy, desiredInvestment, desiredSaving, isR, type Params } from "../macro/model";
import { drivers } from "../macro/shocks";

/** Consumption smoothing over n years with no interest: spend an equal share of lifetime resources. */
export function smooth(income: number[], wealth: number) {
  const n = income.length;
  const c = (wealth + income.reduce((a, b) => a + b, 0)) / n;
  return { c, saving: income.map((y) => y - c) };
}

/** Blend two parameter sets (every numeric field), so a shift can be animated from 0 to 1. */
export function lerpParams(a: Params, b: Params, t: number): Params {
  const out = { ...a } as Record<string, unknown>;
  for (const [k, v] of Object.entries(b)) {
    const w = (a as Record<string, unknown>)[k];
    if (typeof v === "number" && typeof w === "number") out[k] = w + (v - w) * t;
  }
  return out as Params;
}

export type IsDriver = { id: string; label: string; sign: 1 | -1 };
/** The IS drivers played in the lesson, by the id of the driver in the shift table. */
export const isDriverIds = ["investment-outlook", "future-income", "wealth", "gov-spending", "taxes"] as const;
export const driverStep = (id: string, sign: 1 | -1, p: Params) => drivers.find((d) => d.id === id)!.step(p, sign);

/**
 * A tax cut of `cut` when households save a share `f` of each extra dollar of disposable income.
 * Public saving falls by `cut`; private saving rises by f × cut; total saving changes by -(1 - f) × cut.
 * The IS curve then moves right in Y by (1 - f) × cut / sY (at a fixed interest rate).
 */
export function taxCut(cut: number, f: number, sY: number) {
  const dS = -(1 - f) * cut;
  return { dS, dY: -dS / sY };
}

export const base = baselineEconomy("closed");
export { desiredInvestment, desiredSaving, isR };
