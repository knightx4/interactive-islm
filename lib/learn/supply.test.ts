import { describe, expect, it } from "vitest";
import { simulate } from "../macro/model";
import { shockById } from "../macro/shocks";
import { economy } from "./fullmodel";
import { hurricaneRun, policyRun, us1970s } from "./supply";

describe("stagflation", () => {
  const s = simulate(economy, shockById("productivity-down")!.apply, 60);
  it("an adverse supply shock leaves the short-run point alone, then lowers output, raises prices, lowers employment and the real wage", () => {
    expect(s.impact.Y).toBeCloseTo(s.baseline.Y, 6);
    expect(s.impact.r).toBeCloseTo(s.baseline.r, 6);
    expect(s.impact.Y).toBeGreaterThan(s.impact.Ystar);
    expect(s.longRun.Y).toBeLessThan(s.baseline.Y);
    expect(s.longRun.P).toBeGreaterThan(s.baseline.P);
    expect(s.longRun.N).toBeLessThan(s.baseline.N);
    expect(s.longRun.w).toBeLessThan(s.baseline.w);
    expect(s.impact.w).toBeLessThan(s.baseline.w);
  });
  it("a positive supply shock does the reverse", () => {
    const g = simulate(economy, shockById("productivity-up")!.apply, 60);
    expect(g.longRun.Y).toBeGreaterThan(g.baseline.Y);
    expect(g.longRun.P).toBeLessThan(g.baseline.P);
    expect(g.longRun.w).toBeGreaterThan(g.baseline.w);
    const k = simulate(economy, shockById("capital-up")!.apply, 60);
    expect(k.longRun.Y).toBeGreaterThan(k.baseline.Y);
    expect(k.longRun.P).toBeLessThan(k.baseline.P);
  });
});

describe("policy after a supply shock", () => {
  const none = policyRun(0), ease = policyRun(10), tight = policyRun(-10), hard = policyRun(-20);
  it("easing raises output further above the new FE and ends with a higher price level but the same output", () => {
    expect(ease.frames[1].Y).toBeGreaterThan(none.frames[1].Y);
    expect(ease.sim.longRun.P).toBeGreaterThan(none.sim.longRun.P);
    expect(ease.sim.longRun.Y).toBeCloseTo(none.sim.longRun.Y, 6);
  });
  it("tightening lowers output now and the price level later, with the same long-run output", () => {
    expect(tight.frames[1].Y).toBeLessThan(none.frames[1].Y);
    expect(tight.sim.longRun.P).toBeLessThan(none.sim.longRun.P);
    expect(tight.sim.longRun.Y).toBeCloseTo(none.sim.longRun.Y, 6);
  });
  it("a large enough tightening pushes output below the new FE: a deeper slump than the shock alone", () => {
    expect(none.gapAtImpact).toBeGreaterThan(0);
    expect(hard.gapAtImpact).toBeLessThan(0);
  });
});

describe("a hurricane", () => {
  it("always leaves long-run output lower; the price effect depends on the mix", () => {
    expect(hurricaneRun(5, 0).pLong).toBeGreaterThan(1);
    expect(hurricaneRun(0, 60).pLong).toBeLessThan(1);
    expect(hurricaneRun(5, 60).yLong).toBeLessThan(100);
    const lo = hurricaneRun(5, 10).pLong, hi = hurricaneRun(5, 90).pLong;
    expect(hi).toBeLessThan(lo);
  });
  it("hits output at once when demand falls", () => {
    expect(hurricaneRun(5, 60).yImpact).toBeLessThan(100);
  });
});

describe("1970s data", () => {
  it("has inflation and unemployment rising together between 1973 and 1975", () => {
    const y = (n: number) => us1970s.find((d) => d.year === n)!;
    expect(y(1975).inflation).toBeGreaterThan(y(1973).inflation);
    expect(y(1975).unemployment).toBeGreaterThan(y(1973).unemployment);
  });
});
