import { describe, it, expect } from "vitest";
import {
  computeIslmAlgebraicIntersection,
  mapControlsToStructuralParams,
} from "./islmModel";

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
