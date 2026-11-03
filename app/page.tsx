"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ModelControls from "@/components/islm/ModelControls";
import ExpenditureIdentityCard from "@/components/islm/ExpenditureIdentityCard";
import PhaseBar from "@/components/islm/PhaseBar";
import { GLIDE_FAST_MS, GLIDE_SLOW_MS, usePlayer } from "@/components/islm/usePlayer";
import { ScenarioChip } from "@/components/ui/scenario-chip";
import { ResetPill } from "@/components/ui/reset-pill";
import CurvesFigure from "@/components/learn/CurvesFigure";
import SideMarkets from "@/components/learn/SideMarkets";
import { ExchangeRateCard, NetExportsCard, PegCard, SavingIdentityCard, TwoCountry } from "@/components/islm/OpenPanels";
import TimePath from "@/components/learn/TimePath";
import {
  baselineState, isBaseline, run, setCause, setParent, viewAt, isHardPeg, type ParentId, type RegimeChoice, type SimState,
} from "@/lib/macro/sim";
import { scenarios, stateForScenario } from "@/lib/macro/scenarios";
import { SPEED_FAST, SPEED_SLOW, adjustsAtOnce, headlineFor, settleIndex, type Phase } from "@/lib/macro/playback";
import { decodeState, encodeState } from "@/lib/macro/simUrl";

function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(min-width: 1024px)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
}

