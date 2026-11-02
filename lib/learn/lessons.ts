import type { Regime } from "@/lib/macro/model";

/** A playable lab on a lesson page: which economy, which shocks, which one starts selected. */
export type LabSpec = {
  regime: Regime;
  /** Capital mobility for open economies, 0 (none) to 1 (perfect). */
  mobility?: number;
  shocks: string[];
  defaultShock: string;
};

/** One part of a written lesson: a heading, short paragraphs, and optionally an interactive piece by id. */
export type Section = { heading: string; paras: string[]; widget?: string; widgetNote?: string };

/** A multiple-choice prediction check: the reader commits to an answer, then sees why. */
export type Prediction = { q: string; options: string[]; answer: number; why: string };

/** A row of a news-to-model table. Headlines are invented examples, not quotations. */
export type NewsRow = { headline: string; driver: string; curve: string; effect: string };

/** A worked real-world case. Numbers are public facts from memory and marked approximate. */
export type Case = { heading: string; text: string; approx: string };

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
  /** Written sections with interactive widgets, shown after the reading text. */
  sections?: Section[];
  predictions?: Prediction[];
  /** Column names for the news table: headline, driver, curve, effect. */
  newsColumns?: [string, string, string, string];
  news?: NewsRow[];
  cases?: Case[];
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
    n: 1, slug: "measuring-the-economy", part: 1, title: "Measuring output and prices",
    summary: "What GDP and inflation actually count, so headline numbers read as model inputs.",
    covers: ["What GDP adds up, and the expenditure identity", "Nominal against real values, and price indexes", "Employment, unemployment and the labour force"],
    body: [
      "Before any curve appears, it helps to know what the headline numbers count. A report that GDP fell 0.3 percent, or that consumer prices rose 3 percent, is a statement about how output and prices were measured. Later lessons treat the first as a change in output Y against its full-employment level, and the second as a change in the price level P. Those readings only make sense if you know what the measures include and leave out.",
      "Gross domestic product is the market value of the final goods and services produced inside a country in a period. Three words do the work. Market value means each good is weighed by its price, so cars and haircuts can be added. Final means goods bought to be used, not goods bought to be turned into something else. Produced means newly made this period, so selling an old house is not output.",
      "Everything below uses invented numbers. They are there so you can see the arithmetic, not as data about any country.",
    ],
    takeaways: [
      "GDP can be counted from production (value added), from spending on final goods, or from the income that production creates. The three totals are equal by construction.",
      "Y = C + I + G + NX. Imports are inside C, I and G, then removed once through the minus sign in NX, so imports alone do not lower GDP.",
      "Nominal GDP changes with prices and quantities; real GDP holds prices at a base year, so changes in it are changes in output. The base year matters when relative prices move.",
      "A price index prices a fixed basket. Substitution, quality change and new goods all make a fixed basket overstate the rise in the cost of living.",
    ],
    sections: [
      {
        heading: "Three ways to count the same output",
        paras: [
          "Take an economy with two firms. A farm grows oranges and sells all of them to a juice maker. The juice maker squeezes them and sells glasses of juice to households. What is the economy's output?",
          "Production approach. Add up each firm's value added, which is its sales minus what it bought from other firms. The farm adds the whole value of its oranges. The juice maker adds the value of the juice minus the cost of the oranges. Together this equals the value of the juice alone, because the oranges are already inside the juice price. Adding both firms' sales instead would count the oranges twice.",
          "Expenditure approach. Add up spending on final goods. Households buy the juice, so that is consumption. If some juice sits unsold in the warehouse, count it as investment in inventories, as if the firm had bought its own unsold stock. Then spending equals the value of what was made.",
          "Income approach. Every dollar of value added is paid out as wages to workers or kept as profit by owners. Add up all incomes and you get the same total again. Try it: change any price or quantity and watch the bars.",
        ],
        widget: "three-ways",
      },
      {
        heading: "Spending, sorted",
        paras: [
          "The expenditure approach splits final spending into four groups. Consumption C is household spending on new goods and services. Investment I is spending on new capital, new housing and additions to inventories. Government purchases G are what governments buy, including the wages of their workers. Net exports NX are exports minus imports. Together, Y = C + I + G + NX.",
          "Two kinds of transaction fall outside the sum. Transfers such as pensions move money without buying output. Sales of things that already exist, such as a used car or a share of stock, move ownership without making anything new. Only the fee a dealer or broker earns for arranging the sale is new output.",
        ],
        widget: "expenditure-sorter",
      },
      {
        heading: "Why imports subtract and why that is not a loss",
        paras: [
          "People spend on foreign goods as well as home goods, and the survey of spending cannot tell the two apart in the first three terms. So C, I and G include the imported part. GDP is meant to measure home production, so the identity subtracts imports once, inside NX. A foreign-made coat bought for 200 adds 200 to C and takes 200 away through IM. It contributes nothing to GDP, which is right because nobody at home produced it.",
          "This is why the minus sign is a bookkeeping device and not a statement that imports damage the economy. GDP falls with imports only when the purchase replaces something made at home. If a household buys the coat instead of a home-made one, the home-made coat is not produced and GDP falls by its value. The lost output is the cause, not the import figure. In the real data, the timing of imports and stock-building can also differ across quarters, so a large import number in one quarter can be partly offset by inventories or spending elsewhere.",
        ],
        widget: "imports-demo",
      },
      {
        heading: "Nominal and real",
        paras: [
          "Nominal GDP values this year's output at this year's prices. It can rise because more is made, because prices rose, or both. To separate the two, real GDP values each year's quantities at the prices of one fixed base year. If real GDP rose, quantities rose, since prices are held still.",
          "The GDP deflator is nominal GDP divided by real GDP, times 100. It is a price index covering everything produced. In the base year real and nominal are equal and the deflator is 100.",
          "The choice of base year matters when prices move by different amounts. A good that gets much cheaper while its output booms, like a phone, is weighed heavily with early dear prices and lightly with late cheap ones. Statistical agencies deal with this by updating the base year as they go, a method called chain-weighting.",
        ],
        widget: "real-nominal",
      },
      {
        heading: "Prices and the consumer price index",
        paras: [
          "A consumer price index asks how much a fixed basket of goods costs now compared with a base year. If the basket cost 1,160 in year 0 and costs 1,304 in year 1, the index rose by 100 × (1,304/1,160 − 1), about 12.4 percent. The inflation rate is the percentage change in the index.",
          "Holding the basket fixed makes the index easy to compute and also makes it overstate the true rise in the cost of living, for three reasons. Substitution bias: when beef becomes dearer, households buy more chicken, so the fixed basket overstates how much more they must spend to be as well off. Quality bias: if a laptop costs more because it is faster, part of the higher price buys more, not the same thing for more. New-goods bias: products that appear after the base year are missing from the basket, so the gain from having them never shows up.",
          "A US commission chaired by Michael Boskin reported in the mid-1990s that the consumer price index overstated yearly inflation by roughly one percentage point, with quality change and new products the largest part of it. Statistical agencies have since changed their methods, so this is a result about a past index, not a current figure.",
        ],
        widget: "cpi-basket",
      },
      {
        heading: "Reading the numbers as model inputs",
        paras: [
          "From the next lesson on, real GDP is the model's output Y and the price index is its price level P. A headline about real GDP falling is a statement about Y; a headline about inflation is a statement about how fast P is changing. Keep two warnings in mind. A first estimate of GDP is revised later, sometimes by a lot. And the measures describe what is sold in markets, so they say little about unpaid housework, leisure, or the environment.",
        ],
      },
    ],
    predictions: [
      { q: "Nominal GDP rises 5 percent. The deflator rises 5 percent. What happened to real GDP?", options: ["It rose about 5 percent", "It was roughly unchanged", "It fell about 5 percent"], answer: 1, why: "Real GDP is nominal GDP divided by the price index, so a 5 percent rise in both leaves real output about where it was." },
      { q: "A family buys a house that was built and sold for the first time this year. What does this do to this year's GDP?", options: ["Nothing, because houses are not goods", "It adds to investment I", "It adds to consumption C"], answer: 1, why: "New housing counts as investment. Had the house been built long ago, only the agent's fee would be new output." },
      { q: "Beef gets much dearer and households eat more chicken. Compared with the true change in the cost of living, a fixed-basket index will…", options: ["understate it", "overstate it", "get it exactly right"], answer: 1, why: "The fixed basket still contains the beef households have stopped buying, so it shows a bigger rise than they actually face." },
      { q: "Households buy more imported coats and spend less on home-made ones, with everything else unchanged. GDP…", options: ["is unchanged, because imports are subtracted anyway", "falls, by the value of the home-made coats not produced", "rises, because consumption rose"], answer: 1, why: "Total spending did not change, but the home-made coats are no longer produced. The minus sign on imports takes out the foreign coats; the lost home production is the fall." },
      { q: "A factory makes goods it cannot sell and puts them in its warehouse. Output was counted this year because…", options: ["unsold goods are counted as investment in inventories", "the factory's workers still got paid, so it is a transfer", "it is not counted until it is sold"], answer: 0, why: "Production is measured when it is made. The unsold stock appears as inventory investment, which keeps spending equal to output." },
    ],
    newsColumns: ["In the news", "What is being measured", "Model variable", "How to read it"],
    news: [
      { headline: "Real GDP shrank by 0.3 percent last quarter after a rise of 0.8 percent the quarter before.", driver: "Change in real output", curve: "Y (against Y*)", effect: "Output fell. Whether the economy is below full employment depends on where Y started relative to Y*." },
      { headline: "Consumer prices were 3 percent higher than a year ago.", driver: "Change in a fixed-basket price index", curve: "P", effect: "The price level rose 3 percent. It may overstate the true rise in the cost of living because of substitution and quality bias." },
      { headline: "Imports hit a record, and analysts say the economy contracted as a result.", driver: "Imports inside the identity", curve: "NX, C, I", effect: "Imports are subtracted from a total that also includes them. Look for what fell at home: ask whether home production was replaced or only the accounting moved." },
      { headline: "Nominal output rose 6 percent in a year with 4 percent inflation.", driver: "Nominal against real", curve: "Y", effect: "Real output rose about 2 percent. Nominal growth alone does not say how much more was made." },
      { headline: "Retailers pile up unsold stock as holiday sales disappoint.", driver: "Inventory investment", curve: "I (and later Y)", effect: "The unsold goods count as investment now. Output is high today but firms will probably cut production later." },
    ],
    cases: [
      {
        heading: "A quarter in which imports surged ahead of tariffs",
        text: "In the first quarter of 2025 the first US estimate showed real GDP slightly negative at an annual rate, around minus 0.3 percent, while imports jumped as importers bought ahead of expected tariffs. Commentators said the imports had dragged GDP down. The identity shows why this is only half the story: imported goods that were bought by firms and held in stock appear as inventory investment, which is added, and the same goods are subtracted through imports. The import surge changed how output was recorded far more than it changed how much was produced at home. Later estimates revised the quarter, and the size of the effect depends on the revision.",
        approx: "From memory and approximate: the sign and rough size of the first estimate, the surge in imports, and the later revisions should be checked against the US Bureau of Economic Analysis releases.",
      },
      {
        heading: "How much did the price index overstate inflation",
        text: "The Boskin Commission of 1996 estimated that the US consumer price index overstated the yearly rise in the cost of living by a little over one percentage point, with a range of roughly 0.8 to 1.6. It split the gap into substitution across goods, shopping at different kinds of store, and new products and quality, with the last the biggest. A gap that size matters because pensions and tax brackets were tied to the index. After the report, statistical agencies updated their methods, so a gap of that size is no longer what current methods imply.",
        approx: "From memory and approximate: the central estimate of about 1.1 points, the range, and the ranking of the sources should be checked against the commission's 1996 report.",
      },
    ],
  },
  {
    n: 2, slug: "productivity-growth", part: 1, title: "Productivity and growth",
    summary: "Why output per worker rises, and what it does to wages and living standards.",
    covers: ["The production function and what moves it", "Capital, labour and productivity", "Growth over decades compared with swings over quarters"],
  },
  {
    n: 3, slug: "unemployment", part: 1, title: "Unemployment",
    summary: "The labour market at full employment, and why jobs can still be scarce.",
    covers: ["Labour demand, labour supply and the real wage", "Taxes on work", "Frictions, and unemployment above its natural level"],
  },
  {
    n: 4, slug: "saving-investment", part: 1, title: "Saving and investment",
    summary: "Households save, firms invest, and the real interest rate brings the two together.",
    covers: ["Desired saving and what shifts it", "Desired investment and what shifts it", "The real interest rate that clears the market"],
  },
  {
    n: 5, slug: "money-inflation", part: 1, title: "Money and inflation",
    summary: "What people hold money for, what central banks control, and how inflation expectations enter.",
    covers: ["Money demand and the nominal interest rate", "How the money supply is set", "Inflation, expected inflation and the real rate"],
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
