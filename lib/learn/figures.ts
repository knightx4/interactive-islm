/**
 * The figure that stays beside each lesson's reading column: which shock it shows, in which economy.
 * Lessons with a lab use the lab's own starting shock; the others use the shock closest to their subject.
 */
import type { Regime } from "../macro/model";
import type { Lesson } from "./lessons";

export type FigureSpec = { shockId: string; regime: Regime; mobility?: number };

const BY_SLUG: Record<string, string> = {
  "measuring-the-economy": "gov-spending-up",
  "productivity-growth": "productivity-up",
  unemployment: "labour-supply-up",
  "saving-investment": "investment-outlook-up",
  "money-inflation": "money-supply-up",
  "is-lm-fe": "money-supply-up",
  "supply-shocks": "productivity-down",
  "demand-shocks": "gov-spending-up",
  recessions: "wealth-down",
};

export function figureFor(l: Pick<Lesson, "slug" | "lab">): FigureSpec {
  if (l.lab) return { shockId: l.lab.defaultShock, regime: l.lab.regime, mobility: l.lab.mobility };
  return { shockId: BY_SLUG[l.slug] ?? "money-supply-up", regime: "closed" };
}

/** The four stages a section's "Show this" button can move the figure to: recipe step, point and label. */
export const STAGES = [
  { step: 0, at: "A", label: "Start" },
  { step: 2, at: "A", label: "The shock moves a curve" },
  { step: 3, at: "B", label: "Short run, prices fixed" },
  { step: 7, at: "C", label: "After prices adjust" },
] as const;

/** The stage a section shows: sections are spread evenly over the four stages. */
export const stageOfSection = (index: number, count: number) => (count <= 1 ? 0 : Math.round((index * (STAGES.length - 1)) / (count - 1)));
