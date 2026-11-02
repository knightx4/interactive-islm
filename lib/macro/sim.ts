/**
 * The simulator's state and how it maps onto the Learn model (lib/macro/model.ts).
 *
 * Top level: five market sliders, grouped by curve (index units, 50 = baseline).
 *   IS  investment, saving      LM  money supply, money demand      FE  full employment
 * Underneath each: causes, each a change to one model variable. A parent slider always shows
 * the model's own value for its market (read back from the Params), so moving a cause moves
 * the parent; moving the parent adds a direct offset on top of the causes.
 */
import {
  baselineEconomy, investmentConst, moneyDemandConst, netExports, savingConst, simulate, Ystar,
  type Frame, type Params, type Regime, type Simulation,
} from "./model";
import type { View } from "./view";

export type Group = "IS" | "LM" | "FE";
export type ParentId = "investment" | "saving" | "moneySupply" | "moneyDemand" | "fullEmployment";

export type Parent = {
  id: ParentId;
  group: Group;
  label: string;
  symbol: string;
  /** Which way the curve moves when the slider goes up. */
  upDir: "right" | "left";
  /** One line: what the slider is in the model. */
  means: string;
};

export const parents: Parent[] = [
  { id: "investment", group: "IS", label: "Investment", symbol: "I", upDir: "right", means: "Desired investment (plus net exports when open) at each interest rate." },
  { id: "saving", group: "IS", label: "Saving", symbol: "S", upDir: "left", means: "Desired saving at each interest rate, including government saving." },
  { id: "moneySupply", group: "LM", label: "Money supply", symbol: "M/P", upDir: "right", means: "The nominal money stock M, before prices adjust." },
  { id: "moneyDemand", group: "LM", label: "Money demand", symbol: "L", upDir: "left", means: "How much money people want to hold at each output and rate." },
  { id: "fullEmployment", group: "FE", label: "Full employment", symbol: "Y*", upDir: "right", means: "Output when the labour market clears." },
];

export const parentById = (id: ParentId) => parents.find((p) => p.id === id)!;

/* ------------------------------ units ------------------------------ */

const IDX_I = 0.2; // one index point of investment, saving or money demand = 0.2 model units
const IDX_M = 1 / 125; // one index point of money supply = 0.8% of M
const clampIdx = (x: number) => Math.min(100, Math.max(0, x));
export { clampIdx };

/** M and the central bank's credit move together, so a peg's reserves stay as they were. */
const setM = (p: Params, M: number): Params => ({ ...p, D: p.D + (M - p.M), M });

/* ------------------------------ causes ------------------------------ */

export type Cause = {
  id: string;
  parent: ParentId;
  /** A second market the same cause also moves (wealth moves saving and money demand). */
  also?: ParentId;
  label: string;
  /** Range of the slider (0 = no change). */
  min: number;
  max: number;
  step: number;
  unit: string;
  /** Shift-table driver this cause is an example of, and whether the cause going up is the driver going up (+1) or down (-1). */
  driver: string;
  sign: 1 | -1;
  needsOpen?: boolean;
  apply: (p: Params, x: number) => Params;
};

