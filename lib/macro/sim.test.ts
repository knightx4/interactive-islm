import { describe, expect, it } from "vitest";
import { desiredInvestment, desiredSaving, isR, lmR, moneyDemand, Ystar } from "./model";
import {
  baselineState, baseFor, causes, driverRow, frameAt, parentValue, parents, path, phiFor, run, setCause, setParent, shiftOf, viewAt,
  type ParentId, type SimState,
} from "./sim";

const base = baselineState();
const at = (st: SimState, t = 1) => frameAt(run(st).sim, t);

describe("the simulator runs on the Learn model", () => {
  it("rests at the Learn baseline with every slider at 50", () => {
    for (const p of parents) expect(parentValue(p.id, base)).toBeCloseTo(50, 6);
    const r = run(base);
    expect(r.sim.baseline.Y).toBeCloseTo(100, 6);
    expect(r.sim.baseline.r).toBeCloseTo(5, 6);
    expect(r.sim.baseline.P).toBeCloseTo(1, 6);
    // with nothing moved, B and C are A
    expect(r.sim.impact.Y).toBeCloseTo(100, 6);
    expect(r.sim.longRun.Y).toBeCloseTo(100, 6);
  });

  // [slider, move, curve, direction the curve moves]
  const cases: Array<[ParentId, number, "IS" | "LM" | "FE", "right" | "left"]> = [
    ["investment", 70, "IS", "right"], ["investment", 30, "IS", "left"],
    ["saving", 70, "IS", "left"], ["saving", 30, "IS", "right"],
    ["moneySupply", 70, "LM", "right"], ["moneySupply", 30, "LM", "left"],
    ["moneyDemand", 70, "LM", "left"], ["moneyDemand", 30, "LM", "right"],
    ["fullEmployment", 70, "FE", "right"], ["fullEmployment", 30, "FE", "left"],
  ];
  for (const [id, v, curve, dir] of cases) {
    it(`${id} ${v > 50 ? "up" : "down"} moves ${curve} ${dir}`, () => {
      const st = setParent(base, id, v);
      expect(parentValue(id, st)).toBeCloseTo(v, 6);
      const rn = run(st);
      const f = rn.sim.impact, f0 = rn.sim.baseline;
      const sign = dir === "right" ? 1 : -1;
      if (curve === "IS") expect(sign * (isR(rn.after, 100, f.q) - isR(rn.base, 100, f0.q))).toBeGreaterThan(0);
      if (curve === "LM") expect(sign * (lmR(rn.base, 100, f0.Meff / f0.P) - lmR(rn.after, 100, f.Meff / f.P))).toBeGreaterThan(0);
      if (curve === "FE") expect(sign * (Ystar(rn.after) - Ystar(rn.base))).toBeGreaterThan(0);
    });
  }

  it("other sliders stay put when one is moved directly", () => {
    const st = setParent(base, "saving", 70);
    for (const p of parents) if (p.id !== "saving") expect(parentValue(p.id, st)).toBeCloseTo(50, 6);
  });

  it("an IS shift to the right raises short-run output and the rate; a money rise raises output and lowers the rate", () => {
    const inv = at(setParent(base, "investment", 65));
    expect(inv.Y).toBeGreaterThan(100); expect(inv.r).toBeGreaterThan(5);
    const m = at(setParent(base, "moneySupply", 65));
    expect(m.Y).toBeGreaterThan(100); expect(m.r).toBeLessThan(5);
  });

  it("fiscal expansion raises output less than the simple multiplier (the interest rate crowds out)", () => {
    const st = setCause(base, "govSpending", 30);
    const f = at(st);
    const rn = run(st);
    const dG = rn.base.G - rn.after.G; // negative: G rose
    expect(dG).toBeLessThan(0);
    const simple = (-dG) / rn.base.sY; // spending multiplier with no interest-rate response
    expect(f.Y - 100).toBeGreaterThan(0);
    expect(f.Y - 100).toBeLessThan(simple);
  });

  it("a demand shock fades: prices adjust and output returns to full employment", () => {
    const rn = run(setParent(base, "investment", 70));
    const c = rn.sim.longRun;
    expect(c.Y).toBeCloseTo(c.Ystar, 6);
    expect(c.P).toBeGreaterThan(1);
    const last = rn.sim.frames[rn.sim.frames.length - 1];
    expect(Math.abs(last.gap)).toBeLessThan(0.01); // the path has nearly arrived by the end
  });

  it("a supply shift moves full employment and the long run, not the first move", () => {
    const rn = run(setParent(base, "fullEmployment", 60));
    expect(rn.sim.longRun.Y).toBeCloseTo(110, 6);
    expect(rn.sim.impact.Y).toBeLessThan(rn.sim.longRun.Y);
  });
});

describe("price speed", () => {
  it("runs from sticky to flexible and every setting settles at full employment", () => {
    const speeds = [0, 25, 50, 75, 100];
    const ends = speeds.map((speed) => {
      const rn = run({ ...setParent(base, "investment", 70), speed });
      return { speed, gap: Math.abs(rn.sim.frames[rn.sim.frames.length - 1].gap), phi: phiFor(speed) };
    });
    for (const e of ends) expect(e.gap).toBeLessThan(0.02);
    expect(phiFor(0)).toBeLessThan(phiFor(100));
  });

  it("flexible prices close the gap faster than sticky ones", () => {
    const gapAt = (speed: number) => Math.abs(frameAt(run({ ...setParent(base, "investment", 70), speed }).sim, 8).gap);
    expect(gapAt(100)).toBeLessThan(gapAt(0));
  });
});

