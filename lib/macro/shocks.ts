import type { Params, Regime } from "./model";

export type Curve = "IS" | "LM" | "FE";
export type Dir = "right" | "left";

export type Shock = {
  id: string;
  label: string;
  /** The curve this shock moves (the group it is listed under). */
  group: Curve | "foreign";
  /** Curve moved and the way it moves; "foreign" rows move the world-rate line. */
  curve: Curve;
  dir: Dir;
  /** A second curve the same driver also moves, if any. */
  also?: { curve: Curve; dir: Dir };
  /** The driver this row belongs to (one driver, two directions). */
  driver: string;
  regimes: Regime[];
  blurb: string;
  /** True for the eight worked shocks used in the lessons. */
  worked?: boolean;
  apply: (p: Params) => Params;
};

type Driver = {
  id: string;
  curve: Curve;
  /** Which way the curve moves when the driver rises. */
  upDir: Dir;
  also?: { curve: Curve; upDir: Dir };
  up: string;
  down: string;
  why: string;
  /** Change the driver by `s` (+1 or -1) times its standard size. */
  step: (p: Params, s: 1 | -1) => Params;
};

const flip = (d: Dir): Dir => (d === "right" ? "left" : "right");

/** The shift table: every driver the course names, with the curve it moves. */
export const drivers: Driver[] = [
  // ---- IS: desired saving or desired investment changes at every interest rate
  { id: "gov-spending", curve: "IS", upDir: "right", up: "Government spending rises", down: "Government spending falls",
    why: "Government saving falls (rises), so total desired saving is lower (higher) at each rate.",
    step: (p, s) => ({ ...p, G: p.G + 10 * s }) },
  { id: "taxes", curve: "IS", upDir: "left", up: "Taxes rise", down: "Taxes fall",
    why: "Households and government together save more (less) at each rate, because the government's saving rises by more than households cut theirs.",
    step: (p, s) => ({ ...p, T: p.T + 10 * s }) },
  { id: "future-income", curve: "IS", upDir: "right", up: "Households expect higher future income", down: "Households expect lower future income",
    why: "People who expect to be richer later save less (more) today.",
    step: (p, s) => ({ ...p, Yf: p.Yf + 10 * s }) },
  { id: "wealth", curve: "IS", upDir: "right", also: { curve: "LM", upDir: "left" }, up: "Wealth rises", down: "Wealth falls",
    why: "Wealthier households save less (more) out of income; they also want to hold more (less) money, which moves LM the other way.",
    step: (p, s) => ({ ...p, W: p.W + 30 * s }) },
  { id: "investment-outlook", curve: "IS", upDir: "right", up: "Firms expect a higher return on capital", down: "Firms expect a lower return on capital",
    why: "A higher expected future marginal product of capital raises (lowers) desired investment at each rate.",
    step: (p, s) => ({ ...p, mpkF: p.mpkF + 2 * s }) },
  { id: "depreciation", curve: "IS", upDir: "left", up: "Capital wears out faster", down: "Capital wears out more slowly",
    why: "Faster depreciation lowers the net return on capital, so desired investment falls (rises).",
    step: (p, s) => ({ ...p, delta: p.delta + 1 * s }) },
  { id: "investment-tax", curve: "IS", upDir: "left", up: "Tax on investment rises", down: "Tax on investment falls",
    why: "A higher tax on investment lowers the after-tax return, so desired investment falls (rises).",
    step: (p, s) => ({ ...p, tauI: p.tauI + 5 * s }) },
  // ---- LM: money supply or money demand changes at every output and rate
  { id: "money-supply", curve: "LM", upDir: "right", up: "Central bank expands the money supply", down: "Central bank tightens the money supply",
    why: "More (less) money chasing the same demand pushes the rate down (up) at every output.",
    step: (p, s) => ({ ...p, M: p.M * (s > 0 ? 1.1 : 0.9) }) },
  { id: "expected-inflation", curve: "LM", upDir: "right", up: "Expected inflation rises", down: "Expected inflation falls",
    why: "The nominal rate is the real rate plus expected inflation, so at any real rate money costs more to hold and people want less of it.",
    step: (p, s) => ({ ...p, piE: p.piE + 2 * s }) },
  { id: "alt-risk", curve: "LM", upDir: "left", up: "Alternative assets become riskier", down: "Alternative assets become safer",
    why: "Riskier substitutes push people toward money, raising money demand.",
    step: (p, s) => ({ ...p, risk: p.risk + 0.5 * s }) },
  { id: "alt-liquidity", curve: "LM", upDir: "right", up: "Alternative assets become more liquid", down: "Alternative assets become less liquid",
    why: "Substitutes that are easy to sell reduce the need to hold money.",
    step: (p, s) => ({ ...p, liq: p.liq + 0.5 * s }) },
  { id: "payment-tech", curve: "LM", upDir: "right", up: "Payment technology improves", down: "Payment technology worsens",
    why: "Cards and electronic payment let people manage with less money.",
    step: (p, s) => ({ ...p, tech: p.tech + 0.5 * s }) },
  // ---- FE: full-employment output changes
  { id: "productivity", curve: "FE", upDir: "right", up: "Productivity rises", down: "Oil price rises (adverse supply shock)",
    why: "Higher total factor productivity raises output per worker and the wage that labour demand supports; an oil-price shock acts like a fall in it.",
    step: (p, s) => ({ ...p, A: p.A * (s > 0 ? 1.05 : 0.95) }) },
  { id: "capital", curve: "FE", upDir: "right", up: "The capital stock grows", down: "The capital stock shrinks",
    why: "More capital raises labour's marginal product and so output at any employment.",
    step: (p, s) => ({ ...p, K: p.K * (s > 0 ? 1.05 : 0.95) }) },
  { id: "labour-supply", curve: "FE", upDir: "right", up: "Labour supply rises", down: "Labour supply falls",
    why: "More people willing to work at each wage raises full-employment employment.",
    step: (p, s) => ({ ...p, Ns0: p.Ns0 * (s > 0 ? 1.05 : 0.95) }) },
  { id: "labour-tax", curve: "FE", upDir: "left", up: "Labour tax rises", down: "Labour tax falls",
    why: "A higher tax lowers the after-tax wage, so fewer people work and full-employment output falls.",
    step: (p, s) => ({ ...p, tauL: p.tauL + 0.1 * s }) },
];

