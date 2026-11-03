import { describe, expect, it } from "vitest";
import { indexToLevel, levelToIndex, scenarios, stateForScenario } from "./scenarios";
import { headlineFor, phaseAt, positionOf, settleIndex } from "./playback";
import { baselineState, isBaseline, run, viewAt } from "./sim";
import { causes } from "./sim";

describe("scenarios", () => {
  it("levels map onto cause units and back", () => {
    expect(levelToIndex(3)).toBeCloseTo(50);
    expect(indexToLevel(levelToIndex(-2.5))).toBe(-2.5);
    expect(indexToLevel(levelToIndex(0.5))).toBe(0.5);
  });
  it("every scenario names real causes and moves the economy", () => {
    for (const sc of scenarios) {
      const st = stateForScenario(sc, 50);
      for (const id of Object.keys(sc.levels)) expect(causes.some((c) => c.id === id)).toBe(true);
      expect(isBaseline(st)).toBe(false);
      expect(st.t).toBe(0);
      const rn = run(st);
      const { baseline, impact, longRun } = rn.sim;
      expect(Math.abs(impact.Y - baseline.Y) + Math.abs(longRun.P - baseline.P) + Math.abs(longRun.Y - baseline.Y)).toBeGreaterThan(0.01);
    }
  });
  it("the tariff scenario opens the economy", () => {
    expect(stateForScenario(scenarios[3], 50).open).toBe(true);
  });
  it("keeps the price speed", () => {
    expect(stateForScenario(scenarios[0], 100).speed).toBe(100);
  });
});

describe("playback helpers", () => {
  it("positions and phases agree", () => {
    expect(positionOf("A", 82)).toBe(0);
    expect(positionOf("B", 82)).toBe(1);
    expect(positionOf("C", 82)).toBe(81);
    expect(phaseAt(0, 82)).toBe("A");
    expect(phaseAt(1, 82)).toBe("B");
    expect(phaseAt(10, 82)).toBe("moving");
    expect(phaseAt(81, 82)).toBe("C");
  });
  it("prices settle sooner when they adjust at once", () => {
    const slow = run(stateForScenario(scenarios[0], 50));
    const fast = run(stateForScenario(scenarios[0], 100));
    expect(settleIndex(fast.sim)).toBeLessThan(settleIndex(slow.sim));
    expect(settleIndex(slow.sim)).toBeLessThan(slow.length);
  });
  it("the headline says where the economy is", () => {
    const rest = baselineState();
    expect(headlineFor(rest, "A", 100, 100)).toBe("The economy at rest");
    const oil = stateForScenario(scenarios[0], 50);
    const rn = run(oil);
    const B = viewAt(rn.sim, 1).frame;
    expect(headlineFor(oil, "B", B.Y, B.Ystar)).toBe("Short run: running hot");
    const C = viewAt(rn.sim, rn.length - 1).frame;
    expect(headlineFor(oil, "C", C.Y, C.Ystar)).toBe("Long run: back at full employment");
    const stim = run(stateForScenario(scenarios[2], 50));
    const sB = viewAt(stim.sim, 1).frame;
    expect(sB.Y).toBeGreaterThan(sB.Ystar);
    const wealth = run(stateForScenario(scenarios[1], 50));
    const wB = viewAt(wealth.sim, 1).frame;
    expect(headlineFor(stateForScenario(scenarios[1], 50), "B", wB.Y, wB.Ystar)).toBe("Short run: slack");
  });
});
