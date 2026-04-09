import { describe, it, expect } from "vitest";
import {
  computeIslmAlgebraicIntersection,
  computeLmShift,
  computeIsShift,
  IS_BASE_INTERCEPT,
  LM_BASE_INTERCEPT,
  IS_SLOPE,
  LM_SLOPE,
  SHIFT_SCALE,
} from "./islmModel";

describe("computeLmShift", () => {
  it("matches IS-LM formula (Md - Ms) / 2 * SHIFT_SCALE", () => {
    expect(computeLmShift(60, 40)).toBe(((60 - 40) / 2) * SHIFT_SCALE);
    expect(computeLmShift(50, 50)).toBe(0);
  });

  it("differs from the old Labor-chart average formula when Ms ≠ 50", () => {
    const md = 60;
    const ms = 40;
    const islm = computeLmShift(md, ms);
    const legacyLabor = ((ms + md) / 2 - 50) * SHIFT_SCALE;
    expect(islm).not.toBe(legacyLabor);
    expect(islm).toBe(((md - ms) / 2) * SHIFT_SCALE);
    expect(legacyLabor).toBe(0);
  });
});

describe("computeIslmAlgebraicIntersection", () => {
  it("matches closed-form intersection of IS and LM lines", () => {
    const params = {
      investment: 55,
      savings: 45,
      moneySupply: 45,
      moneyDemand: 55,
      fullEmployment: 48,
      governmentSpending: 52,
      taxes: 48,
    };
    const alg = computeIslmAlgebraicIntersection(params);
    const isShift = computeIsShift(
      params.investment,
      params.savings,
      params.governmentSpending,
      params.taxes
    );
    const lmShift = computeLmShift(params.moneyDemand, params.moneySupply);
    const x =
      (IS_BASE_INTERCEPT + isShift - (LM_BASE_INTERCEPT + lmShift)) /
      (LM_SLOPE - IS_SLOPE);
    const y = IS_BASE_INTERCEPT + isShift + IS_SLOPE * x;

    expect(alg.isShift).toBe(isShift);
    expect(alg.lmShift).toBe(lmShift);
    expect(alg.equilibriumX).toBeCloseTo(x);
    expect(alg.equilibriumY).toBeCloseTo(y);
    expect(alg.outputGap).toBeCloseTo(alg.equilibriumX - params.fullEmployment);
  });
});
