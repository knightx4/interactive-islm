/** Tiny linear-expression helpers and a Gaussian solver, so each market can be written as an equation. */
export type Lin = Record<string, number>; // "1" is the constant term

export const k = (c: number): Lin => ({ "1": c });
export const v = (name: string, coef = 1): Lin => ({ [name]: coef });
export function add(...xs: Lin[]): Lin {
  const out: Lin = {};
  for (const x of xs) for (const [n, c] of Object.entries(x)) out[n] = (out[n] ?? 0) + c;
  return out;
}
export const scale = (x: Lin, f: number): Lin => Object.fromEntries(Object.entries(x).map(([n, c]) => [n, c * f]));
export const sub = (a: Lin, b: Lin): Lin => add(a, scale(b, -1));

/** The equation a = b. */
export type Eq = { a: Lin; b: Lin };
export const eq = (a: Lin, b: Lin): Eq => ({ a, b });

export function solve(vars: string[], eqs: Eq[]): Record<string, number> {
  const n = vars.length;
  if (eqs.length !== n) throw new Error(`need ${n} equations, got ${eqs.length}`);
  const M = eqs.map(({ a, b }) => {
    const d = sub(a, b);
    return [...vars.map((name) => d[name] ?? 0), -(d["1"] ?? 0)];
  });
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) throw new Error("singular system");
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let j = c; j <= n; j++) M[r][j] -= f * M[c][j];
    }
  }
  return Object.fromEntries(vars.map((name, i) => [name, M[i][n] / M[i][i]]));
}
