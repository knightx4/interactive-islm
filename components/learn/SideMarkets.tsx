"use client";

import Chart, { type Mark, type Series } from "@/components/chart/Chart";
import {
  desiredInvestment, desiredSaving, employmentFE, moneyDemand, mpl, sideMarkets, wageFE, wageForSupply,
  type Frame, type Params, type Simulation,
} from "@/lib/macro/model";
import type { View } from "@/lib/macro/view";

const rs = [0, 10];
const pointColor = (at: View["at"]) =>
  at === "A" ? "var(--pt-a)" : at === "B" ? "var(--pt-b)" : at === "C" ? "var(--pt-c)" : "var(--ink)";
const line = (f: (x: number) => number, xs: number[]) => xs.map((x) => ({ x, y: f(x) }));
const differs = (a: number[], b: number[]) => a.some((v, i) => Math.abs(v - b[i]) > 0.02);

function Panel({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <figure className="panel min-w-0 p-3">
      <figcaption className="text-sm font-semibold">{title}</figcaption>
      {children}
      <p className="mt-0.5 text-sm text-muted-foreground">{note}</p>
    </figure>
  );
}

function SavingInvestment({ p, f, p0, f0, ghosts, color, sNX }: Ctx) {
  // Closed: S against I. Open: S against I + NX (lessons) or, as the course draws it, S - NX against I (simulator).
  const open = p.regime !== "closed";
  const S = (pp: Params, ff: Frame) => (r: number) => desiredSaving(pp, ff.Y, r) - (sNX ? ff.NX : 0);
  const I = (pp: Params, ff: Frame) => (r: number) => desiredInvestment(pp, r) + (sNX ? 0 : ff.NX);
  const series: Series[] = [];
  if (ghosts) {
    if (differs(rs.map(S(p0, f0)), rs.map(S(p, f)))) series.push({ id: "s0", curve: "is", points: line(S(p0, f0), rs).map(swap), ghost: true });
    if (differs(rs.map(I(p0, f0)), rs.map(I(p, f)))) series.push({ id: "i0", curve: "is", points: line(I(p0, f0), rs).map(swap), ghost: true });
  }
  series.push(
    { id: "s", curve: "is", points: line(S(p, f), rs).map(swap), label: sNX && open ? "S-NX" : "S" },
    { id: "i", curve: "is", points: line(I(p, f), rs).map(swap), label: !open ? "I" : sNX ? "I" : "I+NX" },
  );
  const marks: Mark[] = [{ x: S(p, f)(f.r), y: f.r, color, guides: true }];
  return (
    <Chart title={sNX && open ? "Saving minus net exports, and investment" : "Saving and investment market"} xLabel={sNX && open ? "S - NX, I" : "Saving, investment"} yLabel="Real rate, r (%)" xDomain={[0, 60]} yDomain={[0, 10]}
      xTicks={3} yTicks={5} aspect={0.95} series={series} marks={marks} />
  );
}
const swap = (p: { x: number; y: number }) => ({ x: p.y, y: p.x }); // line() gives (r, quantity); chart wants (quantity, r)

function Money({ p, f, p0, f0, ghosts, color }: Ctx) {
  const L = (pp: Params, ff: Frame) => (r: number) => moneyDemand(pp, ff.Y, r);
  const series: Series[] = [];
  const refLines = [] as { orientation: "v"; value: number; curve: "lm"; label?: string; ghost?: boolean }[];
  if (ghosts) {
    if (differs(rs.map(L(p0, f0)), rs.map(L(p, f)))) series.push({ id: "l0", curve: "lm", points: line(L(p0, f0), rs).map(swap), ghost: true });
    if (Math.abs(f0.Meff / f0.P - f.Meff / f.P) > 0.02) refLines.push({ orientation: "v", value: f0.Meff / f0.P, curve: "lm", ghost: true });
  }
  series.push({ id: "l", curve: "lm", points: line(L(p, f), rs).map(swap), label: "L" });
  refLines.push({ orientation: "v", value: f.Meff / f.P, curve: "lm", label: "M/P" });
  return (
    <Chart title="Money market" xLabel="Real money balances" yLabel="Real rate, r (%)" xDomain={[0, 60]} yDomain={[0, 10]}
      xTicks={3} yTicks={5} aspect={0.95} series={series} refLines={refLines} marks={[{ x: f.Meff / f.P, y: f.r, color, guides: true }]} />
  );
}

