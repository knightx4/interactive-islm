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
 * Open economy (floating or fixed):
 *  - net exports NX = f(RER, Y, partner income, trade policy) sit inside IS (I = S - NX);
 *  - capital mobility runs from none (0) to perfect (1); the financial account is
 *    FA = kappa (r - r_foreign - premium), and uncovered interest parity
 *    e1 = e0 (1 + r_foreign)/(1 + r_home) turns the rate gap into an expected currency move;
 *  - a peg is defended with reserves: the money supply is credit D plus reserves, and
 *    reserves move with the balance of payments; when they run out the peg is devalued;
 *  - a partner economy can be linked, so a shock in one moves the other's NX and capital flows.
 * e is foreign currency per home currency (a rise is an appreciation);
 * RER = e P_home / P_foreign.
 */
import { add, eq, k, scale, solve, v, type Eq, type Lin } from "./linear";

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
  // open economy
  rw: number; // foreign real interest rate (%) when no partner is linked
  m: number; // marginal propensity to import (home income lowers NX)
  mp: number; // partner's propensity to import (partner income raises our NX)
  Yp: number; // partner income when no partner is linked
  x0: number; // autonomous net exports at q = 1
  sigma: number; // net-export sensitivity to the real exchange rate
  tariff: number; // home tariff (points): raises NX
  tariffP: number; // partner tariff (points): lowers NX
  zt: number; // NX response to a point of tariff
  mobility: number; // capital mobility, 0 (none) to 1 (perfect)
  prem: number; // expected-devaluation premium (points): foreign investors demand it to hold home assets
  E0: number; // pegged nominal exchange rate (fixed regime)
  D: number; // central bank's domestic credit (money supply = D + reserves under a peg)
  Res: number; // starting stock of foreign-exchange reserves
  dev: number; // size of the devaluation if reserves run out (share of the peg)
  Pf: number; // foreign price level when no partner is linked
};

