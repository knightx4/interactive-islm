/**
 * The Workbench's scenario chips. Each is a few real causes at a level from -3 to +3 in half steps
 * (the level scale of the cause sliders); a level maps onto the model's own cause units, so no
 * model number changes.
 */
import { baselineState, causeById, setCause, type SimState } from "./sim";

/** One level step (1.0) is this many cause-slider index points: the cause range of 50 spans levels -3..+3. */
export const INDEX_PER_LEVEL = 50 / 3;
export const MAX_LEVEL = 3;
export const levelToIndex = (level: number) => level * INDEX_PER_LEVEL;
/** Level of a cause value, rounded to the nearest half step. */
export const indexToLevel = (x: number) => Math.round((x / INDEX_PER_LEVEL) * 2) / 2;

export type Scenario = { id: string; name: string; levels: Record<string, number> };

export const scenarios: Scenario[] = [
  { id: "oil-1970s", name: "1970s oil shock", levels: { oilPrice: 2 } },
  { id: "wealth-2008", name: "2008 wealth shock", levels: { assetPrices: -3, financialStress: 2, businessConfidence: -1 } },
  { id: "stimulus-2021", name: "2021 stimulus", levels: { govSpending: 2, centralBank: 2 } },
  { id: "tariffs-2025", name: "2025 tariffs", levels: { tariffsOnUs: 2, businessConfidence: -1, oilPrice: 1 } },
];

export const scenarioById = (id: string) => scenarios.find((s) => s.id === id);

/** The simulator state for a scenario, from the baseline (price speed is kept), at point A. */
export function stateForScenario(sc: Scenario, speed: number): SimState {
  let st: SimState = { ...baselineState(), speed };
  for (const [id, level] of Object.entries(sc.levels)) {
    if (causeById(id)) st = setCause(st, id, levelToIndex(level));
  }
  return { ...st, t: 0 };
}