export default function HomePage() {
  const [state, setState] = useState<SimState>(baselineState);
  const [ready, setReady] = useState(false);
  /** The scenario chip last played, and whether the sliders have been edited since. */
  const [scenario, setScenario] = useState<{ id: string; edited: boolean } | null>(null);

  // read the scenario from the link once, then keep the address in step without adding history entries
  useEffect(() => {
    setState(decodeState(window.location.search));
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const q = encodeState(state);
    const url = window.location.pathname + (q ? `?${q}` : "") + window.location.hash;
    if (url !== window.location.pathname + window.location.search + window.location.hash) window.history.replaceState(window.history.state, "", url);
  }, [state, ready]);

  // the solution depends on everything except the playback position
  const key = JSON.stringify([state.offsets, state.causes, state.speed, state.open, state.regime, state.mobility, state.partner]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rn = useMemo(() => run(state), [key]);
  const last = rn.length - 1;
  const settle = useMemo(() => settleIndex(rn.sim), [rn]);
  const atRest = isBaseline(state);
  // nothing has moved: the economy sits at A whatever the playback position says
  const shownT = atRest ? 0 : Math.min(state.t, last);
  const view = viewAt(rn.sim, shownT);
  const atOnce = adjustsAtOnce(state.speed);
  const glideMs = atOnce ? GLIDE_FAST_MS : GLIDE_SLOW_MS;

  const onT = useCallback((t: number) => setState((s) => ({ ...s, t })), []);
  const player = usePlayer(onT);
  const edit = useCallback((f: (s: SimState) => SimState) => { player.stop(); setScenario((c) => (c ? { ...c, edited: true } : c)); setState(f); }, [player]);
  const onParent = (id: ParentId, v: number) => edit((s) => setParent(s, id, v));
  const onCause = (id: string, v: number) => edit((s) => setCause(s, id, v));
  const onOpen = (open: boolean) => edit((s) => ({ ...s, open, t: 1 }));
  const onRegime = (regime: RegimeChoice) => edit((s) => ({ ...s, regime, t: 1 }));
  const onMobility = (mobility: number) => edit((s) => ({ ...s, mobility, t: 1 }));
  const onPartner = (partner: boolean) => edit((s) => ({ ...s, partner, t: 1 }));
  const onReset = () => { player.stop(); setScenario(null); setState((s) => ({ ...baselineState(), speed: s.speed, t: 0 })); };
  const onAdjust = (fast: boolean) => setState((s) => ({ ...s, speed: fast ? SPEED_FAST : SPEED_SLOW }));

  const playScenario = (id: string) => {
    const sc = scenarios.find((q) => q.id === id)!;
    const st = stateForScenario(sc, state.speed);
    const nrn = run(st);
    setScenario({ id, edited: false });
    setState(st);
    player.playAll(settleIndex(nrn.sim), nrn.length - 1, adjustsAtOnce(st.speed) ? GLIDE_FAST_MS : GLIDE_SLOW_MS);
  };
  const onPhase = (p: Phase) => {
    if (p === "A") player.goA();
    else if (p === "B") player.goB();
    else player.goC(shownT, settle, last, glideMs);
  };
  const onPlay = () => player.playAll(settle, last, glideMs);

  const isDesktop = useIsDesktop();
  const [sheetOpen, setSheetOpen] = useState(false);
  const controls = <ModelControls state={state} onParent={onParent} onCause={onCause} onOpen={onOpen} onRegime={onRegime} onMobility={onMobility} onPartner={onPartner} onReset={onReset} price={view.frame.P} />;

  const headline = headlineFor(state, view.at, view.frame.Y, view.frame.Ystar);
  const subline = `Y ${view.frame.Y.toFixed(1)} · Y* ${view.frame.Ystar.toFixed(1)} · index units, not real data`;
  const chartLabel = `IS, LM and FE curves with the points A, B and C. ${headline}.`;

  return (
    <div className="mx-auto w-full max-w-[1360px] px-4 pb-24 pt-6 lg:pb-16 md:px-8">
      <section aria-label="Scenarios" className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        <span className="mr-1 shrink-0 text-[13px] text-muted-foreground">Try a scenario</span>
        {scenarios.map((sc) => (
          <ScenarioChip key={sc.id} active={scenario?.id === sc.id} onClick={() => playScenario(sc.id)}>{sc.name}</ScenarioChip>
        ))}
        <ResetPill className="md:ml-auto" onClick={onReset} />
      </section>

      <div className="mt-6 flex flex-wrap items-start gap-6 lg:flex-nowrap">
        <div className="min-w-0 flex-[999_1_640px]">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="text-[28px] leading-tight" aria-live="polite">{headline}</h1>
            <p className="num text-sm text-muted-foreground">{subline}</p>
          </div>

          {atRest && (
            <div className="panel-wash mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3.5">
              <span className="text-[15px] font-semibold">Nothing has moved yet…</span>
              <span className="text-sm text-ink-soft">Pick a scenario above, or move a driver to shift a curve and watch the economy go from A to B to C.</span>
            </div>
          )}

          <figure className="panel mt-4 px-3 pb-1 pt-3">
            <CurvesFigure sim={rn.sim} view={view} animateMs={player.playing ? 120 : 500} aspect={0.58} />
          </figure>
          <figcaption className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-is">IS</span>, <span className="font-semibold text-lm">LM</span> and{" "}
            <span className="font-semibold text-fe">FE</span>: FE is the dashed vertical line. Fainter dashed curves are where they were.
          </figcaption>
          <span className="sr-only">{chartLabel}</span>

          <div className="mt-4"><PhaseBar at={view.at} playing={player.playing} atOnce={atOnce} onPhase={onPhase} onPlay={onPlay} onAdjust={onAdjust} /></div>

          <section className="mt-10 border-t border-rule pt-4" aria-label="The markets behind the curves">
            <h2 className="text-2xl">The markets behind the curves</h2>
            <p className="mt-1 text-sm text-muted-foreground">Saving and investment, money and labour, all at the point on show above.</p>
            <div className="mt-4 space-y-6">
              <SideMarkets sim={rn.sim} view={view} sNX />
              <TimePath sim={rn.sim} index={view.t} />
            </div>
          </section>

          {state.open && (
            <section className="mt-10 border-t border-rule pt-4" aria-label="The open economy">
              <h2 className="text-2xl">The open economy</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {rn.defended
                  ? `A ${state.regime === "band" ? "band" : "crawling band"} is being defended: the shock was too big for the rate to float freely.`
                  : isHardPeg(state.regime) ? "Hard peg: the exchange rate is fixed, so the balance of payments sets the money supply." : "Floating inside the regime you chose: the exchange rate moves to keep the balance of payments in balance."}
                {" "}All at the point on show above.
              </p>
              <div className="mt-4 space-y-8">
                <ExchangeRateCard params={view.params} frame={view.frame} />
                <div className="grid gap-8 md:grid-cols-2">
                  <NetExportsCard params={view.params} frame={view.frame} />
                  <SavingIdentityCard params={view.params} frame={view.frame} />
                </div>
                <PegCard run={rn} frame={view.frame} />
              </div>
            </section>
          )}

          {state.open && state.partner && <TwoCountry run={rn} t={state.t} />}

          <ExpenditureIdentityCard params={view.params} frame={view.frame} />

          <section className="mt-10 max-w-2xl border-t border-rule pt-4">
            <h2 className="text-2xl">About this model</h2>
            <div className="prose-text mt-3 space-y-4">
              <p>
                The <span className="font-semibold text-is">IS curve</span> is where desired saving equals desired investment
                (plus net exports when the economy is open) for each output; the{" "}
                <span className="font-semibold text-lm">LM curve</span> is where real money supplied equals money demanded; the{" "}
                <span className="font-semibold text-fe">FE line</span> is the output the labour market supports.
              </p>
              <p>
                A driver moves one curve. Output then sits above or below FE, so prices rise or fall, real money balances change, and
                LM shifts until output returns to FE. Slow prices (sticky) make that take longer.
              </p>
              <p>Axes are index units for teaching, not calibrated data.</p>
            </div>
          </section>
        </div>

        {isDesktop && (
          <aside aria-label="Model controls" className="panel w-full max-w-[26rem] shrink-0 p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:flex-[1_1_360px] lg:overflow-y-auto">
            {controls}
          </aside>
        )}
      </div>

      {!isDesktop && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen} modal={false}>
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink bg-paper px-4 py-2">
            <SheetTrigger className="flex h-11 w-full items-center justify-center gap-2 border border-ink font-sans text-sm font-semibold">
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Drivers
            </SheetTrigger>
          </div>
          <SheetContent side="bottom" overlay={false} onInteractOutside={(e) => e.preventDefault()}
            className="flex h-[88dvh] flex-col gap-0 border-t border-ink bg-paper p-0 shadow-none">
            <SheetTitle className="sr-only">Model drivers</SheetTitle>
            <div className="shrink-0 border-b border-rule bg-paper px-4 pb-2 pt-3">
              <CurvesFigure sim={rn.sim} view={view} />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{controls}</div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
