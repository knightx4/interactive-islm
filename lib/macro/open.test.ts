import { describe, expect, it } from "vitest";
import { baselineEconomy, desiredSaving, expectedEChange, kappa, simulate, simulateWorld, type Params, type Regime } from "./model";
import { shockById, shocksFor } from "./shocks";

const run = (regime: Regime, mobility: number, id: string, steps = 120, tweak: (p: Params) => Params = (p) => p) =>
  simulate(tweak(baselineEconomy(regime, mobility)), shockById(id)!.apply, steps);
const up = (a: number, b: number) => b > a + 1e-6;
const down = (a: number, b: number) => b < a - 1e-6;
const same = (a: number, b: number) => Math.abs(b - a) < 1e-6;

describe("Mundell-Fleming at perfect capital mobility", () => {
  it("float: fiscal expansion leaves output alone, appreciates the currency, worsens NX", () => {
    const s = run("floating", 1, "gov-spending-up");
    expect(same(s.baseline.Y, s.impact.Y)).toBe(true);
    expect(same(s.baseline.r, s.impact.r)).toBe(true);
    expect(up(s.baseline.E, s.impact.E)).toBe(true);
    expect(down(s.baseline.NX, s.impact.NX)).toBe(true);
  });
  it("float: money expansion raises output and depreciates the currency", () => {
    const s = run("floating", 1, "money-supply-up");
    expect(up(s.baseline.Y, s.impact.Y)).toBe(true);
    expect(down(s.baseline.E, s.impact.E)).toBe(true);
    expect(same(s.baseline.r, s.impact.r)).toBe(true);
  });
  it("float: a tariff appreciates the currency and leaves output and NX unchanged", () => {
    const s = run("floating", 1, "tariff-up");
    expect(same(s.baseline.Y, s.impact.Y)).toBe(true);
    expect(up(s.baseline.E, s.impact.E)).toBe(true);
    expect(same(s.baseline.NX, s.impact.NX)).toBe(true);
  });
  it("peg: fiscal expansion raises output and the money supply (reserves flow in)", () => {
    const s = run("fixed", 1, "gov-spending-up");
    expect(up(s.baseline.Y, s.impact.Y)).toBe(true);
    expect(up(s.baseline.Meff, s.impact.Meff)).toBe(true);
    expect(up(s.baseline.Res, s.impact.Res)).toBe(true);
  });
  it("peg: monetary expansion does nothing; reserves leak out to undo it", () => {
    const s = run("fixed", 1, "money-supply-up");
    expect(same(s.baseline.Y, s.impact.Y)).toBe(true);
    expect(same(s.baseline.Meff, s.impact.Meff)).toBe(true);
    expect(down(s.baseline.Res, s.impact.Res)).toBe(true);
  });
  it("the domestic rate is pinned to the foreign rate plus the premium", () => {
    const s = run("floating", 1, "foreign-rate-up");
    expect(s.impact.r).toBeCloseTo(s.after.rw, 9);
    const t = run("floating", 1, "devaluation-fear");
    expect(t.impact.r).toBeCloseTo(t.baseline.r + 2, 9);
  });
});

describe("a large economy keeps its own interest rate", () => {
  it("fiscal expansion raises output, the interest rate and the currency", () => {
    const s = run("floating", 0.5, "gov-spending-up");
    expect(up(s.baseline.Y, s.impact.Y)).toBe(true);
    expect(up(s.baseline.r, s.impact.r)).toBe(true);
    expect(up(s.baseline.E, s.impact.E)).toBe(true);
    expect(down(s.baseline.NX, s.impact.NX)).toBe(true);
    expect(up(s.baseline.FA, s.impact.FA)).toBe(true); // capital flows in
    // long run: output back at FE, but the rate stays higher and the currency stronger
    expect(up(s.baseline.r, s.longRun.r)).toBe(true);
    expect(up(s.baseline.E, s.longRun.E)).toBe(true);
  });
  it("output response shrinks as mobility rises, and the rate response too", () => {
    const y = [0, 0.5, 0.8, 1].map((m) => run("floating", m, "gov-spending-up").impact.Y);
    for (let i = 1; i < y.length; i++) expect(y[i]).toBeLessThan(y[i - 1] + 1e-9);
    const r = [0, 0.5, 0.8, 1].map((m) => run("floating", m, "gov-spending-up").impact.r);
    for (let i = 1; i < r.length; i++) expect(r[i]).toBeLessThan(r[i - 1] + 1e-9);
  });
  it("a small economy is pulled to the world rate, a large one moves only part of the way", () => {
    const small = run("floating", 1, "foreign-rate-up").impact.r - 5;
    const large = run("floating", 0.5, "foreign-rate-up").impact.r - 5;
    expect(small).toBeCloseTo(1, 9);
    expect(large).toBeGreaterThan(0);
    expect(large).toBeLessThan(small);
  });
  it("with no capital mobility, trade is balanced and the economy behaves like a closed one", () => {
    for (const reg of ["floating"] as const) {
      const s = run(reg, 0, "gov-spending-up");
      for (const f of s.frames) { expect(f.NX).toBeCloseTo(0, 6); expect(f.FA).toBeCloseTo(0, 6); }
      const c = simulate(baselineEconomy("closed"), shockById("gov-spending-up")!.apply, 120);
      expect(s.impact.Y).toBeCloseTo(c.impact.Y, 6);
      expect(s.impact.r).toBeCloseTo(c.impact.r, 6);
    }
    expect(kappa(baselineEconomy("floating", 0))).toBe(0);
    expect(kappa(baselineEconomy("floating", 1))).toBe(Infinity);
  });
});

