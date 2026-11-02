"use client";

import type { ComponentType } from "react";
import { LafferWidget, LinkedPanels, OkunConverter, PhillipsWidget, UsUnemployment } from "./labour";
import { IsShifters, RicardianWidget, SavingMarketIS, SmoothingWidget } from "./saving";
import { LmShifters, MoneyMarketLM, MultiplierWidget, PolicyRateWidget } from "./money";
import { FEHandoff, GrowthCalculator, HiringWidget, ProductionFunctionWidget } from "./productivity";
import { BigMacWidget, CarryWidget, RegimeSpectrum, StrongCurrencyWidget, UipWidget } from "./fx";
import { GeSandbox, LmPuzzle, MoneyNeutrality, PriceLM, RecipeTwoShocks } from "./fullmodel";
import { IdentityWidget, LedgerWidget, NxShiftersWidget } from "./open";
import { DemandLab, IsDemandSpeed, LiquidityTrap, LmDemandSpeed, MultiplierDemo, StimulusTiming, Wealth2008 } from "./demand";
import { Classifier, Contributions2008, NgdpTarget, RecessionLab, RecessionTypes, TaylorRule } from "./policy";
import { HurricaneWidget, OilLab, PolicyDilemma, Us1970s } from "./supply";
import { TariffPredict, TariffRecord, TariffShocks } from "./tariffs";
import { GermanyUk, Timeline } from "./reunification";
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
  "strong-currency": StrongCurrencyWidget,
  "big-mac": BigMacWidget,
  "regime-spectrum": RegimeSpectrum,
  uip: UipWidget,
  "germany-uk": GermanyUk,
  "reunification-timeline": Timeline,
  "tariff-shocks": TariffShocks,
  "tariff-predict": TariffPredict,
  "tariff-record": TariffRecord,
  "saving-nx": IdentityWidget,
  ledger: LedgerWidget,
  "nx-shifters": NxShiftersWidget,
  carry: CarryWidget,
  "price-lm": PriceLM,
  "recipe-two": RecipeTwoShocks,
  "money-neutrality": MoneyNeutrality,
  "lm-puzzle": LmPuzzle,
  "ge-sandbox": GeSandbox,
  "oil-lab": OilLab,
  "recession-lab": RecessionLab,
  "recession-types": RecessionTypes,
  classifier: Classifier,
  "gdp-2008": Contributions2008,
  taylor: TaylorRule,
  "ngdp-target": NgdpTarget,
  "demand-lab": DemandLab,
  "is-speed": IsDemandSpeed,
  "lm-speed": LmDemandSpeed,
  "stimulus-timing": StimulusTiming,
  "multiplier-demo": MultiplierDemo,
  "liquidity-trap": LiquidityTrap,
  "wealth-2008": Wealth2008,
  "policy-dilemma": PolicyDilemma,
  hurricane: HurricaneWidget,
  "us-1970s": Us1970s,
};

export default function Widget({ id }: { id: string }) {
  const W = registry[id];
  return W ? <W /> : null;
}
