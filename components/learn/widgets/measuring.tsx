"use client";

import { useState } from "react";
import Chart from "@/components/chart/Chart";
import { Button } from "@/components/ui/button";
import {
  deflator, gdpFrom, inflation, nominalGDP, realGDP, threeWays, toyEconomy, years,
  basket,
} from "@/lib/learn/measure";
import { Ctl, Fig, f1, money } from "./ui";

/* ---------- 1. Three ways to count GDP ---------- */

function Bar({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr_4.5rem] items-center gap-2 text-sm">
      <span>{label}</span>
      <span className="h-3 bg-wash" aria-hidden>
        <span className="block h-3" style={{ width: `${Math.min(100, (100 * value) / max)}%`, background: tone }} />
      </span>
      <span className="num text-right font-semibold">{money(value)}</span>
    </div>
  );
}

export function ThreeWaysWidget() {
  const [po, setPo] = useState(2);
  const [qo, setQo] = useState(100);
  const [pj, setPj] = useState(5);
  const [qj, setQj] = useState(80);
  const [soldPct, setSoldPct] = useState(100);
  const [wage, setWage] = useState(60);
  const sold = Math.round((qj * soldPct) / 100);
  const t = threeWays({ po, qo, pj, qj, sold, wageShare: wage / 100 });
  const max = Math.max(t.production, t.expenditure, t.income, 1);
  return (
    <Fig title="A two-firm economy" note="Invented numbers. The farm sells all its oranges to the juice maker; the juice maker sells juice to households. Change any price or quantity: the three totals stay equal.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="tw-po" label="Price of an orange" value={po} min={1} max={5} step={0.5} show={`$${po}`} onChange={setPo} />
        <Ctl id="tw-qo" label="Oranges grown" value={qo} min={20} max={200} step={10} onChange={setQo} />
        <Ctl id="tw-pj" label="Price of a glass of juice" value={pj} min={2} max={12} step={0.5} show={`$${pj}`} onChange={setPj} />
        <Ctl id="tw-qj" label="Glasses of juice made" value={qj} min={20} max={200} step={10} onChange={setQj} />
        <Ctl id="tw-sold" label="Share of the juice households buy this year" value={soldPct} min={0} max={100} step={10} show={`${soldPct}%`} onChange={setSoldPct} />
        <Ctl id="tw-wage" label="Share of income paid as wages" value={wage} min={0} max={100} step={10} show={`${wage}%`} onChange={setWage} />
      </div>
      <div className="mt-4 space-y-1.5" aria-live="polite">
        <Bar label="Production: value added" value={t.production} max={max} tone="var(--c-is)" />
        <Bar label="Expenditure" value={t.expenditure} max={max} tone="var(--c-lm)" />
        <Bar label="Income" value={t.income} max={max} tone="var(--c-fe)" />
      </div>
      <dl className="num mt-3 grid grid-cols-1 gap-x-8 gap-y-0.5 text-sm md:grid-cols-3">
        <div><dt className="font-semibold">Value added</dt><dd>Farm {money(t.valueAddedFarm)} + juice maker {money(t.valueAddedJuice)}</dd></div>
        <div><dt className="font-semibold">Spending</dt><dd>Households {money(t.consumption)} + unsold juice in stock {money(t.inventory)}</dd></div>
        <div><dt className="font-semibold">Income</dt><dd>Wages {money(t.wages)} + profits {money(t.profits)}</dd></div>
      </dl>
      <p className="mt-2 text-sm">Oranges worth {money(t.intermediate)} are bought by the juice maker. They are not counted again in spending, because they are already inside the juice price.</p>
      <p className="mt-1 text-sm font-semibold">{t.production === t.expenditure && Math.abs(t.income - t.production) < 1e-6 ? "All three totals are equal." : "Totals differ."}</p>
    </Fig>
  );
}

/* ---------- 2. Sort spending into C, I, G, NX ---------- */

