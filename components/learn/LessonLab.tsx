"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baselineEconomy, simulate, type Regime } from "@/lib/macro/model";
import { questionsFor } from "@/lib/macro/predict";
import { shockById, shocksFor } from "@/lib/macro/shocks";
import CurvesFigure from "./CurvesFigure";
import PredictCheck from "./PredictCheck";
import SideMarkets from "./SideMarkets";
import TimePath from "./TimePath";

export default function LessonLab({ regime, defaultShock }: { regime: Regime; defaultShock: string }) {
  const available = shocksFor(regime);
  const [shockId, setShockId] = useState(defaultShock);
  const [revealed, setRevealed] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const shock = shockById(shockId) ?? available[0];
  const sim = simulate(baselineEconomy(regime), shock.apply, 60);
  const questions = questionsFor(sim, regime);
  const last = sim.frames.length - 1;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setIndex((i) => {
        if (i >= last) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 120);
    return () => clearInterval(id);
  }, [playing, last]);

  function pick(id: string) {
    setShockId(id);
    setRevealed(false);
    setIndex(0);
    setPlaying(false);
  }
  function reveal() {
    setRevealed(true);
    setIndex(0);
    setPlaying(true);
  }
  function replay() {
    setIndex(0);
    setPlaying(true);
  }

  const label = index === 0 ? "Before the shock" : index === 1 ? "Impact: prices not yet moved" : `Period ${index}`;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="py-4"><CardTitle className="text-base">1. Choose a shock</CardTitle></CardHeader>
        <CardContent className="space-y-2 pb-5">
          <div className="flex flex-wrap gap-2">
            {available.map((s) => (
              <Button key={s.id} type="button" size="sm" variant={s.id === shock.id ? "default" : "outline"} onClick={() => pick(s.id)}>
                {s.label}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{shock.blurb}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4"><CardTitle className="text-base">2. Predict first</CardTitle></CardHeader>
        <CardContent className="pb-5">
          <PredictCheck key={shock.id} questions={questions} revealed={revealed} onReveal={reveal} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4"><CardTitle className="text-base">3. Watch the economy adjust</CardTitle></CardHeader>
        <CardContent className="space-y-4 pb-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <CurvesFigure sim={sim} index={index} />
              <p className="text-xs text-muted-foreground">Dashed lines show where the curves started. Index units, not real data.</p>
            </div>
            <div className="space-y-3">
              <SideMarkets sim={sim} index={index} />
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" disabled={!revealed} onClick={playing ? () => setPlaying(false) : replay}>
                  {playing ? "Pause" : index >= last ? "Replay" : "Play"}
                </Button>
                <input type="range" min={0} max={last} value={index} disabled={!revealed} aria-label="Time"
                  onChange={(e) => { setPlaying(false); setIndex(Number(e.target.value)); }} className="flex-1" />
              </div>
              <div className="text-sm font-medium">{label}</div>
            </div>
          </div>
          <TimePath sim={sim} index={index} />
          {!revealed && <p className="text-sm text-muted-foreground">Make your predictions above, then reveal to unlock the animation.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
