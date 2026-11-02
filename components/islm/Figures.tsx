"use client";

import { useMemo } from "react";
import Chart, { type Series, type Mark } from "@/components/chart/Chart";
import {
  buildLaborSeries,
  buildLmChartSeries,
  buildStructuralIsProjectionSeries,
  computeIsPanelEquilibrium,
  computeIslmAlgebraicIntersection,
  computeLaborEquilibrium,
  mapControlsToStructuralParams,
  type ModelParams,
} from "@/lib/islmModel";

type Pt = { x: number; y: number };
const inside = (pts: Pt[]) => pts.filter((p) => p.y > 0.001 && p.y < 19.999);
const within = (m: Pt | null): Mark[] =>
  m && m.x >= 0 && m.x <= 100 && m.y >= 0 && m.y <= 20 ? [{ x: m.x, y: m.y, label: "E" }] : [];

interface FigureProps {
  params: ModelParams;
  baselineParams: ModelParams | null;
  equilibrium: { output: number; rate: number } | null;
}

/** Figure 1: IS and LM in (Y, r) space with the full-employment line. */
export function IslmFigure({ params, baselineParams, equilibrium }: FigureProps) {
  const lines = (p: ModelParams) => {
    const s = mapControlsToStructuralParams(p);
    return {
      is: [0, 100].map((x) => ({ x, y: s.isIntercept + s.isSlope * x })),
      lm: [0, 100].map((x) => ({ x, y: s.lmIntercept + s.lmSlope * x })),
    };
  };
  const now = useMemo(() => lines(params), [params]);
  const base = useMemo(() => (baselineParams ? lines(baselineParams) : null), [baselineParams]);
  const series: Series[] = [
    ...(base
      ? [
          { id: "is0", curve: "is" as const, points: base.is, ghost: true },
          { id: "lm0", curve: "lm" as const, points: base.lm, ghost: true },
        ]
      : []),
    { id: "is", curve: "is", points: now.is, label: "IS" },
    { id: "lm", curve: "lm", points: now.lm, label: "LM" },
  ];
  return (
    <Chart
      title="IS and LM curves with the full-employment line Y*"
      xLabel="Output, Y (index)" yLabel="Interest rate, r (index)"
      xDomain={[0, 100]} yDomain={[0, 20]} xTicks={5} yTicks={4} aspect={0.62}
      series={series}
      refLines={[{ orientation: "v", value: params.fullEmployment, curve: "fe", label: "Y*" }]}
      marks={within(equilibrium ? { x: equilibrium.output, y: equilibrium.rate } : null)}
    />
  );
}

/** Figure 2: investment (plus net exports) and saving against the interest rate. */
export function LoanableFundsFigure({ params, baselineParams, equilibrium }: FigureProps) {
  const build = (p: ModelParams) => buildStructuralIsProjectionSeries(p, 1);
  const now = useMemo(() => build(params), [params]);
  const base = useMemo(() => (baselineParams ? build(baselineParams) : null), [baselineParams]);
  const inv = (d: ReturnType<typeof build>) => inside(d.map((r) => ({ x: r.x, y: r.investmentY })));
  const sav = (d: ReturnType<typeof build>) => inside(d.map((r) => ({ x: r.x, y: r.savingsY })));
  const eq = computeIsPanelEquilibrium(params);
  void equilibrium;
  return (
    <Chart
      title="Investment plus net exports, and saving, against the interest rate"
      xLabel="Loanable funds" yLabel="Interest rate, r" xDomain={[0, 100]} yDomain={[0, 20]}
      xTicks={4} yTicks={4} aspect={0.8}
      series={[
        ...(base ? [
          { id: "i0", curve: "is" as const, points: inv(base), ghost: true },
          { id: "s0", curve: "is" as const, points: sav(base), ghost: true },
        ] : []),
        { id: "i", curve: "is", points: inv(now), label: "I+NX" },
        { id: "s", curve: "is", points: sav(now), label: "S" },
      ]}
      marks={within(eq)}
    />
  );
}

/** Figure 3: real money supply (vertical) and money demand. */
export function MoneyFigure({ params, baselineParams, equilibrium }: FigureProps) {
  const out = equilibrium?.output ?? 50;
  const demand = (p: ModelParams, o: number) => inside(buildLmChartSeries(p, o, 1).map((r) => ({ x: r.x, y: r.moneyDemandY })));
  const baseOut = baselineParams ? computeIslmAlgebraicIntersection(baselineParams).equilibriumX : 50;
  return (
    <Chart
      title="Real money supply and money demand"
      xLabel="Real balances, Ms/P, L" yLabel="Interest rate, r" xDomain={[0, 100]} yDomain={[0, 20]}
      xTicks={4} yTicks={4} aspect={0.8}
      series={[
        ...(baselineParams ? [{ id: "l0", curve: "money" as const, points: demand(baselineParams, baseOut), ghost: true }] : []),
        { id: "l", curve: "money", points: demand(params, out), label: "L" },
      ]}
      refLines={[
        ...(baselineParams ? [{ orientation: "v" as const, value: baselineParams.moneySupply, curve: "money" as const, ghost: true }] : []),
        { orientation: "v", value: params.moneySupply, curve: "money", label: "Ms/P" },
      ]}
      marks={within(equilibrium ? { x: params.moneySupply, y: equilibrium.rate } : null)}
    />
  );
}

/** Figure 4: labour supply and demand; demand shifts with the output gap. */
export function LabourFigure({ params, baselineParams, equilibrium }: FigureProps) {
  const gap = computeIslmAlgebraicIntersection(params).outputGap;
  const bGap = baselineParams ? computeIslmAlgebraicIntersection(baselineParams).outputGap : null;
  const side = (g: number, k: "supplyY" | "demandY") => inside(buildLaborSeries(g, 1).map((r) => ({ x: r.x, y: r[k] })));
  const eq = computeLaborEquilibrium(gap);
  void equilibrium;
  return (
    <Chart
      title="Labour supply and demand"
      xLabel="Labour, L" yLabel="Real wage, w" xDomain={[0, 100]} yDomain={[0, 20]}
      xTicks={4} yTicks={4} aspect={0.8}
      series={[
        ...(bGap !== null ? [
          { id: "ls0", curve: "labour" as const, points: side(bGap, "supplyY"), ghost: true },
          { id: "ld0", curve: "labour" as const, points: side(bGap, "demandY"), ghost: true },
        ] : []),
        { id: "ls", curve: "labour", points: side(gap, "supplyY"), label: "LS" },
        { id: "ld", curve: "labour", points: side(gap, "demandY"), label: "LD" },
      ]}
      marks={within(eq)}
    />
  );
}
