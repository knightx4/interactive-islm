/** Arithmetic behind the productivity lesson. Invented teaching numbers, not data. */

export type Tech = { A: number; K: number; a: number };

export const out = (t: Tech, N: number) => t.A * Math.pow(t.K, t.a) * Math.pow(N, 1 - t.a);
/** Marginal product of labour: the extra output from one more worker. */
export const mpl = (t: Tech, N: number) => (1 - t.a) * t.A * Math.pow(t.K, t.a) * Math.pow(N, -t.a);
/** Output per worker. */
export const perWorker = (t: Tech, N: number) => out(t, N) / N;
/** Where a profit-maximising firm stops hiring at real wage w: MPL(N) = w. */
export const hireUntil = (t: Tech, w: number) => Math.pow(((1 - t.a) * t.A * Math.pow(t.K, t.a)) / w, 1 / t.a);
/** Profit in output units: output minus the wage bill (capital is fixed). */
export const profit = (t: Tech, N: number, w: number) => out(t, N) - w * N;

/** Growth accounting: g_Y = g_A + a g_K + (1 - a)(g_N + g_H). Rates in percent per year. */
export type Growth = { gY: number; gK: number; gN: number; gH: number; a: number };
export function sources(g: Growth) {
  const capital = g.a * g.gK;
  const labour = (1 - g.a) * g.gN;
  const schooling = (1 - g.a) * g.gH;
  const tfp = g.gY - capital - labour - schooling; // the residual
  return { capital, labour, schooling, tfp };
}

/** Stylised presets. Rounded to echo published findings, not copies of any dataset. */
export const presets: { id: string; label: string; g: Growth; note: string }[] = [
  {
    id: "asia", label: "Fast-growing East Asian economy, input-led",
    g: { gY: 8.7, gK: 11, gN: 4, gH: 2, a: 0.5 },
    note: "Stylised after Young (1995): output grew very fast, but nearly all of it is explained by more capital, more workers and more schooling, leaving almost nothing for TFP.",
  },
  {
    id: "tfp", label: "Productivity-led economy",
    g: { gY: 3.5, gK: 3, gN: 0.8, gH: 0.2, a: 0.3 },
    note: "A stylised economy with modest input growth, where about half of growth is the residual. Not data for any country.",
  },
];
