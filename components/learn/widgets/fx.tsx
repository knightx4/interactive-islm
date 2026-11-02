"use client";

import { useState } from "react";
import { bigMacRER, bigMacRows, carry, depositReturns, regimes, strongCurrency, usBigMac } from "@/lib/learn/fx";
import { Ctl, Fig } from "./ui";

const pct = (x: number, d = 1) => `${x > 0 ? "+" : ""}${x.toFixed(d)}%`;

/* ---------- What a strong currency does to prices and trade ---------- */
export function StrongCurrencyWidget() {
  const [chg, setChg] = useState(10);
  const s = strongCurrency(chg);
  const dir = chg > 0 ? "strong" : chg < 0 ? "weak" : "unchanged";
  return (
    <Fig title="A stronger home currency, prices held fixed" note="e is foreign currency per unit of home currency, so a rise is an appreciation. Home and foreign price levels are held fixed here, so the real exchange rate moves one for one with e. Net exports come from the toy model (index units).">
      <Ctl id="sc-e" label="Change in the exchange rate e" value={chg} min={-25} max={25} step={1} show={pct(chg, 0)} onChange={setChg} />
      <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm md:grid-cols-2">
        <div><dt className="text-muted-foreground">Price of our goods, in foreign currency</dt><dd className="num font-semibold">{pct(100 * s.homeGoodAbroad)}</dd></div>
        <div><dt className="text-muted-foreground">Price of their goods, in our currency</dt><dd className="num font-semibold">{pct(100 * s.foreignGoodHome)}</dd></div>
        <div><dt className="text-muted-foreground">Real exchange rate, RER</dt><dd className="num font-semibold">{s.rer.toFixed(2)} (baseline 1.00)</dd></div>
        <div><dt className="text-muted-foreground">Net exports, NX (toy model)</dt><dd className="num font-semibold">{s.nx.toFixed(1)}</dd></div>
      </dl>
      <p className="prose-text mt-2 text-sm" aria-live="polite">
        {dir === "strong" && "A strong currency makes imports cheap for us and our exports dear abroad: buyers switch toward foreign goods, and NX falls."}
        {dir === "weak" && "A weak currency makes imports dear and our exports cheap abroad: buyers switch toward home goods, and NX rises."}
        {dir === "unchanged" && "With e unchanged, relative prices are unchanged and nothing shifts. Move the slider."}
      </p>
    </Fig>
  );
}

/* ---------- Big Mac real exchange rate calculator ---------- */
export function BigMacWidget() {
  const [i, setI] = useState(6);
  const row = bigMacRows[i];
  const [price, setPrice] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [us, setUs] = useState(usBigMac);
  const lp = price ?? row.price, lr = rate ?? row.perUsd;
  const r = bigMacRER(lp, lr, us);
  const pick = (k: number) => { setI(k); setPrice(null); setRate(null); };
  const w = Math.max(0, Math.min(100, 50 * r.rer));
  return (
    <Fig title="The Big Mac real exchange rate" note="Prices and rates are rounded values from memory, around early 2024. They are only a starting point: overwrite them with a current Economist Big Mac index table. One burger is a rough, single-good stand-in for the price level.">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Country">
        {bigMacRows.map((x, k) => (
          <button key={x.country} type="button" aria-pressed={k === i} onClick={() => pick(k)}
            className={`border-b-2 px-1 text-sm ${k === i ? "border-ink font-semibold" : "border-rule text-muted-foreground"}`}>{x.country}</button>
        ))}
      </div>
      <div className="mt-3 grid gap-x-8 gap-y-3 md:grid-cols-3">
        <Ctl id="bm-p" label={`Local price (${row.currency})`} value={lp} min={Math.max(0.5, row.price * 0.5)} max={row.price * 1.5} step={row.price > 50 ? 1 : 0.1} show={lp.toFixed(row.price > 50 ? 0 : 2)} onChange={setPrice} />
        <Ctl id="bm-r" label={`Market rate (${row.currency} per US dollar)`} value={lr} min={row.perUsd * 0.6} max={row.perUsd * 1.4} step={row.perUsd > 50 ? 1 : row.perUsd > 5 ? 0.1 : 0.01} show={lr.toFixed(row.perUsd > 50 ? 0 : 2)} onChange={setRate} />
        <Ctl id="bm-u" label="US price (dollars)" value={us} min={4} max={7} step={0.05} show={`$${us.toFixed(2)}`} onChange={setUs} />
      </div>
      <div className="mt-3 text-sm" aria-live="polite">
        <p className="num">e (dollars per {row.currency}) = 1 ÷ {lr.toFixed(2)} = {r.e.toFixed(4)}</p>
        <p className="num">RER = e × P<sub>home</sub> ÷ P<sub>US</sub> = {r.e.toFixed(4)} × {lp.toFixed(2)} ÷ {us.toFixed(2)} = <span className="font-semibold">{r.rer.toFixed(2)}</span></p>
        <p className="num">Rate that would equalise the burger: {r.implied.toFixed(row.perUsd > 50 ? 0 : 2)} {row.currency} per dollar.</p>
      </div>
      <div className="mt-2" role="img" aria-label={`Real exchange rate ${r.rer.toFixed(2)} against the US at 1.00`}>
        <div className="relative h-3 bg-wash"><div className="absolute inset-y-0 left-0" style={{ width: `${w}%`, background: "var(--c-fe)" }} /><div className="absolute inset-y-[-3px] border-l-2 border-ink" style={{ left: "50%" }} /></div>
        <div className="mt-0.5 flex justify-between text-xs text-muted-foreground"><span>0</span><span>1.00 parity</span><span>2</span></div>
      </div>
      <p className="prose-text mt-2 text-sm">
        {Math.abs(r.valuation) < 0.03
          ? "About at parity: a dollar buys the same burger at home and in the US."
          : r.valuation < 0
            ? `The currency looks undervalued by about ${(-100 * r.valuation).toFixed(0)} percent: the burger is cheaper in dollars than in the US. The home real exchange rate is low, which tends to lift net exports.`
            : `The currency looks overvalued by about ${(100 * r.valuation).toFixed(0)} percent: the burger costs more in dollars than in the US. The home real exchange rate is high, which tends to depress net exports.`}
        {" "}Poorer countries often look undervalued on one non-traded good such as a burger, because local wages and rents are low, so read a gap as a hint, not a verdict.
      </p>
    </Fig>
  );
}

