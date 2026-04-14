/**
 * Linear teaching toy for IS-LM. All axes are index / model units (not calibrated to data).
 */

export const SHIFT_SCALE = 0.2;
export const OUTPUT_GAP_TOLERANCE = 5;

export const IS_SLOPE = -0.15;
export const LM_SLOPE = 0.15;
export const LM_MONEY_DEMAND_SLOPE = -0.15;

/** Slopes for the decomposed Investment–Savings panel (I vs S). */
export const IS_PANEL_IS_SLOPE = -0.15;
export const IS_PANEL_S_SLOPE = 0.15;

/** Intercepts so IS and LM meet at (50, 10) when shifts are zero at baseline. */
export const IS_BASE_INTERCEPT = 10 - IS_SLOPE * 50;
export const LM_BASE_INTERCEPT = 10 - LM_SLOPE * 50;

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

export function computeInvestmentShift(investment: number): number {
  return (investment - 50) * SHIFT_SCALE;
}

export function computeSavingsShift(savings: number): number {
  return (50 - savings) * SHIFT_SCALE;
}

/**
 * Combined IS shift (IS-LM panel): open-economy goods market bundles **I + NX** vs saving,
 * plus government spending (fiscal).
 */
export function computeIsShift(
  investment: number,
  savings: number,
  governmentSavings: number,
  netExports: number
): number {
  const privatePart =
    ((investment + netExports + (100 - savings)) / 2 - 50) * SHIFT_SCALE;
  // Slider stores government savings (T-G). Higher savings => lower G => leftward IS shift.
  const fiscalPart = -governmentSavings * (SHIFT_SCALE / 2);
  return privatePart + fiscalPart;
}

/** Shift for the IS decomposition chart: planned spending side is I + NX vs S. */
export function computeOpenEconomyInvestmentSideShift(
  investment: number,
  netExports: number
): number {
  return computeInvestmentShift(investment + netExports);
}

export function computeLmShift(moneyDemand: number, moneySupply: number): number {
  return ((moneyDemand - moneySupply) / 2) * SHIFT_SCALE;
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
  const isShift = computeIsShift(
    params.investment,
    params.savings,
    params.governmentSpending,
    params.netExports
  );
  const lmShift = computeLmShift(params.moneyDemand, params.moneySupply);

  const equilibriumX =
    (IS_BASE_INTERCEPT + isShift - (LM_BASE_INTERCEPT + lmShift)) /
    (LM_SLOPE - IS_SLOPE);
  const equilibriumY =
    IS_BASE_INTERCEPT + isShift + IS_SLOPE * equilibriumX;
  const outputGap = equilibriumX - params.fullEmployment;

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
  isShift: number,
  lmShift: number,
  step = 2
): IslmChartPoint[] {
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

export interface IsChartPoint {
  x: number;
  investmentY: number;
  savingsY: number;
}

export function buildIsChartSeries(
  investmentShift: number,
  savingsShift: number,
  step = 5
): IsChartPoint[] {
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
  investmentShift: number,
  savingsShift: number
): { x: number; y: number } | null {
  const isBaseIntercept = 10 - IS_PANEL_IS_SLOPE * 50;
  const sBaseIntercept = 10 - IS_PANEL_S_SLOPE * 50;
  const equilibriumX =
    (isBaseIntercept + investmentShift - (sBaseIntercept + savingsShift)) /
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

export interface LmChartPoint {
  x: number;
  moneyDemandY: number;
}

const LM_CHART_BASE_INTERCEPT = 10 - LM_MONEY_DEMAND_SLOPE * 50;

export function computeMoneyDemandShift(moneyDemand: number): number {
  return (moneyDemand - 50) * SHIFT_SCALE;
}

export function buildLmChartSeries(
  moneyDemandShift: number,
  step = 5
): LmChartPoint[] {
  const data: LmChartPoint[] = [];
  for (let x = 0; x <= 100; x += step) {
    const moneyDemandY =
      LM_CHART_BASE_INTERCEPT + moneyDemandShift + LM_MONEY_DEMAND_SLOPE * x;
    data.push({
      x,
      moneyDemandY: Math.max(0, Math.min(20, moneyDemandY)),
    });
  }
  return data;
}

export function computeLmMoneyMarketEquilibrium(
  moneySupply: number,
  moneyDemandShift: number
): { x: number; y: number } | null {
  const y =
    LM_CHART_BASE_INTERCEPT +
    moneyDemandShift +
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