describe("interest parity and notation", () => {
  it("e1 = e0 (1 + r_foreign)/(1 + r_home): a rate gap means an expected depreciation", () => {
    expect(expectedEChange(6, 5)).toBeCloseTo(1.05 / 1.06 - 1, 12);
    expect(expectedEChange(5, 5)).toBe(0);
    const s = run("floating", 1, "devaluation-fear");
    expect(s.impact.expE).toBeLessThan(0); // home pays more, so its currency is expected to weaken
    expect(s.impact.expE).toBeCloseTo((1 + 0.05) / (1 + 0.07) - 1, 9);
  });
  it("RER = e P_home / P_foreign and I = S - NX hold in every frame", () => {
    for (const reg of ["floating", "fixed"] as const) for (const m of [0.3, 1]) for (const sh of shocksFor(reg)) {
      const s = run(reg, m, sh.id, 40);
      for (const f of s.frames) {
        expect(f.q).toBeCloseTo((f.E * f.P) / s.after.Pf, 9);
        const p = f.t === 0 ? s.before : s.final;
        expect(desiredSaving(p, f.Y, f.r)).toBeCloseTo(f.I + f.NX, 6); // I = S - NX
      }
    }
  });
  it("the balance of payments adds up: current account + financial account = change in reserves", () => {
    for (const reg of ["floating", "fixed"] as const) for (const m of [0, 0.3, 1]) for (const sh of shocksFor(reg)) {
      for (const f of run(reg, m, sh.id, 60).frames) expect(f.CA + f.FA).toBeCloseTo(f.dRes, 6);
    }
  });
  it("floating economies never change reserves", () => {
    for (const f of run("floating", 0.5, "devaluation-fear").frames) expect(f.dRes).toBe(0);
  });
});

describe("a peg is defended with reserves", () => {
  it("China: an export surplus piles up reserves, raising money and prices", () => {
    const s = run("fixed", 0.2, "peg-undervalued", 200);
    expect(up(s.baseline.CA, s.impact.CA)).toBe(true);
    expect(up(s.baseline.Res, s.impact.Res)).toBe(true);
    expect(up(s.baseline.Meff, s.impact.Meff)).toBe(true);
    expect(up(s.baseline.Y, s.impact.Y)).toBe(true);
    expect(up(s.baseline.P, s.longRun.P)).toBe(true);
    expect(up(s.baseline.Meff, s.longRun.Meff)).toBe(true);
    expect(s.longRun.Res).toBeGreaterThan(s.baseline.Res);
    // the real exchange rate drifts back as prices rise
    expect(s.frames[199].q).toBeGreaterThan(s.impact.q);
    expect(s.pegBreaks).toBe(false);
  });
  it("money follows the balance of payments: change in M equals change in reserves", () => {
    const s = run("fixed", 0.2, "peg-undervalued", 50);
    for (let t = 1; t < s.frames.length; t++) {
      expect(s.frames[t].Meff - s.frames[t - 1].Meff).toBeCloseTo(s.frames[t].Res - s.frames[t - 1].Res, 6);
    }
  });
  it("Argentina or Britain: a defended peg bleeds reserves until it is devalued", () => {
    const s = run("fixed", 0.5, "devaluation-fear", 60, (p) => ({ ...p, Res: 12, D: p.D + 28 }));
    const k = s.frames.findIndex((f) => f.devalued);
    expect(k).toBeGreaterThan(1);
    for (let t = 1; t < k; t++) expect(s.frames[t].Res).toBeLessThanOrEqual(s.frames[t - 1].Res + 1e-9);
    expect(s.frames[k - 1].Res).toBeLessThan(s.baseline.Res);
    expect(s.final.E0).toBeCloseTo(0.8, 9); // devalued by dev = 20%
    expect(s.frames[k].E).toBeCloseTo(0.8, 9);
    expect(s.frames[k].E).toBeLessThan(s.frames[k - 1].E);
    expect(s.frames.filter((f) => f.devalued)).toHaveLength(1);
  });
  it("an overvalued peg with thin reserves ends in devaluation too", () => {
    const s = run("fixed", 0.5, "peg-overvalued", 80, (p) => ({ ...p, Res: 3, D: p.D + 37 }));
    expect(s.frames.some((f) => f.devalued)).toBe(true);
  });
  it("the same attack with deep reserves is survived", () => {
    const s = run("fixed", 0.5, "devaluation-fear", 60, (p) => ({ ...p, Res: 300, D: p.D - 260 }));
    expect(s.frames.some((f) => f.devalued)).toBe(false);
  });
});

