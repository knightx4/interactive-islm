import { describe, expect, it } from "vitest";
import {
  baselineEconomy, desiredInvestment, desiredSaving, employmentFE, isR, labourSupply, lmR, longRun, mpl, shortRun, sideMarkets, simulate, wageFE, Ystar,
  type Regime,
} from "./model";
import { shiftTable, shocks, shocksFor, shockById, workedShockIds, drivers } from "./shocks";
import { direction, questionsFor } from "./predict";
import { ps5 } from "./ps5";

const regimes: Regime[] = ["closed", "floating", "fixed"];
const closed = () => baselineEconomy("closed");

describe("baseline", () => {
  it.each(regimes)("%s economy rests at full employment with P = 1", (r) => {
    const p = baselineEconomy(r);
    const pt = shortRun(p, 1);
    expect(pt.Y).toBeCloseTo(Ystar(p), 6);
    expect(pt.r).toBeCloseTo(5, 6);
    expect(pt.q).toBeCloseTo(1, 6);
    expect(pt.NX).toBeCloseTo(0, 6);
    expect(longRun(p).P).toBeCloseTo(1, 6);
  });
  it("FE comes from Y = A K^a N^(1-a) with the labour market clearing", () => {
    const p = closed();
    const N = employmentFE(p);
    expect(N).toBeCloseTo(100, 6);
    expect(Ystar(p)).toBeCloseTo(p.A * Math.pow(p.K, p.a) * Math.pow(N, 1 - p.a), 9);
    expect(mpl(p, N)).toBeCloseTo(wageFE(p), 9);
    expect(labourSupply(p, wageFE(p))).toBeCloseTo(N, 6); // supply = demand at the FE wage
  });
});

describe("labour market", () => {
  it("is a market: a labour tax cuts employment and raises the pre-tax wage", () => {
    const p = closed();
    const q = { ...p, tauL: p.tauL + 0.1 };
    expect(employmentFE(q)).toBeLessThan(employmentFE(p));
    expect(wageFE(q)).toBeGreaterThan(wageFE(p));
    expect(Ystar(q)).toBeLessThan(Ystar(p));
  });
  it("side markets report employment and the real wage", () => {
    const sim = simulate(closed(), shockById("money-supply-up")!.apply);
    const s = sideMarkets(sim.after, sim.impact);
    expect(s.employment).toBeGreaterThan(s.employmentFE); // boom: more hired than at FE
    expect(s.realWage).toBeLessThan(s.realWageFE); // along labour demand, more workers means a lower marginal product
    expect(s.labourSupplyAtWage).toBeLessThan(s.employment);
  });
  it("goods market: saving equals investment on the IS curve at every frame", () => {
    for (const sh of shocks) {
      const sim = simulate(baselineEconomy("closed"), sh.apply, 20);
      for (const f of sim.frames) {
        const p = f.t === 0 ? sim.before : sim.after;
        const s = sideMarkets(p, f);
        expect(s.privateSaving + s.publicSaving).toBeCloseTo(s.investment + s.netExports, 6);
        expect(desiredSaving(p, f.Y, f.r)).toBeCloseTo(desiredInvestment(p, f.r) + f.NX, 6); // IS holds
      }
    }
  });
});

describe("price adjustment", () => {
  for (const r of regimes) {
    for (const s of shocksFor(r)) {
      it(`${r}: ${s.id} converges to the long-run equilibrium`, () => {
        const sim = simulate(baselineEconomy(r), s.apply, 600);
        const last = sim.frames[sim.frames.length - 1];
        expect(last.Y).toBeCloseTo(sim.longRun.Y, 3);
        expect(last.P).toBeCloseTo(sim.longRun.P, 2);
        expect(last.r).toBeCloseTo(sim.longRun.r, 2);
        expect(last.q).toBeCloseTo(sim.longRun.q, 1);
      });
    }
  }
});

/* ---------------------------------- shift table --------------------------------- */

