import { describe, expect, it } from "vitest";
import { shockById } from "../macro/shocks";
import { bondPrice, instantPath, lmPuzzle, longRunPrice, pathAt, pointAt, regionOf } from "./fullmodel";

const apply = (id: string) => shockById(id)!.apply;

describe("price changes move LM", () => {
  it("a higher price level lowers real money, raises r and lowers bond prices; a lower one does the reverse", () => {
    const a = pointAt(1, 0), up = pointAt(1.1, 0), down = pointAt(0.9, 0);
    expect(up.r).toBeGreaterThan(a.r);
    expect(down.r).toBeLessThan(a.r);
    expect(bondPrice(up.i)).toBeLessThan(bondPrice(a.i));
    expect(bondPrice(down.i)).toBeGreaterThan(bondPrice(a.i));
    expect(up.Y).toBeLessThan(a.Y);
    expect(down.Y).toBeGreaterThan(a.Y);
  });
  it("puts the IS-LM point left of FE (slack) when the price level is high and right of it (scarcity) when low", () => {
    expect(regionOf(pointAt(1, 0).gap)).toBe("balance");
    expect(regionOf(pointAt(1.1, 0).gap)).toBe("slack");
    expect(regionOf(pointAt(0.9, 0).gap)).toBe("scarcity");
  });
  it("the long-run price puts the point on FE", () => {
    for (const dG of [-10, 0, 10]) expect(Math.abs(pointAt(longRunPrice(dG), dG).gap)).toBeLessThan(1e-6);
  });
});

describe("money neutrality and the speed of price adjustment", () => {
  const up = apply("money-supply-up");
  it("with instant prices only P moves, by the same share as M", () => {
    const f = instantPath(up, 20);
    expect(f[1].Y).toBeCloseTo(f[0].Y, 6);
    expect(f[1].r).toBeCloseTo(f[0].r, 6);
    expect(f[1].P).toBeCloseTo(1.1, 6);
  });
  it("with slow prices output rises first and the slower the speed the longer it stays up", () => {
    const slow = pathAt(up, 0.1, 20), fast = pathAt(up, 1, 20);
    expect(slow[1].Y).toBeGreaterThan(slow[0].Y);
    expect(slow[10].Y - slow[0].Y).toBeGreaterThan(fast[10].Y - fast[0].Y);
    expect(slow[20].P).toBeLessThan(fast[20].P);
  });
  it("both paths end at the same long-run price", () => {
    expect(pathAt(up, 0.3, 200)[200].P).toBeCloseTo(1.1, 2);
  });
});

describe("the money-demand puzzle", () => {
  it("income raises demand and the rate lowers it by the same amount along LM", () => {
    for (const Y of [90, 100, 112]) {
      const z = lmPuzzle(Y);
      expect(z.total).toBeCloseTo(0, 9);
      expect(z.demand).toBeCloseTo(z.supply, 9);
    }
    expect(lmPuzzle(112).fromIncome).toBeGreaterThan(0);
    expect(lmPuzzle(112).fromRate).toBeLessThan(0);
  });
});

describe("the two recipe shocks", () => {
  it("a money rise leaves r and Y unchanged in the long run and a spending rise raises r and P", () => {
    const m = pathAt(apply("money-supply-up"), 0.5, 300), g = pathAt(apply("gov-spending-up"), 0.5, 300);
    expect(m[300].Y).toBeCloseTo(m[0].Y, 1);
    expect(m[300].r).toBeCloseTo(m[0].r, 1);
    expect(g[300].r).toBeGreaterThan(g[0].r);
    expect(g[300].P).toBeGreaterThan(1);
    expect(g[1].Y).toBeGreaterThan(g[0].Y);
  });
});
