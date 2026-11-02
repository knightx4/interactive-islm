"use client";

import type { ReactNode } from "react";

/** A labelled range control with its current value, used by every lesson widget. */
export function Ctl({
  label, value, min, max, step = 1, onChange, show, id,
}: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; show?: string; id: string }) {
  return (
    <label htmlFor={id} className="block text-sm">
      <span className="flex justify-between gap-2">
        <span>{label}</span>
        <span className="num font-semibold">{show ?? value}</span>
      </span>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full accent-[var(--ink)]" />
    </label>
  );
}

/** A ruled figure block with a caption saying what is toy data and what is real. */
export function Fig({ title, children, note }: { title: string; children: ReactNode; note?: string }) {
  return (
    <figure className="border-y border-rule py-3">
      <figcaption className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</figcaption>
      {children}
      {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
    </figure>
  );
}

export const money = (x: number) => `$${Math.round(x).toLocaleString("en-US")}`;
export const f1 = (x: number) => x.toFixed(1);
