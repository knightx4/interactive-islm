"use client";

import CurvesFigure from "@/components/learn/CurvesFigure";
import { type Frame, type Params, type Simulation } from "@/lib/macro/model";
import { regimes, type Run, type RegimeChoice } from "@/lib/macro/sim";
import { viewAt } from "@/lib/macro/sim";
import { cn } from "@/lib/utils";

const f1 = (x: number) => x.toFixed(1);
const f2 = (x: number) => x.toFixed(2);
const f3 = (x: number) => x.toFixed(3);
const sgn = (x: number) => (x > 0.05 ? "+" : "") + f1(x);

function Card({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0">
      <h3 className="text-base font-semibold">{title}</h3>
      {note && <p className="mt-0.5 text-sm text-muted-foreground">{note}</p>}
      <table className="num mt-2 w-full text-sm"><tbody>{children}</tbody></table>
    </section>
  );
}
function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <tr className={cn("border-b border-rule", strong && "border-t border-ink font-semibold")}>
      <th scope="row" className={cn("py-0.5 pr-3 text-left font-normal", !strong && "text-muted-foreground")}>{label}</th>
      <td className="py-0.5 text-right">{value}</td>
    </tr>
  );
}

/** e, the price levels, the real exchange rate with an over- or undervaluation reading, and uncovered interest parity. */
export function ExchangeRateCard({ params, frame }: { params: Params; frame: Frame }) {
  const Pfor = (frame.E * frame.P) / frame.q;
  const over = frame.q > 1.02, under = frame.q < 0.98;
  const e1 = frame.E * (1 + frame.rp / 100) / (1 + frame.r / 100);
  const gap = frame.r - frame.rp;
  const pegged = params.regime === "fixed";
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card title="Exchange rate and RER" note="e is foreign currency per unit of home currency, so a rise in e is an appreciation. RER = e × P_home ÷ P_foreign.">
        <Row label="e (foreign per home)" value={f3(frame.E)} />
        <Row label="P_home" value={f3(frame.P)} />
        <Row label="P_foreign" value={f3(Pfor)} />
        <Row label="RER" value={f3(frame.q)} strong />
        <tr><td colSpan={2} className="pt-1 text-sm" aria-live="polite">
          {over ? "Overvalued: home goods are dear next to foreign ones, so net exports tend to fall." :
           under ? "Undervalued: home goods are cheap next to foreign ones, so net exports tend to rise." :
           "About right: home and foreign goods cost the same once converted."}
        </td></tr>
      </Card>
      <Card title="Uncovered interest parity" note="e₁ = e₀ (1 + r_foreign) ÷ (1 + r_home): the currency with the higher interest rate is expected to depreciate.">
        <Row label="e₀ (now)" value={f3(frame.E)} />
        <Row label="r_home (%)" value={f2(frame.r)} />
        <Row label="r_foreign (%)" value={f2(frame.rp)} />
        <Row label="e₁ (expected)" value={f3(e1)} strong />
        <tr><td colSpan={2} className="pt-1 text-sm">
          {Math.abs(gap) < 0.005 ? "Equal rates: no expected move." : gap > 0 ? "Home rate is higher: the home currency is expected to depreciate." : "Foreign rate is higher: the foreign currency is expected to depreciate, the home one to appreciate."}
          {pegged && " Under a peg the rate is held, so only a feared devaluation breaks parity."}
        </td></tr>
      </Card>
    </div>
  );
}

/** NX = x0 - m Y + m_p Y_p - σ (RER - 1) + trade policy, term by term. */
export function NetExportsCard({ params, frame }: { params: Params; frame: Frame }) {
  const income = -params.m * frame.Y;
  const partner = params.mp * frame.Yp;
  const rer = -params.sigma * (frame.q - 1);
  const policy = params.zt * (params.tariff - params.tariffP);
  const rest = frame.NX - income - partner - rer - policy;
  return (
    <Card title="Net exports, term by term" note="Home income raises imports; partner income raises our exports; tariffs on our exports cut NX; a real depreciation raises it.">
      <Row label="Autonomous (baseline demand)" value={sgn(rest)} />
      <Row label="Home income: imports (−m·Y)" value={sgn(income)} />
      <Row label="Partner income: our exports (+m_p·Y_p)" value={sgn(partner)} />
      <Row label="Real exchange rate (−σ·(RER − 1))" value={sgn(rer)} />
      <Row label="Trade policy (tariffs on us, ours)" value={sgn(policy)} />
      <Row label="NX" value={sgn(frame.NX)} strong />
    </Card>
  );
}

/** I = S + S_foreign, the current account CA = S - I, and the financial account. */
export function SavingIdentityCard({ params, frame }: { params: Params; frame: Frame }) {
  const S = frame.Y - frame.C - params.G;
  const Sf = frame.I - S;
  const CA = S - frame.I;
  return (
    <Card title="Where investment is funded" note={Sf > 0.05 ? "A trade deficit reads as foreign saving coming in to fund investment." : Sf < -0.05 ? "A trade surplus reads as our saving flowing abroad." : "Trade is balanced: investment is funded by our own saving."}>
      <Row label="Investment I" value={f1(frame.I)} />
      <Row label="National saving S" value={f1(S)} />
      <Row label="Foreign saving S_foreign (I − S)" value={sgn(Sf)} />
      <Row label="I = S + S_foreign" value={`${f1(frame.I)} = ${f1(S)} ${Sf < 0 ? "−" : "+"} ${f1(Math.abs(Sf))}`} strong />
      <Row label="Current account CA = S − I" value={sgn(CA)} />
      <Row label="Financial account (net capital inflow)" value={sgn(frame.FA)} />
      <Row label="Change in official reserves (CA + FA)" value={sgn(frame.dRes)} />
    </Card>
  );
}

