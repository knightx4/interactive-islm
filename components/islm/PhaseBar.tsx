"use client";

import { Play } from "lucide-react";
import { PhaseButton } from "@/components/ui/phase-button";
import { ScenarioChip } from "@/components/ui/scenario-chip";
import type { Phase } from "@/lib/macro/playback";

const PHASES: { id: Phase; name: string; color: string }[] = [
  { id: "A", name: "Start", color: "var(--pt-a)" },
  { id: "B", name: "Short run, prices fixed", color: "var(--pt-b)" },
  { id: "C", name: "Prices adjusted", color: "var(--pt-c)" },
];

type Props = {
  at: Phase | "moving";
  playing: boolean;
  atOnce: boolean;
  onPhase: (p: Phase) => void;
  onPlay: () => void;
  onAdjust: (atOnce: boolean) => void;
};

/** A / B / C buttons, Play A to C, and how fast prices adjust. */
export default function PhaseBar({ at, playing, atOnce, onPhase, onPlay, onAdjust }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-stretch gap-2" role="group" aria-label="Phase of the adjustment">
        {PHASES.map((p) => (
          <PhaseButton key={p.id} letter={p.id} name={p.name} color={p.color} active={at === p.id} onClick={() => onPhase(p.id)} />
        ))}
        <button type="button" onClick={onPlay} disabled={playing}
          className="inline-flex min-h-11 basis-full items-center justify-center gap-2 rounded-lg sm:basis-auto bg-ink px-5 text-sm font-semibold text-paper disabled:opacity-60">
          <Play className="size-4" aria-hidden />Play A to C
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground" role="group" aria-label="How fast prices adjust">
        <span>Prices adjust</span>
        <ScenarioChip active={!atOnce} onClick={() => onAdjust(false)}>slowly (Keynesian)</ScenarioChip>
        <ScenarioChip active={atOnce} onClick={() => onAdjust(true)}>at once (classical)</ScenarioChip>
      </div>
    </div>
  );
}
