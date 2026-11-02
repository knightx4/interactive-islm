"use client";

import { useState, useEffect } from "react";
import ModelControls from "@/components/islm/ModelControls";
import ExpenditureIdentityCard from "@/components/islm/ExpenditureIdentityCard";
import MacroFeedbackBar from "@/components/islm/layout/MacroFeedbackBar";
import {
  IslmFigure,
  LabourFigure,
  LoanableFundsFigure,
  MoneyFigure,
} from "@/components/islm/Figures";
import {
  computeIslmAlgebraicIntersection,
  computeIslmEquilibrium,
  type ModelParams,
} from "@/lib/islmModel";

type SolvedEquilibrium = { output: number; rate: number };

const defaultParams: ModelParams = {
  investment: 50,
  savings: 50,
  futureY: 50,
  wealth: 50,
  futureMPK: 50,
  moneySupply: 50,
  moneyDemand: 50,
  expectedInflation: 50,
  riskiness: 50,
  liquidity: 50,
  fullEmployment: 50,
  centralBankSupply: 50,
  priceLevel: 50,
  productivity: 50,
  capital: 50,
  labor: 50,
  governmentSpending: 0,
  netExports: 0,
};

export default function HomePage() {
  const [params, setParams] = useState<ModelParams>(defaultParams);

  const [solvedEquilibrium, setSolvedEquilibrium] =
    useState<SolvedEquilibrium | null>({
      output: 50,
      rate: 10,
    });
  const [baselineParams, setBaselineParams] = useState<ModelParams | null>(null);

  const updateParam = (key: keyof ModelParams, value: number) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  useEffect(() => {
    const bounded = computeIslmEquilibrium(params);
    if (bounded) {
      setSolvedEquilibrium({
        output: bounded.equilibriumX,
        rate: bounded.equilibriumY,
      });
      return;
    }

    const algebraic = computeIslmAlgebraicIntersection(params);
    setSolvedEquilibrium({
      output: algebraic.equilibriumX,
      rate: algebraic.equilibriumY,
    });
  }, [params]);

  const fig = { params, baselineParams, equilibrium: solvedEquilibrium };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl">The IS-LM model</h1>
        <p className="prose-text mt-3 text-lg text-foreground/90">
          Move a driver on the left and watch equilibrium move. All values are model index units,
          not billions or percentage points. The goods market uses{" "}
          <i>I</i> + <i>NX</i> = <i>S</i>, and the accounting table shows{" "}
          <i>Y</i> = <i>C</i> + <i>I</i> + <i>G</i> + <i>NX</i>.
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-12">
        <aside
          aria-label="Model controls"
          className="order-2 lg:order-1 lg:sticky lg:top-16 lg:max-h-[calc(100vh-5rem)] lg:self-start lg:overflow-y-auto lg:pr-2"
        >
          <ModelControls
            params={params}
            updateParam={updateParam}
            equilibriumOutput={solvedEquilibrium?.output ?? null}
            onSetBaseline={() => setBaselineParams({ ...params })}
            onAfterReset={() => setBaselineParams(null)}
          />
        </aside>

        <div className="order-1 min-w-0 lg:order-2">
          <figure>
            <MacroFeedbackBar
              equilibriumOutput={solvedEquilibrium?.output ?? null}
              fullEmployment={params.fullEmployment}
            />
            <IslmFigure {...fig} />
            <figcaption className="mt-2 text-sm text-muted-foreground">
              <b className="font-semibold text-foreground">Figure 1.</b> Equilibrium <i>E</i> is
              where <span className="font-semibold text-is">IS</span> meets{" "}
              <span className="font-semibold text-lm">LM</span>;{" "}
              <span className="font-semibold text-fe">Y*</span> is full-employment output.
              {baselineParams ? " Dashed curves are the saved baseline." : " Use “Set baseline” to keep a dashed copy of the current curves."}
            </figcaption>
          </figure>

          <div className="mt-10 grid gap-8 border-t border-ink pt-6 md:grid-cols-3">
            <figure>
              <LoanableFundsFigure {...fig} />
              <figcaption className="mt-2 text-sm text-muted-foreground">
                <b className="font-semibold text-foreground">Figure 2.</b> Goods market: investment
                plus net exports against saving.
              </figcaption>
            </figure>
            <figure>
              <MoneyFigure {...fig} />
              <figcaption className="mt-2 text-sm text-muted-foreground">
                <b className="font-semibold text-foreground">Figure 3.</b> Money market: real
                balances supplied and demanded.
              </figcaption>
            </figure>
            <figure>
              <LabourFigure {...fig} />
              <figcaption className="mt-2 text-sm text-muted-foreground">
                <b className="font-semibold text-foreground">Figure 4.</b> Labour market, shifted by
                the output gap.
              </figcaption>
            </figure>
          </div>

          <ExpenditureIdentityCard
            params={params}
            equilibriumOutput={solvedEquilibrium?.output ?? null}
          />

          <section className="mt-10 max-w-2xl border-t border-ink pt-4">
            <h2 className="text-2xl">About this model</h2>
            <div className="prose-text mt-3 space-y-4">
              <p>
                The <span className="font-semibold text-is">IS curve</span> summarises
                goods-market equilibrium in (<i>Y</i>, <i>r</i>) space: planned spending meets income
                with <i>I</i> + <i>NX</i> = <i>S</i>. The{" "}
                <span className="font-semibold text-lm">LM curve</span> summarises money-market
                equilibrium for a given price level; a higher real money supply shifts LM right.
              </p>
              <p>
                Figure 3 shows a vertical real money supply <i>Ms</i>/<i>P</i> and a downward-sloping
                money demand in (quantity, rate) space; Figure 2 plots <i>I</i> + <i>NX</i> against{" "}
                <i>S</i>.
              </p>
              <p>
                Axes are index units for teaching, not calibrated data. Fiscal <i>G</i> and the
                components under Savings move the combined IS schedule; use Net exports under
                Investment for <i>NX</i>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
