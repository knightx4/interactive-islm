import type { Regime } from "@/lib/macro/model";

/** A playable lab on a lesson page: which economy, which shocks, which one starts selected. */
export type LabSpec = {
  regime: Regime;
  /** Capital mobility for open economies, 0 (none) to 1 (perfect). */
  mobility?: number;
  shocks: string[];
  defaultShock: string;
};

export type Lesson = {
  /** 1 to 13; the Practice page is 0 and is not numbered. */
  n: number;
  slug: string;
  part: number;
  title: string;
  summary: string;
  kind?: "lesson" | "practice";
  /** What the lesson will cover; shown on lessons whose text is not written yet. */
  covers: string[];
  /** Written lesson text, when it exists. */
  body?: string[];
  takeaways?: string[];
  lab?: LabSpec;
};

export const parts = [
  { n: 1, title: "The building blocks", blurb: "How to measure an economy, and what drives output, saving, prices and jobs." },
  { n: 2, title: "The IS-LM-FE model", blurb: "Three curves, a recipe for shocks, and how an economy finds its way home." },
  { n: 3, title: "The open economy", blurb: "Exchange rates, trade, tariffs and the flow of capital across borders." },
  { n: 4, title: "Practice", blurb: "Mixed problems that put the whole toolkit to work." },
];

const worked = [
  "productivity-down", "money-supply-up", "gov-spending-up", "taxes-up",
  "wealth-up", "expected-inflation-up", "investment-outlook-up", "labour-tax-up",
];
const featured = ["productivity-down", "money-supply-up", "gov-spending-up"];

