"use client";

import { useState } from "react";
import Chart from "@/components/chart/Chart";
import { lafferPeak, lafferRevenue, okunGap, okunUnemployment, phillips, usUnemployment } from "@/lib/learn/labour";
import { baselineEconomy, employmentFE, isR, lmR, mpl, output, wageFE, wageForSupply, Ystar } from "@/lib/macro/model";
import { Ctl, Fig, f1 } from "./ui";

const grid = (lo: number, hi: number, n = 40) => Array.from({ length: n + 1 }, (_, i) => lo + ((hi - lo) * i) / n);
const base = baselineEconomy("closed");

/* ---------- Linked panels: labour market, production function, FE ---------- */
export function LinkedPanels() {
  const [dA, setDA] = useState(0);
  const [dK, setDK] = useState(0);
  const [dN, setDN] = useState(0);
  const [tax, setTax] = useState(20);
  const p = { ...base, A: base.A * (1 + dA / 100), K: base.K * (1 + dK / 100), Ns0: base.Ns0 * (1 + dN / 100), tauL: tax / 100 };
  const N0 = employmentFE(base), N1 = employmentFE(p);
  const w0 = wageFE(base), w1 = wageFE(p);
  const Y0 = Ystar(base), Y1 = Ystar(p);
  const ns = grid(60, 150);
  const ys = grid(85, 125);
  return (
    <Fig title="Move a driver, and watch all three panels move" note="Index units: baseline Y* = 100, N* = 100, r* = 5%. Dashed lines are the baseline. IS and LM stay put, because none of these drivers touches them.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="lp-a" label="Productivity, A" value={dA} min={-10} max={10} show={`${dA > 0 ? "+" : ""}${dA}%`} onChange={setDA} />
        <Ctl id="lp-k" label="Capital, K" value={dK} min={-10} max={10} show={`${dK > 0 ? "+" : ""}${dK}%`} onChange={setDK} />
        <Ctl id="lp-n" label="Labour supply, at each wage" value={dN} min={-10} max={10} show={`${dN > 0 ? "+" : ""}${dN}%`} onChange={setDN} />
        <Ctl id="lp-t" label="Tax on labour income" value={tax} min={0} max={50} step={5} show={`${tax}%`} onChange={setTax} />
      </div>
      <div className="mt-3 grid gap-4 lg:grid-cols-3">
        <div>
          <div className="text-sm font-semibold">1. Labour market</div>
          <Chart
            series={[
              { id: "d0", curve: "labour", ghost: true, points: ns.map((x) => ({ x, y: mpl(base, x) })) },
              { id: "s0", curve: "ink", ghost: true, points: ns.map((x) => ({ x, y: wageForSupply(base, x) })) },
              { id: "d", curve: "labour", label: "Nd", points: ns.map((x) => ({ x, y: mpl(p, x) })) },
              { id: "s", curve: "ink", label: "Ns", points: ns.map((x) => ({ x, y: wageForSupply(p, x) })) },
            ]}
            marks={[{ x: N0, y: w0, hollow: true, guides: false }, { x: N1, y: w1, label: "E", dy: -10 }]}
            xDomain={[60, 150]} yDomain={[0.4, 1.2]} xLabel="Employment, N" yLabel="Real wage, w" aspect={0.9} xTicks={3}
            title="Labour demand and labour supply meet at the full-employment wage and employment"
          />
        </div>
        <div>
          <div className="text-sm font-semibold">2. Production function</div>
          <Chart
            series={[
              { id: "f0", curve: "ink", ghost: true, points: ns.map((x) => ({ x, y: output(base, x) })) },
              { id: "f", curve: "fe", label: "Y", points: ns.map((x) => ({ x, y: output(p, x) })) },
            ]}
            marks={[{ x: N0, y: Y0, hollow: true, guides: false }, { x: N1, y: Y1, label: "Y*", dy: -10 }]}
            xDomain={[60, 150]} yDomain={[70, 140]} xLabel="Employment, N" yLabel="Output, Y" aspect={0.9} xTicks={3}
            title="Output at the full-employment level of employment"
          />
        </div>
        <div>
          <div className="text-sm font-semibold">3. IS-LM-FE</div>
          <Chart
            series={[
              { id: "is", curve: "is", label: "IS", points: ys.map((x) => ({ x, y: isR(base, x) })) },
              { id: "lm", curve: "lm", label: "LM", points: ys.map((x) => ({ x, y: lmR(base, x, base.M) })) },
            ]}
            refLines={[
              { orientation: "v", value: Y0, curve: "fe", ghost: true },
              { orientation: "v", value: Y1, curve: "fe", label: "FE" },
            ]}
            xDomain={[85, 125]} yDomain={[0, 10]} xLabel="Output, Y" yLabel="Real interest rate, r (%)" aspect={0.9} xTicks={3}
            title="The FE line sits at full-employment output and moves when the labour market moves"
          />
        </div>
      </div>
      <p className="num mt-2 text-sm" aria-live="polite">
        Employment {f1(N0)} → {f1(N1)}; real wage {w0.toFixed(2)} → {w1.toFixed(2)}; full-employment output {f1(Y0)} → {f1(Y1)}.
      </p>
    </Fig>
  );
}

