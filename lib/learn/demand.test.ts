import { describe, expect, it } from "vitest";
import { simulate } from "../macro/model";
import { shockById } from "../macro/shocks";
import { economy } from "./fullmodel";
import { lmLine, modelMultiplier, multiplierSimple, stimulusRun, trap } from "./demand";

const run = (id: string) => simulate(economy, shockById(id)!.apply, 60);

describe("demand shocks through IS and LM", () => {
  it("every IS and LM demand shock lowers output now, lowers prices later and leaves long-run output on FE", () => {
    for (const id of ["investment-outlook-down", "future-income-down", "wealth-down", "taxes-up", "expected-inflation-down", "money-supply-down"]) {
      const s = run(id);
      expect(s.impact.Y, id).toBeLessThan(s.baseline.Y);
      expect(s.longRun.P, id).toBeLessThan(1);
      expect(s.longRun.Y, id).toBeCloseTo(s.baseline.Y, 6);
      expect(s.impact.Y, id).toBeLessThan(s.impact.Ystar);
    }
  });
  it("an IS shock moves r the same way as Y at first; an LM shock moves them in opposite ways", () => {
    for (const id of ["wealth-down", "future-income-down", "taxes-up"]) expect(run(id).impact.r, id).toBeLessThan(5);
    for (const id of ["expected-inflation-down", "money-supply-down"]) expect(run(id).impact.r, id).toBeGreaterThan(5);
  });
  it("slack pulls prices down so LM drifts right and output recovers", () => {
    const s = run("taxes-up");
    expect(s.frames[10].Y).toBeGreaterThan(s.frames[1].Y);
    expect(s.frames[10].P).toBeLessThan(1);
  });
  it("with prices that move faster the output gap closes sooner", () => {
    const slow = stimulusRun(60, 0, 0.1, 20), fast = stimulusRun(60, 0, 1, 20);
    expect(Math.abs(fast[10].Y - 100)).toBeLessThan(Math.abs(slow[10].Y - 100));
  });
});

describe("stimulus", () => {
  it("raises output at the low point and shortens the slump, with less fall in prices", () => {
    const none = stimulusRun(60, 0), help = stimulusRun(60, 4);
    expect(help[1].Y).toBeGreaterThan(none[1].Y);
    expect(help[10].P).toBeGreaterThan(none[10].P);
  });
  it("the same stimulus at full employment pushes output above FE and prices up instead", () => {
    const f = stimulusRun(0, 8, 0.3, 40, false);
    expect(f[1].Y).toBeGreaterThan(f[1].Ystar);
    expect(f[40].P).toBeGreaterThan(1.05);
  });
  it("the textbook multiplier rises with the marginal propensity to consume, and the model's is smaller because the rate responds", () => {
    expect(multiplierSimple(0.8)).toBeGreaterThan(multiplierSimple(0.6));
    expect(multiplierSimple(0.6)).toBeCloseTo(2.5, 9);
    expect(modelMultiplier("spending")).toBeLessThan(multiplierSimple(1 - economy.sY));
    expect(modelMultiplier("spending")).toBeGreaterThan(0);
    expect(modelMultiplier("tax-cut")).toBeGreaterThan(0);
    expect(modelMultiplier("tax-cut")).toBeLessThan(modelMultiplier("spending"));
  });
});

describe("the liquidity trap sketch", () => {
  it("in an ordinary slump more money raises output", () => {
    const a = trap(2, 0, 0), b = trap(2, 40, 0);
    expect(a.atFloor).toBe(false);
    expect(b.x).toBeGreaterThan(a.x);
  });
  it("once the rate is at the floor, more money changes nothing but spending raises output", () => {
    const deep = trap(-4, 0, 0), money = trap(-4, 100, 0), fiscal = trap(-4, 0, 10);
    expect(deep.atFloor).toBe(true);
    expect(deep.r).toBe(0);
    expect(money.x).toBeCloseTo(deep.x, 9);
    expect(fiscal.x).toBeGreaterThan(deep.x);
  });
  it("the lm line never goes below the floor", () => {
    expect(lmLine(100, -50)).toBe(0);
  });
});
