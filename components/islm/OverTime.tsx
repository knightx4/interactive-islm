"use client";

import { cursorTau, LEAD, T_SPAN, type OverTime as OT } from "@/lib/macro/overtime";

const H = 170, X0 = 40, Y0 = 10, Y1 = 140, YM = (Y0 + Y1) / 2;

type Props = {
  ot: OT;
  /** Playback position (0 = A, 1 = B, last = C) and the number of positions. */
  t: number;
  length: number;
  /** Caption after "Over time", e.g. "· 2025 tariffs (edited)". */
  caption: string;
  /** Whether anything has moved (otherwise the lines are flat). */
  moved: boolean;
  atOnce: boolean;
  /** A narrower drawing (480 wide) for a column beside the text, so its labels stay legible. */
  compact?: boolean;
};

/** Output (solid) and prices (dashed purple) as percent from the start, with A, B and C marked. */
export default function OverTime({ ot, t, length, caption, moved, atOnce, compact = false }: Props) {
  const W = compact ? 480 : 680, X1 = W - 10;
  const x = (tau: number) => X0 + ((tau + LEAD) / (T_SPAN + LEAD)) * (X1 - X0);
  const y = (v: number) => YM - (v / ot.span) * ((Y1 - Y0) / 2 - 5);
  const path = (key: "output" | "prices") => ot.points.map((p, i) => `${i ? "L" : "M"}${x(p.tau).toFixed(1)} ${y(moved ? p[key] : 0).toFixed(1)}`).join(" ");
  const cur = x(cursorTau(t, length, ot));
  const marks = [
    { name: "A", tau: ot.at.A, color: "var(--pt-a)" },
    { name: "B", tau: ot.at.B, color: "var(--pt-b)" },
    { name: "C", tau: ot.at.C, color: "var(--pt-c)" },
  ];
  const label = `Output and prices over time as percent from the start, with prices adjusting ${atOnce ? "at once" : "slowly"}, from A through B to C`;
  return (
    <figure className="panel px-4 pb-2 pt-3">
      <figcaption className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-[13px]">
        <span className="font-semibold">Over time <span className="font-normal text-muted-foreground">{caption}</span></span>
        <span className="flex flex-wrap gap-4 text-ink-soft">
          <span><span className="mr-1.5 inline-block w-[18px] border-t-[2.5px] border-ink align-middle" aria-hidden />Output</span>
          <span><span className="mr-1.5 inline-block w-[18px] border-t-[2.5px] border-dashed align-middle" style={{ borderColor: "var(--pt-b)" }} aria-hidden />Prices</span>
          <span className="text-muted-foreground">% from start</span>
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="block h-auto w-full">
        {moved && <rect x={x(ot.at.B)} y={Y0} width={x(ot.at.C) - x(ot.at.B)} height={Y1 - Y0} fill="var(--pt-b)" opacity="0.1" />}
        <path d={`M${X0} ${YM} H${X1}`} stroke="var(--rule-control)" />
        <path d={`M${X0} ${Y0} V${Y1}`} stroke="var(--ink)" />
        <text x={X0 - 6} y={y(ot.span) + 4} textAnchor="end" fontSize="11" fill="var(--ink-faint)" className="num">+{ot.span}</text>
        <text x={X0 - 6} y={YM + 4} textAnchor="end" fontSize="11" fill="var(--ink-faint)" className="num">0</text>
        <text x={X0 - 6} y={y(-ot.span) + 4} textAnchor="end" fontSize="11" fill="var(--ink-faint)" className="num">−{ot.span}</text>
        <path d={path("output")} fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
        <path d={path("prices")} fill="none" stroke="var(--pt-b)" strokeWidth="2.5" strokeDasharray="6 4" strokeLinejoin="round" />
        <path d={`M${cur.toFixed(1)} ${Y0} V${Y1}`} stroke="var(--ink)" strokeDasharray="2 3" />
        {marks.map((m) => (
          <text key={m.name} x={x(m.tau)} y={160} textAnchor="middle" fontSize="12" fontWeight="600" fill={m.color}>{m.name}</text>
        ))}
        <text x={X1} y={160} textAnchor="end" fontSize="11" fill="var(--ink-faint)">time</text>
      </svg>
    </figure>
  );
}
