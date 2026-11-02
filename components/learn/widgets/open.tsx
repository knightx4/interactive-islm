"use client";

import { useState } from "react";
import Chart from "@/components/chart/Chart";
import { identity, isWith, ledger, lmBase } from "@/lib/learn/open";
import { Ctl, Fig } from "./ui";

const sgn = (x: number, d = 0) => `${x > 0 ? "+" : ""}${x.toFixed(d)}`;

/* ---------- I = S - NX ---------- */
export function IdentityWidget() {
  const [S, setS] = useState(18);
  const [I, setI] = useState(22);
  const d = identity(S, I);
  const max = Math.max(S, I, 30);
  const w = (x: number) => `${(100 * Math.max(0, x)) / max}%`;
  return (
    <Fig title="Who pays for investment?" note="Index units for an economy with output 100. S is national saving (households plus government), I is investment, NX is net exports. Rearranging Y = C + I + G + NX gives S = I + NX.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="id-s" label="National saving, S" value={S} min={5} max={30} onChange={setS} />
        <Ctl id="id-i" label="Investment, I" value={I} min={5} max={30} onChange={setI} />
      </div>
      <div className="mt-3 space-y-2 text-xs" role="img" aria-label={`Saving ${S}, investment ${I}, net exports ${d.NX}`}>
        <div className="grid grid-cols-[6rem_1fr] items-center gap-2"><span>Saving S</span><span className="h-3 bg-wash"><span className="block h-3" style={{ width: w(S), background: "var(--c-is)" }} /></span></div>
        <div className="grid grid-cols-[6rem_1fr] items-center gap-2"><span>Investment I</span>
          <span className="flex h-3 bg-wash"><span className="block h-3" style={{ width: w(d.domesticallyFunded), background: "var(--c-is)" }} /><span className="block h-3" style={{ width: w(d.foreignSaving), background: "var(--c-lm)" }} /></span></div>
      </div>
      <p className="num mt-2 text-sm" aria-live="polite">
        NX = S − I = {S} − {I} = <span className="font-semibold">{sgn(d.NX)}</span>.
      </p>
      <p className="prose-text mt-1 text-sm" aria-live="polite">
        {d.NX < 0 ? `A trade deficit of ${-d.NX}. Home saving covers only ${S} of the ${I} invested; the other ${-d.NX} is foreign saving lent in (the red part). The deficit and the capital inflow are one fact seen twice.`
          : d.NX > 0 ? `A trade surplus of ${d.NX}. The country saves more than it invests at home, and lends the ${d.NX} left over abroad.`
          : "Balanced trade: home saving exactly funds home investment."}
        {" "}That is why a deficit is not by itself a sign of weakness: a country with many good projects can borrow to build them.
      </p>
    </Fig>
  );
}

/* ---------- Current and financial accounts as one ledger ---------- */
export function LedgerWidget() {
  const [ca, setCa] = useState(-6);
  const [fa, setFa] = useState(4);
  const [peg, setPeg] = useState(false);
  const l = ledger(ca, fa);
  return (
    <Fig title="Two sides of one ledger" note="CA is the current account (net exports here); FA is net private capital inflow. A positive change in reserves means the central bank is buying foreign currency. Index units.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="lg-c" label="Current account, CA" value={ca} min={-10} max={10} show={sgn(ca)} onChange={setCa} />
        <Ctl id="lg-f" label="Private capital inflow, FA" value={fa} min={-10} max={10} show={sgn(fa)} onChange={setFa} />
      </div>
      <div className="mt-3 flex gap-2 text-sm" role="group" aria-label="Regime">
        {[false, true].map((p) => (
          <button key={String(p)} type="button" aria-pressed={peg === p} onClick={() => setPeg(p)}
            className={`border-b-2 px-1 ${peg === p ? "border-ink font-semibold" : "border-rule text-muted-foreground"}`}>{p ? "Pegged rate" : "Floating rate"}</button>
        ))}
      </div>
      <p className="num mt-2 text-sm" aria-live="polite">CA + FA = {sgn(ca)} {sgn(fa)} = <span className="font-semibold">{sgn(l.dRes)}</span> change in reserves.</p>
      <p className="prose-text mt-1 text-sm" aria-live="polite">
        {Math.abs(l.dRes) < 0.5 ? "The ledger balances without help from the central bank."
          : peg
            ? l.dRes > 0 ? `The central bank buys ${l.dRes} of foreign currency to hold the rate. Reserves rise and the money supply rises with them, unless it offsets (sterilises) the purchase.`
              : `The central bank sells ${-l.dRes} of reserves to hold the rate. Reserves fall and the money supply is drained. If the outflow goes on, reserves run out and the peg breaks.`
            : l.dRes > 0 ? `Under a float reserves cannot absorb ${l.dRes}, so demand for the home currency pushes e up until net exports fall and the gap closes.`
              : `Under a float reserves cannot absorb ${-l.dRes}, so e falls until net exports rise and the gap closes.`}
      </p>
    </Fig>
  );
}

