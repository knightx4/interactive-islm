/**
 * The simulator's state in the URL query, and the link a lesson figure builds from its shock.
 * Only values that differ from the baseline are written, so links stay short. A missing,
 * malformed or out-of-range value reads as the baseline for that value.
 */
import { shockById } from "./shocks";
import {
  baselineState, causeById, causes, setCause, STEPS, type ParentId, type SimState,
} from "./sim";

const OFFSET_KEYS: Record<ParentId, string> = {
  investment: "i", saving: "s", moneySupply: "ms", moneyDemand: "md", fullEmployment: "fe",
};
const OFFSET_LIMIT = 150;
const round = (x: number) => String(Math.round(x * 100) / 100);

/** The query string (no leading "?") for a state; empty at the baseline. */
export function encodeState(st: SimState): string {
  const base = baselineState();
  const q = new URLSearchParams();
  for (const [id, key] of Object.entries(OFFSET_KEYS) as [ParentId, string][]) {
    if (Math.abs(st.offsets[id]) > 0.005) q.set(key, round(st.offsets[id]));
  }
  for (const c of causes) {
    const x = st.causes[c.id] ?? 0;
    if (Math.abs(x) > 0.005) q.set(c.id, round(x));
  }
  if (st.open) q.set("open", "1");
  if (st.speed !== base.speed) q.set("sp", round(st.speed));
  if (st.t !== base.t) q.set("t", String(st.t));
  return q.toString();
}

/** A number from a query value, or null when it is missing, malformed or outside [lo, hi]. */
function num(raw: string | null, lo: number, hi: number): number | null {
  if (raw === null || raw.trim() === "") return null;
  const x = Number(raw);
  return Number.isFinite(x) && x >= lo && x <= hi ? x : null;
}

/** Read a state from a query string; anything wrong falls back to the baseline value. */
export function decodeState(search: string): SimState {
  const q = new URLSearchParams(search);
  const st = baselineState();
  for (const [id, key] of Object.entries(OFFSET_KEYS) as [ParentId, string][]) {
    const x = num(q.get(key), -OFFSET_LIMIT, OFFSET_LIMIT);
    if (x !== null) st.offsets[id] = x;
  }
  for (const c of causes) {
    const x = num(q.get(c.id), c.min, c.max);
    if (x !== null && x !== 0) {
      st.causes[c.id] = x;
      if (c.needsOpen) st.open = true;
    }
  }
  if (q.get("open") === "1") st.open = true;
  const sp = num(q.get("sp"), 0, 100);
  if (sp !== null) st.speed = sp;
  const t = num(q.get("t"), 0, STEPS + 1);
  if (t !== null && Number.isInteger(t)) st.t = t;
  return st;
}

/** The page address for a state. */
export const simulatorHref = (st: SimState) => {
  const q = encodeState(st);
  return q ? `/?${q}` : "/";
};

/**
 * The simulator cause (and size) that reproduces a lesson shock exactly. Shock ids are the
 * shift table's; sizes are the table's standard steps expressed in the cause's own units.
 */
const SHOCK_CAUSE: Record<string, [cause: string, size: number]> = {
  "gov-spending": ["govSpending", 50],
  taxes: ["taxes", 50],
  "future-income": ["consumerConfidence", 20],
  wealth: ["assetPrices", 30],
  "investment-outlook": ["businessConfidence", 20],
  "money-supply": ["centralBank", 12.5],
  "expected-inflation": ["inflationExpectations", 25],
  "alt-risk": ["financialStress", 25],
  "alt-liquidity": ["liquidity", 25],
  "payment-tech": ["paymentTech", 25],
  productivity: ["technology", 25],
  capital: ["capital", 12.5],
  "labour-supply": ["participation", 20],
  "labour-tax": ["labourTax", 50],
  "foreign-demand": ["foreignDemand", 30],
};

/** Table rows with no named cause (depreciation, investment tax) are carried by the parent slider they move. */
const SHOCK_PARENT: Record<string, [parent: ParentId, size: number]> = {
  depreciation: ["investment", -5],
  "investment-tax": ["investment", -7.5],
};

/** The simulator state for a lesson shock, or null when the simulator has no equivalent. */
export function stateForShock(shockId: string, open: boolean): SimState | null {
  const shock = shockById(shockId);
  if (!shock) return null;
  const sign = shockId.endsWith("-down") ? -1 : 1;
  const driver = shock.driver;
  let st: SimState = { ...baselineState(), open };
  if (shockId === "productivity-down") return setCause(st, "oilPrice", 25);
  const c = SHOCK_CAUSE[driver];
  if (c && causeById(c[0])) {
    if (causeById(c[0])!.needsOpen && !open) return null;
    st = setCause(st, c[0], sign * c[1]);
    return { ...st, open: st.open || open };
  }
  const p = SHOCK_PARENT[driver];
  if (p) return { ...st, offsets: { ...st.offsets, [p[0]]: sign * p[1] } };
  return null;
}

/** Link to the simulator with a lesson shock applied, or null when there is none. */
export function simulatorLinkForShock(shockId: string, open: boolean): string | null {
  const st = stateForShock(shockId, open);
  return st ? simulatorHref(st) : null;
}
