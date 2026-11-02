"use client";

import type { ComponentType } from "react";
import { FEHandoff, GrowthCalculator, HiringWidget, ProductionFunctionWidget } from "./productivity";
import { CpiBasketWidget, ExpenditureSorter, ImportsDemo, RealNominalWidget, ThreeWaysWidget } from "./measuring";

/** Interactive pieces a lesson section can name by id. */
const registry: Record<string, ComponentType> = {
  "three-ways": ThreeWaysWidget,
  "expenditure-sorter": ExpenditureSorter,
  "imports-demo": ImportsDemo,
  "real-nominal": RealNominalWidget,
  "cpi-basket": CpiBasketWidget,
  "production-function": ProductionFunctionWidget,
  hiring: HiringWidget,
  "growth-calc": GrowthCalculator,
  "fe-handoff": FEHandoff,
};

export default function Widget({ id }: { id: string }) {
  const W = registry[id];
  return W ? <W /> : null;
}