describe("linked economies", () => {
  const home = () => baselineEconomy("floating", 0.5);
  const partner = () => baselineEconomy("closed");
  const id = (p: Params) => p;

  it("without a shock nothing moves", () => {
    const w = simulateWorld(home(), id, partner(), id, 10);
    for (const f of [...w.home.frames, ...w.foreign!.frames]) expect(f.Y).toBeCloseTo(100, 6);
    expect(w.home.longRun.P).toBeCloseTo(1, 6);
  });
  it("a home fiscal expansion raises the partner's output, rate and net exports", () => {
    const w = simulateWorld(home(), shockById("gov-spending-up")!.apply, partner(), id, 200);
    const f = w.foreign!;
    expect(up(f.baseline.Y, f.impact.Y)).toBe(true);
    expect(up(f.baseline.r, f.impact.r)).toBe(true);
    expect(up(f.baseline.NX, f.impact.NX)).toBe(true);
    expect(f.impact.NX).toBeCloseTo(-w.home.impact.NX, 9);
    expect(f.impact.FA).toBeCloseTo(-w.home.impact.FA, 9); // capital flows from the partner to home
    expect(w.home.frames[199].Y).toBeCloseTo(w.home.longRun.Y, 2);
    expect(f.frames[199].Y).toBeCloseTo(f.longRun.Y, 2);
  });
  it("a partner fiscal expansion lifts home exports and pulls capital out of home", () => {
    const w = simulateWorld(home(), id, partner(), shockById("gov-spending-up")!.apply, 100);
    expect(up(w.home.baseline.NX, w.home.impact.NX)).toBe(true);
    expect(up(w.home.baseline.Y, w.home.impact.Y)).toBe(true);
    expect(up(w.foreign!.baseline.r, w.foreign!.impact.r)).toBe(true);
    expect(down(w.home.baseline.E, w.home.impact.E)).toBe(true); // higher foreign rate: home currency weakens
  });
  it("Germany and the UK: a German rate rise (tight money) lowers UK-side net capital inflow", () => {
    const w = simulateWorld(home(), id, partner(), shockById("money-supply-down")!.apply, 60);
    expect(up(w.foreign!.baseline.r, w.foreign!.impact.r)).toBe(true);
    expect(down(w.home.baseline.FA, w.home.impact.FA)).toBe(true);
  });
  it("US and China: a Fed hike drains the reserves of a pegged partner", () => {
    const peg = baselineEconomy("fixed", 0.5);
    const w = simulateWorld(peg, id, partner(), shockById("money-supply-down")!.apply, 30);
    expect(down(w.home.baseline.Res, w.home.impact.Res)).toBe(true);
    expect(down(w.home.baseline.Meff, w.home.impact.Meff)).toBe(true);
  });
  it("US and Japan: with one world rate, both economies share r when mobility is perfect", () => {
    const w = simulateWorld(baselineEconomy("floating", 1), shockById("gov-spending-up")!.apply, partner(), id, 40);
    for (const t of [1, 5, 20]) expect(w.home.frames[t].r).toBeCloseTo(w.foreign!.frames[t].r, 9);
    expect(up(w.foreign!.baseline.r, w.foreign!.impact.r)).toBe(true);
  });
});
