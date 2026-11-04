import { describe, expect, it } from "vitest";
import { cursorTau, LEAD, overTime, T_SPAN } from "./overtime";
import { settleIndex } from "./playback";
import { scenarios, stateForScenario } from "./scenarios";
import { run } from "./sim";

const go = (i: number, speed: number) => {
  const rn = run(stateForScenario(scenarios[i], speed));
  return { rn, ot: overTime(rn.sim, settleIndex(rn.sim)) };
};

describe("over time", () => {
  it("starts flat at A, jumps at B and ends at the long-run values", () => {
    const { rn, ot } = go(0, 50);
    const first = ot.points[0], last = ot.points[ot.points.length - 1];
    expect(first.tau).toBe(-LEAD);
    expect(first.output).toBe(0);
    expect(ot.points.filter((p) => p.tau < 0).every((p) => p.output === 0 && p.prices === 0)).toBe(true);
    const b = ot.points.find((p) => p.tau === 0)!;
    expect(b.output).toBeCloseTo((rn.sim.impact.Y / rn.sim.baseline.Y - 1) * 100, 9);
    expect(last.tau).toBe(T_SPAN);
    expect(last.output).toBeLessThan(0); // an oil shock lowers output
    expect(last.prices).toBeGreaterThan(0); // and raises prices
  });
  it("prices adjusting at once reach C sooner than slowly", () => {
    const slow = go(0, 50).ot, fast = go(0, 100).ot;
    expect(fast.at.C).toBeLessThan(slow.at.C);
    const at = (o: typeof slow, tau: number) => o.points.find((p) => p.tau === tau)!.output;
    // the same economy sits closer to C after 10 periods when prices move faster
    expect(Math.abs(at(fast, 10) - fast.points[fast.points.length - 1].output)).toBeLessThan(Math.abs(at(slow, 10) - slow.points[slow.points.length - 1].output));
  });
  it("the axis span covers every value", () => {
    for (let i = 0; i < scenarios.length; i++) {
      const { ot } = go(i, 50);
      expect(ot.points.every((p) => Math.abs(p.output) <= ot.span && Math.abs(p.prices) <= ot.span)).toBe(true);
    }
  });
  it("the cursor follows A, B and C", () => {
    const { rn, ot } = go(3, 50);
    expect(cursorTau(0, rn.length, ot)).toBe(ot.at.A);
    expect(cursorTau(1, rn.length, ot)).toBe(ot.at.B);
    expect(cursorTau(rn.length - 1, rn.length, ot)).toBe(ot.at.C);
    expect(cursorTau(4, rn.length, ot)).toBe(3);
  });
});
