import type { Regime } from "@/lib/macro/model";

export type Lesson = {
  n: number;
  slug: string;
  part: number;
  title: string;
  summary: string;
  regime: Regime;
  defaultShock: string;
  body: string[];
  takeaways: string[];
  /** Public facts shown next to — never mixed into — the toy curves. */
  realWorld: { heading: string; text: string };
};

export const parts = [
  { n: 1, title: "Building blocks", blurb: "Full employment, spending, money and labor, one market at a time." },
  { n: 2, title: "The closed economy", blurb: "IS, LM and FE together, and how prices bring the economy home." },
  { n: 3, title: "Policy", blurb: "What fiscal and monetary levers do now, and what they do later." },
  { n: 4, title: "The open economy", blurb: "Exchange rates, capital flows, and floating versus fixed regimes." },
];

export const lessons: Lesson[] = [
  {
    n: 1, slug: "full-employment", part: 1, title: "Full employment and the FE line",
    summary: "What the economy can produce when everyone who wants to work is working.",
    regime: "closed", defaultShock: "productivity-up",
    body: [
      "Potential output is set by the economy's productive capacity: how much labor is available and how much each worker can produce. Plotted against the interest rate, it is a vertical line, called FE here, because spending decisions do not change capacity in the short run.",
      "Output can sit above or below that line for a while. Below it, resources are idle and, in this model, prices drift down. Above it, firms strain and prices drift up. The FE line is the anchor that price movements ultimately pull the economy toward.",
    ],
    takeaways: ["FE is vertical: capacity does not depend on the interest rate.", "Productivity moves FE; spending shocks do not.", "The gap between Y and FE tells you which way prices will move."],
    realWorld: { heading: "Real-world panel", text: "Statistical agencies publish estimates of potential output and the output gap. Estimates get revised, which is one reason policy debates over how much slack exists never fully end." },
  },
  {
    n: 2, slug: "goods-market-is", part: 1, title: "The goods market and the IS curve",
    summary: "Spending, the multiplier, and why higher interest rates lower demand.",
    regime: "closed", defaultShock: "investment-outlook-up",
    body: [
      "Total spending is consumption plus investment plus government purchases. Households spend part of each extra dollar of income, which is why a change in spending ripples into a larger change in output: the multiplier.",
      "Investment falls when the interest rate is higher, so the combinations of output and interest rate that clear the goods market slope downward. That is the IS curve. Anything that raises spending at a given rate shifts it right.",
    ],
    takeaways: ["IS slopes down: higher r, lower investment, lower output.", "Optimism, spending and tax cuts shift IS right.", "The slope of IS depends on the multiplier and on how rate-sensitive investment is."],
    realWorld: { heading: "Real-world panel", text: "Business investment is among the most volatile parts of GDP, which is why shifts in firm confidence are a standard example of an IS shock." },
  },
  {
    n: 3, slug: "money-market-lm", part: 1, title: "The money market and the LM curve",
    summary: "Real money balances, money demand, and an upward-sloping LM.",
    regime: "closed", defaultShock: "money-supply-up",
    body: [
      "People hold money to make purchases, so demand for it rises with income, and falls with the interest rate, which is the cost of holding cash instead of bonds. Supply is the central bank's nominal stock divided by the price level.",
      "Holding real balances fixed, higher income needs a higher interest rate to keep money demand equal to supply. That upward-sloping relationship is the LM curve. More real money, whether from the central bank or from a lower price level, shifts it right.",
    ],
    takeaways: ["LM slopes up for a fixed real money stock.", "Nominal money up or prices down both shift LM right.", "That price link is what lets the economy self-correct."],
    realWorld: { heading: "Real-world panel", text: "In March 2020 the U.S. Federal Reserve cut its policy rate target to a range of 0 to 0.25 percent, an example of the rate side of monetary policy near its practical floor." },
  },
  {
    n: 4, slug: "labor-productivity", part: 1, title: "Labor and productivity",
    summary: "How jobs, output and productivity connect to FE.",
    regime: "closed", defaultShock: "productivity-up",
    body: [
      "Output equals productivity times labor. At full employment, labor is at its normal level and output is productivity times that. Raise productivity and potential output rises with it.",
      "Below FE, the labor panel shows employment under its full level. This is how the model ties the output gap to the labor market without a separate wage model.",
    ],
    takeaways: ["Employment moves with output when productivity is fixed.", "Higher productivity raises potential output and lowers prices in the long run.", "A weak economy shows up as employment under its full level."],
    realWorld: { heading: "Real-world panel", text: "Productivity growth is slow-moving and hard to measure in real time, so labor-market data often tell the story first." },
  },
  {
    n: 5, slug: "is-lm-fe", part: 2, title: "Putting IS, LM and FE together",
    summary: "Short-run equilibrium, and where it sits relative to full employment.",
    regime: "closed", defaultShock: "future-income-down",
    body: [
      "In the short run prices are stuck, so the economy sits where IS and LM cross. That point may be left or right of FE. The IS-LM crossing tells you output and the interest rate; the FE line tells you whether output is high or low relative to capacity.",
      "Run a shock below and watch the crossing move first, then the LM curve drift as prices respond.",
    ],
    takeaways: ["Short run: IS and LM decide Y and r.", "Long run: FE decides Y; IS decides r; prices settle LM.", "The path between them is the price adjustment."],
    realWorld: { heading: "Real-world panel", text: "Recessions are dated after the fact, partly because the output gap itself is estimated rather than observed." },
  },
  {
    n: 6, slug: "demand-shocks", part: 2, title: "Demand shocks",
    summary: "Sentiment, spending and money demand moving the economy off FE.",
    regime: "closed", defaultShock: "future-income-down",
    body: [
      "A demand shock moves IS or LM. If it is contractionary, output falls below FE, prices start to fall, real money balances grow, LM shifts right and output recovers.",
      "In the long run demand shocks leave output where it was. They change prices and, for IS shocks, the interest rate.",
    ],
    takeaways: ["Demand shocks are temporary for output.", "They leave a lasting mark on prices.", "IS shocks leave a lasting mark on r as well."],
    realWorld: { heading: "Real-world panel", text: "Surveys of consumer and business confidence are watched as early signals of this kind of shift." },
  },
  {
    n: 7, slug: "supply-shocks", part: 2, title: "Supply shocks",
    summary: "Moves in productive capacity and what they do to prices.",
    regime: "closed", defaultShock: "productivity-down",
    body: [
      "A supply shock moves FE. A loss of capacity puts the economy above its new potential, so prices rise and squeeze real money balances until output falls to the new, lower FE.",
      "A productivity gain does the reverse. Prices drift lower and output grows to the new FE.",
    ],
    takeaways: ["Supply shocks change long-run output.", "Bad supply news pushes prices up; good news pulls them down.", "Short-run output moves by the demand side, then converges."],
    realWorld: { heading: "Real-world panel", text: "The 1973 oil embargo is the classic episode of an adverse supply shock, with higher prices and weaker output arriving together." },
  },
  {
    n: 8, slug: "price-adjustment", part: 2, title: "How prices adjust",
    summary: "The time path from the short run to the long run.",
    regime: "closed", defaultShock: "money-supply-down",
    body: [
      "The rule is simple: when output is above FE, prices rise; below, they fall. The speed is set by a single parameter. Each price change moves real money balances and so shifts LM.",
      "The time-path panel shows output, prices and the interest rate converging. Whatever the shock, they end where FE and IS dictate.",
    ],
    takeaways: ["Adjustment speed controls how long a slump lasts.", "Prices do the work of shifting LM.", "Convergence is smooth in this model; real economies are messier."],
    realWorld: { heading: "Real-world panel", text: "Many prices change only occasionally, which is one common explanation for why slumps can last for years." },
  },
  {
    n: 9, slug: "fiscal-policy", part: 3, title: "Fiscal policy",
    summary: "Spending and taxes, the multiplier, and crowding out.",
    regime: "closed", defaultShock: "gov-spending-up",
    body: [
      "More government purchases shift IS right. Output and the interest rate both rise at first. Higher rates crowd out some private investment, so the final boost is smaller than the pure multiplier suggests.",
      "A tax cut works through household spending, so its effect is smaller per dollar than a spending increase.",
    ],
    takeaways: ["Fiscal policy shifts IS.", "Crowding out is the rise in r.", "In the long run, output returns to FE and fiscal expansion simply raises prices and r."],
    realWorld: { heading: "Real-world panel", text: "The 2009 U.S. stimulus law was initially estimated at roughly $800 billion, a common case study for fiscal multipliers." },
  },
  {
    n: 10, slug: "monetary-policy", part: 3, title: "Monetary policy",
    summary: "Money supply, interest rates and neutrality in the long run.",
    regime: "closed", defaultShock: "money-supply-up",
    body: [
      "More nominal money shifts LM right, lowering the interest rate and raising output. As prices rise, real balances shrink back, and in the long run only the price level has changed.",
      "That long-run result is called monetary neutrality: money changes nominal values, not real ones.",
    ],
    takeaways: ["Money lowers r and lifts Y in the short run.", "Long run: only P changes.", "The size of the short-run effect depends on slope of LM and IS."],
    realWorld: { heading: "Real-world panel", text: "Central banks mostly steer a short-term interest rate rather than the money stock directly; the model's money shift is a stylized version of a rate cut." },
  },
  {
    n: 11, slug: "policy-tradeoffs", part: 3, title: "Policy tradeoffs",
    summary: "Closing a gap with policy versus waiting for prices.",
    regime: "closed", defaultShock: "future-income-down",
    body: [
      "If demand falls, prices will eventually restore output, but it can take a while. Policy can shorten the slump by shifting IS or LM back.",
      "Try a negative demand shock, then compare it to the policy shocks in the picker. Policy that arrives late risks overshooting.",
    ],
    takeaways: ["Policy can speed up convergence.", "Timing matters; late policy can overshoot.", "Fiscal and monetary tools leave different footprints on r."],
    realWorld: { heading: "Real-world panel", text: "Economists distinguish automatic stabilizers, which act at once, from discretionary changes, which take time to legislate." },
  },
  {
    n: 12, slug: "open-economy", part: 4, title: "Exchange rates and net exports",
    summary: "Real exchange rate, trade balance and the world interest rate.",
    regime: "floating", defaultShock: "foreign-demand-up",
    body: [
      "A small open economy cannot sustain an interest rate different from the world's: capital would flow in or out until they match. The real exchange rate then does the balancing for the goods market.",
      "A stronger currency makes exports dearer and imports cheaper, lowering net exports. That is the extra channel the open-economy model adds to IS.",
    ],
    takeaways: ["Capital mobility pins r to the world rate.", "A stronger real exchange rate lowers net exports.", "Imports leak out of the multiplier."],
    realWorld: { heading: "Real-world panel", text: "Trade shares of GDP differ widely across countries, which is why this channel matters much more for Singapore than for the United States." },
  },
  {
    n: 13, slug: "floating-rates", part: 4, title: "Floating exchange rates",
    summary: "Monetary policy is strong, fiscal policy is offset.",
    regime: "floating", defaultShock: "money-supply-up",
    body: [
      "With a floating rate the central bank sets money. LM, with r fixed at the world rate, pins down output. Fiscal expansion raises the currency, crowds out net exports, and leaves output unchanged.",
      "Monetary expansion weakens the currency, boosts net exports and raises output.",
    ],
    takeaways: ["Money moves Y; fiscal policy mostly moves the currency.", "Fiscal expansion is fully offset by net exports in the short run.", "Long run: Y returns to FE either way."],
    realWorld: { heading: "Real-world panel", text: "Large economies like Japan, the euro area and the U.S. float, and use monetary policy as the main stabilization tool." },
  },
  {
    n: 14, slug: "fixed-rates", part: 4, title: "Fixed exchange rates",
    summary: "Monetary policy is given up, fiscal policy is strong.",
    regime: "fixed", defaultShock: "gov-spending-up",
    body: [
      "To hold a peg, the central bank must buy or sell its currency, so the money supply moves to whatever keeps the exchange rate. It is no longer a free policy tool.",
      "Fiscal expansion raises output because the central bank accommodates it. A money-supply shock is simply undone. Over time prices adjust, shifting the real exchange rate even though the nominal one is fixed.",
    ],
    takeaways: ["Under a peg, money is endogenous.", "Fiscal policy is powerful; monetary is not.", "Prices adjust and the real exchange rate moves anyway."],
    realWorld: { heading: "Real-world panel", text: "In January 2015 the Swiss National Bank dropped its minimum exchange rate against the euro, a well-known example of a peg ending." },
  },
];

export const lessonBySlug = (slug: string) => lessons.find((l) => l.slug === slug);
