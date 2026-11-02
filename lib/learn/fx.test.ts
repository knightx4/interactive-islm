import { describe, expect, it } from "vitest";
import { bigMacRER, carry, depositReturns, regimes, strongCurrency, bigMacRows } from "./fx";

describe("Big Mac real exchange rate", () => {
  it("is 1 when the dollar-converted price equals the US price", () => {
    expect(bigMacRER(10, 2, 5).rer).toBeCloseTo(1, 9);
    expect(bigMacRER(10, 2, 5).implied).toBeCloseTo(2, 9);
  });
  it("is below 1 (undervalued) when the burger is cheaper in dollars", () => {
    expect(bigMacRER(450, 148, 5.7).valuation).toBeLessThan(0);
    expect(bigMacRER(6.5, 0.86, 5.7).valuation).toBeGreaterThan(0);
  });
  it("has rows with positive numbers", () => {
    for (const r of bigMacRows) { expect(r.price).toBeGreaterThan(0); expect(r.perUsd).toBeGreaterThan(0); }
  });
});

describe("a strong currency", () => {
  it("makes our goods dearer abroad, theirs cheaper at home, and lowers net exports", () => {
    const s = strongCurrency(10);
    expect(s.homeGoodAbroad).toBeCloseTo(0.1, 9);
    expect(s.foreignGoodHome).toBeLessThan(0);
    expect(s.nx).toBeLessThan(0);
    expect(strongCurrency(-10).nx).toBeGreaterThan(0);
  });
});

describe("uncovered interest parity", () => {
  it("equalises the two deposits at the parity move", () => {
    const d = depositReturns(5, 2, 0);
    const at = depositReturns(5, 2, d.parity);
    expect(at.gap).toBeCloseTo(0, 9);
  });
  it("expects the high-rate currency to depreciate (e falls)", () => {
    expect(depositReturns(5, 2, 0).parity).toBeLessThan(0);
    expect(depositReturns(2, 5, 0).parity).toBeGreaterThan(0);
  });
  it("sends money abroad when the foreign rate is higher and e is expected flat", () => {
    expect(depositReturns(2, 5, 0).gap).toBeGreaterThan(0);
  });
});

describe("carry trade", () => {
  it("earns about the rate gap if the funding currency does not move", () => {
    expect(carry(0.1, 5.3, 0).perUnit).toBeCloseTo(0.052, 3);
  });
  it("breaks even at the interest parity appreciation of the funding currency", () => {
    const c = carry(0.1, 5.3, 0);
    expect(carry(0.1, 5.3, c.breakeven).perUnit).toBeCloseTo(0, 9);
  });
  it("loses when the funding currency jumps, and leverage scales both ways", () => {
    expect(carry(0.1, 5.3, 12).perUnit).toBeLessThan(0);
    expect(carry(0.1, 5.3, 12, 5).onCapital).toBeCloseTo(5 * carry(0.1, 5.3, 12).perUnit, 12);
  });
});

describe("regimes", () => {
  it("run from most independence to least as stability rises", () => {
    expect(regimes[0].independence).toBeGreaterThan(regimes[regimes.length - 1].independence);
    expect(regimes.map((r) => r.id)).toEqual(["float", "managed", "band", "crawl", "board", "dollar"]);
  });
});
