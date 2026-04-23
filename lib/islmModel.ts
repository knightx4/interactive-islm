/**
 * Linear teaching toy for IS-LM. All axes are index / model units (not calibrated to data).
 */

export const SHIFT_SCALE = 0.2;
export const OUTPUT_GAP_TOLERANCE = 5;
export const IS_CURRENT_INCOME_SAVINGS_SENSITIVITY = 0.12;

const BASE_OUTPUT = 50;
const BASE_RATE = 10;
const BASE_C = 0.5;
const BASE_B = 2;
const BASE_H = 20 / 3; // ~6.67
const BASE_K = (BASE_H * BASE_RATE) / BASE_OUTPUT; // 1.333..., so k/h = 0.2
const BASE_MOVERP = 50;
const BASE_MONEY_DEMAND_INTERCEPT = 50; // L0
const BASE_IS_AUTONOMOUS = BASE_B * BASE_RATE + (1 - BASE_C) * BASE_OUTPUT; // 45

export const IS_SLOPE = -(1 - BASE_C) / BASE_B;
export const LM_SLOPE = BASE_K / BASE_H;
export const IS_BASE_INTERCEPT = BASE_IS_AUTONOMOUS / BASE_B;
export const LM_BASE_INTERCEPT =
  (BASE_MONEY_DEMAND_INTERCEPT - BASE_MOVERP) / BASE_H;
export const LM_MONEY_DEMAND_SLOPE = -(1 / BASE_H);
export const LM_TRANSACTIONS_Y_SENSITIVITY = BASE_K / BASE_H;
export const IS_PANEL_IS_SLOPE = IS_SLOPE;
export const IS_PANEL_S_SLOPE = -IS_SLOPE;

export interface ModelParams {
  investment: number;
  savings: number;
  futureY: number;
  wealth: number;
  futureMPK: number;
  moneySupply: number;
  moneyDemand: number;
  expectedInflation: number;
  riskiness: number;
  liquidity: number;
  fullEmployment: number;
  centralBankSupply: number;
  priceLevel: number;
  productivity: number;
  capital: number;
  labor: number;
  /**
   * Government savings balance (T-G), index; -50..50 with 0 = balanced budget.
   * Positive means surplus (lower G), negative means deficit (higher G).
   */
  governmentSpending: number;
  /** Net exports (X−M), index; −50…50 with 0 = balanced trade. */
  netExports: number;
}

/** Subset used for IS-LM equilibrium and labor bridge. */
export type IslmCoreParams = Pick<
  ModelParams,
  | "investment"
  | "savings"
  | "moneySupply"
  | "moneyDemand"
  | "fullEmployment"
  | "governmentSpending"
  | "netExports"
>;

