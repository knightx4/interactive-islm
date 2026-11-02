/**
 * Practice questions: a short news brief, then predict the direction of one variable in the
 * short or the long run. Every brief and reason is newly written for this app (invented
 * examples, no course or exam wording). The answer is never typed in by hand: it is computed from
 * the model; `expect` only pins it so that a test catches any drift between the text and the model.
 */
import { baselineEconomy, simulate, type Regime, type Simulation } from "../macro/model";
import { questionsFor, type Direction, type Horizon, type Variable } from "../macro/predict";
import { shockById } from "../macro/shocks";

export type PracticeQuestion = {
  id: string;
  /** Lesson slug this question belongs to. */
  lesson: string;
  brief: string;
  regime: Regime;
  mobility?: number;
  shock: string;
  variable: Variable;
  horizon: Horizon;
  expect: Direction;
  reason: string;
};

type Q = Omit<PracticeQuestion, "id" | "regime" | "mobility"> & { regime?: Regime; mobility?: number };
const q = (id: string, x: Q): PracticeQuestion => ({ regime: "closed", ...x, id });

export const practiceQuestions: PracticeQuestion[] = [
  // 1 measuring-the-economy
  q("m1", { lesson: "measuring-the-economy", shock: "money-supply-up", variable: "P", horizon: "long", expect: "up",
    brief: "A central bank keeps expanding the money supply for years and nominal GDP climbs steadily.",
    reason: "More money chasing the same capacity lifts the price level in the end. Nominal GDP can rise this way without real output rising." }),
  q("m2", { lesson: "measuring-the-economy", shock: "money-supply-up", variable: "Y", horizon: "long", expect: "same",
    brief: "The same years of money growth have raised nominal GDP by a third. What has happened to real output once prices have fully adjusted?",
    reason: "Real output is pinned down by capacity (FE) in the long run. The extra nominal GDP is all price." }),
  // 2 productivity-growth
  q("g1", { lesson: "productivity-growth", shock: "productivity-up", variable: "Y", horizon: "long", expect: "up",
    brief: "A new generation of logistics software lets the same workers and machines produce more.",
    reason: "Higher productivity raises output at any employment, so full-employment output rises." }),
  q("g2", { lesson: "productivity-growth", shock: "productivity-up", variable: "w", horizon: "long", expect: "up",
    brief: "Economy-wide productivity rises 5 percent. What happens to the real wage once the labour market has cleared?",
    reason: "Workers produce more each, so labour demand shifts out and the real wage rises." }),
  q("g3", { lesson: "productivity-growth", shock: "capital-up", variable: "N", horizon: "long", expect: "up",
    brief: "Years of investment leave the economy with a noticeably bigger stock of machines and buildings.",
    reason: "More capital makes each worker more productive, which raises labour demand, the real wage, and the number of people who choose to work." }),
  // 3 unemployment
  q("u1", { lesson: "unemployment", shock: "labour-tax-up", variable: "N", horizon: "long", expect: "down",
    brief: "The government raises the payroll tax that workers pay.",
    reason: "A higher tax lowers the after-tax wage, so fewer people want to work at each wage and full-employment employment falls." }),
  q("u2", { lesson: "unemployment", shock: "labour-tax-up", variable: "w", horizon: "long", expect: "up",
    brief: "After the same tax rise, fewer people are working. What happens to the real wage before tax?",
    reason: "With fewer workers the marginal product of labour is higher, and labour demand pins the before-tax wage there." }),
  q("u3", { lesson: "unemployment", shock: "labour-supply-up", variable: "w", horizon: "long", expect: "down",
    brief: "A wave of new workers arrives, willing to work at any going wage.",
    reason: "More labour supply meets the same labour demand, so the market-clearing real wage falls and employment rises." }),
  // 4 saving-investment
  q("s1", { lesson: "saving-investment", shock: "investment-outlook-up", variable: "r", horizon: "short", expect: "up",
    brief: "Firms hear that a new technology will pay off handsomely and rush to plan new factories.",
    reason: "Desired investment rises at every rate, so IS shifts right and the real interest rate must rise to clear the saving and investment market." }),
  q("s2", { lesson: "saving-investment", shock: "investment-outlook-up", variable: "Y", horizon: "short", expect: "up",
    brief: "Firms' optimism about returns on new machines spreads across the economy, before any prices have moved.",
    reason: "Higher investment demand raises spending, and with prices fixed, output rises along LM." }),
  q("s3", { lesson: "saving-investment", shock: "taxes-up", variable: "r", horizon: "short", expect: "down",
    brief: "To close its deficit, the government raises income taxes.",
    reason: "The higher tax raises total saving at each rate (the government saves more than households cut back), so IS shifts left and the real rate falls." }),
  q("s4", { lesson: "saving-investment", shock: "gov-spending-up", variable: "I", horizon: "short", expect: "down",
    brief: "The government launches a large building programme, funded by borrowing.",
    reason: "Government saving falls, so the real interest rate rises to draw in saving. The higher rate crowds out some private investment." }),
  q("s5", { lesson: "saving-investment", shock: "wealth-up", variable: "C", horizon: "short", expect: "up",
    brief: "A stock market boom lifts household net worth a fifth.",
    reason: "Richer households save less out of income, so they consume more." }),
  // 5 money-inflation
  q("i1", { lesson: "money-inflation", shock: "money-supply-up", variable: "r", horizon: "short", expect: "down",
    brief: "The central bank announces it will buy bonds and create money.",
    reason: "More real money than people want to hold at the old rate pushes the interest rate down." }),
  q("i2", { lesson: "money-inflation", shock: "expected-inflation-up", variable: "Y", horizon: "short", expect: "up",
    brief: "Surveys show households expect much faster price rises next year.",
    reason: "The nominal rate is the real rate plus expected inflation; at any real rate, holding money is costlier, so money demand falls and LM shifts right. Output rises with prices fixed." }),
  q("i3", { lesson: "money-inflation", shock: "payment-tech-up", variable: "r", horizon: "short", expect: "down",
    brief: "A new payment app means people can manage with much smaller cash and bank balances.",
    reason: "Lower money demand at each rate, with the supply unchanged, means the rate that clears the money market falls." }),
  // 6 is-lm-fe
  q("f1", { lesson: "is-lm-fe", shock: "gov-spending-up", variable: "Y", horizon: "short", expect: "up",
    brief: "A new spending package is approved while the economy is at full employment.",
    reason: "IS shifts right; with prices fixed, output rises above FE along LM, and the rate rises." }),
  q("f2", { lesson: "is-lm-fe", shock: "gov-spending-up", variable: "Y", horizon: "long", expect: "same",
    brief: "Several years after the same package, prices have fully adjusted. What is output?",
    reason: "Output above FE pushes prices up, shifting LM left until output is back at FE. In the long run only FE determines output." }),
  // 7 supply-shocks
  q("p1", { lesson: "supply-shocks", shock: "productivity-down", variable: "P", horizon: "long", expect: "up",
    brief: "A cartel cuts oil output and the price of crude triples.",
    reason: "The oil shock lowers productivity and shifts FE left. Output at impact stays above the new FE, so prices rise until LM has shifted far enough." }),
  q("p2", { lesson: "supply-shocks", shock: "productivity-down", variable: "Y", horizon: "short", expect: "same",
    brief: "Right after the oil price tripling, firms have not yet changed any prices. How does output compare with before?",
    reason: "A supply shock moves FE, not IS or LM, so at fixed prices the output where IS and LM cross has not moved." }),
  q("p3", { lesson: "supply-shocks", shock: "productivity-down", variable: "N", horizon: "long", expect: "down",
    brief: "Energy stays dear for a decade, and each worker produces less than before.",
    reason: "Lower productivity lowers labour demand and the real wage, so fewer people choose to work and full-employment employment falls." }),
  // 8 demand-shocks
  q("d1", { lesson: "demand-shocks", shock: "wealth-down", variable: "Y", horizon: "short", expect: "down",
    brief: "House prices fall a quarter in a year and families feel poorer.",
    reason: "Poorer households save more and spend less, so total demand falls and output drops while prices stay put." }),
  q("d2", { lesson: "demand-shocks", shock: "wealth-down", variable: "C", horizon: "short", expect: "down",
    brief: "After the housing slump, households cut back. What happens to consumption right away?",
    reason: "Lower wealth means higher saving out of income and lower consumption." }),
  q("d3", { lesson: "demand-shocks", shock: "taxes-up", variable: "P", horizon: "long", expect: "down",
    brief: "A tax rise leaves the economy below capacity for a while.",
    reason: "Output below FE pulls prices down. Falling prices raise real money, shifting LM right until output is back at FE." }),
  // 9 recessions
  q("r1", { lesson: "recessions", shock: "taxes-up", variable: "Y", horizon: "short", expect: "down",
    brief: "A spending cut and tax rise together are passed in the middle of a boom.",
    reason: "Higher taxes shift IS left, which lowers output when prices are fixed." }),
  q("r2", { lesson: "recessions", shock: "taxes-up", variable: "I", horizon: "short", expect: "up",
    brief: "A deficit-reduction plan lowers the real interest rate. What happens to private investment?",
    reason: "The lower real rate encourages investment, so part of the demand loss is made up by investment." }),
  q("r3", { lesson: "recessions", shock: "money-supply-up", variable: "Y", horizon: "short", expect: "up",
    brief: "In a downturn the central bank expands the money supply to help.",
    reason: "Real money rises and LM shifts right, so output rises with prices fixed. In the long run this wears off." }),
  q("r4", { lesson: "recessions", shock: "money-supply-up", variable: "I", horizon: "short", expect: "up",
    brief: "The central bank eases money in a downturn. Which part of spending responds first?",
    reason: "The lower real rate raises desired investment, which is the main channel for monetary policy." }),
  // 10 exchange-rates
  q("x1", { lesson: "exchange-rates", regime: "floating", mobility: 0.5, shock: "money-supply-up", variable: "e", horizon: "short", expect: "down",
    brief: "A country with a floating currency announces a large money-printing programme.",
    reason: "A lower interest rate pushes capital out, selling the currency: e (foreign currency per home currency) falls." }),
  q("x2", { lesson: "exchange-rates", regime: "floating", mobility: 0.5, shock: "foreign-rate-up", variable: "e", horizon: "short", expect: "down",
    brief: "The central bank of a big trading partner raises its interest rate sharply.",
    reason: "Capital leaves for the higher foreign return, so the home currency depreciates." }),
  q("x3", { lesson: "exchange-rates", regime: "floating", mobility: 0.5, shock: "gov-spending-up", variable: "e", horizon: "short", expect: "up",
    brief: "A floating-rate country passes a big spending bill, financed by borrowing.",
    reason: "The home interest rate rises, capital flows in, and the currency appreciates." }),
  q("x4", { lesson: "exchange-rates", regime: "floating", mobility: 0.5, shock: "foreign-rate-up", variable: "NX", horizon: "short", expect: "up",
    brief: "Foreign rates jump and money leaves a floating-rate economy.",
    reason: "A weaker currency makes its goods cheaper abroad and imports dearer at home, so net exports rise." }),
  // 11 open-economy
  q("o1", { lesson: "open-economy", regime: "fixed", mobility: 1, shock: "money-supply-up", variable: "Y", horizon: "short", expect: "same",
    brief: "A small country with a fixed rate, open to capital, lets its central bank expand credit.",
    reason: "Capital leaves to restore the rate, the central bank sells reserves, and the money supply returns to where it was. Monetary policy has no lasting grip." }),
  q("o2", { lesson: "open-economy", regime: "fixed", mobility: 1, shock: "gov-spending-up", variable: "Y", horizon: "short", expect: "up",
    brief: "The same small country, pegged and open, passes a large fiscal stimulus.",
    reason: "The upward pressure on the rate draws capital in, the central bank buys it with new money, and LM shifts right with IS, so output rises a lot." }),
  q("o3", { lesson: "open-economy", regime: "fixed", mobility: 0.5, shock: "foreign-rate-up", variable: "Y", horizon: "short", expect: "down",
    brief: "The Fed raises rates, and a country that pegs to the dollar sees money flowing out.",
    reason: "Reserves drain, the money supply shrinks, and LM shifts left, so output falls." }),
  q("o4", { lesson: "open-economy", regime: "fixed", mobility: 0.5, shock: "peg-undervalued", variable: "P", horizon: "long", expect: "up",
    brief: "A country holds its currency below the market rate for years and buys the foreign money coming in.",
    reason: "Reserves and the money supply grow, so in the long run the price level is higher." }),
  q("o5", { lesson: "open-economy", regime: "fixed", mobility: 0.5, shock: "partner-tariff-up", variable: "Y", horizon: "short", expect: "down",
    brief: "A big trading partner imposes a tariff on goods from a pegged-currency economy.",
    reason: "Exports fall, IS shifts left, and a peg cannot cushion it with a falling currency, so output falls." }),
  // 12 tariffs-trade
  q("t1", { lesson: "tariffs-trade", regime: "floating", mobility: 1, shock: "tariff-up", variable: "e", horizon: "short", expect: "up",
    brief: "A small open country with a floating currency raises tariffs on imports.",
    reason: "Net exports rise at each exchange rate, so IS shifts right; the pressure on the rate draws in capital and the currency appreciates." }),
  q("t2", { lesson: "tariffs-trade", regime: "floating", mobility: 1, shock: "tariff-up", variable: "NX", horizon: "short", expect: "same",
    brief: "After that tariff, the currency has appreciated. What has happened to net exports?",
    reason: "The appreciation offsets the tariff exactly in this case: net exports are unchanged, which is the point of the float absorbing the shock." }),
  q("t3", { lesson: "tariffs-trade", regime: "floating", mobility: 1, shock: "partner-tariff-up", variable: "e", horizon: "short", expect: "down",
    brief: "A major buyer puts a tariff on our goods. Our currency floats and capital moves freely.",
    reason: "IS shifts left, which pulls the rate down, capital leaves, and the currency depreciates." }),
  q("t4", { lesson: "tariffs-trade", regime: "floating", mobility: 1, shock: "partner-tariff-up", variable: "Y", horizon: "short", expect: "same",
    brief: "The same tariff hits a floating, fully open economy. How does output compare with before?",
    reason: "The currency's fall raises net exports back to where they were, so total demand and output do not change." }),
  q("t5", { lesson: "tariffs-trade", shock: "productivity-down", variable: "P", horizon: "long", expect: "up",
    brief: "A tariff makes essential imported inputs much dearer, and domestic firms can produce less from the same factors.",
    reason: "The input-cost shock is a supply shock: FE shifts left and prices must rise in the long run." }),
  // 13 reunification
  q("e1", { lesson: "reunification-capital-flows", regime: "fixed", mobility: 0.5, shock: "foreign-rate-up", variable: "r", horizon: "short", expect: "up",
    brief: "The anchor country's central bank raises its rate to cool a spending boom. A neighbour is pegged to its currency.",
    reason: "To stop capital leaving, the pegged country has to raise its rate as well." }),
  q("e2", { lesson: "reunification-capital-flows", regime: "fixed", mobility: 0.5, shock: "foreign-rate-up", variable: "Y", horizon: "short", expect: "down",
    brief: "The neighbour was already in a slump when the anchor's rate rose.",
    reason: "A higher rate and shrinking reserves shift the economy's curves against it, so output falls further." }),
  q("e3", { lesson: "reunification-capital-flows", regime: "fixed", mobility: 0.5, shock: "devaluation-fear", variable: "Y", horizon: "short", expect: "down",
    brief: "Traders start betting that the peg cannot last, and demand a premium to hold the currency.",
    reason: "The premium forces rates up and drains reserves, so output falls even before any devaluation." }),
  q("e4", { lesson: "reunification-capital-flows", regime: "fixed", mobility: 0.5, shock: "peg-overvalued", variable: "Y", horizon: "short", expect: "down",
    brief: "A country keeps its exchange rate well above what the market would set.",
    reason: "Exports are priced out, IS shifts left, and output falls while reserves leave." }),
  q("e5", { lesson: "reunification-capital-flows", regime: "floating", mobility: 0.5, shock: "devaluation-fear", variable: "NX", horizon: "short", expect: "up",
    brief: "A floating-rate country is hit by a loss of trust in its assets.",
    reason: "The currency falls, imports are dearer and exports cheaper, and net exports rise." }),
];

export const resolve = (pq: PracticeQuestion) => {
  const sim: Simulation = simulate(baselineEconomy(pq.regime, pq.regime === "closed" ? 1 : (pq.mobility ?? 0.5)), shockById(pq.shock)!.apply, 120);
  const t = questionsFor(sim, pq.regime).find((x) => x.id === `${pq.variable}-${pq.horizon}`)!;
  return { sim, truth: t.answer, from: t.from, to: t.to };
};
