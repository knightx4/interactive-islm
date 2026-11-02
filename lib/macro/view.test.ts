import { describe, expect, it } from "vitest";
import { baselineEconomy, simulate } from "./model";
import { shockById } from "./shocks";
import { STEPS, viewFor } from "./view";

const sim = simulate(baselineEconomy("closed"), shockById("money-supply-up")!.apply, 30);

describe("what each recipe step shows", () => {
  it("shows A alone first, then B after the curve has moved, then C", () => {
    const v = Array.from({ length: STEPS }, (_, s) => viewFor(sim, s, 1));
    expect(v.map((x) => [x.showB, x.showC])).toEqual([
      [false, false], [false, false], [false, false], [true, false], [true, false], [true, false], [true, false], [true, true],
    ]);
    expect(v[0].at).toBe("A");
    expect(v[3].at).toBe("B");
    expect(v[7].at).toBe("C");
  });
  it("draws the shift arrow and ghosts from step 2, using the post-shock parameters", () => {
    expect(viewFor(sim, 1, 1).ghosts).toBe(false);
    expect(viewFor(sim, 2, 1)).toMatchObject({ ghosts: true, shockArrow: true });
    expect(viewFor(sim, 2, 1).params).toBe(sim.after);
    expect(viewFor(sim, 0, 1).params).toBe(sim.before);
  });
  it("step 6 follows the time index; step 7 lands on the long-run frame", () => {
    expect(viewFor(sim, 6, 10).frame).toBe(sim.frames[10]);
    expect(viewFor(sim, 6, 999).frame).toBe(sim.frames[30]);
    expect(viewFor(sim, 7, 1).frame).toBe(sim.longRun);
    expect(viewFor(sim, 6, 10).lmArrow).toBe(true);
  });
});