export interface StructuralIslmParams {
  a: number;
  c: number;
  i0: number;
  b: number;
  t: number;
  g: number;
  k: number;
  h: number;
  l0: number;
  mOverP: number;
  autonomousDemand: number;
  isSlope: number;
  isIntercept: number;
  lmSlope: number;
  lmIntercept: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Maps the existing UI controls to a structural linear IS-LM system:
 * C = a + c(Y-T), I = I0 - br, and M/P = L0 + kY - hr.
 */
export function mapControlsToStructuralParams(
  params: IslmCoreParams
): StructuralIslmParams {
  const savingsDeviation = params.savings - BASE_OUTPUT;
  const investmentDeviation = params.investment - BASE_OUTPUT;
  const nxDeviation = params.netExports;
  const governmentSavingsDeviation = params.governmentSpending;
  const moneyDemandDeviation = params.moneyDemand - BASE_OUTPUT;
  const moneySupplyDeviation = params.moneySupply - BASE_OUTPUT;

  // Keep MPC fixed so the IS slope is constant. This is what makes the three
  // panels (IS-LM, loanable funds / IS sub-panel, money market) resolve to one
  // shared (Y*, r*) by construction; a drifting slope would break that.
  const c = BASE_C;
  void savingsDeviation;
  const b = BASE_B;
  const h = BASE_H;
  const k = BASE_K;
  const t = 0;
  const g = 0;
  const i0 = 0;
  const a = 0;

  const autonomousDemand =
    BASE_IS_AUTONOMOUS +
    0.45 * investmentDeviation +
    0.35 * nxDeviation -
    0.4 * savingsDeviation -
    0.35 * governmentSavingsDeviation;

  const l0 = BASE_MONEY_DEMAND_INTERCEPT + 0.8 * moneyDemandDeviation;
  const mOverP = BASE_MOVERP + 0.8 * moneySupplyDeviation;

  return {
    a,
    c,
    i0,
    b,
    t,
    g,
    k,
    h,
    l0,
    mOverP,
    autonomousDemand,
    isSlope: -(1 - c) / b,
    isIntercept: autonomousDemand / b,
    lmSlope: k / h,
    lmIntercept: (l0 - mOverP) / h,
  };
}

export function computeInvestmentShift(investment: number): number {
  return (investment - BASE_OUTPUT) * SHIFT_SCALE;
}

export function computeSavingsShift(savings: number): number {
  return (BASE_OUTPUT - savings) * SHIFT_SCALE;
}

export function computeCurrentIncomeSavingsShift(
  output: number,
  baselineOutput = BASE_OUTPUT
): number {
  return -(output - baselineOutput) * IS_CURRENT_INCOME_SAVINGS_SENSITIVITY;
}

export function computeEffectiveSavingsShift(
  savings: number,
  output: number,
  baselineOutput = BASE_OUTPUT
): number {
  return (
    computeSavingsShift(savings) +
    computeCurrentIncomeSavingsShift(output, baselineOutput)
  );
}

export function computeOpenEconomyInvestmentSideShift(
  investment: number,
  netExports: number
): number {
  return computeInvestmentShift(investment + netExports);
}

export function computeIsShift(
  investment: number,
  savings: number,
  governmentSavings: number,
  netExports: number
): number {
  const structural = mapControlsToStructuralParams({
    investment,
    savings,
    governmentSpending: governmentSavings,
    netExports,
    moneyDemand: BASE_OUTPUT,
    moneySupply: BASE_OUTPUT,
    fullEmployment: BASE_OUTPUT,
  });
  return structural.isIntercept - IS_BASE_INTERCEPT;
}

export function computeLmShift(moneyDemand: number, moneySupply: number): number {
  const structural = mapControlsToStructuralParams({
    investment: BASE_OUTPUT,
    savings: BASE_OUTPUT,
    governmentSpending: 0,
    netExports: 0,
    moneyDemand,
    moneySupply,
    fullEmployment: BASE_OUTPUT,
  });
  return structural.lmIntercept - LM_BASE_INTERCEPT;
}

export interface IslmEquilibriumResult {
  equilibriumX: number;
  equilibriumY: number;
  outputGap: number;
  isShift: number;
  lmShift: number;
}

/** Algebraic intersection (always); used e.g. labor bridge when the dot is off-chart. */
export function computeIslmAlgebraicIntersection(
  params: IslmCoreParams
): IslmEquilibriumResult {
  const structural = mapControlsToStructuralParams(params);
  const denominator = 1 - structural.c + (structural.b * structural.k) / structural.h;
  const equilibriumX =
    (structural.autonomousDemand +
      (structural.b / structural.h) * (structural.mOverP - structural.l0)) /
    denominator;
  const equilibriumY =
    (structural.k / structural.h) * equilibriumX +
    (structural.l0 - structural.mOverP) / structural.h;
  const outputGap = equilibriumX - params.fullEmployment;
  const isShift = structural.isIntercept - IS_BASE_INTERCEPT;
  const lmShift = structural.lmIntercept - LM_BASE_INTERCEPT;

  return {
    equilibriumX,
    equilibriumY,
    outputGap,
    isShift,
    lmShift,
  };
}

export function computeIslmEquilibrium(
  params: IslmCoreParams
): IslmEquilibriumResult | null {
  const alg = computeIslmAlgebraicIntersection(params);

  if (
    alg.equilibriumX >= 0 &&
    alg.equilibriumX <= 100 &&
    alg.equilibriumY >= 0 &&
    alg.equilibriumY <= 20
  ) {
    return alg;
  }

  return null;
}

export interface IslmChartPoint {
  x: number;
  isY: number;
  lmY: number;
}

export function buildIslmSeries(
  paramsOrIsShift: IslmCoreParams | number,
  lmShiftOrStep?: number,
  maybeStep = 2
): IslmChartPoint[] {
  if (typeof paramsOrIsShift === "number") {
    const isShift = paramsOrIsShift;
    const lmShift = lmShiftOrStep ?? 0;
    const step = maybeStep;
    const data: IslmChartPoint[] = [];
    for (let x = 0; x <= 100; x += step) {
      const isY = IS_BASE_INTERCEPT + isShift + IS_SLOPE * x;
      const lmY = LM_BASE_INTERCEPT + lmShift + LM_SLOPE * x;
      data.push({
        x,
        isY: Math.max(0, Math.min(20, isY)),
        lmY: Math.max(0, Math.min(20, lmY)),
      });
    }
    return data;
  }
  return buildStructuralIslmSeries(paramsOrIsShift, lmShiftOrStep ?? 2);
}

export function buildStructuralIslmSeries(
  params: IslmCoreParams,
  step = 2
): IslmChartPoint[] {
  const structural = mapControlsToStructuralParams(params);
  const data: IslmChartPoint[] = [];
  for (let x = 0; x <= 100; x += step) {
    const isY = structural.isIntercept + structural.isSlope * x;
    const lmY = structural.lmIntercept + structural.lmSlope * x;
    data.push({
      x,
      isY: Math.max(0, Math.min(20, isY)),
      lmY: Math.max(0, Math.min(20, lmY)),
    });
  }
  return data;
}

export interface IsChartPoint {
  x: number;
  investmentY: number;
  savingsY: number;
}

export function buildIsChartSeries(
  paramsOrInvestmentShift: IslmCoreParams | number,
  savingsShiftOrStep?: number,
  maybeStep = 5
): IsChartPoint[] {
  if (typeof paramsOrInvestmentShift === "number") {
    const investmentShift = paramsOrInvestmentShift;
    const savingsShift = savingsShiftOrStep ?? 0;
    const step = maybeStep;
    const isBaseIntercept = 10 - IS_PANEL_IS_SLOPE * 50;
    const sBaseIntercept = 10 - IS_PANEL_S_SLOPE * 50;
    const data: IsChartPoint[] = [];
    for (let x = 0; x <= 100; x += step) {
      const investmentY =
        isBaseIntercept + investmentShift + IS_PANEL_IS_SLOPE * x;
      const savingsY = sBaseIntercept + savingsShift + IS_PANEL_S_SLOPE * x;
      data.push({
        x,
        investmentY: Math.max(0, Math.min(20, investmentY)),
        savingsY: Math.max(0, Math.min(20, savingsY)),
      });
    }
    return data;
  }
  return buildStructuralIsProjectionSeries(paramsOrInvestmentShift, savingsShiftOrStep ?? 5);
}

export function buildStructuralIsProjectionSeries(
  params: IslmCoreParams,
  step = 5
): IsChartPoint[] {
  const investmentShift = computeOpenEconomyInvestmentSideShift(
    params.investment,
    params.netExports
  );
  const savingsShift = computeSavingsShift(params.savings);
  const isBaseIntercept = 10 - IS_PANEL_IS_SLOPE * 50;
  const sBaseIntercept = 10 - IS_PANEL_S_SLOPE * 50;
  const data: IsChartPoint[] = [];
  for (let x = 0; x <= 100; x += step) {
    const investmentY =
      isBaseIntercept + investmentShift + IS_PANEL_IS_SLOPE * x;
    const savingsY = sBaseIntercept + savingsShift + IS_PANEL_S_SLOPE * x;
    data.push({
      x,
      investmentY: Math.max(0, Math.min(20, investmentY)),
      savingsY: Math.max(0, Math.min(20, savingsY)),
    });
  }
  return data;
}

export function computeIsPanelEquilibrium(
  paramsOrInvestmentShift: IslmCoreParams | number,
  savingsShift?: number
): { x: number; y: number } | null {
  if (typeof paramsOrInvestmentShift === "number") {
    const investmentShift = paramsOrInvestmentShift;
    const sShift = savingsShift ?? 0;
    const isBaseIntercept = 10 - IS_PANEL_IS_SLOPE * 50;
    const sBaseIntercept = 10 - IS_PANEL_S_SLOPE * 50;
    const equilibriumX =
      (isBaseIntercept + investmentShift - (sBaseIntercept + sShift)) /
      (IS_PANEL_S_SLOPE - IS_PANEL_IS_SLOPE);
    const equilibriumY =
      isBaseIntercept + investmentShift + IS_PANEL_IS_SLOPE * equilibriumX;
    if (
      equilibriumX >= 0 &&
      equilibriumX <= 100 &&
      equilibriumY >= 0 &&
      equilibriumY <= 20
    ) {
      return { x: equilibriumX, y: equilibriumY };
    }
    return null;
  }
  const investmentShift = computeOpenEconomyInvestmentSideShift(
    paramsOrInvestmentShift.investment,
    paramsOrInvestmentShift.netExports
  );
  const sShift = computeSavingsShift(paramsOrInvestmentShift.savings);
  return computeIsPanelEquilibrium(investmentShift, sShift);
}

// ---------------------------------------------------------------------------
// Loanable funds sub-panel (goods market: I(r), S(r, Y*))
//
// Plots the loanable funds diagram in (funds-quantity, r) space with y = r and
// x = quantity of loanable funds. Designed so:
//   1) investment-side sliders move ONLY the I curve,
//   2) savings-side sliders move ONLY the S curve (plus the LM→IS income
//      channel when Y* changes),
//   3) the curves' crossing r is identical to the IS-LM macro r*.
//
// Derivation (with constant MPC c, see mapControlsToStructuralParams):
//   Macro IS: r = A - B*Y, with A = autonomousDemand / b, B = (1-c)/b
//   Macro LM: r = -C_macro + D*Y, with C_macro = (mOverP - l0)/h, D = k/h
//   Y*    = (A + C_macro) / (B + D)
//   r*    = (A*D - B*(-C_macro)) / (B + D) = (A*D + B*C_macro) / (B + D)
//
// Loanable funds lines:
//   I(r)      = 50 + I_shift / Q_SCALE + I_R * (BASE_RATE - r)
//   S(r, Y*)  = 50 + S_shift / Q_SCALE + S_Y * (Y* - BASE_OUTPUT)
//                 + S_R * (r - BASE_RATE)
// Crossing r_panel:
//   r_panel - BASE_RATE
//     = [(I_shift - S_shift)/Q_SCALE - S_Y*(Y* - BASE_OUTPUT)] / (I_R + S_R)
// Matching to r_macro - BASE_RATE via coefficient of (I_shift - S_shift) and
// of C_macro gives:
//   Q_SCALE = b / (I_R + S_R)
//   S_Y     = B * (I_R + S_R)
// which together imply r_panel ≡ r_macro for every parameter setting.
// ---------------------------------------------------------------------------

export const LOANABLE_FUNDS_I_R_SLOPE = 2.5;
export const LOANABLE_FUNDS_S_R_SLOPE = 2.5;

const LF_SLOPE_SUM = LOANABLE_FUNDS_I_R_SLOPE + LOANABLE_FUNDS_S_R_SLOPE;
const LF_Q_SCALE = BASE_B / LF_SLOPE_SUM;
const LF_S_Y_SLOPE = ((1 - BASE_C) / BASE_B) * LF_SLOPE_SUM;

// Match the autonomousDemand coefficients in mapControlsToStructuralParams so
// the loanable funds decomposition is consistent with macro IS.
const LF_INVESTMENT_COEF = 0.45;
const LF_NX_COEF = 0.35;
const LF_SAVINGS_COEF = 0.4;
const LF_GOV_SAVINGS_COEF = 0.35;

export interface LoanableFundsChartPoint {
  x: number;
  investmentR: number | null;
  savingsR: number | null;
}

function loanableFundsBases(params: IslmCoreParams): {
  investmentBase: number;
  savingsBase: number;
  macroY: number;
  macroR: number;
} {
  const investmentShift =
    LF_INVESTMENT_COEF * (params.investment - BASE_OUTPUT) +
    LF_NX_COEF * params.netExports;
  const savingsShift =
    LF_SAVINGS_COEF * (params.savings - BASE_OUTPUT) +
    LF_GOV_SAVINGS_COEF * params.governmentSpending;
  const macro = computeIslmAlgebraicIntersection(params);
  return {
    investmentBase: BASE_OUTPUT + investmentShift / LF_Q_SCALE,
    savingsBase:
      BASE_OUTPUT +
      savingsShift / LF_Q_SCALE +
      LF_S_Y_SLOPE * (macro.equilibriumX - BASE_OUTPUT),
    macroY: macro.equilibriumX,
    macroR: macro.equilibriumY,
  };
}

export function buildLoanableFundsSeries(
  params: IslmCoreParams,
  step = 1
): LoanableFundsChartPoint[] {
  const { investmentBase, savingsBase } = loanableFundsBases(params);
  const data: LoanableFundsChartPoint[] = [];
  for (let x = 0; x <= 100; x += step) {
    const rawInvestmentR =
      BASE_RATE + (investmentBase - x) / LOANABLE_FUNDS_I_R_SLOPE;
    const rawSavingsR =
      BASE_RATE + (x - savingsBase) / LOANABLE_FUNDS_S_R_SLOPE;
    data.push({
      x,
      investmentR:
        rawInvestmentR >= 0 && rawInvestmentR <= 20 ? rawInvestmentR : null,
      savingsR:
        rawSavingsR >= 0 && rawSavingsR <= 20 ? rawSavingsR : null,
    });
  }
  return data;
}

export function computeLoanableFundsEquilibrium(
  params: IslmCoreParams
): { x: number; y: number } {
  const { investmentBase, savingsBase, macroR } = loanableFundsBases(params);
  return {
    x: (investmentBase + savingsBase) / 2,
    y: macroR,
  };
}

export interface LmChartPoint {
  x: number;
  moneyDemandY: number;
}

const LM_CHART_BASE_INTERCEPT = 10 - LM_MONEY_DEMAND_SLOPE * 50;

export function computeMoneyDemandShift(moneyDemand: number): number {
  return (moneyDemand - BASE_OUTPUT) * SHIFT_SCALE;
}

export function computeTransactionsMoneyDemandShift(
  output: number,
  baselineOutput = BASE_OUTPUT
): number {
  return (output - baselineOutput) * LM_TRANSACTIONS_Y_SENSITIVITY;
}

export function computeEffectiveMoneyDemandShift(
  moneyDemand: number,
  output: number,
  baselineOutput = BASE_OUTPUT
): number {
  return (
    computeMoneyDemandShift(moneyDemand) +
    computeTransactionsMoneyDemandShift(output, baselineOutput)
  );
}

export function buildLmChartSeries(
  input: IslmCoreParams | number,
  output = BASE_OUTPUT,
  step = 5
): LmChartPoint[] {
  if (typeof input === "number") {
    const moneyDemandShift = input;
    const transactionsShift = computeTransactionsMoneyDemandShift(output);
    const data: LmChartPoint[] = [];
    for (let x = 0; x <= 100; x += step) {
      const moneyDemandY =
        LM_CHART_BASE_INTERCEPT +
        moneyDemandShift +
        transactionsShift +
        LM_MONEY_DEMAND_SLOPE * x;
      data.push({
        x,
        moneyDemandY: Math.max(0, Math.min(20, moneyDemandY)),
      });
    }
    return data;
  }
  const structural = mapControlsToStructuralParams(input);
  const data: LmChartPoint[] = [];
  for (let x = 0; x <= 100; x += step) {
    const moneyDemandY =
      (structural.l0 + structural.k * output - x) / structural.h;
    data.push({
      x,
      moneyDemandY: Math.max(0, Math.min(20, moneyDemandY)),
    });
  }
  return data;
}

export function computeLmMoneyMarketEquilibrium(
  moneySupply: number,
  moneyDemandShift: number,
  output = BASE_OUTPUT
): { x: number; y: number } | null {
  const transactionsShift = computeTransactionsMoneyDemandShift(output);
  const y =
    LM_CHART_BASE_INTERCEPT +
    moneyDemandShift +
    transactionsShift +
    LM_MONEY_DEMAND_SLOPE * moneySupply;
  if (y >= 0 && y <= 20) {
    return { x: moneySupply, y };
  }
  return null;
}

export interface LaborChartPoint {
  x: number;
  supplyY: number;
  demandY: number;
}

const LABOR_SUPPLY_SLOPE = 0.15;
const LABOR_DEMAND_SLOPE = -0.15;
const LABOR_SUPPLY_INTERCEPT = 10 - LABOR_SUPPLY_SLOPE * 50;
const LABOR_DEMAND_INTERCEPT = 10 - LABOR_DEMAND_SLOPE * 50;

export function buildLaborSeries(outputGap: number, step = 5): LaborChartPoint[] {
  const laborDemandShift = outputGap * 0.1;
  const data: LaborChartPoint[] = [];
  for (let x = 0; x <= 100; x += step) {
    const supplyY = LABOR_SUPPLY_SLOPE * x + LABOR_SUPPLY_INTERCEPT;
    const demandY =
      LABOR_DEMAND_SLOPE * x + LABOR_DEMAND_INTERCEPT + laborDemandShift;
    data.push({
      x,
      supplyY: Math.max(0, Math.min(20, supplyY)),
      demandY: Math.max(0, Math.min(20, demandY)),
    });
  }
  return data;
}

export function computeLaborEquilibrium(outputGap: number): {
  x: number;
  y: number;
  gap: number;
} | null {
  const laborDemandShift = outputGap * 0.1;
  const equilibriumX =
    (LABOR_DEMAND_INTERCEPT + laborDemandShift - LABOR_SUPPLY_INTERCEPT) /
    (LABOR_SUPPLY_SLOPE - LABOR_DEMAND_SLOPE);
  const equilibriumY =
    LABOR_SUPPLY_SLOPE * equilibriumX + LABOR_SUPPLY_INTERCEPT;

  if (
    equilibriumX >= 0 &&
    equilibriumX <= 100 &&
    equilibriumY >= 0 &&
    equilibriumY <= 20
  ) {
    return { x: equilibriumX, y: equilibriumY, gap: outputGap };
  }
  return null;
}
