import { autonomous, Ystar, type Regime, type Simulation } from "./model";
import { direction, type Direction } from "./predict";

export type Curve = "IS" | "LM" | "FE";
export type Shift = { curve: Curve; dir: "right" | "left" };

/** Which curve a shock moves, found by comparing the economy before and after. */
export function detectShift(sim: Simulation): Shift {
  const a = sim.before, b = sim.after;
  const fe = direction(Ystar(a), Ystar(b));
  if (fe !== "same") return { curve: "FE", dir: fe === "up" ? "right" : "left" };
  const lmReal = direction(a.M / a.h, b.M / b.h);
  const kyDir = direction(a.ky / a.h, b.ky / b.h);
  if (lmReal !== "same") return { curve: "LM", dir: lmReal === "up" ? "right" : "left" };
  if (kyDir !== "same") return { curve: "LM", dir: kyDir === "up" ? "left" : "right" };
  const is = direction(autonomous(a), autonomous(b));
  if (is !== "same") return { curve: "IS", dir: is === "up" ? "right" : "left" };
  // world rate: moves the horizontal line the economy is pinned to
  return { curve: "IS", dir: b.rw > a.rw ? "left" : "right" };
}

const word = (d: Direction) => (d === "up" ? "rises" : d === "down" ? "falls" : "stays put");

export type RecipeStep = { title: string; text: string };

/** A fixed five-step recipe, filled in with this shock's results. */
export function recipeFor(sim: Simulation, regime: Regime, shockLabel: string): RecipeStep[] {
  const s = detectShift(sim);
  const b = sim.baseline, i = sim.impact, lr = sim.longRun;
  const yS = direction(b.Y, i.Y), rS = direction(b.r, i.r), pL = direction(b.P, lr.P);
  const gap = i.Y - i.Ystar;
  const pressure = Math.abs(gap) / i.Ystar < 0.005 ? "no" : gap > 0 ? "upward" : "downward";
  const steps: RecipeStep[] = [
    { title: "Start at the baseline", text: "The economy rests where IS, LM and FE meet, with output at full employment." },
    { title: "Name the shock and the curve it moves", text: `${shockLabel}: the ${s.curve} curve shifts ${s.dir}${s.curve === "FE" ? " (capacity changes)" : ""}.` },
    {
      title: "Find the new short-run point (prices have not moved)",
      text: regime === "closed"
        ? `Output ${word(yS)} and the interest rate ${word(rS)}.`
        : `The interest rate is pinned to the world rate; output ${word(yS)}, and the real exchange rate ${word(direction(b.q, i.q))}.`,
    },
    { title: "Compare output with FE", text: pressure === "no" ? "Output is still at FE, so prices have no reason to move." : `Output sits ${gap > 0 ? "above" : "below"} FE, so there is ${pressure} pressure on prices.` },
    { title: "Let prices adjust", text: `Prices ${word(pL)} until output is back on FE. Output ends ${word(direction(b.Y, lr.Y))} versus the start.` },
  ];
  return steps;
}

/** A cause-and-effect chain in plain words, driven by the simulation's own results. */
export function chainFor(sim: Simulation, regime: Regime): string[] {
  const s = detectShift(sim);
  const b = sim.baseline, i = sim.impact, lr = sim.longRun;
  const out: string[] = [`${s.curve} shifts ${s.dir}`];
  const yS = direction(b.Y, i.Y);
  if (s.curve === "FE") {
    out.push(`Capacity ${s.dir === "right" ? "grows" : "shrinks"}`, `Output sits ${s.dir === "right" ? "below" : "above"} the new FE`);
  } else {
    out.push(`Output ${word(yS)}`);
    if (regime === "closed") out.push(`Interest rate ${word(direction(b.r, i.r))}`);
    else out.push(`Real exchange rate ${word(direction(b.q, i.q))}`, `Net exports ${word(direction(b.NX, i.NX))}`);
    if (yS !== "same") out.push(`Output ${yS === "up" ? "above" : "below"} FE`);
  }
  const p = direction(b.P, lr.P);
  if (p === "same") out.push("Prices have no reason to move");
  else {
    out.push(`Prices ${p === "up" ? "rise" : "fall"}`, `Real money ${p === "up" ? "shrinks" : "grows"}`, "LM shifts " + (p === "up" ? "left" : "right"));
  }
  out.push("Output returns to FE");
  return out;
}
