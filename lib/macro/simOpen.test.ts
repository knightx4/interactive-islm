import { describe, expect, it } from "vitest";
import { baselineEconomy, desiredSaving, expectedEChange, isR, lmR, netExports, simulate } from "./model";
import { shockById } from "./shocks";
import {
  baselineState, baseFor, causes, causeDisabled, driverRow, frameAt, isHardPeg, paramsFor, regimes, run, setCause, setParent, shiftOf,
  type RegimeChoice, type SimState,
} from "./sim";
import { decodeState, encodeState, stateForShock } from "./simUrl";

const open = (regime: RegimeChoice = "float", partner = false): SimState => ({ ...baselineState(), open: true, regime, partner });
const openCauses = causes.filter((c) => c.needsOpen);

/** Signed shifts of the curves as drawn at the impact frame; > 0 means right. */
function shifts(st: SimState, atNewQ: boolean) {
  const rn = run(st);
  const f = rn.sim.impact, f0 = rn.sim.baseline;
  return {
    IS: isR(rn.after, 100, atNewQ ? f.q : f0.q) - isR(rn.base, 100, f0.q),
    LM: lmR(rn.base, 100, f0.Meff / f0.P) - lmR(rn.after, 100, f.Meff / f.P),
  };
}

describe("every open-economy cause moves IS or LM the right way", () => {
  it("lists the causes the course names under IS and LM", () => {
    for (const id of ["tariffsOnUs", "ourTariff", "partnerGrowth", "exchangeRate", "foreignRate", "capitalFlight"]) {
      expect(openCauses.map((c) => c.id)).toContain(id);
    }
  });

  for (const c of openCauses) {
    for (const x of [c.max, c.min]) {
      it(`floating: ${c.id} ${x > 0 ? "up" : "down"} moves ${shiftOf(c, x)!.curve} ${shiftOf(c, x)!.dir}`, () => {
        const want = shiftOf(c, x)!;
        expect(want.curve).toBe(driverRow(c).curve);
        const s = shifts(setCause(open("float"), c.id, x), c.channel === "capital");
        expect(want.dir === "right" ? s.IS : -s.IS).toBeGreaterThan(1e-6);
        expect(Math.abs(s.LM)).toBeLessThan(1e-6); // a float leaves the money supply alone
        expect(x > 0 ? c.chain.up : c.chain.down).toContain(`${want.curve} ${want.dir}`);
      });

      it(`currency board: ${c.id} ${x > 0 ? "up" : "down"} moves ${c.pegDir ? "LM" : "IS"} and LM follows the balance of payments`, () => {
        const s = shifts(setCause(open("board"), c.id, x), c.channel === "capital");
        const want = shiftOf(c, x, true)!;
        if (c.pegDir) {
          expect(want.curve).toBe("LM");
          expect(want.dir === "right" ? s.LM : -s.LM).toBeGreaterThan(1e-6);
          expect(x > 0 ? c.pegChain!.up : c.pegChain!.down).toContain(`LM ${want.dir}`);
        } else {
          // IS moves as in a float, and the money supply follows the payments surplus or deficit the same way
          expect(want.dir === "right" ? s.IS : -s.IS).toBeGreaterThan(1e-6);
          expect(want.dir === "right" ? s.LM : -s.LM).toBeGreaterThan(1e-6);
        }
      });
    }
  }

  it("the causes reach the open economy on their own", () => {
    for (const c of openCauses) expect(setCause(baselineState(), c.id, 10).open).toBe(true);
  });
});

