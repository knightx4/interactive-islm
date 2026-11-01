import type { Params, Regime } from "./model";

export type Shock = {
  id: string;
  label: string;
  group: "demand" | "supply" | "policy" | "foreign";
  regimes: Regime[];
  blurb: string;
  apply: (p: Params) => Params;
};

const all: Regime[] = ["closed", "floating", "fixed"];
const open: Regime[] = ["floating", "fixed"];

export const shocks: Shock[] = [
  { id: "fiscal-spend", label: "Government spending rises", group: "policy", regimes: all,
    blurb: "G up by 10 — IS shifts right.", apply: (p) => ({ ...p, G: p.G + 10 }) },
  { id: "tax-cut", label: "Taxes fall", group: "policy", regimes: all,
    blurb: "T down by 10 — households keep more, IS shifts right by less than a matching G rise.",
    apply: (p) => ({ ...p, T: p.T - 10 }) },
  { id: "money-up", label: "Central bank expands money", group: "policy", regimes: all,
    blurb: "Nominal money up 10% — LM shifts right (under a peg the stock is not a free choice).",
    apply: (p) => ({ ...p, M: p.M * 1.1 }) },
  { id: "money-down", label: "Central bank tightens money", group: "policy", regimes: all,
    blurb: "Nominal money down 10% — LM shifts left.", apply: (p) => ({ ...p, M: p.M * 0.9 }) },
  { id: "invest-up", label: "Firms get optimistic", group: "demand", regimes: all,
    blurb: "Autonomous investment up 8 — IS shifts right.", apply: (p) => ({ ...p, I0: p.I0 + 8 }) },
  { id: "consume-down", label: "Households turn cautious", group: "demand", regimes: all,
    blurb: "Autonomous consumption down 8 — IS shifts left.", apply: (p) => ({ ...p, C0: p.C0 - 8 }) },
  { id: "money-demand-up", label: "Demand for money rises", group: "demand", regimes: all,
    blurb: "People want more liquidity at any output and rate — LM shifts left.",
    apply: (p) => ({ ...p, ky: p.ky * 1.1 }) },
  { id: "productivity-up", label: "Productivity rises", group: "supply", regimes: all,
    blurb: "Output per worker up 5% — the FE line moves right.", apply: (p) => ({ ...p, z: p.z * 1.05 }) },
  { id: "supply-down", label: "Adverse supply shock", group: "supply", regimes: all,
    blurb: "Productive capacity down 5% — the FE line moves left.", apply: (p) => ({ ...p, z: p.z * 0.95 }) },
  { id: "world-rate-up", label: "World interest rate rises", group: "foreign", regimes: open,
    blurb: "r* up by 1 point — capital is pulled abroad.", apply: (p) => ({ ...p, rw: p.rw + 1 }) },
  { id: "foreign-demand", label: "Foreign demand for our goods rises", group: "foreign", regimes: open,
    blurb: "Autonomous net exports up 6 — IS shifts right.", apply: (p) => ({ ...p, x0: p.x0 + 6 }) },
];

export const shockById = (id: string) => shocks.find((s) => s.id === id);
export const shocksFor = (regime: Regime) => shocks.filter((s) => s.regimes.includes(regime));
