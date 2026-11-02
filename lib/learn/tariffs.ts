/**
 * The 2025 tariffs exercise: a tariff as three shocks at once, run on three economies.
 * Sizes are teaching assumptions chosen to reflect each economy's exposure, not estimates.
 * All values are index units from the toy model.
 */
import { baselineEconomy, simulate, type Params, type Regime, type Simulation } from "../macro/model";
import { direction, type Direction } from "../macro/predict";

export type EconId = "us" | "ea" | "cn";
export type Kind = "supply" | "demand" | "uncertainty" | "all";

export type Econ = {
  id: EconId;
  name: string;
  bank: string;
  regime: Regime;
  /** Share of TFP lost to costlier inputs (supply shock), as a multiplier on A. */
  inputs: number;
  /** Points of partner (retaliation / export-market) tariff on our goods. */
  tariffP: number;
  /** Fall in expected future income (loss of confidence), index points. */
  confidence: number;
  /** Fall in the expected return on capital (investment waits), percentage points. */
  wait: number;
  /** What the central bank's move is in the model, if it eases. */
  easing: string;
  blurb: string;
};

export const econs: Econ[] = [
  { id: "us", name: "United States", bank: "the Fed", regime: "floating", inputs: 0.97, tariffP: 3, confidence: 6, wait: 1,
    easing: "Money supply +3%", blurb: "Imposes the tariffs. Inputs get dearer; retaliation and doubt cut demand." },
  { id: "ea", name: "Euro area", bank: "the ECB", regime: "floating", inputs: 0.995, tariffP: 3, confidence: 4, wait: 1,
    easing: "Money supply +3%", blurb: "Faces the tariffs. Little input shock; export demand and confidence weaken." },
  { id: "cn", name: "China", bank: "the People's Bank", regime: "fixed", inputs: 0.99, tariffP: 3, confidence: 6, wait: 2,
    easing: "Money supply +3% and a 3% cheaper currency", blurb: "Faces the heaviest tariffs, with a tightly managed rate (modelled as a peg)." },
];

export const mobility = 0.5;

const supplyOf = (e: Econ) => (p: Params): Params => ({ ...p, A: p.A * e.inputs });
const demandOf = (e: Econ) => (p: Params): Params => ({ ...p, tariffP: p.tariffP + e.tariffP, Yf: p.Yf - e.confidence });
const waitOf = (e: Econ) => (p: Params): Params => ({ ...p, mpkF: p.mpkF - e.wait });

/** The shock for one kind; "all" applies the three together. */
export function shockFn(e: Econ, kind: Kind): (p: Params) => Params {
  const s = supplyOf(e), d = demandOf(e), w = waitOf(e);
  if (kind === "supply") return s;
  if (kind === "demand") return d;
  if (kind === "uncertainty") return w;
  return (p) => w(d(s(p)));
}

/** Add the central bank's easing on top of the shock (used for the "what could it do" replay). */
export function withEasing(e: Econ, f: (p: Params) => Params): (p: Params) => Params {
  return (p) => {
    const q = f(p);
    const eased = { ...q, M: q.M * 1.03, D: q.D + 0.03 * p.M };
    return e.id === "cn" ? { ...eased, E0: eased.E0 * 0.97 } : eased;
  };
}

export const simulateTariff = (e: Econ, kind: Kind, eased = false, steps = 120): Simulation => {
  const f = eased ? withEasing(e, shockFn(e, kind)) : shockFn(e, kind);
  return simulate(baselineEconomy(e.regime, mobility), f, steps);
};

export type Policy = "cut" | "hold" | "raise";
export type Answers = { Y: Direction; r: Direction; P: Direction; policy: Policy; pressure: number; dY: number };

/**
 * A teaching rule for the policy call, built from the model's own results (not from the course):
 * price pressure is the long-run change in P, output change is Y at impact against the start.
 * Pressure above 3% and output not collapsing: do not ease (hold; raise if output is not falling).
 * Small price pressure with output falling: cut. Otherwise hold.
 */
export function answers(sim: Simulation): Answers {
  const a = sim.baseline, b = sim.impact, c = sim.longRun;
  const pressure = c.P / a.P - 1;
  const dY = b.Y / a.Y - 1;
  let policy: Policy = "hold";
  if (pressure > 0.03) policy = dY < -0.001 ? "hold" : "raise";
  else if (dY < -0.001) policy = "cut";
  return { Y: direction(a.Y, b.Y, 0.001), r: direction(a.r, b.r, 0.001), P: direction(a.P, c.P, 0.01), policy, pressure, dY };
}

export type RecordRow = { id: EconId; happened: string; sources: string };

/**
 * What happened in 2025, from memory, approximate. Only things the author is confident of are stated;
 * the rest is marked to be filled from public reporting, with a slot for links the person adds.
 */
export const record: RecordRow[] = [
  { id: "us", sources: "To be filled from public reporting (links to be added).",
    happened: "The Fed held its policy rate steady through the first half of 2025, with officials pointing to the risk that tariffs would push inflation up while the job market cooled, and began cutting in the autumn. US consumer inflation was about 2.3 percent in spring and rose toward 3 percent by early autumn. The dollar fell by about a tenth in the first half of the year, which the toy model's float does not predict." },
  { id: "ea", sources: "To be filled from public reporting (links to be added).",
    happened: "The ECB cut its deposit rate in April and June 2025, to 2.0 percent, then paused. Euro-area inflation was near 2 percent. The euro rose sharply against the dollar in the first half of the year." },
  { id: "cn", sources: "To be filled from public reporting (links to be added).",
    happened: "In May 2025 the People's Bank cut its short-term policy rate and the reserve requirement ratio, and the yuan drifted a little weaker and then steadier against the dollar. Exports to the US fell sharply while sales to other markets grew. Consumer prices were close to flat." },
];

export const beyond = "Anything after 2025 (further tariff changes, court rulings on their legal basis, later rate decisions and outcomes) is beyond what the author can state with confidence: to be filled from public reporting, with links the person can add.";