/* ---------- Laffer curve ---------- */
export function LafferWidget() {
  const [eL, setEL] = useState(0.5);
  const [t, setT] = useState(20);
  const ts = grid(0, 0.95, 38);
  const peak = lafferPeak(eL);
  const rev = (x: number) => lafferRevenue(x, eL);
  const ymax = Math.ceil(rev(peak) * 1.1);
  return (
    <Fig title="Taxing work: output and revenue" note="Index units. A higher tax on wages lowers the after-tax wage, so fewer people work. Revenue rises with the rate at first, then falls once employment shrinks fast enough.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="lf-e" label="How strongly labour supply responds to the after-tax wage" value={eL} min={0.2} max={2} step={0.1} onChange={setEL} />
        <Ctl id="lf-t" label="Tax rate on wages" value={t} min={0} max={90} step={5} show={`${t}%`} onChange={setT} />
      </div>
      <Chart
        series={[{ id: "rev", curve: "labour", label: "Revenue", points: ts.map((x) => ({ x: x * 100, y: rev(x) })) }]}
        marks={[{ x: t, y: rev(t / 100), label: `${t}%`, dy: -10 }, { x: peak * 100, y: rev(peak), hollow: true, label: "peak", dy: -10, guides: false }]}
        xDomain={[0, 95]} yDomain={[0, ymax]} xLabel="Tax rate on labour income (%)" yLabel="Tax revenue" aspect={0.5}
        title="Tax revenue against the tax rate rises, peaks, then falls"
      />
      <p className="prose-text text-sm" aria-live="polite">
        At {t}% the revenue is {f1(rev(t / 100))} and full-employment output is {f1(Ystar({ ...base, tauL: t / 100, eL }))}. In this toy economy the revenue peak is at about {Math.round(peak * 100)}%.
        Past the peak, cutting the rate would raise revenue. The more responsive labour supply is, the earlier the peak. Where real economies sit is an empirical question that this model does not answer.
      </p>
    </Fig>
  );
}

/* ---------- Okun converter ---------- */
export function OkunConverter() {
  const [un, setUn] = useState(5);
  const [u, setU] = useState(7);
  const [coef, setCoef] = useState(2.5);
  const [mode, setMode] = useState<"u" | "gap">("u");
  const [gapIn, setGapIn] = useState(-5);
  const gap = mode === "u" ? okunGap(u, un, coef) : gapIn;
  const uOut = mode === "u" ? u : okunUnemployment(gapIn, un, coef);
  const Y = Ystar(base) * (1 + gap / 100);
  return (
    <Fig title="Okun's law converter" note="Okun's law is a rule of thumb: the gap in percent of FE ≈ −2.5 × (u − natural rate). The coefficient is not a constant of nature; estimates vary by country and period.">
      <div className="mb-2 flex gap-4 text-sm" role="radiogroup" aria-label="Direction of conversion">
        <label><input type="radio" name="okun" checked={mode === "u"} onChange={() => setMode("u")} className="mr-1 accent-[var(--ink)]" />Unemployment → output gap</label>
        <label><input type="radio" name="okun" checked={mode === "gap"} onChange={() => setMode("gap")} className="mr-1 accent-[var(--ink)]" />Output gap → unemployment</label>
      </div>
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Ctl id="ok-un" label="Natural rate of unemployment" value={un} min={3} max={8} step={0.1} show={`${un.toFixed(1)}%`} onChange={setUn} />
        <Ctl id="ok-c" label="Okun coefficient" value={coef} min={1} max={4} step={0.1} show={coef.toFixed(1)} onChange={setCoef} />
        {mode === "u"
          ? <Ctl id="ok-u" label="Actual unemployment rate" value={u} min={2} max={15} step={0.1} show={`${u.toFixed(1)}%`} onChange={setU} />
          : <Ctl id="ok-g" label="Output relative to FE" value={gapIn} min={-15} max={5} step={0.5} show={`${gapIn.toFixed(1)}%`} onChange={setGapIn} />}
      </div>
      <p className="num mt-3 text-sm" aria-live="polite">
        Unemployment {uOut.toFixed(1)}% is {(uOut - un).toFixed(1)} points {uOut >= un ? "above" : "below"} natural, so output is <span className="font-semibold">{Math.abs(gap).toFixed(1)}% {gap <= 0 ? "below" : "above"} FE</span>.
        With Y* = 100 in the model, that is Y ≈ {f1(Y)}.
      </p>
    </Fig>
  );
}

