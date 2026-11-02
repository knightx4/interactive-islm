/** Arithmetic and data behind the recessions and policy rules lesson. Model numbers are index units; the data are approximate. */
import { simulate } from "../macro/model";
import { shockById, type Curve } from "../macro/shocks";
import { economy } from "./fullmodel";

/* ---------------- classifying recessions ---------------- */

export type Brief = { text: string; shockId: string; why: string };

/** Invented short briefs. Each is tied to a shock in the shift table, so the answer comes from the model's own table. */
export const briefs: Brief[] = [
  { text: "Worried about job security, households cut back spending and save more. The central bank leaves the money supply alone. Retail prices start to soften.", shockId: "future-income-down", why: "Expected lower income raises desired saving at each rate. That is IS moving left: a demand recession that is real in origin." },
  { text: "A drought destroys harvests and irrigation equipment. Output falls and food prices jump.", shockId: "capital-down", why: "Capital is lost, so capacity falls. FE moves left, and prices rise on the way: a supply recession." },
  { text: "The central bank sharply cuts the money supply. Interest rates rise, output falls, and inflation slows.", shockId: "money-supply-down", why: "A lower money supply lowers real balances at every output, so LM moves left. It is a nominal recession, and only prices differ in the long run." },
  { text: "Firms put off building new plants because they expect weaker returns. Orders for machinery drop.", shockId: "investment-outlook-down", why: "A lower expected return on capital cuts desired investment at each rate, so IS moves left." },
  { text: "Energy costs double. Factories cut shifts, output falls, and consumer prices climb.", shockId: "productivity-down", why: "Dearer energy acts like lower productivity. FE moves left, which is why prices rise even as output falls." },
  { text: "Savers suddenly see shares and bonds as much riskier and move into safe money. The money supply is unchanged. Output falls and the interest rate rises.", shockId: "alt-risk-up", why: "Riskier alternatives raise money demand at each output and rate, so LM moves left." },
  { text: "A new payroll tax cuts the amount people want to work. Employment falls and output falls.", shockId: "labour-tax-up", why: "A higher labour tax lowers the after-tax wage, so full-employment output falls. FE moves left." },
  { text: "The government raises income taxes to close its deficit. Households and the government together save more.", shockId: "taxes-up", why: "Higher taxes raise total saving at each rate, so IS moves left." },
];

export type RecessionRow = { curve: Curve; label: string; shockId: string; yImpact: number; yLong: number; pLong: number; kind: string; origin: string };

/** What each way for output to fall does, run through the model. */
export function recessionRows(): RecessionRow[] {
  const spec: [Curve, string, string, string, string][] = [
    ["IS", "Spending falls (a tighter budget)", "taxes-up", "Demand: prices fall", "Real"],
    ["LM", "Money tightens", "money-supply-down", "Demand: prices fall", "Nominal"],
    ["FE", "Capacity falls (an oil shock)", "productivity-down", "Supply: prices rise", "Real"],
  ];
  return spec.map(([curve, label, shockId, kind, origin]) => {
    const s = simulate(economy, shockById(shockId)!.apply, 60);
    return { curve, label, shockId, yImpact: s.impact.Y - s.baseline.Y, yLong: s.longRun.Y - s.baseline.Y, pLong: s.longRun.P - s.baseline.P, kind, origin };
  });
}

/* ---------------- 2008 and 2009, by component of GDP ---------------- */

/** Approximate contributions to the change in US real GDP from the end of 2007 to mid-2009, in percentage points. From memory. */
export const contributions2008: { name: string; pp: number }[] = [
  { name: "Consumption", pp: -1.7 },
  { name: "Residential investment", pp: -1.2 },
  { name: "Business fixed investment", pp: -1.5 },
  { name: "Inventories", pp: -0.7 },
  { name: "Net exports", pp: 0.6 },
  { name: "Government purchases", pp: 0.5 },
];
export const totalContribution = () => contributions2008.reduce((a, b) => a + b.pp, 0);

/* ---------------- the Taylor rule ---------------- */

export const R_STAR = 2;
export const TARGET = 2;

/** i = inflation + r* + 0.5 (inflation - target) + 0.5 (output gap), all in percent. */
export const taylor = (inflation: number, gap: number, target = TARGET, rStar = R_STAR) =>
  inflation + rStar + 0.5 * (inflation - target) + 0.5 * gap;

/** The rule cannot ask for a negative nominal rate. */
export const withFloor = (i: number) => Math.max(0, i);

/** Approximate US annual data, from memory: inflation (consumer prices, percent), output gap (percent of potential), federal funds rate (percent, annual average). */
export const usPolicy: { year: number; inflation: number; gap: number; funds: number }[] = [
  { year: 2000, inflation: 3.4, gap: 2.5, funds: 6.2 }, { year: 2001, inflation: 2.8, gap: 0.0, funds: 3.9 },
  { year: 2002, inflation: 1.6, gap: -1.5, funds: 1.7 }, { year: 2003, inflation: 2.3, gap: -2.0, funds: 1.1 },
  { year: 2004, inflation: 2.7, gap: -1.5, funds: 1.4 }, { year: 2005, inflation: 3.4, gap: -0.5, funds: 3.2 },
  { year: 2006, inflation: 3.2, gap: 0.3, funds: 5.0 }, { year: 2007, inflation: 2.8, gap: 0.3, funds: 5.0 },
  { year: 2008, inflation: 3.8, gap: -1.5, funds: 1.9 }, { year: 2009, inflation: -0.4, gap: -5.5, funds: 0.2 },
  { year: 2010, inflation: 1.6, gap: -5.2, funds: 0.2 }, { year: 2011, inflation: 3.2, gap: -4.5, funds: 0.1 },
  { year: 2012, inflation: 2.1, gap: -3.8, funds: 0.1 }, { year: 2013, inflation: 1.5, gap: -3.5, funds: 0.1 },
  { year: 2014, inflation: 1.6, gap: -2.5, funds: 0.1 }, { year: 2015, inflation: 0.1, gap: -1.5, funds: 0.1 },
  { year: 2016, inflation: 1.3, gap: -1.3, funds: 0.4 }, { year: 2017, inflation: 2.1, gap: -0.5, funds: 1.0 },
  { year: 2018, inflation: 2.4, gap: 0.7, funds: 1.8 }, { year: 2019, inflation: 1.8, gap: 1.0, funds: 2.2 },
  { year: 2020, inflation: 1.2, gap: -3.0, funds: 0.4 }, { year: 2021, inflation: 4.7, gap: -1.5, funds: 0.1 },
  { year: 2022, inflation: 8.0, gap: 0.5, funds: 1.7 }, { year: 2023, inflation: 4.1, gap: 0.8, funds: 5.0 },
];

/* ---------------- nominal GDP targeting ---------------- */

/** Under a nominal GDP growth target, the implied inflation rate is target growth minus real growth (to a close approximation). */
export const impliedInflation = (ngdpTarget: number, realGrowth: number) => ngdpTarget - realGrowth;
