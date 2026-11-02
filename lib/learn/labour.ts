/** Arithmetic and data for the labour-market lesson. Model numbers are index units. */
import { baselineEconomy, employmentFE, wageFE, type Params } from "../macro/model";

/** Labour-tax revenue at tax rate t, with labour supply elasticity eL, in index units. */
export function lafferRevenue(t: number, eL: number): number {
  const p: Params = { ...baselineEconomy("closed"), tauL: t, eL };
  // keep the baseline normalisation w0 (set at tauL = 0.2 and eL = 0.5): only the response changes
  return t * wageFE(p) * employmentFE(p);
}
/** The tax rate that maximises revenue, found on a grid. */
export function lafferPeak(eL: number): number {
  let best = 0, arg = 0;
  for (let t = 0; t <= 0.95; t += 0.01) {
    const r = lafferRevenue(t, eL);
    if (r > best) { best = r; arg = t; }
  }
  return arg;
}

/** Okun's law as the lesson states it: output gap (% of FE) = -coef x (u - u_natural). */
export const okunGap = (u: number, un: number, coef: number) => -coef * (u - un);
export const okunUnemployment = (gap: number, un: number, coef: number) => un - gap / coef;

/** Expectations-augmented Phillips curve: inflation = expected inflation - beta (u - u_natural). */
export const phillips = (piE: number, u: number, un: number, beta: number) => piE - beta * (u - un);

/**
 * US civilian unemployment rate (percent), selected months, read from memory.
 * Approximate to a few tenths and not a substitute for the BLS series (LNS14000000).
 * x is year + (month - 1) / 12.
 */
export const usUnemployment: { x: number; u: number; label?: string }[] = [
  [2020, 1, 3.5], [2020, 2, 3.5], [2020, 3, 4.4], [2020, 4, 14.8], [2020, 5, 13.2], [2020, 6, 11.0], [2020, 8, 8.4],
  [2020, 10, 6.8], [2020, 12, 6.7], [2021, 3, 6.1], [2021, 6, 5.9], [2021, 9, 4.7], [2021, 12, 3.9],
  [2022, 3, 3.6], [2022, 7, 3.5], [2022, 12, 3.5], [2023, 4, 3.4], [2023, 8, 3.7], [2023, 12, 3.7],
  [2024, 4, 3.9], [2024, 7, 4.3], [2024, 12, 4.1], [2025, 4, 4.2], [2025, 8, 4.3],
].map(([y, m, u]) => ({ x: y + (m - 1) / 12, u }));