export type Point = {
  Y: number;
  r: number;
  q: number;
  E: number;
  NX: number;
  Meff: number; // money supply in force (endogenous under a peg)
  FA: number; // financial account: net private capital inflow (CA = NX)
  dRes: number; // change in official reserves (= CA + FA; zero unless pegged)
  expE: number; // expected change in e implied by uncovered interest parity
  Yp: number; // partner income
  rp: number; // partner interest rate
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

export const desiredSaving = (p: Params, Y: number, r: number) => savingConst(p) + p.sY * Y + p.sR * r;
export const desiredInvestment = (p: Params, r: number) => investmentConst(p) - p.b * r;
export const moneyDemand = (p: Params, Y: number, r: number) => moneyDemandConst(p) + p.kY * Y - p.h * (r + p.piE);

/** Net exports: NX = x0 - m Y + mp Yp - sigma (q - 1) + zt (tariff - tariffP). */
export const netExports = (p: Params, Y: number, q: number, Yp = p.Yp) =>
  open(p) ? p.x0 - p.m * Y + p.mp * Yp - p.sigma * (q - 1) + p.zt * (p.tariff - p.tariffP) : 0;

/** Sensitivity of capital flows to the rate gap (Infinity at perfect mobility). */
export const kappa = (p: Params) => (p.mobility >= 1 ? Infinity : (20 * p.mobility) / (1 - p.mobility));

/** Uncovered interest parity: the expected change in e that offsets the rate gap, e1/e0 - 1. */
export const expectedEChange = (rHome: number, rForeign: number) => (1 + rForeign / 100) / (1 + rHome / 100) - 1;

const nxConst = (p: Params, q: number) => (open(p) ? netExports(p, 0, q) : 0);
const isSlope = (p: Params) => p.sY + mOpen(p);
const isRate = (p: Params) => p.sR + p.b; // saving and investment both respond to r
const isIntercept = (p: Params, q: number) => investmentConst(p) - savingConst(p) + nxConst(p, q);

/** IS curve: r as a function of Y at real exchange rate q (ignored when closed). */
export const isR = (p: Params, Y: number, q = 1) => (isIntercept(p, q) - isSlope(p) * Y) / isRate(p);

/** LM curve: r as a function of Y at real money balances mp. */
export const lmR = (p: Params, Y: number, mp: number) => (moneyDemandConst(p) + p.kY * Y - mp) / p.h - p.piE;

/** The partner economy linked to the home one: its parameters and current price level. */
export type Partner = { p: Params; P: number };

/* Equations for one economy, as linear expressions in named unknowns. */
function isEq(p: Params, Y: Lin, r: Lin, nx: Lin): Eq {
  // S = I + NX
  return eq(add(k(savingConst(p)), scale(Y, p.sY), scale(r, p.sR)), add(k(investmentConst(p)), scale(r, -p.b), nx));
}
function lmEq(p: Params, mReal: Lin, Y: Lin, r: Lin): Eq {
  return eq(mReal, add(k(moneyDemandConst(p) - p.h * p.piE), scale(Y, p.kY), scale(r, -p.h)));
}

/** Everything the open-economy equations need at a date: unknowns are named Y, r, and q or B. */
function openSystem(p: Params, P: number, Rprev: number, partner: Partner | null, pinned?: { Y: number; Yf?: number }) {
  const peg = p.regime === "fixed";
  const kap = kappa(p);
  const Pfor = partner ? partner.P : p.Pf;
  const qConst = (p.E0 * P) / Pfor;
  const Y = pinned ? k(pinned.Y) : v("Y");
  const r = v("r");
  const q = peg && !pinned ? k(qConst) : v("q");
  const Yf = partner ? (pinned ? k(pinned.Yf!) : v("Yf")) : k(p.Yp);
  const rf = partner ? v("rf") : k(p.rw);
  const nx = add(k(p.x0 + p.zt * (p.tariff - p.tariffP) + p.sigma), scale(Y, -p.m), scale(Yf, p.mp), scale(q, -p.sigma));
  const eqs: Eq[] = [isEq(p, Y, r, nx)];
  const vars: string[] = ["r"];
  if (!pinned) vars.unshift("Y");
  if (!(peg && !pinned)) vars.push("q");
  // financial account
  const K = isFinite(kap) ? scale(add(r, scale(rf, -1), k(-p.prem)), kap) : null;
  if (pinned) {
    // long run: balance of payments in balance (no reserve change)
    eqs.push(K ? eq(add(nx, K), k(0)) : eq(r, add(rf, k(p.prem))));
  } else if (peg) {
    vars.push("B");
    eqs.push(lmEq(p, add(k((p.D + Rprev) / P), v("B", 1 / P)), Y, r));
    eqs.push(K ? eq(v("B"), add(nx, K)) : eq(r, add(rf, k(p.prem))));
  } else {
    eqs.push(lmEq(p, k(p.M / P), Y, r));
    eqs.push(K ? eq(add(nx, K), k(0)) : eq(r, add(rf, k(p.prem))));
  }
  if (partner) {
    const f = partner.p;
    vars.push("rf");
    if (!pinned) vars.push("Yf");
    eqs.push(isEq(f, Yf, rf, scale(nx, -1)));
    if (!pinned) eqs.push(lmEq(f, k(f.M / partner.P), Yf, rf));
  }
  return { vars, eqs, nx, K, kap, peg, Pfor, qConst };
}

function pointFrom(p: Params, P: number, Rprev: number, partner: Partner | null, s: Record<string, number>): Point {
  const peg = p.regime === "fixed";
  const Y = s.Y, r = s.r;
  const Yf = partner ? s.Yf : p.Yp, rf = partner ? s.rf : p.rw;
  const Pfor = partner ? partner.P : p.Pf;
  const q = peg ? (p.E0 * P) / Pfor : s.q;
  const NX = netExports(p, Y, q, Yf);
  const B = peg ? s.B : 0;
  const FA = B - NX; // CA + FA = change in reserves
  return {
    Y, r, q, E: peg ? p.E0 : (q * Pfor) / P, NX,
    Meff: peg ? p.D + Rprev + B : p.M,
    FA, dRes: B, expE: expectedEChange(r, rf), Yp: Yf, rp: rf,
  };
}

/** Short-run equilibrium at a given price level (reserves Rprev matter only under a peg). */
export function shortRun(p: Params, P: number, Rprev = p.Res, partner: Partner | null = null): Point {
  if (p.regime === "closed") {
    const Lc = moneyDemandConst(p);
    const mp = p.M / P;
    const Y = (isIntercept(p, 1) / isRate(p) + (mp - Lc) / p.h + p.piE) / (isSlope(p) / isRate(p) + p.kY / p.h);
    return { Y, r: lmR(p, Y, mp), q: 1, E: 1, NX: 0, Meff: p.M, FA: 0, dRes: 0, expE: 0, Yp: p.Yp, rp: p.rw };
  }
  const sys = openSystem(p, P, Rprev, partner);
  return pointFrom(p, P, Rprev, partner, solve(sys.vars, sys.eqs));
}

/**
 * Long-run (full-employment) equilibrium: output at Y* (and the partner's at its own Y*),
 * prices fully adjusted, balance of payments in balance.
 */
export function longRun(p: Params, partner: Partner | null = null): Point & { P: number; Pp: number; reserves: number } {
  const Y = Ystar(p);
  if (p.regime === "closed") {
    const r = isR(p, Y);
    return { Y, r, q: 1, E: 1, NX: 0, Meff: p.M, FA: 0, dRes: 0, expE: 0, Yp: p.Yp, rp: p.rw, P: p.M / moneyDemand(p, Y, r), Pp: 1, reserves: 0 };
  }
  const Yfs = partner ? Ystar(partner.p) : p.Yp;
  const sys = openSystem(p, 1, 0, partner, { Y, Yf: Yfs });
  const s = solve(sys.vars, sys.eqs);
  const r = s.r, q = s.q, rf = partner ? s.rf : p.rw;
  const peg = p.regime === "fixed";
  const Pp = partner ? partner.p.M / moneyDemand(partner.p, Yfs, rf) : p.Pf;
  const NX = netExports(p, Y, q, Yfs);
  const L = moneyDemand(p, Y, r);
  const P = peg ? (q * Pp) / p.E0 : p.M / L;
  const Meff = peg ? P * L : p.M;
  return {
    Y, r, q, E: peg ? p.E0 : (q * Pp) / P, NX, Meff, FA: -NX, dRes: 0, expE: expectedEChange(r, rf),
    Yp: Yfs, rp: rf, P, Pp, reserves: peg ? Meff - p.D : p.Res,
  };
}

/**
 * Baseline economy resting at full employment with P = 1 (and q = 1 when open).
 * Saving's intercept and the money stock are solved so every market clears at r = 5.
 * Open economies start with balanced trade and no capital flow. `mobility` defaults to
 * perfect (a small country); use a lower value for a large economy.
 */
export function baselineEconomy(regime: Regime, mobility = 1): Params {
  const p: Params = {
    regime,
    A: 1, K: 100, a: 0.3, Ns0: 100, eL: 0.5, w0: 1, tauL: 0.2,
    s0: 0, sY: 0.4, sR: 0.5, sF: 0.2, sW: 0.15, T: 20, G: 20, Yf: 100, W: 100,
    i0: 40, b: 4, kF: 1, mpkF: 10, kD: 1, delta: 5, kT: 0.3, tauI: 10,
    kY: 0.5, h: 4, M: 0, piE: 2, kW: 0.1, kRisk: 4, risk: 1, kLiq: 4, liq: 1, kTech: 4, tech: 1,
    phi: 0.5,
    rw: 5, m: 0.15, mp: 0.15, Yp: 100, x0: 0, sigma: 40, tariff: 0, tariffP: 0, zt: 1,
    mobility, prem: 0, E0: 1, D: 0, Res: 40, dev: 0.2, Pf: 1,
  };
  p.w0 = (1 - p.tauL) * mpl(p, p.Ns0); // so labour supply equals Ns0 at the baseline wage
  const Y = Ystar(p);
  const rStar = 5;
  p.x0 = regime === "closed" ? 0 : p.m * Y - p.mp * p.Yp; // trade balanced at q = 1, Y = Y*
  // saving intercept so that S = I + NX at (Y*, r*), NX = 0
  p.s0 = desiredInvestment(p, rStar) - desiredSaving(p, Y, rStar);
  p.M = moneyDemand(p, Y, rStar); // P = 1
  p.D = p.M - p.Res;
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
  CA: number; // current account (= net exports)
  Res: number; // reserves at the end of the period
  devalued: boolean; // the peg was reset this period because reserves ran out
};

export type Simulation = {
  before: Params;
  after: Params;
  /** The economy at the end: `after`, plus a devaluation if reserves ran out. */
  final: Params;
  frames: Frame[]; // frames[0] = baseline, frames[1] = impact, then adjustment
  baseline: Frame;
  impact: Frame;
  longRun: Frame;
  /** Long run needs more reserves than the economy has, so the peg cannot last. */
  pegBreaks: boolean;
};

function frameOf(p: Params, pt: Point, P: number, t: number, Res: number, devalued = false): Frame {
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
    CA: pt.NX,
    Res,
    devalued,
  };
}

