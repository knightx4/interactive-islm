/** Arithmetic behind the exchange rates lesson. Notation: e is foreign currency per home currency (a rise is an appreciation). */
import { baselineEconomy, expectedEChange, netExports } from "../macro/model";

export { expectedEChange };

/** A Big Mac row. Prices and rates are rounded, from memory, and only meant as a starting point the reader can overwrite. */
export type BigMacRow = { country: string; currency: string; price: number; perUsd: number };

export const usBigMac = 5.7; // US dollars, approximate, early 2024

export const bigMacRows: BigMacRow[] = [
  { country: "Switzerland", currency: "CHF", price: 6.5, perUsd: 0.86 },
  { country: "Euro area", currency: "EUR", price: 4.9, perUsd: 0.92 },
  { country: "United Kingdom", currency: "GBP", price: 4.2, perUsd: 0.79 },
  { country: "Brazil", currency: "BRL", price: 22.9, perUsd: 4.9 },
  { country: "Mexico", currency: "MXN", price: 95, perUsd: 17 },
  { country: "China", currency: "CNY", price: 24.4, perUsd: 7.2 },
  { country: "Japan", currency: "JPY", price: 450, perUsd: 148 },
  { country: "India", currency: "INR", price: 205, perUsd: 83 },
];

/**
 * Real exchange rate of a country against the US, from one good's price.
 * Home = the country; e = US dollars per unit of its currency; RER = e * P_home / P_US,
 * with P_home in local currency and P_US in dollars.
 */
export function bigMacRER(localPrice: number, localPerUsd: number, usPrice: number) {
  const e = 1 / localPerUsd;
  const rer = (e * localPrice) / usPrice;
  return { e, rer, implied: localPrice / usPrice, valuation: rer - 1 };
}

/**
 * What a move in e does to the price of a home good abroad and a foreign good at home,
 * and to net exports in the toy model (NX = -sigma (q - 1) at full employment, other things equal).
 */
export function strongCurrency(changePct: number) {
  const e = 1 + changePct / 100;
  const p = baselineEconomy("floating");
  return {
    homeGoodAbroad: e - 1, // foreign-currency price of our good moves with e
    foreignGoodHome: 1 / e - 1, // our-currency price of their good moves with 1/e
    rer: e,
    nx: netExports(p, 100, e),
  };
}

/** Returns, in home currency per unit invested, of a home deposit and a foreign deposit when e is expected to change by g (percent). */
export function depositReturns(rHome: number, rForeign: number, gPct: number) {
  const home = 1 + rHome / 100;
  const foreign = (1 + rForeign / 100) / (1 + gPct / 100);
  return { home, foreign, gap: foreign - home, parity: expectedEChange(rHome, rForeign) * 100 };
}

/**
 * Carry trade: borrow in the funding (home) currency at rFund, lend in the target currency at rTarget.
 * movePct is the realised change in e (target per funding) over the year; a rise means the funding currency appreciated.
 * Per unit borrowed the payoff in funding currency is (1 + rT)/(1 + move) - (1 + rF); `leverage` scales it per unit of own money.
 */
export function carry(rFundPct: number, rTargetPct: number, movePct: number, leverage = 1) {
  const perUnit = (1 + rTargetPct / 100) / (1 + movePct / 100) - (1 + rFundPct / 100);
  return { perUnit, onCapital: perUnit * leverage, breakeven: expectedEChange(rFundPct, rTargetPct) * 100 };
}

/** A currency regime on the spectrum from free float to dollarization. */
export type Regime = { id: string; name: string; rule: string; examples: string; independence: number; stability: number; cost: string };

export const regimes: Regime[] = [
  { id: "float", name: "Free float", rule: "The market sets the rate; the central bank does not target it.", examples: "United States, euro area, Japan, UK", independence: 5, stability: 1,
    cost: "The rate can swing a lot, and trade prices swing with it." },
  { id: "managed", name: "Managed float", rule: "The rate floats, but the central bank leans against big moves.", examples: "Singapore and India both manage their rates to some degree", independence: 4, stability: 2,
    cost: "Reserves are spent smoothing moves; markets can guess the bank's limits." },
  { id: "band", name: "Fixed band", rule: "The rate may move inside a publicly announced band around a central rate.", examples: "Denmark against the euro (a band of 2.25 percent either side)", independence: 3, stability: 3,
    cost: "Policy rates must follow the anchor currency's whenever the rate nears the edge." },
  { id: "crawl", name: "Crawling band", rule: "The central rate is reset at a steady pace, often to match inflation gaps.", examples: "Used by several countries with high inflation in past decades, such as Chile and Israel in the 1990s", independence: 3, stability: 3,
    cost: "Rules can be hard to keep when shocks are large." },
  { id: "board", name: "Currency board", rule: "A law ties the money supply to reserves of the anchor currency at a fixed rate.", examples: "Hong Kong (dollar link since 1983), Argentina (1991 to 2001)", independence: 1, stability: 5,
    cost: "No lender of last resort, and no independent rate policy; the link breaks if reserves run out." },
  { id: "dollar", name: "Dollarization", rule: "The country uses another country's currency, so there is no national money.", examples: "Panama, Ecuador, El Salvador", independence: 0, stability: 5,
    cost: "No central bank at all, and no way to leave without issuing a new currency." },
];