describe("net exports and the S - NX = I panel", () => {
  it("a rise in NX lowers S - NX and moves IS right; a fall moves it left", () => {
    const up = run(setCause(open(), "foreignDemand", 40)), dn = run(setCause(open(), "foreignDemand", -40));
    const f0 = up.sim.baseline;
    const at = (rn: typeof up) => netExports(rn.after, f0.Y, f0.q, rn.after.Yp);
    // the panel's S - NX schedule, at the same Y, lies lower after a rise in NX and higher after a fall
    const sMinusNX = (p: typeof up.base, nx: number) => desiredSaving(p, f0.Y, 5) - nx;
    expect(sMinusNX(up.after, at(up))).toBeLessThan(sMinusNX(up.base, netExports(up.base, f0.Y, f0.q)));
    expect(sMinusNX(dn.after, at(dn))).toBeGreaterThan(sMinusNX(dn.base, netExports(dn.base, f0.Y, f0.q)));
    expect(at(up)).toBeGreaterThan(netExports(up.base, f0.Y, f0.q));
    expect(at(dn)).toBeLessThan(netExports(dn.base, f0.Y, f0.q));
    expect(isR(up.after, 100, f0.q)).toBeGreaterThan(isR(up.base, 100, f0.q)); // IS right: higher r at each Y
    expect(isR(dn.after, 100, f0.q)).toBeLessThan(isR(dn.base, 100, f0.q));
  });

  it("NX = f(Y, partner income, trade policy, RER) with the signs the course gives", () => {
    const p = baseFor(open());
    expect(netExports(p, 110, 1)).toBeLessThan(netExports(p, 100, 1)); // home income raises imports
    expect(netExports(p, 100, 1, 110)).toBeGreaterThan(netExports(p, 100, 1, 100)); // partner income raises exports
    expect(netExports({ ...p, tariffP: 10 }, 100, 1)).toBeLessThan(netExports(p, 100, 1)); // tariffs on our exports cut NX
    expect(netExports(p, 100, 0.9)).toBeGreaterThan(netExports(p, 100, 1)); // a real depreciation raises NX
  });
});

describe("exchange rates", () => {
  it("RER = e × P_home ÷ P_foreign at every period", () => {
    const rn = run(setCause(open(), "foreignRate", 30));
    for (const t of [0, 1, 5, 30]) {
      const f = frameAt(rn.sim, t);
      expect(f.q).toBeCloseTo((f.E * f.P) / 1, 6); // P_foreign = 1 with no linked partner
    }
  });

  it("uncovered interest parity: the higher-rate currency is expected to depreciate", () => {
    expect(expectedEChange(7, 5)).toBeLessThan(0); // home rate above foreign: home currency expected to fall
    expect(expectedEChange(3, 5)).toBeGreaterThan(0);
    expect(expectedEChange(5, 5)).toBeCloseTo(0, 12);
    expect((1 + 5 / 100) / (1 + 7 / 100)).toBeCloseTo(1 + expectedEChange(7, 5), 12); // e1/e0
    const f = run(setParent(open(), "moneySupply", 70)).sim.impact; // easy money lowers r below the foreign rate
    expect(f.r).toBeLessThan(f.rp);
    expect(f.expE).toBeGreaterThan(0);
  });

  it("a float appreciates when foreign demand rises; a real appreciation is RER above 1", () => {
    const f = run(setCause(open(), "foreignDemand", 30)).sim.impact;
    expect(f.E).toBeGreaterThan(1);
    expect(f.q).toBeGreaterThan(1);
  });
});

