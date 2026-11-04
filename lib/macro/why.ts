/**
 * "Why it moves": every moved cause explained under the curve it shifts, then what happens
 * before (B) and after (C) prices adjust. All numbers come from the model's run.
 */
import { isR, lmR, Ystar, type Params, type Frame } from "./model";
import { causeDisabled, causes, isHardPeg, parentById, parents, shiftOf, type ParentId, type Run } from "./sim";
import type { Curve, Dir } from "./shocks";
import { indexToLevel } from "./scenarios";

export type WhyItem = { id: string; lead: string; text: string; dir: Dir };
export type WhyGroup = {
  curve: Curve;
  /** The curve's net movement in the model, or null when the causes cancel or do not reach it. */
  net: Dir | null;
  head: string;
  items: WhyItem[];
};
export type Why = { groups: WhyGroup[]; short: string | null; long: string | null };

const MOVED = 0.05;
const ORDER: Curve[] = ["FE", "IS", "LM"];

/** How far (and which way) each curve actually moved between two economies, read from the model. */
export function netShift(curve: Curve, before: Params, bFrame: Frame, after: Params, aFrame: Frame): Dir | null {
  let d: number;
  if (curve === "FE") d = Ystar(after) - Ystar(before);
  // IS right = a higher rate at the same output; LM right = a lower rate at the same output
  else if (curve === "IS") d = isR(after, 100, aFrame.q) - isR(before, 100, bFrame.q);
  else d = -(lmR(after, 100, aFrame.Meff / aFrame.P) - lmR(before, 100, bFrame.Meff / bFrame.P));
  return Math.abs(d) <= MOVED ? null : d > 0 ? "right" : "left";
}

const arrowed = (s: string) => s.replace(/ -> /g, " → ");
const fixed1 = (x: number) => x.toFixed(1);

export function explain(rn: Run): Why {
  const st = rn.state;
  const hard = st.open && isHardPeg(st.regime);
  const by: Record<Curve, WhyItem[]> = { FE: [], IS: [], LM: [] };

  for (const c of causes) {
    const x = st.causes[c.id] ?? 0;
    if (x === 0) continue;
    if ((c.needsOpen && !st.open) || causeDisabled(c, st)) continue;
    const sh = shiftOf(c, x, hard);
    if (!sh) continue;
    const chain = hard && c.pegChain ? c.pegChain : c.chain;
    const steps = (x > 0 ? chain.up : chain.down).split(" -> ");
    const lvl = indexToLevel(x);
    by[sh.curve].push({
      id: c.id,
      dir: sh.dir,
      lead: `${c.label}, ${x > 0 ? "up" : "down"} ${Math.abs(lvl) || Math.abs(x).toFixed(1)}`,
      text: arrowed(steps.slice(1).join(" -> ") || steps[0]) + ".",
    });
  }
  // a direct nudge of a market (an older link) is not a named cause, but it still moves a curve
  for (const p of parents) {
    const o = st.offsets[p.id as ParentId];
    if (!o || Math.abs(o) < 0.005) continue;
    const dir: Dir = o * (p.upDir === "right" ? 1 : -1) > 0 ? "right" : "left";
    by[p.group].push({ id: `offset-${p.id}`, dir, lead: `${parentById(p.id as ParentId).label}, moved directly by ${fixed1(Math.abs(o))}`, text: `${p.group} shifts ${dir}.` });
  }

  const groups: WhyGroup[] = [];
  for (const curve of ORDER) {
    const items = by[curve];
    if (!items.length) continue;
    const net = netShift(curve, rn.sim.before, rn.sim.baseline, rn.sim.after, rn.sim.impact);
    const mixed = new Set(items.map((i) => i.dir)).size > 1;
    groups.push({ curve, net, items, head: net ? `${curve} shifts ${net}${mixed ? " overall" : ""}` : `${curve}: the moves cancel out` });
  }

  if (!groups.length) return { groups, short: null, long: null };

  const a = rn.sim.baseline, b = rn.sim.impact, c = rn.sim.longRun;
  const dir = (d: number, up: string, down: string, same: string) => (d > 0.05 ? up : d < -0.05 ? down : same);
  const short = `Output ${dir(b.Y - a.Y, "rises", "falls", "holds")} to ${fixed1(b.Y)} and the interest rate ${dir(b.r - a.r, "rises", "falls", "holds")} to ${fixed1(b.r)}%. Prices have not moved yet.`;
  const gap = b.Y - b.Ystar;
  const pct = (c.P / a.P - 1) * 100;
  const long = Math.abs(gap) < 0.05
    ? "Output is already at full employment, so prices stay put."
    : gap > 0
      ? `Output is above full employment, so prices rise${Math.abs(pct) >= 0.05 ? ` (${fixed1(pct)}%)` : ""}. Real money shrinks and LM shifts left until output is back at ${fixed1(c.Y)}, with the interest rate at ${fixed1(c.r)}%.`
      : `Output is below full employment, so prices fall${Math.abs(pct) >= 0.05 ? ` (${fixed1(pct)}%)` : ""}. Real money grows and LM shifts right until output is back at ${fixed1(c.Y)}, with the interest rate at ${fixed1(c.r)}%.`;
  return { groups, short, long };
}

