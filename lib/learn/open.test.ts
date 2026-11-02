import { describe, expect, it } from "vitest";
import { identity, isWith, ledger } from "./open";
import { baselineEconomy, simulate, type Params } from "../macro/model";
import { shockById } from "../macro/shocks";

const A = { Yp: 100, tariff: 0, tariffP: 0, q: 1 };
const run = (reg: "floating" | "fixed", f: (p: Params) => Params, steps = 120) => simulate(baselineEconomy(reg, 0.5), f, steps);
const id = (reg: "floating" | "fixed", s: string) => run(reg, shockById(s)!.apply);

describe("saving, investment and net exports", () => {
  it("NX = S - I and foreign saving is I - S", () => {
    expect(identity(18, 22).NX).toBe(-4);
    expect(identity(18, 22).foreignSaving).toBe(4);
    expect(identity(25, 20).NX).toBe(5);
  });
  it("the ledger sums: CA + FA = change in reserves", () => {
    expect(ledger(-4, 4).dRes).toBe(0);
    expect(ledger(-4, 1).dRes).toBe(-3);
  });
});

describe("NX shifts IS", () => {
  it("partner income, a home tariff and a weaker RER shift IS right; a partner tariff and a stronger RER shift it left", () => {
    const at = isWith(A, 100);
    expect(isWith({ ...A, Yp: 120 }, 100)).toBeGreaterThan(at);
    expect(isWith({ ...A, tariff: 10 }, 100)).toBeGreaterThan(at);
    expect(isWith({ ...A, q: 0.9 }, 100)).toBeGreaterThan(at);
    expect(isWith({ ...A, tariffP: 10 }, 100)).toBeLessThan(at);
    expect(isWith({ ...A, q: 1.1 }, 100)).toBeLessThan(at);
  });
});

describe("the open-economy cases follow the model", () => {
  it("float vs peg: a fall in foreign demand hits output only under the peg, and drains reserves", () => {
    const f = run("floating", (p) => ({ ...p, x0: p.x0 - 8 }));
    const k = run("fixed", (p) => ({ ...p, x0: p.x0 - 8 }));
    expect(f.impact.E).toBeLessThan(f.baseline.E);
    expect(Math.abs(f.impact.Y - f.baseline.Y)).toBeLessThan(1e-6);
    expect(k.impact.Y).toBeLessThan(k.baseline.Y);
    expect(k.impact.Res).toBeLessThan(k.baseline.Res);
    expect(k.impact.Meff).toBeLessThan(k.baseline.Meff);
  });
  it("a rate rise abroad: a float depreciates and gains output; a peg loses reserves and output", () => {
    const f = id("floating", "foreign-rate-up"), k = id("fixed", "foreign-rate-up");
    expect(f.impact.E).toBeLessThan(f.baseline.E);
    expect(f.impact.Y).toBeGreaterThan(f.baseline.Y);
    expect(k.impact.Res).toBeLessThan(k.baseline.Res);
    expect(k.impact.Y).toBeLessThan(k.baseline.Y);
  });
  it("a money expansion barely moves output under a peg, and reserves leak out", () => {
    const f = id("floating", "money-supply-up"), k = id("fixed", "money-supply-up");
    expect(k.impact.Y - k.baseline.Y).toBeLessThan((f.impact.Y - f.baseline.Y) / 3);
    expect(k.impact.Res).toBeLessThan(k.baseline.Res);
  });
  it("a fiscal expansion under a float appreciates the currency and lowers NX (the 1980s dollar)", () => {
    const f = id("floating", "gov-spending-up");
    expect(f.impact.E).toBeGreaterThan(f.baseline.E);
    expect(f.impact.NX).toBeLessThan(f.baseline.NX);
  });
  it("an undervalued peg piles up reserves, raises the money supply, and lifts prices in the long run", () => {
    const s = id("fixed", "peg-undervalued");
    expect(s.impact.Res).toBeGreaterThan(s.baseline.Res);
    expect(s.impact.Meff).toBeGreaterThan(s.baseline.Meff);
    expect(s.longRun.P).toBeGreaterThan(s.baseline.P);
  });
  it("an overvalued peg runs reserves down and pushes output below capacity", () => {
    const s = id("fixed", "peg-overvalued");
    expect(s.impact.Res).toBeLessThan(s.baseline.Res);
    expect(s.impact.Y).toBeLessThan(s.baseline.Y);
  });
  it("fear of devaluation: a float's currency falls and its rate rises; a peg bleeds reserves and output", () => {
    const f = id("floating", "devaluation-fear"), k = id("fixed", "devaluation-fear");
    expect(f.impact.E).toBeLessThan(f.baseline.E);
    expect(f.impact.r).toBeGreaterThan(f.baseline.r);
    expect(k.impact.Res).toBeLessThan(k.baseline.Res);
    expect(k.impact.Y).toBeLessThan(k.baseline.Y);
  });
});