describe("the regime is a choice on a spectrum", () => {
  it("offers float, band, crawling band, currency board and dollarization in that order", () => {
    expect(regimes.map((r) => r.id)).toEqual(["float", "band", "crawl", "board", "dollar"]);
  });

  it("a float keeps the money supply; a hard peg lets the balance of payments set it", () => {
    const fl = run(setCause(open("float"), "foreignDemand", 40)).sim;
    expect(fl.impact.Meff).toBeCloseTo(fl.baseline.Meff, 9);
    const peg = run(setCause(open("board"), "foreignDemand", 40)).sim;
    expect(peg.impact.Meff).toBeGreaterThan(peg.baseline.Meff); // a surplus adds money
    expect(peg.impact.Res).toBeGreaterThan(peg.baseline.Res);
    expect(peg.impact.E).toBeCloseTo(peg.baseline.E, 9); // the rate does not move
    expect(peg.longRun.P).toBeGreaterThan(1); // prices rise
    const deficit = run(setCause(open("board"), "foreignDemand", -40)).sim;
    expect(deficit.impact.Meff).toBeLessThan(deficit.baseline.Meff);
    expect(deficit.impact.Res).toBeLessThan(deficit.baseline.Res); // defending uses reserves
  });

  it("a hard peg has no money policy of its own", () => {
    const st = setCause(open("board"), "centralBank", 40);
    expect(causeDisabled(causes.find((c) => c.id === "centralBank")!, st)).not.toBeNull();
    const rn = run(st);
    expect(rn.sim.impact.Y).toBeCloseTo(rn.sim.baseline.Y, 9);
    expect(paramsFor(baseFor(st), st).M).toBeCloseTo(baseFor(st).M, 9);
  });

  it("reserves run out only after they have been used: a big enough drain breaks the peg", () => {
    let st = open("board");
    for (const id of ["capitalFlight", "foreignRate", "tariffsOnUs"]) st = setCause(st, id, 50);
    st = setCause(st, "exchangeRate", -50);
    const rn = run(st);
    expect(rn.sim.frames.some((f) => f.devalued) || rn.sim.pegBreaks).toBe(true);
  });

  it("dollarization has no devaluation premium", () => {
    const rn = run(setCause(open("dollar"), "capitalFlight", 50));
    expect(rn.after.prem).toBe(0);
    expect(causeDisabled(causes.find((c) => c.id === "capitalFlight")!, open("dollar"))).not.toBeNull();
    expect(isHardPeg("dollar") && isHardPeg("board") && !isHardPeg("band")).toBe(true);
  });

  it("a band floats for a small shock and defends its edge for a big one", () => {
    const small = run(setCause(open("band"), "partnerGrowth", 20));
    expect(small.defended).toBeNull();
    expect(small.ran).toBe("floating");
    const big = run(setCause(open("band"), "tariffsOnUs", 50));
    expect(big.defended).not.toBeNull();
    expect(big.ran).toBe("fixed");
    const e = big.sim.impact.E;
    expect(Math.abs(e - 1)).toBeLessThanOrEqual(0.1 + 1e-9);
    expect(isHardPeg("band")).toBe(false);
  });

  it("a crawling band is centred on the long-run rate, not today's", () => {
    const st = setCause(open("crawl"), "ourTariff", 50);
    const rn = run(st);
    // the float's long-run e is 1.25 here, so a band around it is not breached by an e that moves there
    expect(rn.defended === null || rn.defended.centre > 1).toBe(true);
  });
});

describe("I = S + S_foreign, the current account and the financial account", () => {
  const scenarios: Array<[string, SimState]> = [
    ["balanced", open()],
    ["foreign demand up", setCause(open(), "foreignDemand", 40)],
    ["capital flight (float)", setCause(open(), "capitalFlight", 40)],
    ["surplus under a board", setCause(open("board"), "foreignDemand", 40)],
    ["deficit under a board", setCause(open("board"), "tariffsOnUs", 40)],
  ];
  for (const [label, st] of scenarios) {
    it(`${label}: investment is own saving plus foreign saving, and CA + FA = Δreserves`, () => {
      const rn = run(st);
      for (const t of [0, 1, 4, 25]) {
        const f = frameAt(rn.sim, t);
        const p = t === 0 ? rn.base : rn.after;
        const S = f.Y - f.C - p.G;
        const Sf = f.I - S;
        expect(f.I).toBeCloseTo(S + Sf, 9);
        expect(S - f.I).toBeCloseTo(f.NX, 6); // CA = S - I = NX
        expect(Sf).toBeCloseTo(-f.NX, 6); // a trade deficit is foreign saving coming in
        expect(f.NX + f.FA).toBeCloseTo(f.dRes, 6);
      }
    });
  }
});