export type WorldSimulation = { home: Simulation; foreign: Simulation | null };

/**
 * Apply shocks at t = 1 and let prices adjust for `steps` periods. With a partner, both
 * economies are solved together each period; under a peg, reserves move with the balance of
 * payments and the peg is devalued if they run out.
 */
export function simulateWorld(
  before: Params,
  shock: (p: Params) => Params,
  partnerBefore: Params | null = null,
  partnerShock: (p: Params) => Params = (p) => p,
  steps = 60,
): WorldSimulation {
  const after = shock({ ...before });
  const pAfter = partnerBefore ? partnerShock({ ...partnerBefore }) : null;
  const solveAt = (h: Params, Ph: number, R: number, f: Params | null, Pf: number) => {
    if (!f || h.regime === "closed") return { home: shortRun(h, Ph, R), foreign: null as Point | null };
    const partner = { p: f, P: Pf };
    const sys = openSystem(h, Ph, R, partner);
    const s = solve(sys.vars, sys.eqs);
    const home = pointFrom(h, Ph, R, partner, s);
    return { home, foreign: partnerPoint(f, Pf, s, home) };
  };
  const partnerPoint = (f: Params, Pf: number, s: Record<string, number>, home: Point): Point => ({
    Y: s.Yf, r: s.rf, q: 1 / home.q, E: 1 / home.E, NX: -home.NX, Meff: f.M, FA: -home.FA, dRes: 0,
    expE: 0, Yp: home.Y, rp: home.r,
  });

  const b = solveAt(before, 1, before.Res, partnerBefore, 1);
  const baseline = frameOf(before, b.home, 1, 0, before.Res);
  const fBase = partnerBefore && b.foreign ? frameOf(partnerBefore, b.foreign, 1, 0, 0) : null;
  const frames: Frame[] = [baseline];
  const fFrames: Frame[] = fBase ? [fBase] : [];
  let cur = { ...after };
  let P = 1, Pf = 1, R = before.Res;
  for (let t = 1; t <= steps; t++) {
    let sol = solveAt(cur, P, R, pAfter, Pf);
    let devalued = false;
    if (cur.regime === "fixed" && R + sol.home.dRes < 0) {
      // reserves would run out: the central bank gives up the old peg and resets it lower
      devalued = true;
      cur = { ...cur, E0: cur.E0 * (1 - cur.dev), prem: 0 };
      sol = solveAt(cur, P, R, pAfter, Pf);
    }
    R = cur.regime === "fixed" ? Math.max(0, R + sol.home.dRes) : R;
    const f = frameOf(cur, sol.home, P, t, R, devalued);
    frames.push(f);
    if (pAfter && sol.foreign) {
      fFrames.push(frameOf(pAfter, sol.foreign, Pf, t, 0));
      Pf = Pf * (1 + pAfter.phi * fFrames[fFrames.length - 1].gap);
    }
    P = P * (1 + cur.phi * f.gap);
  }
  const mkLR = (p: Params, partner: Partner | null) => {
    const lr = longRun(p, partner);
    return { lr, frame: frameOf(p, lr, lr.P, Infinity, lr.reserves) };
  };
  const homeLR = mkLR(cur, pAfter ? { p: pAfter, P: 1 } : null);
  const home: Simulation = {
    before, after, final: cur, frames, baseline, impact: frames[1], longRun: homeLR.frame,
    pegBreaks: cur.regime === "fixed" && homeLR.lr.reserves < 0,
  };
  let foreign: Simulation | null = null;
  if (partnerBefore && pAfter && fBase) {
    const lrF = Ystar(pAfter);
    const rfLR = homeLR.lr.rp;
    const PfLR = pAfter.M / moneyDemand(pAfter, lrF, rfLR);
    const fp: Point = {
      Y: lrF, r: rfLR, q: 1 / homeLR.lr.q, E: 1 / homeLR.lr.E, NX: -homeLR.lr.NX, Meff: pAfter.M,
      FA: -homeLR.lr.FA, dRes: 0, expE: 0, Yp: homeLR.lr.Y, rp: homeLR.lr.r,
    };
    foreign = {
      before: partnerBefore, after: pAfter, final: pAfter, frames: fFrames, baseline: fBase, impact: fFrames[1],
      longRun: frameOf(pAfter, fp, PfLR, Infinity, 0), pegBreaks: false,
    };
  }
  return { home, foreign };
}

/** One economy on its own (any linked partner is the fixed "rest of the world"). */
export function simulate(before: Params, shock: (p: Params) => Params, steps = 60): Simulation {
  return simulateWorld(before, shock, null, (p) => p, steps).home;
}

/** Side markets implied by a frame: saving/investment, money, labour, balance of payments. */
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
    /** Balance of payments: current account, financial account, change in reserves. */
    currentAccount: f.CA,
    financialAccount: f.FA,
    reservesChange: f.dRes,
    reserves: f.Res,
    // kept for existing callers
    labor: f.N,
    laborFull: employmentFE(p),
  };
}