const all: Regime[] = ["closed", "floating", "fixed"];

/** The eight worked shocks the lessons play through in the short and the long run. */
export const workedShockIds = [
  "money-supply-up",
  "gov-spending-up",
  "taxes-up",
  "productivity-down", // oil-price rise
  "wealth-up",
  "expected-inflation-up",
  "investment-outlook-up",
  "labour-tax-up",
] as const;

/** Every row of the shift table, each in both directions, tagged with the curve it moves. */
export const shiftTable: Shock[] = drivers.flatMap((d) =>
  ([1, -1] as const).map((s): Shock => {
    const dir = s > 0 ? d.upDir : flip(d.upDir);
    const id = `${d.id}-${s > 0 ? "up" : "down"}`;
    return {
      id,
      label: s > 0 ? d.up : d.down,
      group: d.curve,
      curve: d.curve,
      dir,
      also: d.also ? { curve: d.also.curve, dir: s > 0 ? d.also.upDir : flip(d.also.upDir) } : undefined,
      driver: d.id,
      regimes: all,
      blurb: `${d.curve} shifts ${dir}. ${d.why}`,
      worked: (workedShockIds as readonly string[]).includes(id),
      apply: (p) => d.step(p, s),
    };
  }),
);

/** Extras for the small-country open economy (replaced when the open economy is rebuilt). */
const foreign: Shock[] = [
  { id: "world-rate-up", label: "World interest rate rises", group: "foreign", curve: "IS", dir: "left", driver: "world-rate",
    regimes: ["floating", "fixed"], blurb: "r* up by 1 point; capital is pulled abroad.", apply: (p) => ({ ...p, rw: p.rw + 1 }) },
  { id: "foreign-demand", label: "Foreign demand for our goods rises", group: "foreign", curve: "IS", dir: "right", driver: "foreign-demand",
    regimes: ["floating", "fixed"], blurb: "Autonomous net exports up 6; IS shifts right.", apply: (p) => ({ ...p, x0: p.x0 + 6 }) },
];

export const shocks: Shock[] = [...shiftTable, ...foreign];

export const shockById = (id: string) => shocks.find((s) => s.id === id);
export const shocksFor = (regime: Regime) => shocks.filter((s) => s.regimes.includes(regime));
export const workedShocks = () => workedShockIds.map((id) => shockById(id)!);