describe("a partner economy sharing the world interest rate", () => {
  const boom = { ...setCause(open("float", true), "businessConfidence", 50) };
  const rn = run(boom);

  it("simulates the partner beside the home economy", () => {
    expect(rn.foreign).not.toBeNull();
    expect(rn.foreign!.frames.length).toBe(rn.sim.frames.length);
    expect(run(open()).foreign).toBeNull();
  });

  it("a US future-productivity boom raises the world rate, lowers US NX and raises Japan's", () => {
    const us = rn.sim, jp = rn.foreign!;
    expect(us.impact.r).toBeGreaterThan(us.baseline.r);
    expect(jp.impact.r).toBeCloseTo(us.impact.r, 6); // one world rate
    expect(us.impact.NX).toBeLessThan(us.baseline.NX);
    expect(jp.impact.NX).toBeGreaterThan(jp.baseline.NX);
    expect(jp.impact.NX).toBeCloseTo(-us.impact.NX, 6);
  });

  it("the two economies' trade balances sum to zero and both return to full employment", () => {
    for (const t of [1, 10, 40]) expect(frameAt(rn.sim, t).NX + frameAt(rn.foreign!, t).NX).toBeCloseTo(0, 6);
    expect(rn.sim.longRun.Y).toBeCloseTo(rn.sim.longRun.Ystar, 6);
    expect(rn.foreign!.longRun.Y).toBeCloseTo(rn.foreign!.longRun.Ystar, 6);
  });

  it("partner growth and the foreign rate are the partner's to set once it is simulated", () => {
    const pg = causes.find((c) => c.id === "partnerGrowth")!, fr = causes.find((c) => c.id === "foreignRate")!;
    expect(causeDisabled(pg, open("float", true))).not.toBeNull();
    expect(causeDisabled(fr, open("float", true))).not.toBeNull();
    expect(causeDisabled(pg, open())).toBeNull();
  });
});

describe("the open economy in a link", () => {
  it("regime, mobility and partner reopen exactly", () => {
    const st: SimState = { ...setCause({ ...open("band", true) }, "tariffsOnUs", 25), mobility: 0.8 };
    const back = decodeState(encodeState(st));
    expect(back.regime).toBe("band");
    expect(back.partner).toBe(true);
    expect(back.open).toBe(true);
    expect(back.causes).toEqual({ tariffsOnUs: 25 });
    const noPartner = decodeState(encodeState({ ...open("crawl"), mobility: 0.8 }));
    expect(noPartner.mobility).toBeCloseTo(0.8, 6);
    expect(noPartner.regime).toBe("crawl");
  });
  it("a bad regime, mobility or flag falls back to the default", () => {
    const st = decodeState("?open=1&rg=peg&mob=7&pt=yes");
    expect(st.regime).toBe("float");
    expect(st.mobility).toBe(0.5);
    expect(st.partner).toBe(false);
  });
  it("the lesson's open-economy shocks open the floating simulator with the same answer", () => {
    for (const id of ["tariff-up", "partner-tariff-up", "foreign-rate-up", "devaluation-fear", "foreign-demand-up"]) {
      const st = stateForShock(id, "floating")!;
      expect(st).not.toBeNull();
      const lesson = simulate(baselineEconomy("floating", 0.5), shockById(id)!.apply, 60);
      const sim = run(st).sim;
      expect(sim.impact.Y).toBeCloseTo(lesson.impact.Y, 6);
      expect(sim.impact.E).toBeCloseTo(lesson.impact.E, 6);
      expect(sim.impact.NX).toBeCloseTo(lesson.impact.NX, 6);
      expect(sim.longRun.P).toBeCloseTo(lesson.longRun.P, 6);
    }
    expect(stateForShock("peg-overvalued", "fixed")).toBeNull();
  });
});
