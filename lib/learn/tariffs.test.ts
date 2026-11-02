import { describe, expect, it } from "vitest";
import { answers, econs, simulateTariff, type Kind } from "./tariffs";

const sim = (id: string, kind: Kind, eased = false) => simulateTariff(econs.find((e) => e.id === id)!, kind, eased);

describe("the three tariff shocks", () => {
  for (const e of econs) {
    it(`${e.name}: the supply shock moves FE left and raises prices, with no change in output at impact`, () => {
      const s = sim(e.id, "supply");
      expect(s.impact.Ystar).toBeLessThan(s.baseline.Ystar);
      expect(s.impact.Y).toBeCloseTo(s.baseline.Y, 6);
      expect(s.longRun.P).toBeGreaterThan(s.baseline.P);
    });
    it(`${e.name}: demand and uncertainty shift IS left: output and the real rate fall, prices end lower`, () => {
      for (const k of ["demand", "uncertainty"] as const) {
        const s = sim(e.id, k);
        expect(s.impact.Y, k).toBeLessThan(s.baseline.Y);
        expect(s.impact.r, k).toBeLessThan(s.baseline.r);
        expect(s.longRun.P, k).toBeLessThan(s.baseline.P);
      }
    });
    it(`${e.name}: the long run returns to full employment`, () => {
      const s = sim(e.id, "all");
      expect(s.longRun.Y).toBeCloseTo(s.longRun.Ystar, 6);
    });
  }
  it("combined, output falls and prices rise in the US, where the supply shock is large", () => {
    const a = answers(sim("us", "all"));
    expect(a.Y).toBe("down");
    expect(a.P).toBe("up");
  });
  it("combined, the euro area's price pressure is small and China's is deflationary under its peg", () => {
    expect(Math.abs(answers(sim("ea", "all")).pressure)).toBeLessThan(0.03);
    expect(answers(sim("cn", "all")).P).toBe("down");
  });
  it("the policy rule: Fed holds, ECB cuts, People's Bank cuts", () => {
    expect(answers(sim("us", "all")).policy).toBe("hold");
    expect(answers(sim("ea", "all")).policy).toBe("cut");
    expect(answers(sim("cn", "all")).policy).toBe("cut");
  });
  it("easing lifts output at impact in each economy", () => {
    for (const e of econs) expect(sim(e.id, "all", true).impact.Y).toBeGreaterThan(sim(e.id, "all", false).impact.Y);
  });
});
