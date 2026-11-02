/** Arithmetic behind the money and LM lesson. Index units, not data. */
import { baselineEconomy, lmR, moneyDemand, type Params } from "../macro/model";
import { drivers } from "../macro/shocks";

export const base = baselineEconomy("closed");
export { lmR, moneyDemand };

/** Deposit-creation multiplier with a required reserve ratio rr and (optionally) a currency-to-deposit ratio cu. */
export const multiplier = (rr: number, cu = 0) => (1 + cu) / (cu + rr);

/** Round by round: each deposit is lent out apart from the reserve share, and the loan becomes a new deposit. */
export function rounds(initial: number, rr: number, n = 12) {
  const out: { deposit: number; reserve: number; loan: number; total: number }[] = [];
  let dep = initial, total = 0;
  for (let i = 0; i < n; i++) {
    total += dep;
    out.push({ deposit: dep, reserve: dep * rr, loan: dep * (1 - rr), total });
    dep = dep * (1 - rr);
  }
  return out;
}

export const driverStep = (id: string, sign: 1 | -1, p: Params) => drivers.find((d) => d.id === id)!.step(p, sign);

/** Nominal money supply the central bank must supply to hold the nominal interest rate i at output Y and price level P. */
export const moneyForRate = (p: Params, Y: number, i: number, P = 1) => P * moneyDemand(p, Y, i - p.piE);

/** The LM drivers played in the lesson. */
export const lmDriverIds = ["money-supply", "expected-inflation", "wealth", "alt-risk", "alt-liquidity", "payment-tech"] as const;