export const causes: Cause[] = [
  { id: "futureMPK", parent: "investment", label: "Future marginal product of capital", min: -50, max: 50, step: 1, unit: "index", driver: "investment-outlook", sign: 1,
    apply: (p, x) => ({ ...p, mpkF: p.mpkF + 0.1 * x }) },
  { id: "netExports", parent: "investment", label: "Net exports (NX)", min: -50, max: 50, step: 1, unit: "index", driver: "foreign-demand", sign: 1, needsOpen: true,
    apply: (p, x) => ({ ...p, x0: p.x0 + 0.2 * x }) },
  { id: "futureY", parent: "saving", label: "Expected future income", min: -50, max: 50, step: 1, unit: "index", driver: "future-income", sign: 1,
    apply: (p, x) => ({ ...p, Yf: p.Yf + 0.5 * x }) },
  { id: "wealth", parent: "saving", also: "moneyDemand", label: "Wealth", min: -50, max: 50, step: 1, unit: "index", driver: "wealth", sign: 1,
    apply: (p, x) => ({ ...p, W: p.W + x }) },
  { id: "govSaving", parent: "saving", label: "Government saving (T - G)", min: -50, max: 50, step: 1, unit: "index", driver: "gov-spending", sign: -1,
    apply: (p, x) => ({ ...p, G: p.G - 0.1 * x }) },
  { id: "centralBank", parent: "moneySupply", label: "Central bank money stock", min: -50, max: 50, step: 1, unit: "index", driver: "money-supply", sign: 1,
    apply: (p, x) => setM(p, p.M * (1 + IDX_M * x)) },
  { id: "priceLevel", parent: "moneySupply", label: "Price level", min: -50, max: 50, step: 1, unit: "index", driver: "money-supply", sign: -1,
    apply: (p, x) => setM(p, p.M / (1 + x / 100)) },
  { id: "riskiness", parent: "moneyDemand", label: "Riskiness of other assets", min: -50, max: 50, step: 1, unit: "index", driver: "alt-risk", sign: 1,
    apply: (p, x) => ({ ...p, risk: p.risk + 0.02 * x }) },
  { id: "liquidity", parent: "moneyDemand", label: "Liquidity of other assets", min: -50, max: 50, step: 1, unit: "index", driver: "alt-liquidity", sign: 1,
    apply: (p, x) => ({ ...p, liq: p.liq + 0.02 * x }) },
  { id: "expectedInflation", parent: "moneyDemand", label: "Expected inflation", min: -50, max: 50, step: 1, unit: "index", driver: "expected-inflation", sign: 1,
    apply: (p, x) => ({ ...p, piE: p.piE + 0.08 * x }) },
  { id: "productivity", parent: "fullEmployment", label: "Productivity", min: -50, max: 50, step: 1, unit: "index", driver: "productivity", sign: 1,
    apply: (p, x) => ({ ...p, A: p.A * (1 + 0.002 * x) }) },
  { id: "capital", parent: "fullEmployment", label: "Capital stock", min: -50, max: 50, step: 1, unit: "index", driver: "capital", sign: 1,
    apply: (p, x) => ({ ...p, K: p.K * (1 + 0.004 * x) }) },
  { id: "labour", parent: "fullEmployment", label: "Labour supply", min: -50, max: 50, step: 1, unit: "index", driver: "labour-supply", sign: 1,
    apply: (p, x) => ({ ...p, Ns0: p.Ns0 * (1 + 0.004 * x) }) },
];

export const causeById = (id: string) => causes.find((c) => c.id === id);
export const causesOf = (parent: ParentId) => causes.filter((c) => c.parent === parent);

/* ------------------------------ state ------------------------------ */

export type SimState = {
  /** Direct offset of each parent slider, in index points, on top of its causes. */
  offsets: Record<ParentId, number>;
  /** Cause values (0 = no change). */
  causes: Record<string, number>;
  /** Price speed, 0 (sticky) to 100 (flexible). */
  speed: number;
  /** Playback position: 0 = before, 1 = impact, then the price adjustment, last = fully adjusted. */
  t: number;
  /** Run the open economy (floating rate). */
  open: boolean;
};

export const baselineState = (): SimState => ({
  offsets: { investment: 0, saving: 0, moneySupply: 0, moneyDemand: 0, fullEmployment: 0 },
  causes: {},
  speed: 50,
  t: 1,
  open: false,
});

/** Number of price-adjustment periods simulated. */
export const STEPS = 80;
const OPEN_MOBILITY = 0.5;

/** Price-adjustment speed phi: sticky (slow) to flexible (fast). */
export const phiFor = (speed: number) => 0.1 + 0.9 * (Math.min(100, Math.max(0, speed)) / 100);

export function baseFor(s: Pick<SimState, "open" | "speed">): Params {
  const regime: Regime = s.open ? "floating" : "closed";
  return { ...baselineEconomy(regime, s.open ? OPEN_MOBILITY : 1), phi: phiFor(s.speed) };
}

/* Output exponent: Y* is proportional to A^FE_POW, so a change in Y* can be put back into A. */
const fePow = (p: Params) => 1 + ((1 - p.a) * p.eL) / (1 + p.a * p.eL);

/** The parents' own index value for a set of parameters, read back from the model. */
export function parentIndex(id: ParentId, p: Params, base: Params): number {
  switch (id) {
    case "investment": {
      const side = (q: Params) => investmentConst(q) + netExports(q, 0, 1);
      return 50 + (side(p) - side(base)) / IDX_I;
    }
    case "saving": return 50 + (savingConst(p) - savingConst(base)) / IDX_I;
    case "moneySupply": return 50 + (p.M / base.M - 1) / IDX_M;
    case "moneyDemand": {
      // L at a given real rate: expected inflation lowers it (the nominal rate is r + piE)
      const at = (q: Params) => moneyDemandConst(q) - q.h * q.piE;
      return 50 + (at(p) - at(base)) / IDX_I;
    }
    case "fullEmployment": return 50 + (Ystar(p) - Ystar(base));
  }
}

/** Parameters with every cause applied (no direct parent offsets). */
function withCauses(base: Params, st: SimState): Params {
  let p = { ...base };
  for (const c of causes) {
    const x = st.causes[c.id] ?? 0;
    if (x !== 0 && (!c.needsOpen || p.regime !== "closed")) p = c.apply(p, x);
  }
  return p;
}

