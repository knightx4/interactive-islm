import { describe, expect, it } from "vitest";
import { baselineEconomy, simulate, type Regime } from "./model";
import { chainFor, detectShift, recipeFor } from "./recipe";
import { shockById, shocksFor } from "./shocks";

const regimes: Regime[] = ["closed", "floating", "fixed"];

describe("recipe and chain", () => {
  it("reads the curve straight from the shift-table row", () => {
    expect(detectShift(shockById("gov-spending-up")!)).toEqual({ curve: "IS", dir: "right" });
    expect(detectShift(shockById("money-supply-up")!)).toEqual({ curve: "LM", dir: "right" });
    expect(detectShift(shockById("alt-risk-up")!)).toEqual({ curve: "LM", dir: "left" });
    expect(detectShift(shockById("productivity-down")!)).toEqual({ curve: "FE", dir: "left" });
  });
  it("builds steps and a chain ending at FE for every shock", () => {
    for (const r of regimes) for (const s of shocksFor(r)) {
      const sim = simulate(baselineEconomy(r), s.apply);
      expect(recipeFor(sim, r, s).length).toBeGreaterThanOrEqual(5);
      const c = chainFor(sim, r, s);
      expect(c[0]).toMatch(/shifts/);
      expect(c[c.length - 1]).toBe("Output returns to FE");
    }
  });
});