describe("shift table", () => {
  const p0 = closed();
  const Y0 = 100;
  const pos = (p: ReturnType<typeof closed>) => ({
    IS: isR(p, Y0), // higher r at a given Y = IS further right
    LM: lmR(p, Y0, p.M / 1), // higher r at a given Y = LM further left
    FE: Ystar(p),
  });
  const sign = (a: number, b: number) => (Math.abs(b - a) < 1e-9 ? 0 : b > a ? 1 : -1);

  it("has the row count of its drivers, in both directions", () => {
    expect(shiftTable).toHaveLength(drivers.length * 2);
    expect(new Set(shiftTable.map((s) => s.id)).size).toBe(shiftTable.length);
  });

  it.each(shiftTable.map((s) => [s.id, s] as const))("%s moves exactly the curve it is tagged with", (_id, s) => {
    const a = pos(p0), b = pos(s.apply({ ...p0 }));
    const want = { IS: 0, LM: 0, FE: 0 };
    const mark = (c: "IS" | "LM" | "FE", d: "right" | "left") => {
      // right: IS up in r, LM down in r, FE up in Y*
      want[c] = c === "LM" ? (d === "right" ? -1 : 1) : d === "right" ? 1 : -1;
    };
    mark(s.curve, s.dir);
    if (s.also) mark(s.also.curve, s.also.dir);
    expect(sign(a.IS, b.IS)).toBe(want.IS);
    expect(sign(a.LM, b.LM)).toBe(want.LM);
    expect(sign(a.FE, b.FE)).toBe(want.FE);
  });

  it("opposite rows of a driver move the curve opposite ways", () => {
    for (const d of drivers) {
      const up = shockById(`${d.id}-up`)!, down = shockById(`${d.id}-down`)!;
      expect(up.curve).toBe(down.curve);
      expect(up.dir).not.toBe(down.dir);
    }
  });
});

/* -------------------------------- worked shocks -------------------------------- */

type D = "up" | "down" | "same";
type Expect = { Ysr: D; rsr: D; Ylr: D; rlr: D; Plr?: D; Nsr: D; Nlr: D; wsr: D; wlr: D };
const worked: Record<(typeof workedShockIds)[number], Expect> = {
  "money-supply-up": { Ysr: "up", rsr: "down", Ylr: "same", rlr: "same", Plr: "up", Nsr: "up", Nlr: "same", wsr: "down", wlr: "same" },
  "gov-spending-up": { Ysr: "up", rsr: "up", Ylr: "same", rlr: "up", Plr: "up", Nsr: "up", Nlr: "same", wsr: "down", wlr: "same" },
  "taxes-up": { Ysr: "down", rsr: "down", Ylr: "same", rlr: "down", Plr: "down", Nsr: "down", Nlr: "same", wsr: "up", wlr: "same" },
  "productivity-down": { Ysr: "same", rsr: "same", Ylr: "down", rlr: "up", Plr: "up", Nsr: "up", Nlr: "down", wsr: "down", wlr: "down" },
  "wealth-up": { Ysr: "up", rsr: "up", Ylr: "same", rlr: "up", Nsr: "up", Nlr: "same", wsr: "down", wlr: "same" },
  "expected-inflation-up": { Ysr: "up", rsr: "down", Ylr: "same", rlr: "same", Plr: "up", Nsr: "up", Nlr: "same", wsr: "down", wlr: "same" },
  "investment-outlook-up": { Ysr: "up", rsr: "up", Ylr: "same", rlr: "up", Plr: "up", Nsr: "up", Nlr: "same", wsr: "down", wlr: "same" },
  "labour-tax-up": { Ysr: "same", rsr: "same", Ylr: "down", rlr: "up", Plr: "up", Nsr: "same", Nlr: "down", wsr: "same", wlr: "up" },
};

describe("the eight worked shocks", () => {
  it("are eight, each a row of the shift table", () => {
    expect(workedShockIds).toHaveLength(8);
    for (const id of workedShockIds) expect(shiftTable.some((s) => s.id === id)).toBe(true);
  });
  it.each(workedShockIds.map((id) => [id] as const))("%s: short and long run", (id) => {
    const sim = simulate(closed(), shockById(id)!.apply);
    const b = sim.baseline, i = sim.impact, lr = sim.longRun, e = worked[id];
    const d = (x: number, y: number): D => (Math.abs(y - x) < 1e-7 ? "same" : y > x ? "up" : "down");
    expect({
      Ysr: d(b.Y, i.Y), rsr: d(b.r, i.r), Ylr: d(b.Y, lr.Y), rlr: d(b.r, lr.r),
      Nsr: d(b.N, i.N), Nlr: d(b.N, lr.N), wsr: d(b.w, i.w), wlr: d(b.w, lr.w),
      ...(e.Plr ? { Plr: d(b.P, lr.P) } : {}),
    }).toEqual(e);
  });
  it("wealth: P in the long run is determinate under these parameters", () => {
    const sim = simulate(closed(), shockById("wealth-up")!.apply);
    expect(["up", "down"]).toContain(direction(sim.baseline.P, sim.longRun.P));
  });
  it("after an adverse supply shock, long-run output is the new FE", () => {
    const sim = simulate(closed(), shockById("productivity-down")!.apply, 400);
    expect(sim.longRun.Y).toBeCloseTo(Ystar(sim.after), 9);
    expect(sim.longRun.Y).toBeLessThan(Ystar(sim.before));
  });
});

