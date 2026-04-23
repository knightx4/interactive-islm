import { describe, it, expect } from "vitest";
import {
  buildLoanableFundsSeries,
  computeLoanableFundsEquilibrium,
  computeIslmAlgebraicIntersection,
  mapControlsToStructuralParams,
} from "./islmModel";

const NEUTRAL = {
  investment: 50,
  savings: 50,
  moneySupply: 50,
  moneyDemand: 50,
  fullEmployment: 50,
  governmentSpending: 0,
  netExports: 0,
};

describe("computeIslmAlgebraicIntersection", () => {
  it("matches the structural reduced-form solution for Y* and r*", () => {
    const params = {
      investment: 55,
      savings: 45,
      moneySupply: 45,
      moneyDemand: 55,
      fullEmployment: 48,
      governmentSpending: 2,
      netExports: 0,
    };

    const sp = mapControlsToStructuralParams(params);
    const denominator = 1 - sp.c + (sp.b * sp.k) / sp.h;
    const expectedY =
      (sp.autonomousDemand + (sp.b / sp.h) * (sp.mOverP - sp.l0)) / denominator;
    const expectedR = (sp.k / sp.h) * expectedY + (sp.l0 - sp.mOverP) / sp.h;

    const alg = computeIslmAlgebraicIntersection(params);
    expect(alg.equilibriumX).toBeCloseTo(expectedY);
    expect(alg.equilibriumY).toBeCloseTo(expectedR);
    expect(alg.outputGap).toBeCloseTo(alg.equilibriumX - params.fullEmployment);
  });

  it("keeps neutral baseline near (Y,r)=(50,10)", () => {
    const neutral = computeIslmAlgebraicIntersection({
      investment: 50,
      savings: 50,
      moneySupply: 50,
      moneyDemand: 50,
      fullEmployment: 50,
      governmentSpending: 0,
      netExports: 0,
    });
    expect(neutral.equilibriumX).toBeCloseTo(50, 3);
    expect(neutral.equilibriumY).toBeCloseTo(10, 3);
  });

  it("shows fiscal multiplier dampening vs simple Keynesian multiplier", () => {
    const base = {
      investment: 50,
      savings: 50,
      moneySupply: 50,
      moneyDemand: 50,
      fullEmployment: 50,
      governmentSpending: 0,
      netExports: 0,
    };

    const shock = { ...base, governmentSpending: -10 };
    const baseEq = computeIslmAlgebraicIntersection(base);
    const shockEq = computeIslmAlgebraicIntersection(shock);

    const sp = mapControlsToStructuralParams(base);
    const islmMultiplier = 1 / (1 - sp.c + (sp.b * sp.k) / sp.h);
    const keynesianMultiplier = 1 / (1 - sp.c);

    expect(islmMultiplier).toBeLessThan(keynesianMultiplier);
    expect(shockEq.equilibriumX).toBeGreaterThan(baseEq.equilibriumX);
  });

  it("raises output after a positive money-supply shock", () => {
    const lowMoney = computeIslmAlgebraicIntersection({
      investment: 55,
      savings: 50,
      moneySupply: 40,
      moneyDemand: 50,
      fullEmployment: 50,
      governmentSpending: 0,
      netExports: 0,
    });
    const highMoney = computeIslmAlgebraicIntersection({
      investment: 55,
      savings: 50,
      moneySupply: 60,
      moneyDemand: 50,
      fullEmployment: 50,
      governmentSpending: 0,
      netExports: 0,
    });
    expect(highMoney.equilibriumX).toBeGreaterThan(lowMoney.equilibriumX);
  });
});

describe("mapControlsToStructuralParams", () => {
  it("keeps mapped coefficients in stable ranges", () => {
    const sp = mapControlsToStructuralParams({
      investment: 100,
      savings: 0,
      moneySupply: 0,
      moneyDemand: 100,
      fullEmployment: 50,
      governmentSpending: -50,
      netExports: 50,
    });
    expect(sp.c).toBeGreaterThanOrEqual(0.2);
    expect(sp.c).toBeLessThanOrEqual(0.85);
    expect(sp.h).toBeGreaterThan(0);
    expect(sp.b).toBeGreaterThan(0);
  });
});

