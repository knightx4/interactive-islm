import type { Regime, Simulation } from "./model";
import { direction, type Direction } from "./predict";
import type { Curve, Shock } from "./shocks";

export type { Curve };
export type Shift = { curve: Curve; dir: "right" | "left" };

/** Which curve a shock moves: read off the shift-table row. */
export const detectShift = (shock: Shock): Shift => ({ curve: shock.curve, dir: shock.dir });

const word = (d: Direction) => (d === "up" ? "rises" : d === "down" ? "falls" : "stays put");
const fmt = (x: number, d = 1) => x.toFixed(d);

export type RecipeStep = { title: string; text: string };

/** Index of the recipe step that shows each point: A at step 0, B at step 3, C at step 7. */
export const stepOfPoint = { A: 0, B: 3, C: 7 } as const;

/** The eight-step recipe, filled in with this shock's own results. */
export function recipeFor(sim: Simulation, regime: Regime, shock: Shock): RecipeStep[] {
  const s = detectShift(shock);
  const a = sim.baseline, b = sim.impact, c = sim.longRun;
  const open = regime !== "closed";
  const gap = b.Y - b.Ystar;
  const pressure = Math.abs(gap) / b.Ystar < 0.005 ? "none" : gap > 0 ? "up" : "down";
  const pDir = direction(a.P, c.P);
  const also = shock.also ? ` It also moves ${shock.also.curve} ${shock.also.dir}.` : "";
  return [
    {
      title: "Start at the resting point (A)",
      text: `IS, LM and FE cross at one point. Output is at full employment, the three side markets clear, and the price level is ${fmt(a.P, 2)}.`,
    },
    {
      title: "Name the shock and what it hits",
      text: `${shock.label}. ${shock.blurb.replace(/^(IS|LM|FE) shifts (left|right)\.\s*/, "")}`,
    },
    {
      title: "Move the curve",
      text: `The ${s.curve} curve shifts ${s.dir}${s.curve === "FE" ? " (capacity changes, so the vertical line moves)" : ""}.${also} The dashed line is where it was.`,
    },
    {
      title: "Find the short-run point (B), with prices still fixed",
      text:
        `Output ${word(direction(a.Y, b.Y))} (${fmt(a.Y)} to ${fmt(b.Y)}) and the real interest rate ${word(direction(a.r, b.r))} (${fmt(a.r, 2)} to ${fmt(b.r, 2)}).` +
        (open ? ` The exchange rate e ${word(direction(a.E, b.E))} and net exports ${word(direction(a.NX, b.NX, 0.005, 1))}.` : ""),
    },
    {
      title: "Check the side markets at B",
      text: `Saving and investment: investment ${word(direction(a.I, b.I))}. Money: the rate moves until money demand matches the money supply. Labour: employment ${word(direction(a.N, b.N))} to ${fmt(b.N)} and the real wage ${word(direction(a.w, b.w, 0.005))} to ${fmt(b.w, 2)}, read off labour demand.`,
    },
    {
      title: "Compare output with FE",
      text:
        pressure === "none"
          ? "Output is still on FE, so prices have no reason to move."
          : `Output sits ${gap > 0 ? "above" : "below"} FE, so firms and workers push prices ${pressure === "up" ? "up" : "down"}.`,
    },
    {
      title: "Let prices adjust",
      text:
        pDir === "same"
          ? "The price level does not need to change."
          : `Prices ${pDir === "up" ? "rise" : "fall"}, so real money balances ${pDir === "up" ? "shrink" : "grow"} and LM shifts ${pDir === "up" ? "left" : "right"}, step by step, until output is back on FE.`,
    },
    {
      title: "Land at the long-run point (C) and compare with A",
      text:
        `Output ${word(direction(a.Y, c.Y))}, the real rate ${word(direction(a.r, c.r))}, prices ${word(pDir)}, employment ${word(direction(a.N, c.N))}, the real wage ${word(direction(a.w, c.w, 0.005))}.` +
        (shock.curve === "LM" ? " A pure money shock is neutral: only nominal variables end up different." : ""),
    },
  ];
}

export type ChainLink = { text: string; /** the recipe step at which this link lights up */ step: number };

/** A cause-and-effect chain in plain words, driven by the simulation's own results. */
export function chainFor(sim: Simulation, regime: Regime, shock: Shock): ChainLink[] {
  const s = detectShift(shock);
  const a = sim.baseline, b = sim.impact, c = sim.longRun;
  const out: ChainLink[] = [{ text: `${s.curve} shifts ${s.dir}`, step: 2 }];
  const yS = direction(a.Y, b.Y);
  if (s.curve === "FE") {
    out.push(
      { text: `Capacity ${s.dir === "right" ? "grows" : "shrinks"}`, step: 2 },
      { text: `Output sits ${s.dir === "right" ? "below" : "above"} the new FE`, step: 5 },
    );
  } else {
    out.push({ text: `Output ${word(yS)}`, step: 3 });
    out.push({ text: `Interest rate ${word(direction(a.r, b.r))}`, step: 3 });
    if (regime !== "closed") out.push({ text: `Exchange rate ${word(direction(a.E, b.E))}`, step: 3 }, { text: `Net exports ${word(direction(a.NX, b.NX, 0.005, 1))}`, step: 3 });
    out.push({ text: `Employment ${word(direction(a.N, b.N))}`, step: 4 });
    if (yS !== "same") out.push({ text: `Output ${yS === "up" ? "above" : "below"} FE`, step: 5 });
  }
  const p = direction(a.P, c.P);
  if (p === "same") out.push({ text: "Prices have no reason to move", step: 6 });
  else out.push(
    { text: `Prices ${p === "up" ? "rise" : "fall"}`, step: 6 },
    { text: `Real money ${p === "up" ? "shrinks" : "grows"}`, step: 6 },
    { text: `LM shifts ${p === "up" ? "left" : "right"}`, step: 6 },
  );
  out.push({ text: "Output returns to FE", step: 7 });
  return out;
}
