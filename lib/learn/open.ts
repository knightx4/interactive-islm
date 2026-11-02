/** Arithmetic behind the open-economy lesson. Index units, not data. */
import { baselineEconomy, isR, lmR, type Params } from "../macro/model";

export const base = baselineEconomy("floating", 0.5);

/** Saving-investment-trade identity: I = S - NX, so NX = S - I and foreign saving is I - S. */
export function identity(S: number, I: number) {
  const NX = S - I;
  return { NX, foreignSaving: I - S, domesticallyFunded: Math.min(S, I) };
}

/**
 * One ledger: the current account (CA = NX here), the private financial account (FA, net capital inflow)
 * and the change in official reserves. CA + FA = change in reserves; a floating rate holds that at zero.
 */
export function ledger(ca: number, fa: number) {
  return { dRes: ca + fa, floatGap: -(ca + fa) };
}

/** The IS curve (r at output Y) for an open economy with the given net-export drivers. */
export function isWith(drivers: { Yp: number; tariff: number; tariffP: number; q: number }, Y: number) {
  const p: Params = { ...base, Yp: drivers.Yp, tariff: drivers.tariff, tariffP: drivers.tariffP };
  return isR(p, Y, drivers.q);
}
export const lmBase = (Y: number) => lmR(base, Y, base.M);
export { isR };
