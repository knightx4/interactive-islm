/**
 * Arithmetic behind the measuring lesson: three ways to add up GDP, nominal against real values,
 * a fixed-basket price index, and imports in the expenditure identity.
 * All numbers are invented teaching values, not data.
 */

/* ---------------- the two-firm economy: three ways to count GDP ---------------- */

export type Orchard = {
  /** Price and quantity of oranges (the farm's output, all sold to the juice maker). */
  po: number; qo: number;
  /** Price and quantity of juice made, and how much of it households bought this year. */
  pj: number; qj: number; sold: number;
  /** Share of each firm's value added paid out as wages (the rest is profit). */
  wageShare: number;
};

export type ThreeWays = {
  valueAddedFarm: number; valueAddedJuice: number;
  production: number;
  consumption: number; inventory: number; expenditure: number;
  wages: number; profits: number; income: number;
  /** Sales of oranges to the juice maker: intermediate, so not counted in expenditure. */
  intermediate: number;
};

export function threeWays(e: Orchard): ThreeWays {
  const sold = Math.min(e.sold, e.qj);
  const intermediate = e.po * e.qo;
  const valueAddedFarm = e.po * e.qo; // the farm buys nothing from other firms
  const valueAddedJuice = e.pj * e.qj - intermediate;
  const production = valueAddedFarm + valueAddedJuice;
  const consumption = e.pj * sold;
  const inventory = e.pj * (e.qj - sold); // unsold juice is investment in inventories
  const expenditure = consumption + inventory;
  const wages = e.wageShare * production;
  const profits = production - wages;
  return { valueAddedFarm, valueAddedJuice, production, consumption, inventory, expenditure, wages, profits, income: wages + profits, intermediate };
}

/* ---------------- nominal and real GDP ---------------- */

export type Good = { name: string; p: number[]; q: number[] };
export const years = [2020, 2021, 2022, 2023, 2024];

/** A three-good toy economy. Phones get far cheaper and are made in far greater numbers. */
export const toyEconomy: Good[] = [
  { name: "Phones", p: [100, 90, 80, 70, 60], q: [10, 14, 20, 28, 40] },
  { name: "Loaves of bread", p: [2, 2.2, 2.4, 2.6, 2.8], q: [1000, 1000, 1010, 1010, 1020] },
  { name: "Haircuts", p: [20, 21, 22, 23, 24], q: [100, 100, 105, 105, 110] },
];

export const nominalGDP = (g: Good[], t: number) => g.reduce((s, x) => s + x.p[t] * x.q[t], 0);
/** Real GDP in year t, valued at the prices of the base year. */
export const realGDP = (g: Good[], t: number, base: number) => g.reduce((s, x) => s + x.p[base] * x.q[t], 0);
/** GDP deflator, base year = 100. */
export const deflator = (g: Good[], t: number, base: number) => (100 * nominalGDP(g, t)) / realGDP(g, t, base);

/* ---------------- a fixed-basket price index ---------------- */

export type BasketItem = { name: string; q: number; p0: number; p1: number; kind?: "beef" | "chicken" | "laptop" };
export const basket: BasketItem[] = [
  { name: "Beef (kg)", q: 10, p0: 8, p1: 12, kind: "beef" },
  { name: "Chicken (kg)", q: 10, p0: 4, p1: 4.2, kind: "chicken" },
  { name: "Bread (loaf)", q: 20, p0: 2, p1: 2.1 },
  { name: "Laptop", q: 1, p0: 1000, p1: 1100, kind: "laptop" },
];

/**
 * Inflation between the two years as a percentage, three ways.
 *  - fixed: the same basket in both years (what a CPI does).
 *  - adjusted: households switch `swap` kg from beef to chicken once beef becomes dearer (substitution).
 *  - corrected: also treats `quality` (0 to 1) of the laptop's price rise as a better machine, not a dearer one.
 */
export function inflation(swap: number, quality: number) {
  const cost = (items: BasketItem[], year: "p0" | "p1", qtys: number[], laptopP1?: number) =>
    items.reduce((s, it, i) => s + qtys[i] * (it.kind === "laptop" && year === "p1" && laptopP1 !== undefined ? laptopP1 : it[year]), 0);
  const fixedQ = basket.map((b) => b.q);
  const swapQ = basket.map((b) => (b.kind === "beef" ? b.q - swap : b.kind === "chicken" ? b.q + swap : b.q));
  const lap = basket.find((b) => b.kind === "laptop")!;
  const pureLaptop = lap.p0 + (1 - quality) * (lap.p1 - lap.p0);
  const pct = (a: number, b: number) => 100 * (b / a - 1);
  return {
    fixed: pct(cost(basket, "p0", fixedQ), cost(basket, "p1", fixedQ)),
    adjusted: pct(cost(basket, "p0", swapQ), cost(basket, "p1", swapQ)),
    corrected: pct(cost(basket, "p0", swapQ), cost(basket, "p1", swapQ, pureLaptop)),
  };
}

/* ---------------- imports in the identity ---------------- */

export type Spending = { C: number; I: number; G: number; X: number; IM: number };
/** GDP = C + I + G + X - IM, where C, I and G include spending on imported goods. */
export const gdpFrom = (s: Spending) => s.C + s.I + s.G + s.X - s.IM;
/** Households move `amount` of spending from a domestic good to an imported one. */
export function switchToImport(s: Spending, amount: number): Spending {
  return { ...s, IM: s.IM + amount }; // C is unchanged: it was spending either way
}