describe("money neutrality", () => {
  it.each([0.5, 0.8, 1.1, 1.5, 3])("scaling M by %s scales P and leaves real variables alone", (k) => {
    const p = closed();
    const sim = simulate(p, (x) => ({ ...x, M: x.M * k }), 800);
    const b = sim.baseline, lr = sim.longRun, end = sim.frames[sim.frames.length - 1];
    expect(lr.P).toBeCloseTo(k, 9);
    for (const f of [lr, end]) {
      expect(f.Y).toBeCloseTo(b.Y, 2);
      expect(f.r).toBeCloseTo(b.r, 2);
      expect(f.N).toBeCloseTo(b.N, 2);
      expect(f.w).toBeCloseTo(b.w, 2);
      expect(f.C).toBeCloseTo(b.C, 2);
      expect(f.I).toBeCloseTo(b.I, 2);
    }
    expect(end.P).toBeCloseTo(k, 1);
  });
  it("money is not neutral in the short run", () => {
    const sim = simulate(closed(), shockById("money-supply-up")!.apply);
    expect(sim.impact.Y).toBeGreaterThan(sim.baseline.Y);
  });
});

/* ------------------------------------ PS5 ----------------------------------- */

describe("PS5 system", () => {
  const cases: [number, number, number, number][] = [
    // G, Ms, Y, r
    [100, 800, 504, 13.6],
    [300, 800, 744, 29.6],
    [100, 950, 564, 7.6],
    [300, 950, 804, 23.6],
  ];
  it.each(cases)("G=%s, Ms=%s gives Y=%s, r=%s and both curves agree there", (G, Ms, Y, r) => {
    const eq = ps5.equilibrium(G, Ms);
    expect(eq.Y).toBeCloseTo(Y, 9);
    expect(eq.r).toBeCloseTo(r, 9);
    expect(ps5.is(eq.Y, G)).toBeCloseTo(ps5.lm(eq.Y, Ms), 9);
  });
  it("more G raises Y and r; more money raises Y and lowers r", () => {
    const a = ps5.equilibrium(100, 800);
    expect(ps5.equilibrium(300, 800).Y).toBeGreaterThan(a.Y);
    expect(ps5.equilibrium(300, 800).r).toBeGreaterThan(a.r);
    expect(ps5.equilibrium(100, 950).Y).toBeGreaterThan(a.Y);
    expect(ps5.equilibrium(100, 950).r).toBeLessThan(a.r);
  });
});

/* ------------------------- predictions and the open case ------------------------ */

describe("textbook directions", () => {
  const dirs = (r: Regime, id: string) => {
    const sim = simulate(baselineEconomy(r), shockById(id)!.apply);
    return Object.fromEntries(questionsFor(sim, r).map((q) => [q.id, q.answer]));
  };
  it("closed fiscal expansion: Y and r up, then crowding out (I and C down) and higher P", () => {
    expect(dirs("closed", "gov-spending-up")).toMatchObject({
      "Y-short": "up", "r-short": "up", "P-short": "same", "Y-long": "same", "r-long": "up", "P-long": "up", "I-long": "down",
    });
  });
  it("productivity: Y* rises, P falls, wages rise", () => {
    expect(dirs("closed", "productivity-up")).toMatchObject({ "Y-long": "up", "P-long": "down", "w-long": "up", "N-long": "up" });
  });
  it("the check covers Y, r, P, C, I, N, w, e and NX when open, and leaves out e and NX when closed", () => {
    const open = Object.keys(dirs("floating", "money-supply-up")).filter((k) => k.endsWith("-short")).map((k) => k.split("-")[0]);
    expect(open).toEqual(["Y", "r", "P", "C", "I", "N", "w", "e", "NX"]);
    expect(Object.keys(dirs("closed", "money-supply-up")).some((k) => k.startsWith("e-") || k.startsWith("NX-"))).toBe(false);
  });
  it("open economy at perfect mobility: money lifts Y and weakens e under a float, nothing under a peg", () => {
    expect(dirs("floating", "money-supply-up")).toMatchObject({ "Y-short": "up", "e-short": "down" });
    expect(dirs("fixed", "money-supply-up")["Y-short"]).toBe("same");
    expect(dirs("fixed", "gov-spending-up")["Y-short"]).toBe("up");
  });
  it("direction helper", () => {
    expect(direction(100, 100.5)).toBe("same");
    expect(direction(100, 105)).toBe("up");
    expect(direction(100, 90)).toBe("down");
  });
});
