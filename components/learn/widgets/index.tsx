"use client";

import type { ComponentType } from "react";
import { LafferWidget, LinkedPanels, OkunConverter, PhillipsWidget, UsUnemployment } from "./labour";
import { IsShifters, RicardianWidget, SavingMarketIS, SmoothingWidget } from "./saving";
import { LmShifters, MoneyMarketLM, MultiplierWidget, PolicyRateWidget } from "./money";
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
  multiplier: MultiplierWidget,
  "money-market": MoneyMarketLM,
  "lm-shifters": LmShifters,
  "policy-rate": PolicyRateWidget,
  smoothing: SmoothingWidget,
  "saving-market": SavingMarketIS,
  "is-shifters": IsShifters,
  ricardian: RicardianWidget,
  "linked-panels": LinkedPanels,
  laffer: LafferWidget,
  okun: OkunConverter,
  phillips: PhillipsWidget,
  "us-unemployment": UsUnemployment,
};

export default function Widget({ id }: { id: string }) {
  const W = registry[id];
  return W ? <W /> : null;
}
