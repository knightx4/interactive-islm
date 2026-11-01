/**
 * Learn-section economy: IS, LM and FE curves with prices that adjust over time,
 * plus a small open-economy extension (floating or fixed exchange rate).
 *
 * Independent of lib/islmModel.ts (the simulator's model). All numbers are index
 * units, not calibrated to real data.
 *
 * Y = output, r = real interest rate (%), P = price level, q = real exchange rate
 * (higher q = domestic goods dearer abroad), E = nominal exchange rate (foreign
 * currency per unit of domestic currency).
 */

export type Regime = "closed" | "floating" | "fixed";

export type Params = {
  regime: Regime;
  // goods market
  c: number; // marginal propensity to consume
  C0: number; // autonomous consumption
  T: number; // taxes
  I0: number; // autonomous investment
  b: number; // investment sensitivity to r (per percentage point)
  G: number; // government purchases
  // money market
  ky: number; // money demand sensitivity to output
  h: number; // money demand sensitivity to r
  M: number; // nominal money supply (floating/closed)
  // supply side
  z: number; // productivity (output per unit of labor)
  Lstar: number; // full-employment labor
  // price adjustment speed
  phi: number;
  // open economy
  rw: number; // world real interest rate (%)
  m: number; // marginal propensity to import
  x0: number; // autonomous net exports at q = 1 (before the -mY term)
  sigma: number; // net-export sensitivity to q
  E0: number; // pegged nominal exchange rate (fixed regime)
  Pf: number; // foreign price level
};

export type Point = {
  Y: number;
  r: number;
  q: number;
  E: number;
  NX: number;
  Meff: number; // money supply in force (endogenous under a peg)
};

export const Ystar = (p: Params) => p.z * p.Lstar;

/** Slope parameter of IS: 1 - c (+ m when open). */
export const isSlope = (p: Params) => 1 - p.c + (p.regime === "closed" ? 0 : p.m);

/** Autonomous spending at a given q (q ignored when closed). */
export function autonomous(p: Params, q = 1): number {
  const base = p.C0 - p.c * p.T + p.I0 + p.G;
  return p.regime === "closed" ? base : base + p.x0 - p.sigma * (q - 1);
}

/** IS curve: r as a function of Y at exchange rate q. */
export const isR = (p: Params, Y: number, q = 1) => (autonomous(p, q) - isSlope(p) * Y) / p.b;

/** LM curve: r as a function of Y at real money balances mp. */
export const lmR = (p: Params, Y: number, mp: number) => (p.ky * Y - mp) / p.h;

/** Short-run equilibrium at a given price level. */
export function shortRun(p: Params, P: number): Point {
  const s = isSlope(p);
  if (p.regime === "closed") {
    const mp = p.M / P;
    const Y = (autonomous(p) / p.b + mp / p.h) / (s / p.b + p.ky / p.h);
    return { Y, r: lmR(p, Y, mp), q: 1, E: 1, NX: 0, Meff: p.M };
  }
  if (p.regime === "floating") {
    const Y = (p.M / P + p.h * p.rw) / p.ky;
    const q = 1 + (autonomous(p, 1) - p.b * p.rw - s * Y) / p.sigma;
    return { Y, r: p.rw, q, E: (q * p.Pf) / P, NX: p.x0 - p.m * Y - p.sigma * (q - 1), Meff: p.M };
  }
  // fixed: nominal rate pegged, money supply adjusts to defend it
  const q = (p.E0 * P) / p.Pf;
  const Y = (autonomous(p, q) - p.b * p.rw) / s;
  return {
    Y,
    r: p.rw,
    q,
    E: p.E0,
    NX: p.x0 - p.m * Y - p.sigma * (q - 1),
    Meff: P * (p.ky * Y - p.h * p.rw),
  };
}