/* ---------- NX shifts IS ---------- */
export function NxShiftersWidget() {
  const [Yp, setYp] = useState(100);
  const [tariff, setTariff] = useState(0);
  const [tariffP, setTariffP] = useState(0);
  const [q, setQ] = useState(1);
  const d = { Yp, tariff, tariffP, q };
  const ys = Array.from({ length: 17 }, (_, i) => 60 + 5 * i);
  const r100 = isWith(d, 100) - isWith({ Yp: 100, tariff: 0, tariffP: 0, q: 1 }, 100);
  const dir = Math.abs(r100) < 0.02 ? "has not moved" : r100 > 0 ? "has shifted right (a higher rate at every output)" : "has shifted left (a lower rate at every output)";
  return (
    <Fig title="What moves net exports moves IS" note="Closed-economy IS plus net exports, I = S − NX. Dashed: where IS starts. The three index controls are partner income, trade policy and the real exchange rate q (the model's RER). Index units.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="nx-y" label="Partner income" value={Yp} min={80} max={120} show={String(Yp)} onChange={setYp} />
        <Ctl id="nx-q" label="Real exchange rate, RER" value={q} min={0.8} max={1.2} step={0.05} show={q.toFixed(2)} onChange={setQ} />
        <Ctl id="nx-t" label="Home tariff (points)" value={tariff} min={0} max={10} onChange={setTariff} />
        <Ctl id="nx-tp" label="Partner's tariff (points)" value={tariffP} min={0} max={10} onChange={setTariffP} />
      </div>
      <div className="mt-3 max-w-md">
        <Chart
          series={[
            { id: "is0", curve: "is", ghost: true, points: ys.map((y) => ({ x: y, y: isWith({ Yp: 100, tariff: 0, tariffP: 0, q: 1 }, y) })) },
            { id: "is", curve: "is", label: "IS", points: ys.map((y) => ({ x: y, y: isWith(d, y) })) },
            { id: "lm", curve: "lm", label: "LM", points: ys.map((y) => ({ x: y, y: lmBase(y) })) },
          ]}
          refLines={[{ orientation: "v", value: 100, curve: "fe", label: "FE" }]}
          xDomain={[60, 140]} yDomain={[0, 10]} xLabel="Output, Y" yLabel="Interest rate, r (%)" xTicks={4} yTicks={5}
          title="IS curve shifting with net-export drivers, against a fixed LM and FE"
        />
      </div>
      <p className="prose-text mt-1 text-sm" aria-live="polite">IS {dir}. Stronger partner demand, a home tariff, or a cheaper currency raise NX at every output and shift IS right. A partner&apos;s tariff or a dearer currency lower NX and shift it left. These are effects on IS only: with a floating rate the currency then moves too.</p>
    </Fig>
  );
}
