import { describe, expect, it } from "vitest";
import { baselineEconomy, longRun, shortRun, simulate, Ystar, type Regime } from "./model";
import { shocks, shocksFor } from "./shocks";
import { direction, questionsFor } from "./predict";

const regimes: Regime[] = ["closed", "floating", "fixed"];

describe("baseline", () => {
  it.each(regimes)("%s economy rests at full employment with P = 1", (r) => {
    const p = baselineEconomy(r);
    const pt = shortRun(p, 1);
    expect(pt.Y).toBeCloseTo(Ystar(p), 6);
    expect(pt.r).toBeCloseTo(5, 6);
    expect(pt.q).toBeCloseTo(1, 6);
    expect(pt.NX).toBeCloseTo(0, 6);
    const lr = longRun(p);
    expect(lr.P).toBeCloseTo(1, 6);
  });
});

describe("price adjustment", () => {
  for (const r of regimes) {
    for (const s of shocksFor(r)) {
      it(`${r}: ${s.id} converges to the long-run equilibrium`, () => {
        const sim = simulate(baselineEconomy(r), s.apply, 400);
        const last = sim.frames[sim.frames.length - 1];
        expect(last.Y).toBeCloseTo(sim.longRun.Y, 3);
        expect(last.P).toBeCloseTo(sim.longRun.P, 2);
        expect(last.r).toBeCloseTo(sim.longRun.r, 2);
        expect(last.q).toBeCloseTo(sim.longRun.q, 1);
      });
    }
  }
});

describe("textbook directions", () => {
  const dirs = (r: Regime, id: string) => {
    const s = shocks.find((x) => x.id === id)!;
    const sim = simulate(baselineEconomy(r), s.apply);
    return Object.fromEntries(questionsFor(sim, r).map((q) => [q.id, q.answer]));
  };
  it("closed fiscal expansion: Y and r up, then crowding out and higher P", () => {
    expect(dirs("closed", "fiscal-spend")).toMatchObject({ "Y-short": "up", "r-short": "up", "Y-long": "same", "P-long": "up" });
  });
  it("closed money expansion: Y up, r down, P up, r back to start", () => {
    const d = dirs("closed", "money-up");
    expect(d).toMatchObject({ "Y-short": "up", "r-short": "down", "Y-long": "same", "P-long": "up" });
  });
  it("floating: fiscal expansion raises Y not at all, appreciates currency", () => {
    expect(dirs("floating", "fiscal-spend")).toMatchObject({ "Y-short": "same", "q-long": "up" });
  });
  it("floating: money expansion lifts Y", () => {
    expect(dirs("floating", "money-up")["Y-short"]).toBe("up");
  });
  it("fixed: money expansion does nothing, fiscal expansion lifts Y", () => {
    expect(dirs("fixed", "money-up")["Y-short"]).toBe("same");
    expect(dirs("fixed", "fiscal-spend")["Y-short"]).toBe("up");
  });
  it("productivity: Y* rises, P falls", () => {
    expect(dirs("closed", "productivity-up")).toMatchObject({ "Y-long": "up", "P-long": "down" });
  });
  it("direction helper", () => {
    expect(direction(100, 100.5)).toBe("same");
    expect(direction(100, 105)).toBe("up");
    expect(direction(100, 90)).toBe("down");
  });
});

import { chainFor, detectShift, recipeFor } from "./recipe";

describe("recipe and chain", () => {
  const run = (r: Regime, id: string) => simulate(baselineEconomy(r), shocks.find((x) => x.id === id)!.apply);
  it("detects the curve each shock moves", () => {
    expect(detectShift(run("closed", "fiscal-spend"))).toEqual({ curve: "IS", dir: "right" });
    expect(detectShift(run("closed", "money-up"))).toEqual({ curve: "LM", dir: "right" });
    expect(detectShift(run("closed", "money-demand-up"))).toEqual({ curve: "LM", dir: "left" });
    expect(detectShift(run("closed", "supply-down"))).toEqual({ curve: "FE", dir: "left" });
  });
  it("builds five steps and a chain ending at FE for every shock", () => {
    for (const r of regimes) for (const s of shocksFor(r)) {
      const sim = simulate(baselineEconomy(r), s.apply);
      expect(recipeFor(sim, r, s.label)).toHaveLength(5);
      const c = chainFor(sim, r);
      expect(c[0]).toMatch(/shifts/);
      expect(c[c.length - 1]).toBe("Output returns to FE");
    }
  });
});
