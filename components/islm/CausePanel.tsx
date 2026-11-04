"use client";

import { useState } from "react";
import { CurveTabs, CurveTabPanel, type CurveTab } from "@/components/ui/curve-tabs";
import { CauseSliderRow } from "@/components/ui/cause-slider-row";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RegimePicker } from "./OpenPanels";
import { INDEX_PER_LEVEL, levelToIndex } from "@/lib/macro/scenarios";
import { causeDisabled, causes, driverRow, isHardPeg, shiftOf, type Cause, type RegimeChoice, type SimState } from "@/lib/macro/sim";
import type { Curve } from "@/lib/macro/shocks";

export type TabId = "IS" | "LM" | "FE" | "Open";

const TABS: (CurveTab & { id: TabId; note: string })[] = [
  { id: "IS", label: "IS", color: "var(--c-is)", note: "Goods market: anything that moves spending against saving." },
  { id: "LM", label: "LM", color: "var(--c-lm)", note: "Money market: anything that moves money supply against money demand." },
  { id: "FE", label: "FE", color: "var(--c-fe)", note: "Supply side: what the economy can produce at full employment." },
  { id: "Open", label: "Open", note: "Trade and currencies. Moving one switches the open economy on and acts through net exports or, under a hard peg, the money supply." },
];

/** The tab a cause sits under: open-economy causes under Open, the rest by the market they move. */
export function tabOf(c: Cause): TabId {
  if (c.needsOpen) return "Open";
  return c.parent === "investment" || c.parent === "saving" ? "IS" : c.parent === "fullEmployment" ? "FE" : "LM";
}

const CURVE_COLOR: Record<Curve, string> = { IS: "var(--c-is)", LM: "var(--c-lm)", FE: "var(--c-fe)" };

type Props = {
  state: SimState;
  /** Last cause moved, highlighted. */
  focus: string | null;
  onCause: (id: string, value: number) => void;
  onFocus: (id: string) => void;
  onOpen: (open: boolean) => void;
  onRegime: (r: RegimeChoice) => void;
  onMobility: (m: number) => void;
  onPartner: (p: boolean) => void;
  /** Current price level, shown under the LM tab (it moves on its own). */
  price: number;
  /** Tab to start on (defaults to IS). */
  initialTab?: TabId;
};

/** Every cause as a slider (-3 to +3 in half steps) under the IS / LM / FE / Open tabs. */
export default function CausePanel({ state, focus, onCause, onFocus, onOpen, onRegime, onMobility, onPartner, price, initialTab = "IS" }: Props) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const hard = state.open && isHardPeg(state.regime);
  const moved = (t: TabId) => causes.filter((c) => tabOf(c) === t && (state.causes[c.id] ?? 0) !== 0).length;
  const tabs = TABS.map((t) => ({ ...t, label: moved(t.id) ? `${t.label} · ${moved(t.id)}` : t.label }));
  const levelOf = (x: number) => x / INDEX_PER_LEVEL;

  return (
    <CurveTabs tabs={tabs} value={tab} onValueChange={(v) => setTab(v as TabId)}>
      {TABS.map((t) => (
        <CurveTabPanel key={t.id} value={t.id}>
          <p className="px-4 pb-1 pt-3 text-[13px] text-muted-foreground">{t.note}</p>
          {t.id === "Open" && (
            <div className="space-y-3 px-4 pb-2 pt-1">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={state.open} onChange={(e) => onOpen(e.target.checked)} className="h-4 w-4 accent-[var(--ink)]" />
                <span>Open economy (trade and capital flows)</span>
              </label>
              {state.open && (
                <div className="space-y-3 border-l border-rule pl-3">
                  <RegimePicker value={state.regime} onChange={onRegime} />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={state.partner} onChange={(e) => onPartner(e.target.checked)} className="h-4 w-4 accent-[var(--ink)]" />
                    <span>Show a partner economy (US and Japan)</span>
                  </label>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-xs font-medium text-muted-foreground">Advanced</summary>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="mobility" className="text-xs font-medium">Capital mobility</Label>
                        <span className="num text-xs font-semibold">{(state.partner ? 1 : state.mobility).toFixed(2)}</span>
                      </div>
                      <Slider id="mobility" min={0} max={1} step={0.05} value={[state.partner ? 1 : state.mobility]} disabled={state.partner}
                        onValueChange={(v) => onMobility(v[0])} className="cursor-pointer" />
                      <p className="text-[11px] text-muted-foreground">0 = capital cannot move, 1 = it moves freely. {state.partner ? "Fixed at 1 with a partner, so both share one world rate." : "The course's small open economy is 1; the default is a large economy."}</p>
                    </div>
                  </details>
                </div>
              )}
            </div>
          )}
          {t.id === "LM" && (
            <p className="num px-4 pb-1 text-xs text-muted-foreground">
              Price level P = {price.toFixed(3)}: it moves on its own as prices adjust, so real money M/P changes after the first move.
            </p>
          )}
          <div className="flex flex-col gap-0.5 px-2 pb-3 pt-1">
            {causes.filter((c) => tabOf(c) === t.id).map((c) => {
              const x = state.causes[c.id] ?? 0;
              const off = causeDisabled(c, state);
              const curve = (shiftOf(c, x || 1, hard)?.curve ?? driverRow(c).curve) as Curve;
              const second = c.also ? ` (and ${c.also === "moneyDemand" ? "money demand" : c.also === "moneySupply" ? "money supply" : c.also})` : "";
              return (
                <CauseSliderRow key={c.id} name={c.label} via={`through ${c.detail.charAt(0).toLowerCase()}${c.detail.slice(1)}${second}`}
                  color={CURVE_COLOR[curve]} value={levelOf(x)} onValueChange={(lv) => onCause(c.id, levelToIndex(lv))}
                  active={focus === c.id} disabled={!!off} onFocusRow={() => onFocus(c.id)}
                  note={off ?? (c.needsOpen && !state.open ? "Moving it switches the open economy on." : undefined)} />
              );
            })}
          </div>
        </CurveTabPanel>
      ))}
    </CurveTabs>
  );
}
