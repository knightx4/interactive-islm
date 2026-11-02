import { describe, expect, it } from "vitest";
import { rates, runScenario, scenarios, timeline } from "./reunification";

const r = (id: Parameters<typeof runScenario>[0]) => runScenario(id);

describe("German reunification on two linked economies", () => {
  it("a German fiscal boom raises German output and rate, and drags the pegged UK into a higher rate and lower output with reserves leaving", () => {
    const w = r("fiscal"), de = w.foreign!, uk = w.home;
    expect(de.impact.Y).toBeGreaterThan(de.baseline.Y);
    expect(de.impact.r).toBeGreaterThan(de.baseline.r);
    expect(uk.impact.r).toBeGreaterThan(uk.baseline.r);
    expect(uk.impact.Y).toBeLessThan(uk.baseline.Y);
    expect(uk.impact.Res).toBeLessThan(uk.baseline.Res);
    expect(uk.impact.E).toBeCloseTo(uk.baseline.E, 9);
  });
  it("the Bundesbank's tightening raises the German rate further and the UK still follows", () => {
    const a = r("fiscal"), b = r("bundesbank");
    expect(b.foreign!.impact.r).toBeGreaterThan(a.foreign!.impact.r);
    expect(b.home.impact.r).toBeGreaterThan(b.home.baseline.r);
    expect(b.home.impact.Y).toBeLessThan(a.home.impact.Y);
  });
  it("a premium on sterling deepens the UK slump and drains more reserves", () => {
    const b = r("bundesbank"), d = r("doubt");
    expect(d.home.impact.r).toBeGreaterThan(b.home.impact.r);
    expect(d.home.impact.Y).toBeLessThan(b.home.impact.Y);
    expect(d.home.impact.Res).toBeLessThan(b.home.impact.Res);
  });
  it("when the premium is large the peg breaks: the pound falls and output rebounds, with higher prices to come", () => {
    const e = r("exit");
    expect(e.home.frames.some((f) => f.devalued)).toBe(true);
    expect(e.home.impact.E).toBeLessThan(e.home.baseline.E);
    expect(e.home.impact.Y).toBeGreaterThan(e.home.baseline.Y);
    expect(e.home.longRun.P).toBeGreaterThan(e.home.baseline.P);
  });
  it("a floating pound would have depreciated and kept output up", () => {
    const f = r("float");
    expect(f.home.impact.E).toBeLessThan(f.home.baseline.E);
    expect(f.home.impact.Y).toBeGreaterThan(f.home.baseline.Y);
  });
  it("every scenario returns to full employment in the long run", () => {
    for (const s of scenarios) {
      const w = r(s.id);
      expect(w.home.longRun.Y).toBeCloseTo(w.home.longRun.Ystar, 6);
      expect(w.foreign!.longRun.Y).toBeCloseTo(w.foreign!.longRun.Ystar, 6);
    }
  });
  it("has dated, well formed history", () => {
    expect(timeline.length).toBeGreaterThanOrEqual(10);
    expect(timeline.some((t) => t.date.includes("16 September 1992"))).toBe(true);
    for (const x of rates) { expect(x.de).toBeGreaterThan(0); expect(x.uk).toBeGreaterThan(0); }
  });
});
