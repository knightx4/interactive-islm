import { describe, expect, it } from "vitest";
import { base, desiredInvestment, desiredSaving, driverStep, isDriverIds, isR, lerpParams, smooth, taxCut } from "./saving";
import { baselineEconomy, shortRun, Ystar } from "../macro/model";

describe("consumption smoothing", () => {
  const flat = Array(10).fill(100);
  it("barely changes consumption for a one-year income shock, and fully for a permanent one", () => {
    const c0 = smooth(flat, 0).c;
    const temp = smooth(flat.map((y, i) => (i === 0 ? y + 50 : y)), 0).c;
    const perm = smooth(flat.map((y) => y + 50), 0).c;
    expect(temp - c0).toBeCloseTo(5, 9);
    expect(perm - c0).toBeCloseTo(50, 9);
  });
  it("spreads a wealth windfall over every year", () => {
    expect(smooth(flat, 100).c - smooth(flat, 0).c).toBeCloseTo(10, 9);
  });
  it("saves the rest of a temporary income gain", () => {
    const s = smooth(flat.map((y, i) => (i === 0 ? y + 50 : y)), 0).saving;
    expect(s[0]).toBeCloseTo(45, 9);
  });
});

describe("IS drivers: the saving-investment market and the IS curve agree", () => {
  const expectRight: Record<string, 1 | -1> = { "investment-outlook": 1, "future-income": 1, wealth: 1, "gov-spending": 1, taxes: -1 };
  for (const id of isDriverIds) {
    it(`${id} up moves IS ${expectRight[id] === 1 ? "right" : "left"}`, () => {
      const after = driverStep(id, 1, base);
      const Y = 100;
      const rBefore = isR(base, Y), rAfter = isR(after, Y);
      expect(Math.sign(rAfter - rBefore)).toBe(expectRight[id]);
      // the same direction from the market: higher r at the same Y means S left or I right
      const dS = desiredSaving(after, Y, 5) - desiredSaving(base, Y, 5);
      const dI = desiredInvestment(after, 5) - desiredInvestment(base, 5);
      expect(Math.sign(dI - dS)).toBe(expectRight[id]);
    });
  }
  it("raising Y shifts S right and lowers the market rate", () => {
    expect(desiredSaving(base, 110, 5)).toBeGreaterThan(desiredSaving(base, 100, 5));
    expect(isR(base, 110)).toBeLessThan(isR(base, 100));
  });
  it("interpolates between before and after", () => {
    const after = driverStep("gov-spending", 1, base);
    expect(lerpParams(base, after, 0.5).G).toBeCloseTo(base.G + 5, 9);
  });
  it("short-run output rises after each right-shifting driver", () => {
    for (const id of ["investment-outlook", "future-income", "wealth", "gov-spending"]) {
      const p = driverStep(id, 1, baselineEconomy("closed"));
      expect(shortRun(p, 1).Y, id).toBeGreaterThan(Ystar(baselineEconomy("closed")));
    }
  });
});

describe("Ricardian equivalence", () => {
  it("shifts IS by nothing when households save the whole cut, and more the less they save", () => {
    expect(taxCut(10, 1, 0.4).dY).toBeCloseTo(0, 9);
    expect(taxCut(10, 0.4, 0.4).dY).toBeCloseTo(15, 9);
    expect(taxCut(10, 0.2, 0.4).dY).toBeGreaterThan(taxCut(10, 0.4, 0.4).dY);
  });
  it("matches the model's tax effect when f equals the propensity to save", () => {
    const after = { ...base, T: base.T - 10 };
    const dY = taxCut(10, base.sY, base.sY).dS;
    // with f = sY the model's own S constant moves by sY*10 - 10
    expect(desiredSaving(after, 100, 5) - desiredSaving(base, 100, 5)).toBeCloseTo(dY, 9);
  });
});
