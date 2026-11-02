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
import { drivers, shockById, type Curve, type Dir } from "./shocks";
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
  /** What moves, in a few words (shown under the label). */
  detail: string;
  /** Range of the slider (0 = no change). */
  min: number;
  max: number;
  step: number;
  unit: string;
  /** Shift-table driver this cause is an example of, and whether the cause going up is the driver going up (+1) or down (-1). */
  driver: string;
  sign: 1 | -1;
  /** The cause-and-effect line when the cause rises, and when it falls. */
  chain: { up: string; down: string };
  needsOpen?: boolean;
  /** Acts through the exchange rate itself, so the parent slider (a schedule at the old rate) does not move. */
  viaRate?: boolean;
  apply: (p: Params, x: number) => Params;
};

const R = { min: -50, max: 50, step: 1, unit: "index" } as const;

/** Every real-world cause, each acting on one model variable. Positive = the named thing rises. */
export const causes: Cause[] = [
  // ---- IS: investment side
  { id: "businessConfidence", parent: "investment", label: "Business confidence and expected profits", detail: "Future marginal product of capital", ...R,
    driver: "investment-outlook", sign: 1,
    chain: { up: "business confidence rises -> expected future MPK rises -> desired investment rises -> IS right", down: "business confidence falls -> expected future MPK falls -> desired investment falls -> IS left" },
    apply: (p, x) => ({ ...p, mpkF: p.mpkF + 0.1 * x }) },
  { id: "foreignDemand", parent: "investment", label: "Foreign demand for our goods", detail: "Net exports (NX)", ...R, needsOpen: true,
    driver: "foreign-demand", sign: 1,
    chain: { up: "foreign demand rises -> NX rises -> S - NX falls, like an investment boom -> IS right (a floating currency then appreciates and pulls it back)", down: "foreign demand falls -> NX falls -> IS left (a floating currency then depreciates and pulls it back)" },
    apply: (p, x) => ({ ...p, x0: p.x0 + 0.2 * x }) },
  { id: "exchangeRate", parent: "investment", label: "Exchange rate: demand for our currency", detail: "Expected-devaluation premium", ...R, needsOpen: true, viaRate: true,
    driver: "foreign-demand", sign: -1,
    chain: { up: "currency strengthens -> real exchange rate rises -> NX falls -> IS left", down: "currency weakens -> real exchange rate falls -> NX rises -> IS right" },
    apply: (p, x) => ({ ...p, prem: p.prem - 0.04 * x }) },
  // ---- IS: saving side
  { id: "consumerConfidence", parent: "saving", label: "Consumer confidence and expected income", detail: "Expected future income (Yf)", ...R,
    driver: "future-income", sign: 1,
    chain: { up: "consumers expect higher income -> future Y rises -> saving falls -> IS right", down: "consumers expect lower income -> future Y falls -> saving rises -> IS left" },
    apply: (p, x) => ({ ...p, Yf: p.Yf + 0.5 * x }) },
  { id: "assetPrices", parent: "saving", also: "moneyDemand", label: "House and stock prices", detail: "Wealth (W)", ...R,
    driver: "wealth", sign: 1,
    chain: { up: "house prices rise -> wealth rises -> saving falls -> IS right (and money demand rises -> LM left)", down: "house prices fall -> wealth falls -> saving rises -> IS left (and money demand falls -> LM right)" },
    apply: (p, x) => ({ ...p, W: p.W + x }) },
  { id: "govSpending", parent: "saving", label: "Government spending", detail: "Government purchases (G)", ...R,
    driver: "gov-spending", sign: 1,
    chain: { up: "government spending rises -> government saving falls -> total saving falls -> IS right", down: "government spending falls -> government saving rises -> IS left" },
    apply: (p, x) => ({ ...p, G: p.G + 0.2 * x }) },
  { id: "taxes", parent: "saving", label: "Taxes", detail: "Taxes (T)", ...R,
    driver: "taxes", sign: 1,
    chain: { up: "taxes rise -> government saving rises by more than households cut theirs -> saving rises -> IS left", down: "taxes fall -> government saving falls -> saving falls -> IS right" },
    apply: (p, x) => ({ ...p, T: p.T + 0.2 * x }) },
  // ---- LM
  { id: "centralBank", parent: "moneySupply", label: "Central bank policy", detail: "Money stock M", ...R,
    driver: "money-supply", sign: 1,
    chain: { up: "the central bank eases -> money supply rises -> LM right", down: "the central bank tightens -> money supply falls -> LM left" },
    apply: (p, x) => setM(p, p.M * (1 + IDX_M * x)) },
  { id: "inflationExpectations", parent: "moneyDemand", label: "Inflation expectations", detail: "Expected inflation", ...R,
    driver: "expected-inflation", sign: 1,
    chain: { up: "expected inflation rises -> holding money costs more -> money demand falls -> LM right", down: "expected inflation falls -> money demand rises -> LM left" },
    apply: (p, x) => ({ ...p, piE: p.piE + 0.08 * x }) },
  { id: "financialStress", parent: "moneyDemand", label: "Financial stress", detail: "Riskiness of other assets", ...R,
    driver: "alt-risk", sign: 1,
    chain: { up: "financial stress rises -> other assets look riskier -> money demand rises -> LM left", down: "financial stress eases -> other assets look safer -> money demand falls -> LM right" },
    apply: (p, x) => ({ ...p, risk: p.risk + 0.02 * x }) },
  { id: "paymentTech", parent: "moneyDemand", label: "New payment technology", detail: "Payment technology", ...R,
    driver: "payment-tech", sign: 1,
    chain: { up: "payments get easier -> people need less money -> money demand falls -> LM right", down: "payment technology worsens -> money demand rises -> LM left" },
    apply: (p, x) => ({ ...p, tech: p.tech + 0.02 * x }) },
  { id: "liquidity", parent: "moneyDemand", label: "Liquidity of other assets", detail: "Liquidity of alternatives", ...R,
    driver: "alt-liquidity", sign: 1,
    chain: { up: "other assets become easier to sell -> money demand falls -> LM right", down: "other assets become harder to sell -> money demand rises -> LM left" },
    apply: (p, x) => ({ ...p, liq: p.liq + 0.02 * x }) },
  // ---- FE
  { id: "technology", parent: "fullEmployment", label: "Productivity and technology", detail: "Productivity (A)", ...R,
    driver: "productivity", sign: 1,
    chain: { up: "technology improves -> productivity A rises -> labour demand and output rise -> FE right", down: "productivity falls -> A falls -> labour demand and output fall -> FE left" },
    apply: (p, x) => ({ ...p, A: p.A * (1 + 0.002 * x) }) },
  { id: "oilPrice", parent: "fullEmployment", label: "Energy and oil prices", detail: "Productivity (A)", ...R,
    driver: "productivity", sign: -1,
    chain: { up: "oil prices rise -> production costs rise, A falls -> labour demand and output fall -> FE left", down: "oil prices fall -> A rises -> FE right" },
    apply: (p, x) => ({ ...p, A: p.A * (1 - 0.002 * x) }) },
  { id: "capital", parent: "fullEmployment", label: "Capital stock (growth, war or disaster)", detail: "Capital stock K", ...R,
    driver: "capital", sign: 1,
    chain: { up: "capital accumulates -> K rises -> labour's marginal product rises -> FE right", down: "war or disaster destroys capital -> K falls -> labour's marginal product falls -> FE left" },
    apply: (p, x) => ({ ...p, K: p.K * (1 + 0.004 * x) }) },
  { id: "participation", parent: "fullEmployment", label: "Labour-force participation", detail: "Labour supply", ...R,
    driver: "labour-supply", sign: 1,
    chain: { up: "more people seek work -> labour supply rises -> employment rises -> FE right", down: "fewer people seek work -> labour supply falls -> FE left" },
    apply: (p, x) => ({ ...p, Ns0: p.Ns0 * (1 + 0.0025 * x) }) },
  { id: "immigration", parent: "fullEmployment", label: "Immigration", detail: "Labour supply", ...R,
    driver: "labour-supply", sign: 1,
    chain: { up: "immigration rises -> labour supply rises -> employment rises -> FE right", down: "immigration falls -> labour supply falls -> FE left" },
    apply: (p, x) => ({ ...p, Ns0: p.Ns0 * (1 + 0.005 * x) }) },
  { id: "labourTax", parent: "fullEmployment", label: "Labour taxes", detail: "Labour tax rate", ...R,
    driver: "labour-tax", sign: 1,
    chain: { up: "labour taxes rise -> after-tax wage falls -> labour supply falls -> FE left", down: "labour taxes fall -> after-tax wage rises -> labour supply rises -> FE right" },
    apply: (p, x) => ({ ...p, tauL: p.tauL + 0.002 * x }) },
];

/** The shift-table row a cause belongs to: the curve and which way it moves when the driver rises. */
export function driverRow(c: Cause): { curve: Curve; upDir: Dir } {
  const d = drivers.find((q) => q.id === c.driver);
  if (d) return { curve: d.curve, upDir: d.upDir };
  const s = shockById(c.driver) ?? shockById(`${c.driver}-up`);
  if (!s) throw new Error(`no shift-table row for ${c.driver}`);
  return { curve: s.curve, upDir: s.dir };
}

/** The curve a cause moves and the way, from the shift table (the driver's up-direction, flipped when the cause lowers it). */
export function shiftOf(c: Cause, x: number): { curve: Curve; dir: Dir } | null {
  if (x === 0) return null;
  const d = driverRow(c);
  const up = x * c.sign > 0;
  const flip = (r: Dir): Dir => (r === "right" ? "left" : "right");
  return { curve: d.curve, dir: up ? d.upDir : flip(d.upDir) };
}

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

/** Price-adjustment speed phi: sticky (0.1) to flexible (0.9); the middle, 0.5, is the lessons' speed. */
export const phiFor = (speed: number) => 0.1 + 0.8 * (Math.min(100, Math.max(0, speed)) / 100);

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