type Bucket = "C" | "I" | "G" | "NX" | "None";
const buckets: Bucket[] = ["C", "I", "G", "NX", "None"];
const sortItems: { text: string; amount: number; answer: Bucket; why: string }[] = [
  { text: "A family buys a new car made at a domestic factory", amount: 30000, answer: "C", why: "Households' purchases of new goods and services are consumption." },
  { text: "A neighbour sells a used car to a friend", amount: 8000, answer: "None", why: "The car was counted when it was built. A used sale only moves ownership. A dealer's fee for arranging it would count, as a service." },
  { text: "A developer finishes a new house and a family buys it", amount: 400000, answer: "I", why: "New housing is counted as investment, even when a household is the buyer." },
  { text: "A firm buys a new machine for its factory", amount: 90000, answer: "I", why: "Spending on new capital is investment." },
  { text: "A government pays pensions to retired people", amount: 20000, answer: "None", why: "A transfer buys no output. It counts later, as consumption, when recipients spend it." },
  { text: "A city pays a bus driver's wages", amount: 50000, answer: "G", why: "Government purchases of goods and services, including pay for its workers, are G." },
  { text: "A foreign airline buys a plane built at home", amount: 100000000, answer: "NX", why: "Exports are home output bought abroad, so they enter NX with a plus sign." },
  { text: "A household's spending on a foreign-made coat: the part that has to be taken back out", amount: 200, answer: "NX", why: "The coat is counted in C when it is bought, then removed by the minus sign on imports in NX, because it was not made at home." },
  { text: "A shop makes 100 more jackets than it sells this year", amount: 5000, answer: "I", why: "Unsold goods added to stock are counted as inventory investment, so output made equals output counted." },
  { text: "A student buys shares of a company on the stock market", amount: 1000, answer: "None", why: "A purchase of an existing financial asset is a swap of ownership, not new output." },
];