function Labour({ p, f, p0, ghosts, color }: Ctx) {
  const D = (pp: Params) => (N: number) => mpl(pp, N);
  const S = (pp: Params) => (N: number) => wageForSupply(pp, N);
  const ns = [60, 80, 100, 120, 140];
  const pts = (f: (n: number) => number) => ns.map((n) => ({ x: n, y: f(n) }));
  const series: Series[] = [];
  if (ghosts) {
    if (differs(ns.map(D(p0)), ns.map(D(p)))) series.push({ id: "d0", curve: "labour", points: pts(D(p0)), ghost: true });
    if (differs(ns.map(S(p0)), ns.map(S(p)))) series.push({ id: "s0", curve: "labour", points: pts(S(p0)), ghost: true });
  }
  series.push({ id: "d", curve: "labour", points: pts(D(p)), label: "Ld" }, { id: "s", curve: "labour", points: pts(S(p)), label: "Ls" });
  const marks: Mark[] = [
    { x: employmentFE(p), y: wageFE(p), hollow: true, color: "var(--ink)", guides: false, label: "FE", dx: 8, dy: 16 },
    { x: f.N, y: f.w, color, guides: true },
  ];
  return (
    <Chart title="Labour market" xLabel="Employment, N" yLabel="Real wage, w" xDomain={[60, 140]} yDomain={[0.2, 1.2]}
      xTicks={3} yTicks={5} aspect={0.95} series={series} marks={marks} />
  );
}

type Ctx = { p: Params; f: Frame; p0: Params; f0: Frame; ghosts: boolean; color: string; sNX?: boolean };

/** The three side markets: saving and investment, money, and labour, plus the balance of payments when open. */
/** `sNX` draws the open-economy goods market as S - NX against I (the simulator); the lessons keep S against I + NX. */
export default function SideMarkets({ sim, view, sNX = false, lead }: { sim: Simulation; view: View; sNX?: boolean; lead?: React.ReactNode }) {
  const ctx: Ctx = { p: view.params, f: view.frame, p0: sim.before, f0: sim.baseline, ghosts: view.ghosts, color: pointColor(view.at), sNX };
  const s = sideMarkets(view.params, view.frame);
  const open = view.params.regime !== "closed";
  return (
    <div className="space-y-4">
      <div className={lead ? "grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,1fr))]" : "grid gap-6 md:grid-cols-3"}>
        {lead}
        <Panel title="Saving and investment" note={sNX && open ? `Rate ${view.frame.r.toFixed(2)}%; I = S - NX = ${s.investment.toFixed(1)}. A higher NX lowers S - NX and moves IS right.` : `Rate ${view.frame.r.toFixed(2)}%; investment ${s.investment.toFixed(1)}.`}>
          <SavingInvestment {...ctx} />
        </Panel>
        <Panel title="Money" note={`Real balances ${s.moneySupplyReal.toFixed(1)}; price level ${view.frame.P.toFixed(3)}.`}>
          <Money {...ctx} />
        </Panel>
        <Panel title="Labour" note={`Employment ${s.employment.toFixed(1)} (FE ${s.employmentFE.toFixed(1)}); real wage ${s.realWage.toFixed(3)}.`}>
          <Labour {...ctx} />
        </Panel>
      </div>
      {open && (
        <table className="num w-full max-w-md text-sm">
          <caption className="pb-1 text-left font-semibold">Balance of payments</caption>
          <tbody>
            {([["Current account (= net exports)", s.currentAccount], ["Financial account (net capital inflow)", s.financialAccount], ["Change in reserves", s.reservesChange]] as const).map(([l, x]) => (
              <tr key={l} className="border-b border-rule">
                <th scope="row" className="py-0.5 pr-4 text-left font-normal text-muted-foreground">{l}</th>
                <td className="py-0.5 text-right">{x.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