/* ---------- Phillips curve with expectations ---------- */
export function PhillipsWidget() {
  const [piE, setPiE] = useState(2);
  const [un, setUn] = useState(5);
  const [beta, setBeta] = useState(0.5);
  const us = grid(2, 10);
  return (
    <Fig title="The Phillips curve and expected inflation" note="Inflation = expected inflation − β × (u − natural rate). A stylised relation: with u at the natural rate, inflation equals what people expect. Dashed: the curve when expected inflation is 2%.">
      <div className="grid gap-x-8 gap-y-3 md:grid-cols-3">
        <Ctl id="ph-e" label="Expected inflation" value={piE} min={0} max={8} step={0.5} show={`${piE}%`} onChange={setPiE} />
        <Ctl id="ph-n" label="Natural rate" value={un} min={3} max={8} step={0.5} show={`${un}%`} onChange={setUn} />
        <Ctl id="ph-b" label="Slope β" value={beta} min={0.2} max={1.5} step={0.1} onChange={setBeta} />
      </div>
      <Chart
        series={[
          { id: "p0", curve: "ink", ghost: true, points: us.map((x) => ({ x, y: phillips(2, x, 5, 0.5) })) },
          { id: "p", curve: "lm", label: "Phillips", points: us.map((x) => ({ x, y: phillips(piE, x, un, beta) })) },
        ]}
        refLines={[{ orientation: "v", value: un, curve: "fe", label: "natural u" }]}
        marks={[{ x: un, y: piE, label: "u = natural", dy: -10 }]}
        xDomain={[2, 10]} yDomain={[-4, 10]} xLabel="Unemployment rate (%)" yLabel="Inflation (%)" aspect={0.5}
        title="Inflation against unemployment: the curve shifts up one for one with expected inflation"
      />
      <p className="prose-text text-sm">When expected inflation rises, the whole curve moves up. Pushing unemployment below the natural rate buys extra inflation only while the expectation lags. Once people expect it, the same low unemployment brings still more.</p>
    </Fig>
  );
}

/* ---------- Real data: US unemployment 2020 to 2025 ---------- */
export function UsUnemployment() {
  const [natural, setNatural] = useState(4.3);
  const peak = usUnemployment.reduce((a, b) => (b.u > a.u ? b : a));
  const last = usUnemployment[usUnemployment.length - 1];
  return (
    <Fig title="US unemployment rate, 2020 to 2025" note="Selected months read from memory of the BLS series (seasonally adjusted civilian rate), approximate to a few tenths, not a substitute for the BLS data. The natural rate is not observed; the line is an assumption you can move.">
      <Chart
        series={[{ id: "u", curve: "labour", label: "US rate", points: usUnemployment.map((d) => ({ x: d.x, y: d.u })) }]}
        refLines={[{ orientation: "h", value: natural, curve: "fe", label: "natural" }]}
        marks={[{ x: peak.x, y: peak.u, label: `${peak.u}%`, dx: 8, dy: 4 }]}
        xDomain={[2020, 2026]} yDomain={[0, 16]} xLabel="Year" yLabel="Unemployment rate (%)" aspect={0.5} xTicks={6}
        title="US unemployment jumped to about 15 percent in April 2020, then fell back below 4 percent by 2022"
      />
      <Ctl id="us-n" label="Assumed natural rate" value={natural} min={3.5} max={5.5} step={0.1} show={`${natural.toFixed(1)}%`} onChange={setNatural} />
      <p className="prose-text mt-2 text-sm">
        Unemployment went from about 3.5% in February 2020 to about {peak.u}% in April, the fastest rise in the series, as businesses shut. By late 2021 it was near 4%, and in 2022 and 2023 it sat around 3.5%, below most estimates of the natural rate.
        By the latest points shown ({last.u}%) it had drifted back up toward it. With a natural rate of {natural.toFixed(1)}% and a coefficient of 2.5, Okun&apos;s law would put output {(2.5 * (peak.u - natural)).toFixed(0)}% below FE in April 2020.
        Real GDP in fact fell about 10% from its peak to its trough that spring. The rule overshoots here because many of the unemployed were temporarily laid off and expected to be recalled, and Okun&apos;s ratio was fitted to ordinary recessions.
      </p>
    </Fig>
  );
}
