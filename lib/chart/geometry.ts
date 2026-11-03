/** Pure helpers for the house-style chart (see docs/DESIGN.md). */

export type Scale = (v: number) => number;

export function linearScale(d0: number, d1: number, r0: number, r1: number): Scale {
  const span = d1 - d0 || 1;
  return (v) => r0 + ((v - d0) / span) * (r1 - r0);
}

/** "Nice" tick values (1, 2, 5 × 10^n) covering [lo, hi], at most ~count ticks. */
export function niceTicks(lo: number, hi: number, count = 5): number[] {
  if (!(hi > lo)) return [lo];
  const raw = (hi - lo) / Math.max(1, count);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * mag;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) {
    out.push((Math.round(v / step) * step || 0));
  }
  return out;
}

/**
 * Spread label y positions so neighbours are at least `gap` apart, keeping them
 * inside [min, max] and as close to their wanted position as possible.
 * Returns positions in the original order.
 */
export function nudgeLabels(wanted: number[], gap: number, min: number, max: number): number[] {
  const order = wanted.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  const pos = order.map((o) => Math.min(max, Math.max(min, o.y)));
  for (let k = 1; k < pos.length; k++) pos[k] = Math.max(pos[k], pos[k - 1] + gap);
  const over = pos.length ? pos[pos.length - 1] - max : 0;
  if (over > 0) {
    pos[pos.length - 1] = max;
    for (let k = pos.length - 2; k >= 0; k--) pos[k] = Math.min(pos[k], pos[k + 1] - gap);
  }
  const out = new Array<number>(wanted.length);
  order.forEach((o, k) => (out[o.i] = pos[k]));
  return out;
}

/** Sample f over [x0, x1] into a polyline. */
export function sample(f: (x: number) => number, x0: number, x1: number, n = 2) {
  return Array.from({ length: n }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / (n - 1);
    return { x, y: f(x) };
  });
}

export type LabelBox = { x: number; y: number; w: number; h: number };

/**
 * Choose a label offset for each mark so that no label overlaps another label or any mark.
 * `pts` are pixel positions; `label` widths are in px. Candidates are tried in order and the
 * first free one wins; if none is free the one with the least overlap is used.
 * Returns dx/dy (the text's x offset and baseline offset from the mark), in the original order.
 */
export function placeMarkLabels(
  pts: { x: number; y: number; w: number }[],
  bounds: { x0: number; x1: number; y0: number; y1: number },
  opts: { h?: number; r?: number } = {},
): { dx: number; dy: number }[] {
  const h = opts.h ?? 15, r = opts.r ?? 7;
  const cands = (w: number) => [
    { dx: 9, dy: -9 }, { dx: 9, dy: 20 }, { dx: -w - 9, dy: -9 }, { dx: -w - 9, dy: 20 },
    { dx: 11, dy: 5 }, { dx: -w - 11, dy: 5 }, { dx: -w / 2, dy: -13 }, { dx: -w / 2, dy: 24 },
  ];
  const boxOf = (p: { x: number; y: number }, w: number, c: { dx: number; dy: number }): LabelBox => ({ x: p.x + c.dx, y: p.y + c.dy - h + 3, w, h });
  const hit = (a: LabelBox, b: LabelBox) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const discs = pts.map((p): LabelBox => ({ x: p.x - r, y: p.y - r, w: 2 * r, h: 2 * r }));
  const placed: LabelBox[] = [];
  return pts.map((p) => {
    let best = { dx: 9, dy: -9 }, bestScore = Infinity;
    for (const c of cands(p.w)) {
      const b = boxOf(p, p.w, c);
      let score = 0;
      if (b.x < bounds.x0 || b.x + b.w > bounds.x1 || b.y < bounds.y0 || b.y + b.h > bounds.y1) score += 1;
      for (const d of discs) if (hit(b, d)) score += 1;
      for (const o of placed) if (hit(b, o)) score += 1;
      if (score < bestScore) { bestScore = score; best = c; }
      if (score === 0) break;
    }
    placed.push(boxOf(p, p.w, best));
    return best;
  });
}
