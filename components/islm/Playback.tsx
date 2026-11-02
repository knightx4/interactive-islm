"use client";

import { useEffect } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import useReducedMotion from "@/components/learn/useReducedMotion";

const TickMs = 120;

type Props = {
  /** Playback position 0..length-1 (0 before, 1 impact, last fully adjusted). */
  t: number;
  length: number;
  playing: boolean;
  speed: number;
  label: string;
  onT: (t: number) => void;
  onPlaying: (p: boolean) => void;
  onSpeed: (s: number) => void;
};

/** Play the price adjustment from the first move to full employment; scrub it; set how fast prices move. */
export default function Playback({ t, length, playing, speed, label, onT, onPlaying, onSpeed }: Props) {
  const reduced = useReducedMotion();
  const last = length - 1;
  useEffect(() => {
    if (!playing || reduced) return;
    if (t >= last) { onPlaying(false); return; }
    const id = setTimeout(() => onT(t + 1), TickMs);
    return () => clearTimeout(id);
  }, [playing, reduced, t, last, onT, onPlaying]);

  const play = () => {
    if (reduced) { onT(last); return; }
    if (t >= last) onT(1);
    onPlaying(true);
  };

  return (
    <div className="space-y-2 border-t border-rule pt-3" role="group" aria-label="Playback of the price adjustment">
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" size="sm" variant="outline" onClick={playing ? () => onPlaying(false) : play}>
          {playing ? <><Pause className="mr-1 h-4 w-4" aria-hidden />Pause</> : reduced ? "Jump to C" : t >= last ? <><RotateCcw className="mr-1 h-4 w-4" aria-hidden />Replay</> : <><Play className="mr-1 h-4 w-4" aria-hidden />Play</>}
        </Button>
        <label className="flex min-w-[10rem] flex-1 items-center gap-2 text-sm">
          <span className="whitespace-nowrap">Time</span>
          <input type="range" min={0} max={last} value={t} aria-label="Playback position"
            onChange={(e) => { onPlaying(false); onT(Number(e.target.value)); }} className="flex-1 accent-[var(--ink)]" />
        </label>
        <label className="flex min-w-[12rem] items-center gap-2 text-sm">
          <span className="whitespace-nowrap">Prices</span>
          <span className="text-xs text-muted-foreground">sticky</span>
          <input type="range" min={0} max={100} value={speed} aria-label="Price speed, sticky to flexible"
            onChange={(e) => onSpeed(Number(e.target.value))} className="flex-1 accent-[var(--ink)]" />
          <span className="text-xs text-muted-foreground">flexible</span>
        </label>
      </div>
      <p className="num text-sm font-semibold" aria-live="polite">{label}</p>
    </div>
  );
}