/** Long-run (full-employment) equilibrium: output at Y*, prices fully adjusted. */
export function longRun(p: Params): Point & { P: number } {
  const Y = Ystar(p);
  const s = isSlope(p);
  if (p.regime === "closed") {
    const r = isR(p, Y);
    const P = p.M / (p.ky * Y - p.h * r);
    return { Y, r, q: 1, E: 1, NX: 0, Meff: p.M, P };
  }
  if (p.regime === "floating") {
    const P = p.M / (p.ky * Y - p.h * p.rw);
    const q = 1 + (autonomous(p, 1) - p.b * p.rw - s * Y) / p.sigma;
    return { Y, r: p.rw, q, E: (q * p.Pf) / P, NX: p.x0 - p.m * Y - p.sigma * (q - 1), Meff: p.M, P };
  }
  const q = 1 + (autonomous(p, 1) - p.b * p.rw - s * Y) / p.sigma;
  const P = (q * p.Pf) / p.E0;
  return {
    Y,
    r: p.rw,
    q,
    E: p.E0,
    NX: p.x0 - p.m * Y - p.sigma * (q - 1),
    Meff: P * (p.ky * Y - p.h * p.rw),
    P,
  };
}

/**
 * Baseline economy resting at full employment with P = 1 (and q = 1 when open).
 * Autonomous investment and the money stock are solved so every market clears.
 */
export function baselineEconomy(regime: Regime): Params {
  const p: Params = {
    regime,
    c: 0.6,
    C0: 20,
    T: 20,
    I0: 0,
    b: 4,
    G: 20,
    ky: 0.5,
    h: 4,
    M: 0,
    z: 1,
    Lstar: 100,
    phi: 0.5,
    rw: 5,
    m: 0.15,
    x0: 0,
    sigma: 40,
    E0: 1,
    Pf: 1,
  };
  const Y = Ystar(p);
  const rStar = 5;
  p.x0 = regime === "closed" ? 0 : p.m * Y; // trade balanced at q = 1, Y = Y*
  p.I0 = isSlope(p) * Y + p.b * rStar - (p.C0 - p.c * p.T + p.G + p.x0);
  p.M = p.ky * Y - p.h * rStar; // P = 1
  return p;
}

export type Frame = Point & { t: number; P: number; gap: number; Ystar: number };

export type Simulation = {
  before: Params;
  after: Params;
  frames: Frame[]; // frames[0] = baseline, frames[1] = impact, then adjustment
  baseline: Frame;
  impact: Frame;
  longRun: Point & { P: number };
};

/** Apply a shock at t = 1 and let prices adjust for `steps` periods. */
export function simulate(before: Params, shock: (p: Params) => Params, steps = 60): Simulation {
  const after = shock({ ...before });
  const P0 = 1;
  const mk = (p: Params, t: number, P: number): Frame => {
    const pt = shortRun(p, P);
    return { ...pt, t, P, gap: (pt.Y - Ystar(p)) / Ystar(p), Ystar: Ystar(p) };
  };
  const baseline = mk(before, 0, P0);
  const frames: Frame[] = [baseline];
  let P = P0;
  for (let t = 1; t <= steps; t++) {
    const f = mk(after, t, P);
    frames.push(f);
    P = P * (1 + after.phi * f.gap);
  }
  return { before, after, frames, baseline, impact: frames[1], longRun: longRun(after) };
}

/** Side markets implied by a frame: saving/investment, money, labor, FX. */
export function sideMarkets(p: Params, f: Frame) {
  const C = p.C0 + p.c * (f.Y - p.T);
  const privateSaving = f.Y - p.T - C;
  const publicSaving = p.T - p.G;
  const investment = p.I0 - p.b * f.r;
  const moneyDemand = p.ky * f.Y - p.h * f.r;
  return {
    privateSaving,
    publicSaving,
    investment,
    netExports: f.NX,
    moneySupplyReal: f.Meff / f.P,
    moneyDemand,
    labor: f.Y / p.z,
    laborFull: p.Lstar,
  };
}
