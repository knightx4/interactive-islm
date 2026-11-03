"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Link2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ModelControls from "@/components/islm/ModelControls";
import ExpenditureIdentityCard from "@/components/islm/ExpenditureIdentityCard";
import MacroFeedbackBar from "@/components/islm/layout/MacroFeedbackBar";
import Playback from "@/components/islm/Playback";
import CurvesFigure from "@/components/learn/CurvesFigure";
import SideMarkets from "@/components/learn/SideMarkets";
import { ExchangeRateCard, NetExportsCard, PegCard, SavingIdentityCard, TwoCountry } from "@/components/islm/OpenPanels";
import TimePath from "@/components/learn/TimePath";
import {
  baselineState, run, setCause, setParent, viewAt, isHardPeg, type ParentId, type RegimeChoice, type SimState,
} from "@/lib/macro/sim";
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
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState<"" | "copied" | "failed">("");

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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied("copied");
    } catch {
      setCopied("failed");
    }
    setTimeout(() => setCopied(""), 2500);
  };

  // the solution depends on everything except the playback position
  const key = JSON.stringify([state.offsets, state.causes, state.speed, state.open, state.regime, state.mobility, state.partner]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rn = useMemo(() => run(state), [key]);
  const view = viewAt(rn.sim, state.t);
  const last = rn.length - 1;

  const edit = useCallback((f: (s: SimState) => SimState) => { setPlaying(false); setState(f); }, []);
  const onParent = (id: ParentId, v: number) => edit((s) => setParent(s, id, v));
  const onCause = (id: string, v: number) => edit((s) => setCause(s, id, v));
  const onOpen = (open: boolean) => edit((s) => ({ ...s, open, t: 1 }));
  const onRegime = (regime: RegimeChoice) => edit((s) => ({ ...s, regime, t: 1 }));
  const onMobility = (mobility: number) => edit((s) => ({ ...s, mobility, t: 1 }));
  const onPartner = (partner: boolean) => edit((s) => ({ ...s, partner, t: 1 }));
  const onReset = () => edit((s) => ({ ...baselineState(), speed: s.speed }));
  const onT = useCallback((t: number) => setState((s) => ({ ...s, t })), []);
  const onSpeed = (speed: number) => setState((s) => ({ ...s, speed }));

  const isDesktop = useIsDesktop();
  const [sheetOpen, setSheetOpen] = useState(false);
  const controls = <ModelControls state={state} onParent={onParent} onCause={onCause} onOpen={onOpen} onRegime={onRegime} onMobility={onMobility} onPartner={onPartner} onReset={onReset} price={view.frame.P} />;

  const label =
    view.at === "A" ? "Point A: before the change" : view.at === "B" ? "Point B: the first move, prices not yet changed" :
    view.at === "C" ? "Point C: prices fully adjusted, output back at full employment" : `Prices adjusting: period ${view.t}`;
  const playback = (
    <Playback t={Math.min(state.t, last)} length={rn.length} playing={playing} speed={state.speed} label={label}
      onT={onT} onPlaying={setPlaying} onSpeed={onSpeed} />
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-8 lg:pb-16 md:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl">The IS-LM model</h1>
        <p className="prose-text mt-3 text-lg text-foreground/90">
          Move a driver (on a phone, open Drivers at the bottom) and see the short-run point <b>B</b>, then play the
          prices adjusting until output is back at full employment, point <b>C</b>. This is the same model as the
          lessons. Values are model index units, not billions or percentage points.
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-12">
        {isDesktop && (
          <aside aria-label="Model controls"
            className="order-2 lg:order-1 lg:sticky lg:top-16 lg:max-h-[calc(100vh-5rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
            {controls}
          </aside>
        )}

        <div className="order-1 min-w-0 lg:order-2">
          <figure>
            <MacroFeedbackBar frame={view.frame} />
            <CurvesFigure sim={rn.sim} view={view} />
            {playback}
            <div className="mt-2 flex items-center gap-3">
              <Button type="button" size="sm" variant="outline" onClick={copyLink}>
                <Link2 className="mr-1 h-4 w-4" aria-hidden />Copy link
              </Button>
              <span className="text-sm text-muted-foreground" aria-live="polite">
                {copied === "copied" ? "Link copied: it reopens these settings." : copied === "failed" ? "Copy failed: copy the address from the address bar." : "Copies a link that reopens exactly these settings."}
              </span>
            </div>
            <figcaption className="mt-2 text-sm text-muted-foreground">
              <b className="font-semibold text-foreground">Figure 1.</b> <span className="font-semibold text-is">IS</span>,{" "}
              <span className="font-semibold text-lm">LM</span> and <span className="font-semibold text-fe">FE</span>.{" "}
              <b style={{ color: "var(--pt-a)" }}>A</b> is the start, <b style={{ color: "var(--pt-b)" }}>B</b> the first move
              with prices fixed, <b style={{ color: "var(--pt-c)" }}>C</b> the long run. Dashed curves are where they were.
            </figcaption>
          </figure>

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
