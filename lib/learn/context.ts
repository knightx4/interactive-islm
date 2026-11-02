/**
 * Short real-world notes and news-style headlines for the worked shocks.
 * All text is written for this app; the headlines are invented examples, not quotations.
 * Real-world facts are public and approximate; they sit beside the toy model and are never mixed into it.
 */
export type RealWorld = { heading: string; text: string };

export const realWorld: Record<string, RealWorld> = {
  "productivity-down": {
    heading: "Oil shocks in the 1970s",
    text: "Oil prices rose several-fold between 1973 and 1974 and jumped again in 1979. In many oil-importing countries output fell while prices rose, the combination a leftward FE shift predicts and a pure demand slump does not. Oil is only one input, so the model's 5% productivity fall is a stand-in for the cost of doing without cheap energy.",
  },
  "money-supply-up": {
    heading: "Easier money in practice",
    text: "When a central bank cuts its policy rate or buys bonds, borrowing rates usually fall within days and spending responds over months; prices respond later still. Across countries, long runs of fast money growth go together with high inflation and no lasting gain in output, which is the neutrality result in the model.",
  },
  "gov-spending-up": {
    heading: "Spending programmes",
    text: "Large temporary spending packages, such as the US recovery programme of 2009 (roughly $800 billion spread over several years), aim to lift output when it is below capacity. Estimates of the effect vary widely, partly because it depends on how the central bank and interest rates respond, which is exactly the crowding-out question in the model.",
  },
  "taxes-up": {
    heading: "Deficit-reduction packages",
    text: "Governments that raise taxes to close deficits expect lower spending and, in the short run, lower output, with interest rates easing as public borrowing falls. Whether output really dips depends on how much the central bank offsets it.",
  },
  "wealth-up": {
    heading: "Asset booms",
    text: "Rising share and house prices make households feel richer. They tend to spend more and save less, and to hold more liquid balances; both effects are in the model, and they push interest rates the same way.",
  },
  "expected-inflation-up": {
    heading: "When inflation expectations drift",
    text: "In the 1970s, expectations of continuing inflation made nominal interest rates climb well above real rates. Holding money became costly in nominal terms, so people economised on it. The model captures this through the nominal rate, real rate plus expected inflation.",
  },
  "investment-outlook-up": {
    heading: "Investment booms",
    text: "Business investment is among the most volatile parts of GDP. Waves of optimism about new technology, such as the late 1990s boom in computing and networks, raise desired investment at any interest rate, which is an IS shift.",
  },
  "labour-tax-up": {
    heading: "Taxes on work",
    text: "Economists compare hours worked across countries partly through the gap between what employers pay and what workers keep. A larger gap means fewer people find work worth taking, which in the model lowers full-employment output.",
  },
};

export type News = { shockId: string; headline: string };

export const news: News[] = [
  { shockId: "productivity-down", headline: "Tanker traffic through a key shipping lane stops and crude oil jumps by a third in a week." },
  { shockId: "money-supply-up", headline: "The central bank says it will buy bonds every month until hiring picks up." },
  { shockId: "gov-spending-up", headline: "Parliament passes a bill funding a large programme of road and rail building." },
  { shockId: "taxes-up", headline: "The finance ministry raises the income-tax rate to bring the deficit down." },
  { shockId: "wealth-up", headline: "Share prices reach a record and household net worth jumps for the third quarter running." },
  { shockId: "expected-inflation-up", headline: "A survey finds families expect prices to rise faster over the coming year." },
  { shockId: "investment-outlook-up", headline: "Manufacturers announce new plants as better machines promise higher returns." },
  { shockId: "labour-tax-up", headline: "Payroll taxes on workers' wages go up from the first of the month." },
];