export function ExpenditureSorter() {
  const [pick, setPick] = useState<Record<number, Bucket>>({});
  const [checked, setChecked] = useState(false);
  const score = sortItems.filter((s, i) => pick[i] === s.answer).length;
  return (
    <Fig title="Which part of GDP, if any?" note="Pick a bucket for each item, then check. NX = exports minus imports. Dollar amounts are illustrative.">
      <ul className="divide-y divide-rule">
        {sortItems.map((s, i) => {
          const ok = checked && pick[i] === s.answer;
          const bad = checked && pick[i] !== s.answer;
          return (
            <li key={i} className="py-2">
              <div className="prose-text text-sm">{s.text}</div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5" role="group" aria-label={`Bucket for item ${i + 1}`}>
                {buckets.map((b) => (
                  <Button key={b} type="button" size="sm" variant={pick[i] === b ? "default" : "outline"} aria-pressed={pick[i] === b} disabled={checked}
                    onClick={() => setPick((p) => ({ ...p, [i]: b }))}>{b === "None" ? "Not counted" : b}</Button>
                ))}
                {checked && <span className={`ml-1 text-sm ${ok ? "font-semibold text-fe" : "text-lm"}`}>{ok ? "Right." : `Answer: ${s.answer === "None" ? "not counted" : s.answer}.`}</span>}
              </div>
              {bad || ok ? <p className="mt-1 text-sm text-muted-foreground">{s.why}</p> : null}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex items-center gap-3">
        {checked ? (
          <>
            <p className="text-sm font-semibold" aria-live="polite">{score} of {sortItems.length} in the right bucket.</p>
            <Button type="button" size="sm" variant="outline" onClick={() => { setChecked(false); setPick({}); }}>Start again</Button>
          </>
        ) : (
          <Button type="button" size="sm" disabled={Object.keys(pick).length < sortItems.length} onClick={() => setChecked(true)}>Check my sorting</Button>
        )}
      </div>
    </Fig>
  );
}

/* ---------- 3. Imports in the identity ---------- */

export function ImportsDemo() {
  const [imports, setImports] = useState(200);
  const [displaced, setDisplaced] = useState(0);
  const base = { C: 700, I: 200, G: 250, X: 150 };
  // Extra spending on imports is added to C (people buy more) and to IM; "displaced" removes domestic output people no longer buy.
  const C = base.C + imports - 200 - displaced;
  const gdp = gdpFrom({ ...base, C, IM: imports });
  const start = gdpFrom({ ...base, IM: 200 });
  return (
    <Fig title="Do imports lower GDP?" note="Invented economy, in billions. Spending on imports is counted inside C, I and G, then subtracted once as IM.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="im-m" label="Imports bought (IM)" value={imports} min={0} max={400} step={20} show={`$${imports}bn`} onChange={setImports} />
        <Ctl id="im-d" label="Domestic purchases given up to buy them" value={displaced} min={0} max={200} step={20} show={`$${displaced}bn`} onChange={(v) => setDisplaced(v)} />
      </div>
      <p className="num mt-3 text-sm">
        GDP = C {C} + I {base.I} + G {base.G} + X {base.X} − IM {imports} = <span className="font-semibold">{gdp}</span>
        <span className="text-muted-foreground"> (start: {start})</span>
      </p>
      <p className="prose-text mt-2 text-sm">
        {displaced === 0
          ? "Households spend extra on imports: C rises by the same amount that IM subtracts, so GDP does not move. Imports are not a hole in GDP."
          : `Here households gave up ${displaced} of domestic goods to buy imports. GDP falls by ${displaced}: the loss is the home output not made, not the import figure itself.`}
      </p>
    </Fig>
  );
}

/* ---------- 4. Nominal against real, with a base-year slider ---------- */

export function RealNominalWidget() {
  const [base, setBase] = useState(0);
  const nom = years.map((_, t) => nominalGDP(toyEconomy, t));
  const real = years.map((_, t) => realGDP(toyEconomy, t, base));
  const defl = years.map((_, t) => deflator(toyEconomy, t, base));
  const growth = 100 * (real[4] / real[0] - 1);
  const pts = (arr: number[]) => arr.map((y, t) => ({ x: years[t], y }));
  return (
    <Fig title="Nominal and real output of a three-good economy" note="Toy data for phones, bread and haircuts, not a real economy. Real GDP values each year's quantities at the prices of the base year you pick.">
      <Ctl id="rn-base" label="Base year (prices held at this year's level)" value={years[base]} min={2020} max={2024} onChange={(v) => setBase(v - 2020)} />
      <Chart
        series={[
          { id: "nom", curve: "lm", label: "Nominal", points: pts(nom) },
          { id: "real", curve: "is", label: `Real, ${years[base]} prices`, points: pts(real) },
        ]}
        xDomain={[2020, 2024]} yDomain={[0, Math.ceil(Math.max(...nom, ...real) / 1000) * 1000]} xLabel="Year" yLabel="Value of output ($)"
        title="Nominal GDP and real GDP of the toy economy over 2020 to 2024" aspect={0.5} xTicks={4}
      />
      <table className="num mt-2 w-full text-sm">
        <thead>
          <tr className="border-b border-ink text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="py-1 font-semibold">Year</th><th scope="col" className="font-semibold">Nominal</th>
            <th scope="col" className="font-semibold">Real</th><th scope="col" className="font-semibold">Deflator</th>
          </tr>
        </thead>
        <tbody>
          {years.map((y, t) => (
            <tr key={y} className={`border-b border-rule ${t === base ? "bg-wash font-semibold" : ""}`}>
              <td className="py-0.5">{y}{t === base ? " (base)" : ""}</td><td>{money(nom[t])}</td><td>{money(real[t])}</td><td>{f1(defl[t])}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="prose-text mt-2 text-sm">
        Real output grows <span className="font-semibold">{f1(growth)}%</span> from 2020 to 2024 with {years[base]} prices. Move the base year: the answer changes
        because phones fell in price and boomed in quantity, so a base with dear phones gives that boom more weight. In the base year real equals nominal and the deflator is 100.
      </p>
    </Fig>
  );
}

/* ---------- 5. The CPI basket ---------- */

export function CpiBasketWidget() {
  const [swap, setSwap] = useState(0);
  const [quality, setQuality] = useState(0);
  const inf = inflation(swap, quality);
  return (
    <Fig title="A fixed shopping basket" note="Invented prices in year 0 and year 1. A price index prices the same basket in both years; the cost of living may rise by less.">
      <table className="num w-full text-sm">
        <thead>
          <tr className="border-b border-ink text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="py-1 font-semibold">Item</th><th scope="col" className="font-semibold">Basket qty</th>
            <th scope="col" className="font-semibold">Price, year 0</th><th scope="col" className="font-semibold">Price, year 1</th>
          </tr>
        </thead>
        <tbody>
          {basket.map((b) => (
            <tr key={b.name} className="border-b border-rule"><td className="py-0.5">{b.name}</td><td>{b.q}</td><td>${b.p0}</td><td>${b.p1}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="cpi-sub" label="Substitution: kg of beef swapped for chicken once beef is dearer" value={swap} min={0} max={8} show={`${swap} kg`} onChange={setSwap} />
        <Ctl id="cpi-q" label="Share of the laptop's price rise that is a better machine" value={quality} min={0} max={100} step={10} show={`${quality}%`} onChange={setQuality} />
      </div>
      <dl className="num mt-3 grid gap-x-8 gap-y-1 text-sm md:grid-cols-3" aria-live="polite">
        <div><dt className="font-semibold">Fixed-basket index</dt><dd>{f1(inf.fixed)}% inflation</dd></div>
        <div><dt className="font-semibold">With substitution</dt><dd>{f1(inf.adjusted)}%</dd></div>
        <div><dt className="font-semibold">Substitution and quality</dt><dd>{f1(inf.corrected)}%</dd></div>
      </dl>
      <p className="prose-text mt-2 text-sm">
        Overstatement from the fixed basket: <span className="font-semibold">{f1(inf.fixed - inf.corrected)} points</span>.
        A third source of bias, new goods, cannot be shown here: a product missing from the basket in year 0 has no year-0 price to compare with, so the index misses the gain from its arrival.
      </p>
    </Fig>
  );
}
