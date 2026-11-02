/**
 * Learn-section economy: the IS-LM-FE model with an explicit labour market.
 *
 *  FE  Y* = A K^a N*^(1-a), where N* clears labour demand (the marginal product of
 *      labour) against a labour supply that responds to the after-tax real wage.
 *  IS  desired saving S(r, Y, future Y, wealth, government saving) = desired
 *      investment I(r, future MPK, depreciation, investment tax) [+ NX when open].
 *  LM  real money supply M/P = money demand L(Y, r + expected inflation, wealth,
 *      riskiness and liquidity of alternatives, payment technology).
 *
 * Prices adjust slowly toward the level that puts output back on FE.
 * Independent of lib/islmModel.ts (the simulator's model). All numbers are index
 * units, not calibrated to real data.
 *
 * Y = output, r = real interest rate (%), P = price level, N = employment,
 * w = real wage, q = real exchange rate, E = nominal exchange rate (foreign
 * currency per unit of home currency, so a rise is an appreciation).
 *
 * The open-economy block here is a small country that takes the world rate; it is
 * replaced by the course's open economy in the next step.
 */

export type Regime = "closed" | "floating" | "fixed";

export type Params = {
  regime: Regime;
  // supply side: Y = A K^a N^(1-a), labour supply Ns = Ns0 ((1 - tauL) w / w0)^eL
  A: number; // total factor productivity
  K: number; // capital stock
  a: number; // capital share
  Ns0: number; // labour supply scale
  eL: number; // elasticity of labour supply to the after-tax real wage
  w0: number; // normalising real wage
  tauL: number; // labour tax rate
  // saving: S = s0 + sY (Y - T) + sR r - sF Yf - sW W + (T - G)
  s0: number;
  sY: number; // marginal propensity to save
  sR: number; // saving response to r
  sF: number; // saving falls when future output is expected to be higher
  sW: number; // saving falls when wealth is higher
  T: number; // taxes
  G: number; // government purchases
  Yf: number; // expected future output
  W: number; // real wealth
  // investment: I = i0 - b r + kF mpkF - kD delta - kT tauI
  i0: number;
  b: number; // investment response to r
  kF: number;
  mpkF: number; // expected future marginal product of capital (%)
  kD: number;
  delta: number; // depreciation rate (%)
  kT: number;
  tauI: number; // tax on investment (%)
  // money demand: L = kY Y - h (r + piE) + kW W + kRisk risk - kLiq liq - kTech tech
  kY: number;
  h: number; // response to the nominal interest rate
  M: number; // nominal money supply (closed/floating)
  piE: number; // expected inflation (%)
  kW: number;
  kRisk: number;
  risk: number; // riskiness of alternative assets (index)
  kLiq: number;
  liq: number; // liquidity of alternative assets (index)
  kTech: number;
  tech: number; // payment technology (index)
  // price adjustment speed
  phi: number;
  // open economy (small country; replaced in the next step)
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

/* ------------------------------ supply side ------------------------------ */

const prod = (p: Params) => p.A * Math.pow(p.K, p.a);

/** Output from employment N. */
export const output = (p: Params, N: number) => prod(p) * Math.pow(N, 1 - p.a);

/** Employment needed to produce Y. */
export const employmentFor = (p: Params, Y: number) => Math.pow(Y / prod(p), 1 / (1 - p.a));

/** Labour demand: the real wage equals the marginal product of labour. */
export const mpl = (p: Params, N: number) => (1 - p.a) * prod(p) * Math.pow(N, -p.a);

/** Labour supply at a real wage (before labour tax). */
export const labourSupply = (p: Params, w: number) => p.Ns0 * Math.pow(((1 - p.tauL) * w) / p.w0, p.eL);

/** Full-employment labour: where labour demand meets labour supply. */
export const employmentFE = (p: Params) =>
  Math.pow(p.Ns0 * Math.pow(((1 - p.tauL) * (1 - p.a) * prod(p)) / p.w0, p.eL), 1 / (1 + p.a * p.eL));

/** Full-employment output (the FE line). */
export const Ystar = (p: Params) => output(p, employmentFE(p));

/** Real wage in the full-employment labour market. */
export const wageFE = (p: Params) => mpl(p, employmentFE(p));

/* ------------------------------ demand side ------------------------------ */

const open = (p: Params) => p.regime !== "closed";
const mOpen = (p: Params) => (open(p) ? p.m : 0);

/** Constant in S = Sc + sY Y + sR r (includes government saving T - G). */
export const savingConst = (p: Params) => p.s0 - p.sY * p.T - p.sF * p.Yf - p.sW * p.W + (p.T - p.G);

/** Constant in I = Ic - b r. */
export const investmentConst = (p: Params) => p.i0 + p.kF * p.mpkF - p.kD * p.delta - p.kT * p.tauI;

/** Constant in L = Lc + kY Y - h (r + piE). */
export const moneyDemandConst = (p: Params) =>
  p.kW * p.W + p.kRisk * p.risk - p.kLiq * p.liq - p.kTech * p.tech;

/** Net exports excluding the income term (zero when closed). */
const nxConst = (p: Params, q: number) => (open(p) ? p.x0 - p.sigma * (q - 1) : 0);

const isSlope = (p: Params) => p.sY + mOpen(p);
const isRate = (p: Params) => p.sR + p.b; // saving and investment both respond to r
const isIntercept = (p: Params, q: number) => investmentConst(p) - savingConst(p) + nxConst(p, q);

export const desiredSaving = (p: Params, Y: number, r: number) => savingConst(p) + p.sY * Y + p.sR * r;
export const desiredInvestment = (p: Params, r: number) => investmentConst(p) - p.b * r;
export const moneyDemand = (p: Params, Y: number, r: number) => moneyDemandConst(p) + p.kY * Y - p.h * (r + p.piE);

/** IS curve: r as a function of Y at real exchange rate q (ignored when closed). */
export const isR = (p: Params, Y: number, q = 1) => (isIntercept(p, q) - isSlope(p) * Y) / isRate(p);

/** LM curve: r as a function of Y at real money balances mp. */
export const lmR = (p: Params, Y: number, mp: number) => (moneyDemandConst(p) + p.kY * Y - mp) / p.h - p.piE;

/** Short-run equilibrium at a given price level. */
export function shortRun(p: Params, P: number): Point {
  const Lc = moneyDemandConst(p);
  const mp = p.M / P;
  if (p.regime === "closed") {
    const Y =
      (isIntercept(p, 1) / isRate(p) + (mp - Lc) / p.h + p.piE) / (isSlope(p) / isRate(p) + p.kY / p.h);
    return { Y, r: lmR(p, Y, mp), q: 1, E: 1, NX: 0, Meff: p.M };
  }
  if (p.regime === "floating") {
    const Y = (mp - Lc + p.h * (p.rw + p.piE)) / p.kY;
    const q = 1 + (p.x0 - (isRate(p) * p.rw + isSlope(p) * Y - (investmentConst(p) - savingConst(p)))) / p.sigma;
    return { Y, r: p.rw, q, E: (q * p.Pf) / P, NX: nxConst(p, q) - p.m * Y, Meff: p.M };
  }
  // fixed: nominal rate pegged, money supply adjusts to defend it
  const q = (p.E0 * P) / p.Pf;
  const Y = (isIntercept(p, q) - isRate(p) * p.rw) / isSlope(p);
  return { Y, r: p.rw, q, E: p.E0, NX: nxConst(p, q) - p.m * Y, Meff: P * moneyDemand(p, Y, p.rw) };
}

/** Long-run (full-employment) equilibrium: output at Y*, prices fully adjusted. */
export function longRun(p: Params): Point & { P: number } {
  const Y = Ystar(p);
  if (p.regime === "closed") {
    const r = isR(p, Y);
    return { Y, r, q: 1, E: 1, NX: 0, Meff: p.M, P: p.M / moneyDemand(p, Y, r) };
  }
  const q = 1 + (p.x0 - (isRate(p) * p.rw + isSlope(p) * Y - (investmentConst(p) - savingConst(p)))) / p.sigma;
  const NX = nxConst(p, q) - p.m * Y;
  if (p.regime === "floating") {
    const P = p.M / moneyDemand(p, Y, p.rw);
    return { Y, r: p.rw, q, E: (q * p.Pf) / P, NX, Meff: p.M, P };
  }
  const P = (q * p.Pf) / p.E0;
  return { Y, r: p.rw, q, E: p.E0, NX, Meff: P * moneyDemand(p, Y, p.rw), P };
}

/**
 * Baseline economy resting at full employment with P = 1 (and q = 1 when open).
 * Saving's intercept and the money stock are solved so every market clears at r = 5.
 */
export function baselineEconomy(regime: Regime): Params {
  const p: Params = {
    regime,
    A: 1, K: 100, a: 0.3, Ns0: 100, eL: 0.5, w0: 1, tauL: 0.2,
    s0: 0, sY: 0.4, sR: 0.5, sF: 0.2, sW: 0.15, T: 20, G: 20, Yf: 100, W: 100,
    i0: 40, b: 4, kF: 1, mpkF: 10, kD: 1, delta: 5, kT: 0.3, tauI: 10,
    kY: 0.5, h: 4, M: 0, piE: 2, kW: 0.1, kRisk: 4, risk: 1, kLiq: 4, liq: 1, kTech: 4, tech: 1,
    phi: 0.5,
    rw: 5, m: 0.15, x0: 0, sigma: 40, E0: 1, Pf: 1,
  };
  p.w0 = (1 - p.tauL) * mpl(p, p.Ns0); // so labour supply equals Ns0 at the baseline wage
  const Y = Ystar(p);
  const rStar = 5;
  p.x0 = regime === "closed" ? 0 : p.m * Y; // trade balanced at q = 1, Y = Y*
  const nx = regime === "closed" ? 0 : p.x0 - p.m * Y;
  // saving intercept so that S = I + NX at (Y*, r*)
  p.s0 = desiredInvestment(p, rStar) + nx - desiredSaving(p, Y, rStar);
  p.M = moneyDemand(p, Y, rStar); // P = 1
  return p;
}

export type Frame = Point & {
  t: number;
  P: number;
  gap: number;
  Ystar: number;
  N: number; // employment
  w: number; // real wage (marginal product of labour at N)
  C: number; // consumption
  I: number; // investment
};

export type Simulation = {
  before: Params;
  after: Params;
  frames: Frame[]; // frames[0] = baseline, frames[1] = impact, then adjustment
  baseline: Frame;
  impact: Frame;
  longRun: Frame;
};

function frameOf(p: Params, pt: Point, P: number, t: number): Frame {
  const ys = Ystar(p);
  const N = employmentFor(p, pt.Y);
  return {
    ...pt,
    t,
    P,
    gap: (pt.Y - ys) / ys,
    Ystar: ys,
    N,
    w: mpl(p, N),
    C: pt.Y - p.G - desiredInvestment(p, pt.r) - pt.NX,
    I: desiredInvestment(p, pt.r),
  };
}

/** Apply a shock at t = 1 and let prices adjust for `steps` periods. */
export function simulate(before: Params, shock: (p: Params) => Params, steps = 60): Simulation {
  const after = shock({ ...before });
  const baseline = frameOf(before, shortRun(before, 1), 1, 0);
  const frames: Frame[] = [baseline];
  let P = 1;
  for (let t = 1; t <= steps; t++) {
    const f = frameOf(after, shortRun(after, P), P, t);
    frames.push(f);
    P = P * (1 + after.phi * f.gap);
  }
  const lr = longRun(after);
  return { before, after, frames, baseline, impact: frames[1], longRun: frameOf(after, lr, lr.P, Infinity) };
}

/** Side markets implied by a frame: saving/investment, money, labour, FX. */
export function sideMarkets(p: Params, f: Frame) {
  const privateSaving = f.Y - p.T - f.C;
  return {
    privateSaving,
    publicSaving: p.T - p.G,
    investment: f.I,
    netExports: f.NX,
    consumption: f.C,
    moneySupplyReal: f.Meff / f.P,
    moneyDemand: moneyDemand(p, f.Y, f.r),
    /** Labour market: employment and the real wage at this frame, against the full-employment point. */
    employment: f.N,
    employmentFE: employmentFE(p),
    labourSupplyAtWage: labourSupply(p, f.w),
    realWage: f.w,
    realWageFE: wageFE(p),
    // kept for existing callers
    labor: f.N,
    laborFull: employmentFE(p),
  };
}
