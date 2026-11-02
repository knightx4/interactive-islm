/** Arithmetic behind the supply shocks lesson. Index units, not data. */
import { simulate, Ystar, type Frame, type Params, type Simulation } from "../macro/model";
import { economy } from "./fullmodel";
import { shockById } from "../macro/shocks";

const oil = shockById("productivity-down")!.apply;

/** An oil shock followed at once by a change of `pct` percent in the money supply (zero means no policy response). */
export const oilWithPolicy = (pct: number) => (p: Params): Params => {
  const q = oil(p);
  return { ...q, M: q.M * (1 + pct / 100), D: q.D + (pct / 100) * q.M };
};

export type PolicyRun = { sim: Simulation; frames: Frame[]; feAfter: number; gapAtImpact: number; peakPrice: number };

export function policyRun(pct: number, steps = 40): PolicyRun {
  const sim = simulate(economy, oilWithPolicy(pct), steps);
  const feAfter = Ystar(sim.after);
  return { sim, frames: sim.frames, feAfter, gapAtImpact: sim.impact.Y - feAfter, peakPrice: sim.longRun.P };
}

/** A hurricane: it destroys `capitalPct` percent of the capital stock (FE moves left) and cuts wealth by `wealthLoss` (IS moves left, LM right). */
export const hurricane = (capitalPct: number, wealthLoss: number) => (p: Params): Params => ({
  ...p, K: p.K * (1 - capitalPct / 100), W: p.W - wealthLoss,
});

export function hurricaneRun(capitalPct: number, wealthLoss: number) {
  const sim = simulate(economy, hurricane(capitalPct, wealthLoss), 60);
  return {
    sim,
    yImpact: sim.impact.Y, yLong: sim.longRun.Y, fe: Ystar(sim.after),
    pImpact: sim.impact.P, pLong: sim.longRun.P,
    rImpact: sim.impact.r, rLong: sim.longRun.r,
  };
}

/** Approximate US annual CPI inflation (percent) and unemployment rate (percent), from memory. */
export const us1970s: { year: number; inflation: number; unemployment: number }[] = [
  { year: 1970, inflation: 5.7, unemployment: 4.9 }, { year: 1971, inflation: 4.4, unemployment: 5.9 },
  { year: 1972, inflation: 3.2, unemployment: 5.6 }, { year: 1973, inflation: 6.2, unemployment: 4.9 },
  { year: 1974, inflation: 11.0, unemployment: 5.6 }, { year: 1975, inflation: 9.1, unemployment: 8.5 },
  { year: 1976, inflation: 5.8, unemployment: 7.7 }, { year: 1977, inflation: 6.5, unemployment: 7.1 },
  { year: 1978, inflation: 7.6, unemployment: 6.1 }, { year: 1979, inflation: 11.3, unemployment: 5.8 },
  { year: 1980, inflation: 13.5, unemployment: 7.1 }, { year: 1981, inflation: 10.3, unemployment: 7.6 },
  { year: 1982, inflation: 6.2, unemployment: 9.7 }, { year: 1983, inflation: 3.2, unemployment: 9.6 },
];
