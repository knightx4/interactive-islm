import { describe, expect, it } from "vitest";
import { shockById } from "../macro/shocks";
import { briefs, contributions2008, impliedInflation, recessionRows, taylor, totalContribution, usPolicy, withFloor } from "./policy";

describe("the recession classifier", () => {
  it("has a model shock for every brief, on a different mix of curves", () => {
    const curves = new Set<string>();
    for (const b of briefs) {
      const s = shockById(b.shockId);
      expect(s, b.shockId).toBeDefined();
      curves.add(s!.curve);
      expect(b.why.length).toBeGreaterThan(20);
    }
    expect([...curves].sort()).toEqual(["FE", "IS", "LM"]);
  });
  it("every brief's shock is a leftward shift or a drop in output", () => {
    for (const b of briefs) expect(shockById(b.shockId)!.dir, b.shockId).toBe("left");
  });
});

describe("supply against demand and real against nominal", () => {
  const rows = recessionRows();
  const by = (c: string) => rows.find((r) => r.curve === c)!;
  it("output falls on impact for IS and LM; for FE it falls only as prices adjust", () => {
    expect(by("IS").yImpact).toBeLessThan(0);
    expect(by("LM").yImpact).toBeLessThan(0);
    expect(by("FE").yImpact).toBeCloseTo(0, 6);
    expect(by("FE").yLong).toBeLessThan(0);
  });
  it("prices end lower after a demand recession and higher after a supply recession", () => {
    expect(by("IS").pLong).toBeLessThan(0);
    expect(by("LM").pLong).toBeLessThan(0);
    expect(by("FE").pLong).toBeGreaterThan(0);
  });
  it("demand recessions leave output at FE in the long run", () => {
    expect(by("IS").yLong).toBeCloseTo(0, 6);
    expect(by("LM").yLong).toBeCloseTo(0, 6);
  });
});

describe("2008 and 2009", () => {
  it("the components add to a fall of about 4 percent", () => {
    expect(totalContribution()).toBeCloseTo(-4, 1);
  });
  it("private investment was the biggest negative contributor group", () => {
    const inv = contributions2008.filter((c) => /investment|Inventories/.test(c.name)).reduce((a, c) => a + c.pp, 0);
    expect(inv).toBeLessThan(contributions2008.find((c) => c.name === "Consumption")!.pp);
  });
});

describe("the Taylor rule", () => {
  it("at the target and a closed gap it is inflation plus r*", () => {
    expect(taylor(2, 0)).toBe(4);
  });
  it("inflation 3 and gap -2 give 3 + 2 + 0.5 - 1 = 4.5", () => {
    expect(taylor(3, -2)).toBeCloseTo(4.5, 10);
  });
  it("raises the nominal rate by more than one for one when inflation rises (the Taylor principle)", () => {
    expect(taylor(4, 0) - taylor(3, 0)).toBeCloseTo(1.5, 10);
  });
  it("a deep slump with low inflation asks for a negative rate, which the floor clips to zero", () => {
    const y = usPolicy.find((d) => d.year === 2009)!;
    expect(taylor(y.inflation, y.gap)).toBeLessThan(0);
    expect(withFloor(taylor(y.inflation, y.gap))).toBe(0);
  });
  it("had the 2022 rule been followed it would have been far above the actual rate", () => {
    const y = usPolicy.find((d) => d.year === 2022)!;
    expect(taylor(y.inflation, y.gap)).toBeGreaterThan(y.funds + 5);
  });
});

describe("nominal GDP targeting", () => {
  it("lets inflation rise when real growth falls", () => {
    expect(impliedInflation(4, 2)).toBe(2);
    expect(impliedInflation(4, -1)).toBe(5);
  });
});