export const lessons: Lesson[] = [
  {
    n: 1, slug: "measuring-the-economy", part: 1, title: "Measuring the economy",
    summary: "GDP, prices and employment: what the numbers count and what they miss.",
    covers: ["What GDP adds up, and the expenditure identity", "Nominal against real values, and price indexes", "Employment, unemployment and the labour force"],
  },
  {
    n: 2, slug: "productivity-growth", part: 1, title: "Productivity and growth",
    summary: "Why output per worker rises, and what it does to wages and living standards.",
    covers: ["The production function and what moves it", "Capital, labour and productivity", "Growth over decades compared with swings over quarters"],
  },
  {
    n: 3, slug: "saving-investment", part: 1, title: "Saving and investment",
    summary: "Households save, firms invest, and the real interest rate brings the two together.",
    covers: ["Desired saving and what shifts it", "Desired investment and what shifts it", "The real interest rate that clears the market"],
  },
  {
    n: 4, slug: "money-inflation", part: 1, title: "Money and inflation",
    summary: "What people hold money for, what central banks control, and how inflation expectations enter.",
    covers: ["Money demand and the nominal interest rate", "How the money supply is set", "Inflation, expected inflation and the real rate"],
  },
  {
    n: 5, slug: "unemployment", part: 1, title: "Unemployment",
    summary: "The labour market at full employment, and why jobs can still be scarce.",
    covers: ["Labour demand, labour supply and the real wage", "Taxes on work", "Frictions, and unemployment above its natural level"],
  },
  {
    n: 6, slug: "is-lm-fe", part: 2, title: "The IS-LM-FE model",
    summary: "Put the goods, money and labour markets on one picture and run a shock through it.",
    covers: ["The IS, LM and FE curves", "What each curve holds fixed", "Short-run and long-run equilibrium"],
    body: [
      "The model is three conditions drawn against output on the horizontal axis and the real interest rate on the vertical. The IS curve collects every pair of output and interest rate at which desired saving equals desired investment, so the goods market clears. The LM curve collects every pair at which the real money supply equals what people want to hold, so the money market clears. The FE line marks the output the economy produces when the labour market clears, with the real wage where labour demand meets labour supply. It is vertical because that level of output does not depend on the interest rate.",
      "In the short run prices are stuck, so the economy sits where IS and LM cross, wherever that is relative to FE. If output is above FE, firms and workers bid prices up; below it, prices slip. A price change alters real money balances, so it moves LM. The economy keeps sliding along until IS, LM and FE all meet at one point, which is the long run.",
      "Below, pick a shock and say what you expect to happen to nine variables, now and after prices have settled. Then step through the recipe and watch the same answer appear on the curves, in the three side markets, and along the time path.",
    ],
    takeaways: [
      "IS and LM set output and the interest rate in the short run; FE sets where output ends up.",
      "Every shock moves exactly one curve first; the table of shifts tells you which.",
      "Prices move until real money balances put LM back through the point where IS meets FE.",
    ],
    lab: { regime: "closed", shocks: featured, defaultShock: "productivity-down" },
  },
  {
    n: 7, slug: "recipe", part: 2, title: "The recipe",
    summary: "A fixed sequence of eight steps that turns any shock into a prediction.",
    covers: ["Naming the shock and the market it hits", "Moving a curve and finding the short-run point", "Letting prices adjust to the long-run point"],
    lab: { regime: "closed", shocks: worked, defaultShock: "money-supply-up" },
  },
  {
    n: 8, slug: "supply-demand-shocks", part: 2, title: "Supply and demand shocks",
    summary: "Shocks that move IS or LM against shocks that move FE, and how to tell them apart in the data.",
    covers: ["Demand shocks: spending and money", "Supply shocks: productivity, capital, labour", "Why prices and output move together or apart"],
    lab: { regime: "closed", shocks: worked, defaultShock: "productivity-down" },
  },
  {
    n: 9, slug: "recessions", part: 2, title: "Recessions",
    summary: "What puts output below capacity, how long it lasts, and what policy can do.",
    covers: ["Slumps from falling demand", "Slumps from falling capacity", "Policy responses and their limits"],
    lab: { regime: "closed", shocks: ["taxes-up", "wealth-up", "money-supply-up", "gov-spending-up"], defaultShock: "taxes-up" },
  },
  {
    n: 10, slug: "exchange-rates", part: 3, title: "Exchange rates",
    summary: "Nominal and real exchange rates, and what moves them under floating and fixed regimes.",
    covers: ["e and the real exchange rate", "Interest parity and expected currency moves", "Floating regimes against pegs"],
    lab: { regime: "floating", mobility: 0.5, shocks: ["money-supply-up", "gov-spending-up", "foreign-rate-up"], defaultShock: "money-supply-up" },
  },
  {
    n: 11, slug: "open-economy", part: 3, title: "The open economy",
    summary: "Net exports inside IS, and how capital mobility changes what policy can do.",
    covers: ["Net exports and the real exchange rate", "Capital mobility from none to perfect", "Large and small economies"],
    lab: { regime: "floating", mobility: 0.5, shocks: ["gov-spending-up", "money-supply-up", "foreign-demand-up"], defaultShock: "gov-spending-up" },
  },
  {
    n: 12, slug: "tariffs-trade", part: 3, title: "Tariffs and trade",
    summary: "What tariffs do to net exports, the exchange rate and output.",
    covers: ["Tariffs and net exports", "Retaliation and a partner's tariff", "Why a float can offset a tariff"],
    lab: { regime: "floating", mobility: 0.5, shocks: ["tariff-up", "partner-tariff-up"], defaultShock: "tariff-up" },
  },
  {
    n: 13, slug: "reunification-capital-flows", part: 3, title: "Reunification and capital flows",
    summary: "Large shifts in saving and investment across borders, and what pegs and reserves do under strain.",
    covers: ["Shocks that move capital across borders", "Pegs, reserves and speculative attacks", "Linked economies"],
    lab: { regime: "fixed", mobility: 0.5, shocks: ["devaluation-fear", "peg-undervalued", "foreign-rate-up"], defaultShock: "devaluation-fear" },
  },
  {
    n: 0, slug: "practice", part: 4, kind: "practice", title: "Practice",
    summary: "Mixed problems across all parts, with the shocks to try and the answers to check against.",
    covers: ["Predict-then-check drills", "Reading a news item as a shock", "Putting the whole recipe together"],
  },
];

export const lessonBySlug = (slug: string) => lessons.find((l) => l.slug === slug);

/** Old lesson addresses and where they live now. */
export const legacySlugs: Record<string, string> = {
  islm: "is-lm-fe",
  productivity: "productivity-growth",
  "labor-market": "unemployment",
  fx: "exchange-rates",
  "full-employment": "is-lm-fe",
  "goods-market-is": "saving-investment",
  "money-market-lm": "money-inflation",
  "labor-productivity": "productivity-growth",
  "demand-shocks": "supply-demand-shocks",
  "supply-shocks": "supply-demand-shocks",
  "price-adjustment": "recipe",
  "fiscal-policy": "supply-demand-shocks",
  "monetary-policy": "supply-demand-shocks",
  "policy-tradeoffs": "recessions",
  "floating-rates": "exchange-rates",
  "fixed-rates": "exchange-rates",
};
