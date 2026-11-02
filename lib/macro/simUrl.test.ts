import { describe, expect, it } from "vitest";
import { baselineEconomy, simulate } from "./model";
import { shiftTable } from "./shocks";
import { baselineState, causes, run, setCause, setParent, type SimState } from "./sim";
import { decodeState, encodeState, simulatorHref, simulatorLinkForShock, stateForShock } from "./simUrl";

const base = baselineState();

describe("scenario links", () => {
  it("writes nothing at the baseline, so links stay short", () => {
    expect(encodeState(base)).toBe("");
    expect(simulatorHref(base)).toBe("/");
  });

  it("writes only the values that differ", () => {
    const q = encodeState({ ...setCause(base, "taxes", 20), speed: 80 });
    expect(q).toBe("taxes=20&sp=80");
  });

  it("reopens exactly the same settings, sliders, causes, speed and playback position", () => {
    const st: SimState = { ...setCause(setCause(setParent(base, "moneySupply", 63.4), "assetPrices", -17), "foreignDemand", 12), speed: 20, t: 9 };
    const back = decodeState(encodeState(st));
    expect(back.causes).toEqual({ assetPrices: -17, foreignDemand: 12 });
    expect(back.open).toBe(true);
    expect(back.speed).toBe(20);
    expect(back.t).toBe(9);
    for (const k of Object.keys(st.offsets) as (keyof SimState["offsets"])[]) expect(back.offsets[k]).toBeCloseTo(st.offsets[k], 2);
    // and the same economy comes out
    const a = run(st).sim.longRun, b = run(back).sim.longRun;
    expect(b.Y).toBeCloseTo(a.Y, 1);
    expect(run(back).sim.impact.r).toBeCloseTo(run(st).sim.impact.r, 1);
  });

  it("round-trips every cause at both ends of its range", () => {
    for (const c of causes) for (const x of [c.min, c.max]) {
      const back = decodeState(encodeState(setCause(base, c.id, x)));
      expect(back.causes[c.id]).toBe(x);
    }
  });

  it("a broken link opens the baseline instead of failing", () => {
    for (const bad of ["?taxes=abc", "?taxes=", "?taxes=999", "?taxes=NaN", "?taxes=Infinity", "?i=1e9", "?sp=-5", "?sp=500", "?t=2.5", "?t=-1", "?t=9999", "?open=yes", "?%E0%A4%A", "?=&&==", "?taxes[]=3"]) {
      const st = decodeState(bad);
      expect(st.causes).toEqual({});
      expect(st.offsets).toEqual(base.offsets);
      expect(st.speed).toBe(base.speed);
      expect(st.t).toBe(base.t);
      expect(st.open).toBe(false);
    }
  });

  it("falls back per value: a good value survives a bad neighbour", () => {
    const st = decodeState("?taxes=999&govSpending=15&sp=zzz");
    expect(st.causes).toEqual({ govSpending: 15 });
    expect(st.speed).toBe(base.speed);
  });
});

describe("a lesson shock opens in the simulator", () => {
  const mobility = 0.5;
  const mapped = shiftTable.filter((s) => stateForShock(s.id, "closed") !== null);

  it("covers every closed-economy row of the shift table", () => {
    expect(mapped.length).toBe(shiftTable.length);
  });

  for (const s of shiftTable) {
    it(`${s.id}: the simulator gives the lesson's answer`, () => {
      const st = stateForShock(s.id, "closed")!;
      const lesson = simulate(baselineEconomy("closed"), s.apply, 60);
      const sim = run(st).sim;
      expect(sim.impact.Y).toBeCloseTo(lesson.impact.Y, 6);
      expect(sim.impact.r).toBeCloseTo(lesson.impact.r, 6);
      expect(sim.longRun.Y).toBeCloseTo(lesson.longRun.Y, 6);
      expect(sim.longRun.P).toBeCloseTo(lesson.longRun.P, 6);
      // and the link carries it
      expect(simulatorLinkForShock(s.id, "closed")).toMatch(/^\/(\?|$)/);
      const back = decodeState(simulatorLinkForShock(s.id, "closed")!.split("?")[1] ?? "");
      expect(run(back).sim.impact.Y).toBeCloseTo(lesson.impact.Y, 1);
    });
  }

  it("open-economy shocks open the floating economy", () => {
    const st = stateForShock("foreign-demand-up", "floating")!;
    expect(st.open).toBe(true);
    const lesson = simulate(baselineEconomy("floating", mobility), shiftTable.concat().find((s) => s.id === "gov-spending-up")!.apply, 60);
    const st2 = stateForShock("gov-spending-up", "floating")!;
    expect(run(st2).sim.impact.Y).toBeCloseTo(lesson.impact.Y, 6);
  });

  it("a shock the simulator has no cause for gives no link", () => {
    expect(simulatorLinkForShock("no-such-shock", "closed")).toBeNull();
  });
});