/** The economy the state describes, from the baseline `base`. */
export function paramsFor(base: Params, st: SimState): Params {
  let p = withCauses(base, st);
  const o = st.offsets;
  if (o.investment) p = { ...p, i0: p.i0 + IDX_I * o.investment };
  if (o.saving) p = { ...p, s0: p.s0 + IDX_I * o.saving };
  if (o.moneyDemand) p = { ...p, L0: p.L0 + IDX_I * o.moneyDemand };
  if (o.moneySupply) p = setM(p, p.M * (1 + IDX_M * o.moneySupply));
  if (o.fullEmployment) {
    const y0 = Ystar(p);
    p = { ...p, A: p.A * Math.pow((y0 + o.fullEmployment) / y0, 1 / fePow(p)) };
  }
  return p;
}

/** The parent slider's value for a state: the model's own number, causes and offset included. */
export function parentValue(id: ParentId, st: SimState): number {
  const base = baseFor(st);
  return parentIndex(id, paramsFor(base, st), base);
}

/** Move a parent slider to `target`: the direct offset absorbs whatever the causes do not explain. */
export function setParent(st: SimState, id: ParentId, target: number): SimState {
  const base = baseFor(st);
  const cur = parentIndex(id, paramsFor(base, st), base);
  const want = clampIdx(target);
  let off = st.offsets[id];
  if (id === "moneySupply") {
    // multiplicative: solve for the offset that lands exactly on the target
    const without = parentIndex(id, paramsFor(base, { ...st, offsets: { ...st.offsets, moneySupply: 0 } }), base);
    const m0 = 1 + IDX_M * (without - 50);
    off = ((1 + IDX_M * (want - 50)) / m0 - 1) / IDX_M;
  } else if (id === "fullEmployment") {
    const without = parentIndex(id, paramsFor(base, { ...st, offsets: { ...st.offsets, fullEmployment: 0 } }), base);
    off = want - without;
  } else {
    off += want - cur;
  }
  return { ...st, offsets: { ...st.offsets, [id]: off }, t: 1 };
}

/** Move a cause; the parent follows because it is read back from the model. */
export function setCause(st: SimState, id: string, x: number): SimState {
  const c = causeById(id);
  if (!c) return st;
  const v = Math.min(c.max, Math.max(c.min, x));
  const next = { ...st, causes: { ...st.causes, [id]: v }, t: 1 };
  return c.needsOpen && v !== 0 && !st.open ? { ...next, open: true } : next;
}

/* ------------------------------ run ------------------------------ */

export type Run = {
  state: SimState;
  base: Params;
  after: Params;
  sim: Simulation;
  /** Number of playback positions: 0 (before), 1 (impact) ... last (fully adjusted). */
  length: number;
};

export function run(st: SimState): Run {
  const base = baseFor(st);
  const after = paramsFor(base, st);
  const sim = simulate(base, () => ({ ...after, phi: base.phi }), STEPS);
  return { state: st, base, after, sim, length: sim.frames.length + 1 };
}

/** The frame at a playback position (the last position is the fully adjusted long run). */
export function frameAt(sim: Simulation, t: number): Frame {
  const last = sim.frames.length - 1;
  if (t <= 0) return sim.baseline;
  if (t > last) return sim.longRun;
  return sim.frames[t];
}

/** The path of (Y, r) through time, from the first move to the last playback position. */
export function path(sim: Simulation, t = Infinity): { x: number; y: number }[] {
  const last = sim.frames.length - 1;
  const pts = sim.frames.slice(1, Math.min(t, last) + 1).map((f) => ({ x: f.Y, y: f.r }));
  if (t > last) pts.push({ x: sim.longRun.Y, y: sim.longRun.r });
  return pts;
}

/** The lab's View for a playback position, so the lesson figures can draw the simulator. */
export function viewAt(sim: Simulation, t: number): View {
  const last = sim.frames.length - 1;
  const tt = Math.min(Math.max(0, Math.round(t)), last + 1);
  const frame = frameAt(sim, tt);
  const params = tt === 0 ? sim.before : tt > last ? sim.final : sim.after;
  return {
    params,
    curveFrame: frame,
    frame,
    showB: tt >= 1,
    showC: tt > last,
    shockArrow: tt >= 1,
    ghosts: tt >= 1,
    lmArrow: tt >= 2,
    t: Math.min(tt, last),
    at: tt === 0 ? "A" : tt === 1 ? "B" : tt > last ? "C" : "moving",
  };
}

/** True when every slider and cause is at its baseline value. */
export function isBaseline(st: SimState): boolean {
  return Object.values(st.offsets).every((v) => v === 0) && Object.values(st.causes).every((v) => v === 0);
}