describe("the three panels agree on one (Y, r)", () => {
  const scenarios: Array<[string, SimState]> = [
    ["baseline", base],
    ["higher investment", setParent(base, "investment", 65)],
    ["higher saving", setParent(base, "saving", 65)],
    ["expansionary money", setParent(base, "moneySupply", 60)],
    ["tight money", setParent(base, "moneySupply", 40)],
    ["higher money demand", setParent(base, "moneyDemand", 62)],
    ["deficit", setCause(base, "govSpending", 30)],
    ["trade surplus (open)", setCause(base, "foreignDemand", 30)],
    ["mixed", setCause(setCause(setParent(base, "investment", 60), "assetPrices", 20), "centralBank", 15)],
  ];
  const ts = [0, 1, 3, 20];
  for (const [label, st] of scenarios) {
    it(`${label}: the point sits on IS and LM, and the side markets clear there`, () => {
      const rn = run(st);
      for (const t of ts) {
        const f = frameAt(rn.sim, t);
        const p = t === 0 ? rn.base : rn.after;
        expect(isR(p, f.Y, f.q)).toBeCloseTo(f.r, 6);
        expect(lmR(p, f.Y, f.Meff / f.P)).toBeCloseTo(f.r, 6);
        expect(desiredSaving(p, f.Y, f.r)).toBeCloseTo(desiredInvestment(p, f.r) + f.NX, 6);
        expect(moneyDemand(p, f.Y, f.r)).toBeCloseTo(f.Meff / f.P, 6);
      }
    });
  }
});

describe("parents and causes stay consistent", () => {
  for (const c of causes.filter((q) => !q.viaRate)) {
    it(`moving ${c.id} moves its parent ${c.parent}${c.also ? ` and ${c.also}` : ""}`, () => {
      const st = setCause(base, c.id, c.max);
      expect(Math.abs(parentValue(c.parent, st) - 50)).toBeGreaterThan(0.01);
      if (c.also) expect(Math.abs(parentValue(c.also, st) - 50)).toBeGreaterThan(0.01);
    });
  }

  it("the parent can still be moved directly after a cause has moved it", () => {
    const st = setParent(setCause(base, "assetPrices", 30), "saving", 40);
    expect(parentValue("saving", st)).toBeCloseTo(40, 6);
    expect(st.causes.assetPrices).toBe(30);
  });

  it("the money-supply and full-employment parents land exactly where they are put", () => {
    const st = setParent(setParent(setCause(base, "technology", 20), "fullEmployment", 63), "moneySupply", 72);
    expect(parentValue("fullEmployment", st)).toBeCloseTo(63, 6);
    expect(parentValue("moneySupply", st)).toBeCloseTo(72, 6);
  });
});

describe("playback", () => {
  it("has a before, an impact, the adjustment and the long run", () => {
    const rn = run(setParent(base, "investment", 70));
    expect(viewAt(rn.sim, 0).at).toBe("A");
    expect(viewAt(rn.sim, 1).at).toBe("B");
    expect(viewAt(rn.sim, 5).at).toBe("moving");
    expect(viewAt(rn.sim, rn.length - 1).at).toBe("C");
    expect(path(rn.sim).length).toBeGreaterThan(10);
    expect(baseFor(rn.state).regime).toBe("closed");
  });
});

describe("every real-world cause moves the right curve the right way", () => {
  /** Signed horizontal-shift measure of the curves as drawn: > 0 means right. */
  const shifts = (st: SimState, atNewQ = false) => {
    const rn = run(st);
    const f = rn.sim.impact, f0 = rn.sim.baseline;
    return {
      // the IS schedule at the old exchange rate; the exchange-rate cause moves it only through q itself
      IS: isR(rn.after, 100, atNewQ ? f.q : f0.q) - isR(rn.base, 100, f0.q),
      LM: lmR(rn.base, 100, f0.Meff / f0.P) - lmR(rn.after, 100, f.Meff / f.P),
      FE: Ystar(rn.after) - Ystar(rn.base),
    };
  };
  const rowFor = driverRow;

  for (const c of causes) {
    for (const x of [c.max, c.min]) {
      it(`${c.id} ${x > 0 ? "up" : "down"}: ${rowFor(c).curve} ${shiftOf(c, x)!.dir}, with the shift table's sign`, () => {
        const want = shiftOf(c, x)!;
        // the shift table's row for this driver gives the direction
        expect(want.curve).toBe(rowFor(c).curve);
        const got = shifts(setCause(base, c.id, x), c.id === "exchangeRate")[want.curve];
        expect(want.dir === "right" ? got : -got).toBeGreaterThan(1e-6);
        // the line names the curve and the direction
        expect(x > 0 ? c.chain.up : c.chain.down).toContain(`${want.curve} ${want.dir}`);
      });
    }
    it(`${c.id} leaves the other curves alone (except the one it also names)`, () => {
      const s = shifts(setCause(base, c.id, c.max), c.id === "exchangeRate");
      const main = rowFor(c).curve;
      const alsoCurve = c.also ? "LM" : null;
      for (const curve of ["IS", "LM", "FE"] as const) {
        if (curve === main || curve === alsoCurve) continue;
        // the exchange rate cause moves IS only through q; LM is untouched by the others
        expect(Math.abs(s[curve])).toBeLessThan(1e-6);
      }
    });
  }

  it("wealth also moves money demand, which moves LM the other way", () => {
    const s = shifts(setCause(base, "assetPrices", 50));
    expect(s.IS).toBeGreaterThan(0); // IS right
    expect(s.LM).toBeLessThan(0); // LM left
  });

  it("the exchange-rate and foreign-demand causes switch the open economy on", () => {
    expect(setCause(base, "foreignDemand", 10).open).toBe(true);
    expect(setCause(base, "exchangeRate", 10).open).toBe(true);
    expect(setCause(base, "taxes", 10).open).toBe(false);
  });
});
