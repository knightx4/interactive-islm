"use client";

import { useEffect, useId, useRef, useState } from "react";
import { linearScale, niceTicks, nudgeLabels } from "@/lib/chart/geometry";

/** The fixed colour of each curve (tokens in app/globals.css). */
export type CurveKey = "is" | "lm" | "fe" | "labour" | "money" | "ink";
const COLOR: Record<CurveKey, string> = {
  is: "var(--c-is)",
  lm: "var(--c-lm)",
  fe: "var(--c-fe)",
  labour: "var(--c-labour)",
  money: "var(--c-money)",
  ink: "var(--ink)",
};

export type Series = {
  id: string;
  curve: CurveKey;
  points: { x: number; y: number }[];
  /** Name set at the line end, in the curve's colour. */
  label?: string;
  /** Earlier position of a curve: dashed and lighter, labelled "label′" by convention. */
  ghost?: boolean;
};
export type RefLine = { orientation: "v" | "h"; value: number; curve: CurveKey; label?: string; ghost?: boolean };
export type Mark = { x: number; y: number; label?: string; guides?: boolean };

export type ChartProps = {
  series: Series[];
  refLines?: RefLine[];
  marks?: Mark[];
  xDomain: [number, number];
  yDomain: [number, number];
  xLabel: string;
  yLabel: string;
  /** Accessible description of what the figure shows. */
  title: string;
  /** Height as a fraction of width (default 0.72). */
  aspect?: number;
  xTicks?: number;
  yTicks?: number;
  /** Hide numeric tick labels (stylised textbook diagrams). */
  hideTickValues?: boolean;
  className?: string;
};

const M = { l: 48, r: 40, t: 14, b: 44 };
const FONT = 12;

