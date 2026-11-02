import { describe, expect, it } from "vitest";
import { basket, deflator, gdpFrom, inflation, nominalGDP, realGDP, switchToImport, threeWays, toyEconomy } from "./measure";

describe("three ways to count GDP", () => {
  const e = { po: 2, qo: 100, pj: 5, qj: 80, sold: 80, wageShare: 0.6 };
  it("gives the same total by production, expenditure and income", () => {
    const t = threeWays(e);
    expect(t.production).toBe(400); // 5 * 80: only the juice, once
    expect(t.expenditure).toBe(t.production);
    expect(t.income).toBeCloseTo(t.production, 9);
    expect(t.valueAddedFarm + t.valueAddedJuice).toBe(t.production);
  });
  it("counts unsold juice as inventory investment, so the totals stay equal", () => {
    const t = threeWays({ ...e, sold: 50 });
    expect(t.inventory).toBe(150);
    expect(t.consumption).toBe(250);
    expect(t.expenditure).toBe(t.production);
  });
  it("stays equal for any prices and quantities", () => {
    for (const po of [1, 3, 7]) for (const pj of [8, 20]) for (const sold of [0, 30, 80]) {
      const t = threeWays({ po, qo: 90, pj, qj: 80, sold, wageShare: 0.3 });
      expect(t.expenditure).toBeCloseTo(t.production, 9);
      expect(t.income).toBeCloseTo(t.production, 9);
    }
  });
});

describe("real against nominal", () => {
  it("equal in the base year, whatever the base year", () => {
    for (let b = 0; b < 5; b++) {
      expect(realGDP(toyEconomy, b, b)).toBeCloseTo(nominalGDP(toyEconomy, b), 9);
      expect(deflator(toyEconomy, b, b)).toBeCloseTo(100, 9);
    }
  });
  it("makes real growth depend on the base year when relative prices move", () => {
    const g = (b: number) => realGDP(toyEconomy, 4, b) / realGDP(toyEconomy, 0, b) - 1;
    expect(g(0)).toBeGreaterThan(g(4)); // phones were dear in 2020, so early prices give them more weight
  });
});

describe("the price index", () => {
  it("equals the basket cost ratio when nobody switches and quality is ignored", () => {
    const c0 = basket.reduce((s, b) => s + b.q * b.p0, 0), c1 = basket.reduce((s, b) => s + b.q * b.p1, 0);
    expect(inflation(0, 0).fixed).toBeCloseTo(100 * (c1 / c0 - 1), 9);
    expect(inflation(0, 0).adjusted).toBeCloseTo(inflation(0, 0).fixed, 9);
  });
  it("substitution and quality each lower measured inflation", () => {
    expect(inflation(5, 0).adjusted).toBeLessThan(inflation(0, 0).fixed);
    expect(inflation(5, 0.6).corrected).toBeLessThan(inflation(5, 0).adjusted);
  });
});

describe("imports in the identity", () => {
  const s = { C: 700, I: 200, G: 250, X: 150, IM: 200 };
  it("adds up C + I + G + X - IM", () => {
    expect(gdpFrom(s)).toBe(1100);
    expect(gdpFrom(switchToImport(s, 0))).toBe(1100);
  });
  it("leaves GDP alone when extra spending goes to imports (C up, IM up by the same amount)", () => {
    expect(gdpFrom({ ...s, C: s.C + 50, IM: s.IM + 50 })).toBe(1100);
  });
  it("lowers GDP by the amount of domestic output replaced when imports displace it", () => {
    expect(gdpFrom({ ...s, IM: s.IM + 50 })).toBe(1050);
  });
});
