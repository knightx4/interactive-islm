import { describe, expect, it } from "vitest";
import { explain } from "./why";
import { scenarios, stateForScenario, levelToIndex } from "./scenarios";
import { baselineState, causes, run, setCause } from "./sim";

describe("why it moves", () => {
  it("says nothing when nothing has moved", () => {
    const w = explain(run(baselineState()));
    expect(w.groups).toEqual([]);
    expect(w.short).toBeNull();
  });
  it("names every moved cause of every scenario under the curve it shifts", () => {
    for (const sc of scenarios) {
      const st = stateForScenario(sc, 50);
      const w = explain(run(st));
      const ids = w.groups.flatMap((g) => g.items.map((i) => i.id)).sort();
      expect(ids).toEqual(Object.keys(sc.levels).sort());
      expect(w.short).toBeTruthy();
      expect(w.long).toBeTruthy();
    }
  });
  it("the oil shock shifts FE left and LM left in the long run text", () => {
    const w = explain(run(stateForScenario(scenarios[0], 50)));
    expect(w.groups).toHaveLength(1);
    expect(w.groups[0].curve).toBe("FE");
    expect(w.groups[0].head).toBe("FE shifts left");
    expect(w.long).toMatch(/prices rise/);
    expect(w.long).toMatch(/LM shifts left/);
  });
  it("groups a multi-cause scenario into one heading per curve", () => {
    const w = explain(run(stateForScenario(scenarios[1], 50)));
    expect(w.groups.map((g) => g.curve)).toEqual(["IS", "LM"].filter((c) => w.groups.some((g) => g.curve === c)));
    const is = w.groups.find((g) => g.curve === "IS")!;
    expect(is.items.map((i) => i.id).sort()).toEqual(["assetPrices", "businessConfidence"]);
    expect(is.head).toBe("IS shifts left");
    expect(w.groups.find((g) => g.curve === "LM")!.items.map((i) => i.id)).toEqual(["financialStress"]);
  });
  it("says 'overall' when the causes on one curve pull opposite ways", () => {
    let st = setCause(baselineState(), "govSpending", levelToIndex(1));
    st = setCause(st, "taxes", levelToIndex(1));
    const w = explain(run(st));
    const is = w.groups.find((g) => g.curve === "IS")!;
    expect(new Set(is.items.map((i) => i.dir)).size).toBe(2);
    expect(is.head).toMatch(/overall|cancel/);
  });
  it("every cause, moved alone, appears under exactly one curve", () => {
    for (const c of causes) {
      let st = setCause({ ...baselineState(), open: true }, c.id, levelToIndex(1.5));
      st = { ...st, open: true };
      const w = explain(run(st));
      const ids = w.groups.flatMap((g) => g.items.map((i) => i.id));
      expect(ids, c.id).toEqual([c.id]);
    }
  });
});
