"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  causesOf, clampIdx, parentValue, parents, shiftOf, type Group, type ParentId, type SimState,
} from "@/lib/macro/sim";

const GROUPS: { id: Group; title: string; tone: string; note: string }[] = [
  { id: "IS", title: "IS: goods and loanable funds", tone: "text-is", note: "Desired saving against desired investment at each interest rate." },
  { id: "LM", title: "LM: money", tone: "text-lm", note: "Real money supplied against money demanded." },
  { id: "FE", title: "FE: full employment", tone: "text-fe", note: "What the economy can produce when the labour market clears." },
];

const toneOf = (g: Group) => GROUPS.find((x) => x.id === g)!.tone;

type Props = {
  state: SimState;
  onParent: (id: ParentId, value: number) => void;
  onCause: (id: string, value: number) => void;
  onOpen: (open: boolean) => void;
  onReset: () => void;
  /** Current price level, shown under the LM group (it moves on its own). */
  price: number;
};

/** The five market sliders, grouped by curve, each with the causes that move it. */
export default function ModelControls({ state, onParent, onCause, onOpen, onReset, price }: Props) {
  const [shown, setShown] = useState<Record<string, boolean>>({});
  return (
    <Card className="flex w-full max-w-full flex-col gap-2 border-ink py-3">
      <CardHeader className="px-0 pb-0 pt-0">
        <CardTitle className="font-serif text-lg">Drivers</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-0 pb-0 pt-1">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={state.open} onChange={(e) => onOpen(e.target.checked)} className="h-4 w-4 accent-[var(--ink)]" />
          <span>Open economy (trade, floating exchange rate)</span>
        </label>

        {GROUPS.map((g) => (
          <section key={g.id} aria-label={g.title} className="space-y-3">
            <div className="border-b border-rule pb-1">
              <h3 className={cn("text-sm font-semibold", g.tone)}>{g.title}</h3>
              <p className="text-xs text-muted-foreground">{g.note}</p>
            </div>
            {parents.filter((p) => p.group === g.id).map((p) => {
              const value = parentValue(p.id, state);
              const cs = causesOf(p.id);
              const open = shown[p.id] ?? true;
              return (
                <div key={p.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Label htmlFor={`parent-${p.id}`} className="text-sm font-medium">{p.label} ({p.symbol})</Label>
                      {cs.length > 0 && (
                        <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" aria-expanded={open}
                          aria-label={`${open ? "Hide" : "Show"} what moves ${p.label.toLowerCase()}`}
                          onClick={() => setShown((s) => ({ ...s, [p.id]: !open }))}>
                          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      )}
                    </div>
                    <span className={cn("num text-sm font-semibold", toneOf(g.id))}>{value.toFixed(0)}</span>
                  </div>
                  <Slider id={`parent-${p.id}`} min={0} max={100} step={1} value={[clampIdx(value)]}
                    onValueChange={(v) => onParent(p.id, v[0])} className="cursor-pointer" />
                  {open && (
                    <div className="mt-1.5 space-y-3 border-l border-rule pl-3">
                      {cs.map((c) => {
                        const x = state.causes[c.id] ?? 0;
                        const sh = shiftOf(c, x);
                        return (
                          <div key={c.id} className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <Label htmlFor={`cause-${c.id}`} className="text-xs font-medium">{c.label}</Label>
                              <span className={cn("num text-xs font-semibold", toneOf(g.id))}>{x > 0 ? "+" : ""}{x}</span>
                            </div>
                            <Slider id={`cause-${c.id}`} min={c.min} max={c.max} step={c.step} value={[x]}
                              onValueChange={(v) => onCause(c.id, v[0])} className="cursor-pointer" />
                            <p className="text-[11px] leading-snug text-muted-foreground">
                              <span className="font-semibold">Works through:</span> {c.detail}
                              {c.also && <> (and {parents.find((q) => q.id === c.also)!.label.toLowerCase()})</>}.{" "}
                              {c.needsOpen && !state.open && "Moving it switches the open economy on. "}
                              {c.viaRate && "Acts through the exchange rate, so the parent slider stays put. "}
                            </p>
                            <p className={cn("text-[11px] leading-snug", x === 0 ? "text-muted-foreground" : toneOf(sh?.curve ?? g.id))} aria-live="polite">
                              {x === 0 ? <>If it rises: {c.chain.up}.</> : (x > 0 ? c.chain.up : c.chain.down) + "."}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {g.id === "LM" && (
              <p className="num text-xs text-muted-foreground">
                Price level P = {price.toFixed(3)}: it moves on its own as prices adjust, so real money M/P changes after the first move.
              </p>
            )}
          </section>
        ))}

        <Button type="button" variant="outline" size="sm" onClick={onReset} className="self-start">Reset all</Button>
      </CardContent>
    </Card>
  );
}
