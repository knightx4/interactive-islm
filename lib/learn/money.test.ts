import { describe, expect, it } from "vitest";
import { base, driverStep, lmDriverIds, lmR, moneyDemand, moneyForRate, multiplier, rounds } from "./money";
import { baselineEconomy, shortRun } from "../macro/model";

describe("money multiplier", () => {
  it("is 1 / rr with no currency drain, and smaller with a drain", () => {
    expect(multiplier(0.1)).toBeCloseTo(10, 9);
    expect(multiplier(0.1, 0.5)).toBeLessThan(multiplier(0.1));
    expect(multiplier(0.2)).toBeLessThan(multiplier(0.1));
  });
  it("rounds converge to initial / rr", () => {
    const r = rounds(100, 0.1, 400);
    expect(r[r.length - 1].total).toBeCloseTo(1000, 3);
    expect(rounds(100, 0.1, 3)[2].total).toBeCloseTo(100 + 90 + 81, 9);
  });
});

describe("LM drivers move LM the way the lesson says", () => {
  const right = new Set(["money-supply", "expected-inflation", "alt-liquidity", "payment-tech"]);
  for (const id of lmDriverIds) {
    it(`${id} up moves LM ${id === "wealth" || id === "alt-risk" ? "left" : "right"}`, () => {
      const after = driverStep(id, 1, base);
      const Y = 100;
      const dr = lmR(after, Y, after.M / 1) - lmR(base, Y, base.M / 1);
      expect(Math.sign(dr)).toBe(right.has(id) ? -1 : 1); // lower r at the same Y = LM right
    });
  }
  it("a higher price level lowers real balances and moves LM left", () => {
    expect(lmR(base, 100, base.M / 1.1)).toBeGreaterThan(lmR(base, 100, base.M));
  });
  it("raising Y raises the rate that clears the money market (LM slopes up)", () => {
    expect(lmR(base, 110, base.M)).toBeGreaterThan(lmR(base, 100, base.M));
  });
  it("money demand is nominal = P x real demand, and clears at the baseline", () => {
    expect(moneyDemand(base, 100, 5)).toBeCloseTo(base.M, 9);
  });
});

describe("policy rate", () => {
  it("raising the nominal rate target requires a smaller money supply, which is a leftward LM", () => {
    const p = baselineEconomy("closed");
    const i0 = 5 + p.piE;
    expect(moneyForRate(p, 100, i0)).toBeCloseTo(p.M, 9);
    expect(moneyForRate(p, 100, i0 + 1)).toBeLessThan(p.M);
    const after = { ...p, M: moneyForRate(p, 100, i0 + 1) };
    expect(shortRun(after, 1).r).toBeGreaterThan(shortRun(p, 1).r);
  });
});