function useWidth<T extends HTMLElement>(initial = 520) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => setW(Math.max(240, Math.round(el.getBoundingClientRect().width)));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export default function Chart({
  series, refLines = [], marks = [], xDomain, yDomain, xLabel, yLabel, title,
  aspect = 0.72, xTicks = 5, yTicks = 5, hideTickValues = false, className,
}: ChartProps) {
  const [ref, W] = useWidth<HTMLDivElement>();
  const clipId = useId();
  const H = Math.round(Math.min(560, Math.max(260, W * aspect)));
  const x = linearScale(xDomain[0], xDomain[1], M.l, W - M.r);
  const y = linearScale(yDomain[0], yDomain[1], H - M.b, M.t);
  const xt = niceTicks(xDomain[0], xDomain[1], xTicks);
  const yt = niceTicks(yDomain[0], yDomain[1], yTicks);
  const path = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i ? "L" : "M"}${x(p.x).toFixed(1)},${y(p.y).toFixed(1)}`).join(" ");

  // Direct labels at line ends, nudged apart vertically.
  const labelled = series.filter((s) => s.label && s.points.length);
  const wantedY = labelled.map((s) => {
    const e = s.points[s.points.length - 1];
    return Math.min(H - M.b, Math.max(M.t, y(e.y)));
  });
  const labelY = nudgeLabels(wantedY, FONT + 3, M.t + FONT / 2, H - M.b - 2);

  return (
    <div ref={ref} className={className}>
      <svg width={W} height={H} role="img" aria-label={title} style={{ display: "block", maxWidth: "100%" }}>
        <title>{title}</title>
        <defs>
          <clipPath id={clipId}><rect x={M.l} y={M.t} width={W - M.l - M.r} height={H - M.t - M.b} /></clipPath>
        </defs>

        {/* horizontal gridlines only */}
        {yt.map((v) => (
          <line key={`g${v}`} x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} stroke="var(--rule)" strokeWidth={1} />
        ))}
        {/* axes: hairlines with ticks, no box */}
        <path d={`M${M.l},${M.t} V${H - M.b} H${W - M.r}`} fill="none" stroke="var(--ink)" strokeWidth={1} />
        {xt.map((v) => (
          <g key={`x${v}`}>
            <line x1={x(v)} x2={x(v)} y1={H - M.b} y2={H - M.b + 4} stroke="var(--ink)" />
            {!hideTickValues && (
              <text x={x(v)} y={H - M.b + 17} textAnchor="middle" fontSize={FONT} fill="var(--ink-faint)" className="num">{v}</text>
            )}
          </g>
        ))}
        {yt.map((v) => (
          <g key={`y${v}`}>
            <line x1={M.l - 4} x2={M.l} y1={y(v)} y2={y(v)} stroke="var(--ink)" />
            {!hideTickValues && (
              <text x={M.l - 8} y={y(v) + 4} textAnchor="end" fontSize={FONT} fill="var(--ink-faint)" className="num">{v}</text>
            )}
          </g>
        ))}
        <text x={(M.l + W - M.r) / 2} y={H - 6} textAnchor="middle" fontSize={FONT + 1} fill="var(--ink-soft)">{xLabel}</text>
        <text transform={`translate(13 ${(M.t + H - M.b) / 2}) rotate(-90)`} textAnchor="middle" fontSize={FONT + 1} fill="var(--ink-soft)">{yLabel}</text>

        <g clipPath={`url(#${clipId})`} fill="none">
          {refLines.map((r, i) => {
            const common = { stroke: COLOR[r.curve], strokeWidth: r.ghost ? 1.5 : 2, strokeDasharray: r.ghost ? "5 4" : undefined, opacity: r.ghost ? 0.6 : 1 };
            return r.orientation === "v"
              ? <line key={i} x1={x(r.value)} x2={x(r.value)} y1={M.t} y2={H - M.b} {...common} />
              : <line key={i} x1={M.l} x2={W - M.r} y1={y(r.value)} y2={y(r.value)} {...common} />;
          })}
          {series.map((s) => (
            <path key={s.id} d={path(s.points)} stroke={COLOR[s.curve]} strokeWidth={s.ghost ? 1.5 : 2}
              strokeDasharray={s.ghost ? "5 4" : undefined} opacity={s.ghost ? 0.6 : 1} strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {marks.filter((m) => m.guides !== false).map((m, i) => (
            <g key={`gd${i}`} stroke="var(--ink)" strokeDasharray="1.5 3" strokeWidth={1}>
              <line x1={x(m.x)} x2={x(m.x)} y1={y(m.y)} y2={H - M.b} />
              <line x1={M.l} x2={x(m.x)} y1={y(m.y)} y2={y(m.y)} />
            </g>
          ))}
        </g>

        {/* vertical reference-line names at the top */}
        {refLines.filter((r) => r.label && r.orientation === "v").map((r, i) => (
          <text key={`rv${i}`} x={x(r.value) + 5} y={M.t + FONT} fontSize={FONT + 1} fontWeight={600} fill={COLOR[r.curve]}>{r.label}</text>
        ))}
        {refLines.filter((r) => r.label && r.orientation === "h").map((r, i) => (
          <text key={`rh${i}`} x={W - M.r + 5} y={y(r.value) + 4} fontSize={FONT + 1} fontWeight={600} fill={COLOR[r.curve]}>{r.label}</text>
        ))}
        {labelled.map((s, i) => (
          <text key={`l${s.id}`} x={W - M.r + 5} y={labelY[i] + 4} fontSize={FONT + 1} fontWeight={600}
            fill={COLOR[s.curve]} opacity={s.ghost ? 0.75 : 1}>{s.label}</text>
        ))}
        {marks.map((m, i) => (
          <g key={`m${i}`}>
            <circle cx={x(m.x)} cy={y(m.y)} r={4.5} fill="var(--ink)" stroke="var(--paper)" strokeWidth={1.5} />
            {m.label && <text x={x(m.x) + 8} y={y(m.y) - 8} fontSize={FONT + 1} fontStyle="italic" fill="var(--ink)">{m.label}</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}