/** Under a hard peg or a defended band, the balance of payments sets the money supply. */
export function PegCard({ run, frame }: { run: Run; frame: Frame }) {
  const { sim, ran, defended, state } = run;
  const hard = state.regime === "board" || state.regime === "dollar";
  if (ran !== "fixed") return null;
  const runOut = sim.frames.find((f) => f.t >= 1 && (f.devalued || f.Res <= 1e-6));
  const m0 = sim.baseline.Meff;
  return (
    <Card
      title={hard ? "The peg and the money supply" : "The band is being defended"}
      note={defended ? `The shock would push e past ${f2(defended.centre)} ± ${Math.round(100 * (defended.edge > defended.centre ? defended.edge / defended.centre - 1 : 1 - defended.edge / defended.centre))}%, so the edge, e = ${f2(defended.edge)}, is held like a peg.` : "With the rate held, a payments surplus adds money, prices rise and LM moves; a deficit drains reserves and money."}
    >
      <Row label="Money supply in force" value={`${f1(frame.Meff)} (was ${f1(m0)})`} />
      <Row label="Reserves" value={f1(frame.Res)} />
      <Row label="Change in reserves this period" value={sgn(frame.dRes)} />
      <tr><td colSpan={2} className="pt-1 text-sm" aria-live="polite">
        {runOut || sim.pegBreaks
          ? `Reserves would run out${runOut ? ` in period ${runOut.t}` : " in the long run"}: the peg can be defended only while they last.`
          : frame.dRes > 0.05 ? "A surplus: reserves and money rise." : frame.dRes < -0.05 ? "A deficit: reserves and money fall." : "Payments balance: money is steady."}
      </td></tr>
    </Card>
  );
}

/** The exchange-rate regime as a choice on a spectrum. */
export function RegimePicker({ value, onChange }: { value: RegimeChoice; onChange: (r: RegimeChoice) => void }) {
  const cur = regimes.find((r) => r.id === value)!;
  return (
    <fieldset className="space-y-1.5">
      <legend className="text-sm font-medium">Exchange-rate regime</legend>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground"><span>floats</span><span>fixed</span></div>
      <div className="grid grid-cols-5 gap-px border border-ink" role="radiogroup" aria-label="Exchange-rate regime, from free float to dollarization">
        {regimes.map((r) => (
          <button key={r.id} type="button" role="radio" aria-checked={r.id === value} onClick={() => onChange(r.id)}
            className={cn("px-0.5 py-1.5 text-[11px] leading-tight", r.id === value ? "bg-ink text-paper font-semibold" : "bg-paper hover:bg-rule/40")}>
            {r.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">{cur.text}</p>
    </fieldset>
  );
}

/** The home economy (US) beside a partner (Japan) sharing the world interest rate. */
export function TwoCountry({ run, t }: { run: Run; t: number }) {
  const { sim, foreign } = run;
  if (!foreign) return null;
  const home = viewAt(sim, t), away = viewAt(foreign, t);
  const row = (name: string, s: Simulation, v: ReturnType<typeof viewAt>) => (
    <tr key={name} className="border-b border-rule">
      <th scope="row" className="py-0.5 pr-3 text-left font-normal">{name}</th>
      <td className="py-0.5 text-right">{f1(v.frame.Y)}</td>
      <td className="py-0.5 text-right">{f2(v.frame.r)}</td>
      <td className="py-0.5 text-right">{sgn(v.frame.NX)}</td>
      <td className="py-0.5 text-right">{f3(v.frame.P)}</td>
    </tr>
  );
  return (
    <section className="mt-10 border-t border-rule pt-4" aria-label="Two economies sharing one world interest rate">
      <h2 className="text-2xl">Two economies, one world interest rate</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Capital moves freely between the home economy (the US) and a partner (Japan), so both face the same world rate. A future-productivity boom in the US raises
        investment demand there, which raises the world rate, lowers US net exports and raises Japan&apos;s. The drivers above move the US; Japan responds.
      </p>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <figure><figcaption className="mb-1 text-sm font-semibold">United States (home)</figcaption><CurvesFigure sim={sim} view={home} /></figure>
        <figure><figcaption className="mb-1 text-sm font-semibold">Japan (partner)</figcaption><CurvesFigure sim={foreign} view={away} /></figure>
      </div>
      <table className="num mt-3 w-full max-w-lg text-sm">
        <thead><tr className="border-b border-ink text-left"><th className="py-0.5 font-semibold">At the point on show</th><th className="py-0.5 text-right font-semibold">Y</th><th className="py-0.5 text-right font-semibold">r (%)</th><th className="py-0.5 text-right font-semibold">NX</th><th className="py-0.5 text-right font-semibold">P</th></tr></thead>
        <tbody>{row("United States", sim, home)}{row("Japan", foreign, away)}</tbody>
      </table>
    </section>
  );
}