describe("loanable funds panel matches macro equilibrium", () => {
  const scenarios: Array<[string, Partial<typeof NEUTRAL>]> = [
    ["neutral", {}],
    ["higher investment", { investment: 65 }],
    ["higher savings", { savings: 65 }],
    ["expansionary money", { moneySupply: 60 }],
    ["contractionary money", { moneySupply: 40 }],
    ["fiscal deficit", { governmentSpending: -10 }],
    ["positive net exports", { netExports: 15 }],
    ["mixed shock", {
      investment: 60,
      savings: 55,
      moneySupply: 55,
      governmentSpending: -5,
      netExports: 5,
    }],
  ];

  scenarios.forEach(([label, override]) => {
    it(`panel r* equals IS-LM macro r* for scenario: ${label}`, () => {
      const params = { ...NEUTRAL, ...override };
      const macro = computeIslmAlgebraicIntersection(params);
      const panel = computeLoanableFundsEquilibrium(params);
      expect(panel.y).toBeCloseTo(macro.equilibriumY, 6);
    });
  });
});

describe("buildLoanableFundsSeries", () => {
  it("shifts S curve right and leaves I curve unchanged when savings increases", () => {
    const baseSeries = buildLoanableFundsSeries(NEUTRAL);
    const higherSavings = buildLoanableFundsSeries({ ...NEUTRAL, savings: 60 });

    // Pick an r just above baseline so both points are in-range.
    const probeR = 10;
    const baseSavingsX = baseSeries
      .filter((p) => p.savingsR !== null)
      .reduce((best, p) =>
        Math.abs((p.savingsR as number) - probeR) <
        Math.abs((best.savingsR as number) - probeR)
          ? p
          : best
      );
    const shiftSavingsX = higherSavings
      .filter((p) => p.savingsR !== null)
      .reduce((best, p) =>
        Math.abs((p.savingsR as number) - probeR) <
        Math.abs((best.savingsR as number) - probeR)
          ? p
          : best
      );

    // More savings -> S curve shifts to the right (more funds supplied at same r).
    expect(shiftSavingsX.x).toBeGreaterThan(baseSavingsX.x);

    // I curve should be identical (investment drivers unchanged).
    const baseInvestmentAtX50 = baseSeries.find((p) => p.x === 50)?.investmentR;
    const shiftInvestmentAtX50 = higherSavings.find((p) => p.x === 50)?.investmentR;
    expect(baseInvestmentAtX50).not.toBeNull();
    expect(shiftInvestmentAtX50).not.toBeNull();
    expect(shiftInvestmentAtX50 as number).toBeCloseTo(
      baseInvestmentAtX50 as number,
      10
    );
  });

  it("shifts I curve right and leaves S curve untouched by investment slider", () => {
    const baseSeries = buildLoanableFundsSeries(NEUTRAL);
    const higherInvestment = buildLoanableFundsSeries({
      ...NEUTRAL,
      investment: 60,
    });

    const baseInvestmentAtX50 = baseSeries.find((p) => p.x === 50)?.investmentR;
    const shiftInvestmentAtX50 = higherInvestment.find((p) => p.x === 50)
      ?.investmentR;
    // I curve moves up (at a given x, higher r), i.e. shifts right on the chart.
    expect(shiftInvestmentAtX50 as number).toBeGreaterThan(
      baseInvestmentAtX50 as number
    );

    // Savings curve moves too — but only via the LM→Y* income channel.
    // That channel is weaker than the direct investment shift, so S moves less.
    const baseSavingsAtX50 = baseSeries.find((p) => p.x === 50)?.savingsR;
    const shiftSavingsAtX50 = higherInvestment.find((p) => p.x === 50)?.savingsR;
    const investmentDelta = Math.abs(
      (shiftInvestmentAtX50 as number) - (baseInvestmentAtX50 as number)
    );
    const savingsDelta = Math.abs(
      (shiftSavingsAtX50 as number) - (baseSavingsAtX50 as number)
    );
    expect(savingsDelta).toBeLessThan(investmentDelta);
  });

  it("shifts S curve right when money supply rises (LM → IS income channel)", () => {
    const baseSeries = buildLoanableFundsSeries(NEUTRAL);
    const easyMoney = buildLoanableFundsSeries({ ...NEUTRAL, moneySupply: 60 });

    const baseSavingsAtX50 = baseSeries.find((p) => p.x === 50)?.savingsR;
    const easyMoneySavingsAtX50 = easyMoney.find((p) => p.x === 50)?.savingsR;
    // Higher Y* → more savings supplied at every r → S curve shifts to the
    // RIGHT. For an upward-sloping line in (x, r) space, a rightward shift
    // means that at a fixed x the curve now sits at a LOWER r.
    expect(easyMoneySavingsAtX50 as number).toBeLessThan(
      baseSavingsAtX50 as number
    );

    // I curve untouched by monetary policy.
    const baseI = baseSeries.find((p) => p.x === 50)?.investmentR;
    const easyI = easyMoney.find((p) => p.x === 50)?.investmentR;
    expect(easyI as number).toBeCloseTo(baseI as number, 10);
  });
});
