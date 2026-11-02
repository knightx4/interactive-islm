/**
 * German reunification and the 1992 pound: two linked economies, Germany (the large partner)
 * and the UK (pegged to the mark). Index units from the toy model; the history is public, from memory and approximate.
 */
import { baselineEconomy, simulateWorld, type Params, type WorldSimulation } from "../macro/model";

export type ScenarioId = "fiscal" | "bundesbank" | "doubt" | "exit" | "float";

export type Scenario = {
  id: ScenarioId;
  label: string;
  text: string;
  /** UK regime before the shocks. */
  uk: "fixed" | "floating";
};

export const scenarios: Scenario[] = [
  { id: "fiscal", uk: "fixed", label: "1. Germany spends",
    text: "Reunification spending and the cost of absorbing East German firms raise West German demand at every interest rate: Germany's IS shifts right. German output and the German rate rise. The UK is tied to the mark, so its capital markets now see a higher German rate. To stop money leaving, UK rates must rise too, and its IS and LM move against it." },
  { id: "bundesbank", uk: "fixed", label: "2. The Bundesbank tightens",
    text: "The Bundesbank fears inflation from the spending boom, and shrinks the money supply: Germany's LM shifts left. The German rate rises further. Partners pegged to the mark must follow, whether or not their own economies are weak." },
  { id: "doubt", uk: "fixed", label: "3. Markets doubt the peg",
    text: "Traders judge that a country in slump cannot keep rates high for long. Holding sterling now needs a premium over German assets for the chance of a devaluation. In the model the premium raises the rate the UK must offer; reserves drain as money leaves and the money supply shrinks." },
  { id: "exit", uk: "fixed", label: "4. The pound leaves the system",
    text: "When the premium is large enough that reserves would run out, the peg breaks. The model devalues the pound by a fifth, and the UK regains its own monetary policy. Output rebounds, and the cost shows up later as higher prices." },
  { id: "float", uk: "floating", label: "What if the pound had floated?",
    text: "A counterfactual: the same German shocks, but the UK never joined the system. The pound falls against the mark, net exports rise, and UK output goes up rather than down. The peg, not Germany, made the difference." },
];

const germany = () => baselineEconomy("floating", 0.5);
const spend = (p: Params): Params => ({ ...p, G: p.G + 10 });
const tighten = (p: Params): Params => ({ ...p, M: p.M * 0.95 });

/** Premium (points) that investors demand to hold the pegged currency in each scenario. */
export const premiumOf = (id: ScenarioId) => (id === "doubt" ? 2 : id === "exit" ? 7 : 0);

export function runScenario(id: ScenarioId, steps = 120): WorldSimulation {
  const sc = scenarios.find((s) => s.id === id)!;
  const de = id === "fiscal" ? spend : (p: Params) => tighten(spend(p));
  const prem = premiumOf(id);
  return simulateWorld(baselineEconomy(sc.uk, 0.5), (p) => ({ ...p, prem: p.prem + prem }), germany(), de, steps);
}

export type TimelineRow = { date: string; text: string };

/** Dated events, public history in our own words; from memory and approximate. */
export const timeline: TimelineRow[] = [
  { date: "1 July 1990", text: "German monetary union: the mark replaces the East German currency, at a generous rate for wages and small savings. Demand in the east jumps." },
  { date: "3 October 1990", text: "Formal reunification. Large public transfers to the east begin, around a few percent of West German output each year." },
  { date: "5 to 8 October 1990", text: "The UK cuts its rate by one point to 14 percent and joins the exchange-rate system at about 2.95 marks to the pound, with a band of 6 percent either side." },
  { date: "1991 to mid-1992", text: "The Bundesbank raises its rates in steps, to a peak near 8.75 percent in summer 1992, to hold down inflation. The UK is in recession and cuts its rate toward 10 percent." },
  { date: "2 June 1992", text: "Danish voters narrowly reject the Maastricht treaty. Doubts about the whole system grow." },
  { date: "8 September 1992", text: "Finland lets its markka float (see the open-economy lesson)." },
  { date: "13 September 1992", text: "Italy devalues the lira inside the system, by about 7 percent." },
  { date: "16 September 1992", text: "Black Wednesday. The Bank of England buys sterling, raises its rate in the morning from 10 to 12 percent and announces a rise to 15 percent. By the evening the Chancellor announces that the pound is leaving the system." },
  { date: "17 September 1992", text: "The promised rise is dropped. Italy also suspends its membership. The pound falls roughly 15 percent against the mark over the following weeks." },
  { date: "1992 to early 1993", text: "The UK cuts rates quickly, to about 6 percent by February 1993, and growth returns in 1993." },
  { date: "2 August 1993", text: "The bands of the system are widened to 15 percent either side, ending the narrow peg for the remaining members." },
];

/** Policy rates, rounded, from memory and approximate: year (decimal), German discount rate, UK base rate. */
export const rates: { t: number; de: number; uk: number }[] = [
  { t: 1990.8, de: 6, uk: 14 },
  { t: 1991.9, de: 8, uk: 10.5 },
  { t: 1992.5, de: 8.75, uk: 10 },
  { t: 1992.8, de: 8.25, uk: 9 },
  { t: 1993.1, de: 8, uk: 6 },
];
