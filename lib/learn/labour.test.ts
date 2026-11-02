import { describe, expect, it } from "vitest";
import { lafferPeak, lafferRevenue, okunGap, okunUnemployment, phillips, usUnemployment } from "./labour";
import { baselineEconomy, employmentFE, mpl, labourSupply, Ystar } from "../macro/model";

describe("labour market and FE", () => {
  const p = baselineEconomy("closed");
  it("clears at the FE point: demand equals supply", () => {
    const N = employmentFE(p);
    const w = mpl(p, N);
    expect(labourSupply(p, w)).toBeCloseTo(N, 6);
  });
  it("FE moves right with A, K and labour supply and left with the labour tax", () => {
    expect(Ystar({ ...p, A: 1.05 })).toBeGreaterThan(Ystar(p));
    expect(Ystar({ ...p, K: 105 })).toBeGreaterThan(Ystar(p));
    expect(Ystar({ ...p, Ns0: 105 })).toBeGreaterThan(Ystar(p));
    expect(Ystar({ ...p, tauL: 0.3 })).toBeLessThan(Ystar(p));
  });
  it("does not depend on the interest rate or on the money supply", () => {
    expect(Ystar({ ...p, M: p.M * 2, G: p.G + 10, W: p.W + 50 })).toBeCloseTo(Ystar(p), 9);
  });
});
describe("Laffer curve", () => {
  it("raises no revenue at a zero tax, peaks inside the range, and the peak falls as supply gets more responsive", () => {
    expect(lafferRevenue(0, 0.5)).toBe(0);
    const lo = lafferPeak(0.5), hi = lafferPeak(2);
    expect(lo).toBeGreaterThan(0.2);
    expect(lo).toBeLessThan(0.95);
    expect(hi).toBeLessThan(lo);
  });
});
describe("Okun and Phillips", () => {
  it("a one point rise in unemployment above natural is 2.5 percent below FE", () => {
    expect(okunGap(6, 5, 2.5)).toBeCloseTo(-2.5, 9);
    expect(okunUnemployment(okunGap(7.3, 5, 2.5), 5, 2.5)).toBeCloseTo(7.3, 9);
  });
  it("shifts the Phillips curve up one for one with expected inflation", () => {
    expect(phillips(5, 4, 5, 0.5) - phillips(2, 4, 5, 0.5)).toBeCloseTo(3, 9);
    expect(phillips(2, 5, 5, 0.5)).toBe(2);
  });
  it("has the US series peaking in April 2020", () => {
    const peak = usUnemployment.reduce((a, b) => (b.u > a.u ? b : a));
    expect(peak.x).toBeCloseTo(2020 + 3 / 12, 9);
  });
});