/* ---------- Regime spectrum ---------- */
export function RegimeSpectrum() {
  const [k, setK] = useState(0);
  const g = regimes[k];
  return (
    <Fig title="From free float to dollarization" note="Examples are public and approximate, from memory; regimes change, and official classifications differ by source. Check a current IMF table before relying on any single example.">
      <div role="group" aria-label="Exchange-rate regime" className="grid grid-cols-3 gap-y-2 md:grid-cols-6">
        {regimes.map((x, i) => (
          <button key={x.id} type="button" aria-pressed={i === k} onClick={() => setK(i)}
            className={`border-t-2 pt-1 text-left text-sm ${i === k ? "border-ink font-semibold" : "border-rule text-muted-foreground"}`}>{x.name}</button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>more room for own monetary policy</span><span>more stable exchange rate</span></div>
      <div className="relative mt-1 h-1 bg-rule" aria-hidden><div className="absolute -top-1.5 h-4 w-4 rounded-full bg-ink transition-[left] duration-300" style={{ left: `calc(${(k / (regimes.length - 1)) * 100}% - 8px)` }} /></div>
      <div className="mt-4 text-sm" aria-live="polite">
        <h3 className="text-lg">{g.name}</h3>
        <p className="prose-text mt-1">{g.rule}</p>
        <p className="prose-text mt-1"><span className="font-semibold">Examples:</span> {g.examples}.</p>
        <p className="prose-text mt-1"><span className="font-semibold">The price paid:</span> {g.cost}</p>
        <p className="num mt-1 text-muted-foreground">Own monetary policy {g.independence} of 5. Rate stability {g.stability} of 5.</p>
      </div>
    </Fig>
  );
}

/* ---------- Interest parity as a no-arbitrage calculator ---------- */
export function UipWidget() {
  const [rh, setRh] = useState(2);
  const [rf, setRf] = useState(5);
  const [g, setG] = useState(0);
  const d = depositReturns(rh, rf, g);
  const better = Math.abs(d.gap) < 0.0005 ? "neither" : d.gap > 0 ? "foreign" : "home";
  return (
    <Fig title="Where does money go?" note="You hold one unit of home currency for a year. e is foreign currency per home currency; if e is expected to fall by g, the foreign deposit pays back more home currency. Nothing here is a forecast.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-3">
        <Ctl id="uip-h" label="Home interest rate" value={rh} min={0} max={10} step={0.5} show={`${rh}%`} onChange={setRh} />
        <Ctl id="uip-f" label="Foreign interest rate" value={rf} min={0} max={10} step={0.5} show={`${rf}%`} onChange={setRf} />
        <Ctl id="uip-g" label="Expected change in e over the year" value={g} min={-12} max={12} step={0.5} show={pct(g)} onChange={setG} />
      </div>
      <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm md:grid-cols-3" aria-live="polite">
        <div><dt className="text-muted-foreground">Home deposit, in home currency</dt><dd className="num font-semibold">{d.home.toFixed(4)}</dd></div>
        <div><dt className="text-muted-foreground">Foreign deposit, in home currency</dt><dd className="num font-semibold">{d.foreign.toFixed(4)}</dd></div>
        <div><dt className="text-muted-foreground">Move in e that makes them equal</dt><dd className="num font-semibold">{pct(d.parity, 2)}</dd></div>
      </dl>
      <p className="prose-text mt-2 text-sm" aria-live="polite">
        {better === "neither" ? "The two deposits pay the same. No reason for money to move: this is uncovered interest parity."
          : better === "foreign" ? "The foreign deposit wins, so money flows out of home assets. Selling the home currency pushes e down until the expected move cancels the gain."
          : "The home deposit wins, so money flows in. Buying the home currency pushes e up today, which lowers the expected rise to come."}
        {" "}Parity says e<sub>1</sub> = e<sub>0</sub>(1 + r<sub>foreign</sub>) ÷ (1 + r<sub>home</sub>): the currency with the higher interest rate is expected to depreciate.
      </p>
    </Fig>
  );
}

/* ---------- Carry trade ---------- */
export function CarryWidget() {
  const [rF, setRF] = useState(0.1);
  const [rT, setRT] = useState(5.3);
  const [move, setMove] = useState(0);
  const [lev, setLev] = useState(5);
  const c = carry(rF, rT, move, lev);
  const gain = c.onCapital * 100;
  const scale = Math.max(40, Math.abs(gain));
  return (
    <Fig title="Borrow cheap, lend dear, and wait" note="Round rates for illustration (a funding currency near zero, a target near a US-style policy rate). e is target-currency units per funding-currency unit, so a rise is the funding currency strengthening. Leverage is position size per unit of your own money. Not advice.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="cr-f" label="Interest rate on the funding currency (yen-like)" value={rF} min={0} max={3} step={0.1} show={`${rF.toFixed(1)}%`} onChange={setRF} />
        <Ctl id="cr-t" label="Interest rate on the target currency (dollar-like)" value={rT} min={0} max={10} step={0.1} show={`${rT.toFixed(1)}%`} onChange={setRT} />
        <Ctl id="cr-m" label="Funding currency's move against the target over the year" value={move} min={-5} max={20} step={0.5} show={pct(move)} onChange={setMove} />
        <Ctl id="cr-l" label="Leverage" value={lev} min={1} max={10} step={1} show={`${lev}×`} onChange={setLev} />
      </div>
      <div className="mt-3 text-sm" aria-live="polite">
        <p className="num">Carry earned if nothing moves: <span className="font-semibold">{pct(100 * carry(rF, rT, 0, 1).perUnit, 2)}</span> on each unit borrowed.</p>
        <p className="num">The funding currency must rise by {c.breakeven.toFixed(2)}% to wipe it out (the parity move).</p>
        <p className="num">Result on your own money at {lev}× leverage: <span className={`font-semibold ${gain < 0 ? "text-lm" : ""}`}>{pct(gain, 1)}</span></p>
      </div>
      <div className="mt-2 grid grid-cols-2" role="img" aria-label={`Result on own money ${gain.toFixed(1)} percent`}>
        <div className="flex h-3 justify-end bg-wash">{gain < 0 && <div style={{ width: `${Math.min(100, (-gain / scale) * 100)}%`, background: "var(--c-lm)" }} />}</div>
        <div className="h-3 bg-wash">{gain > 0 && <div style={{ width: `${Math.min(100, (gain / scale) * 100)}%`, background: "var(--c-fe)" }} />}</div>
      </div>
      <p className="prose-text mt-2 text-sm">
        The gain is small and steady, the loss is large and sudden. In the real August 2024 unwind the yen rose about 14 percent against the dollar in a few weeks (from roughly 162 to roughly 142 yen per dollar, from memory and approximate): at 5× leverage that costs about 38 percent of the capital, and at 10× more than 70 percent. Try a move of 14.
      </p>
    </Fig>
  );
}
