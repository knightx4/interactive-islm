import { describe, expect, it } from "vitest";
import { hireUntil, mpl, out, presets, profit, sources } from "./growth";
import { baselineEconomy, employmentFE, mpl as modelMpl, output as modelOut, Ystar } from "../macro/model";

const t = { A: 1, K: 100, a: 0.3 };
describe("production function", () => {
  it("matches the model's production function and marginal product", () => {
    const p = baselineEconomy("closed");
    for (const N of [50, 100, 150]) {
      expect(out({ A: p.A, K: p.K, a: p.a }, N)).toBeCloseTo(modelOut(p, N), 9);
      expect(mpl({ A: p.A, K: p.K, a: p.a }, N)).toBeCloseTo(modelMpl(p, N), 9);
    }
  });
  it("has diminishing marginal product", () => {
    expect(mpl(t, 50)).toBeGreaterThan(mpl(t, 100));
    expect(mpl(t, 100)).toBeGreaterThan(mpl(t, 200));
  });
  it("is raised by A and K", () => {
    expect(mpl({ ...t, A: 1.1 }, 100)).toBeGreaterThan(mpl(t, 100));
    expect(mpl({ ...t, K: 120 }, 100)).toBeGreaterThan(mpl(t, 100));
  });
});
describe("hiring", () => {
  it("hires until MPL equals the wage, and that maximises profit", () => {
    const w = 0.7, N = hireUntil(t, w);
    expect(mpl(t, N)).toBeCloseTo(w, 9);
    expect(profit(t, N, w)).toBeGreaterThan(profit(t, N * 0.9, w));
    expect(profit(t, N, w)).toBeGreaterThan(profit(t, N * 1.1, w));
  });
  it("hires more when productivity rises", () => {
    expect(hireUntil({ ...t, A: 1.1 }, 0.7)).toBeGreaterThan(hireUntil(t, 0.7));
  });
});
describe("growth accounting", () => {
  it("splits growth exactly into its sources", () => {
    for (const p of presets) {
      const s = sources(p.g);
      expect(s.capital + s.labour + s.schooling + s.tfp).toBeCloseTo(p.g.gY, 9);
    }
  });
  it("leaves almost no TFP in the input-led preset and a large share in the other", () => {
    const asia = presets[0].g, tfp = presets[1].g;
    expect(sources(asia).tfp / asia.gY).toBeLessThan(0.1);
    expect(sources(tfp).tfp / tfp.gY).toBeGreaterThan(0.4);
  });
});
describe("hand-off to FE", () => {
  it("moves FE right when A rises", () => {
    const p = baselineEconomy("closed");
    expect(Ystar({ ...p, A: p.A * 1.05 })).toBeGreaterThan(Ystar(p));
    expect(employmentFE({ ...p, A: p.A * 1.05 })).toBeGreaterThan(employmentFE(p));
  });
});
