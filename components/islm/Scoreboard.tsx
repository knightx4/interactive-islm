import type { Simulation } from "@/lib/macro/model";

type Row = { name: string; key: "Y" | "r" | "P" | "C" | "I" | "N"; digits: number; tol: (a: number) => number };
const ROWS: Row[] = [
  { name: "Output, Y", key: "Y", digits: 1, tol: (a) => Math.abs(a) * 0.0005 },
  { name: "Interest rate, r (%)", key: "r", digits: 2, tol: () => 0.005 },
  { name: "Price level, P", key: "P", digits: 3, tol: (a) => Math.abs(a) * 0.0005 },
  { name: "Consumption, C", key: "C", digits: 1, tol: (a) => Math.abs(a) * 0.0005 },
  { name: "Investment, I", key: "I", digits: 1, tol: (a) => Math.abs(a) * 0.0005 },
  { name: "Employment, N", key: "N", digits: 1, tol: (a) => Math.abs(a) * 0.0005 },
];

/** Every variable at A, B and C, with an arrow against A. Values come from the model's run. */
export default function Scoreboard({ sim, moved }: { sim: Simulation; moved: boolean }) {
  const A = sim.baseline, B = sim.impact, C = sim.longRun;
  const arrow = (row: Row, v: number) => {
    const a = A[row.key];
    return v > a + row.tol(a) ? " ↑" : v < a - row.tol(a) ? " ↓" : "";
  };
  return (
    <section className="panel overflow-x-auto p-4" aria-label="Scoreboard">
      <h2 className="mb-2 font-sans text-sm font-semibold">Scoreboard</h2>
      <table className="num w-full border-collapse text-sm">
        <thead>
          <tr className="text-right text-xs text-muted-foreground">
            <th scope="col" className="py-1.5 text-left font-medium">Variable</th>
            <th scope="col" className="px-2 py-1.5 font-semibold" style={{ color: "var(--pt-a)" }}>A start</th>
            <th scope="col" className="px-2 py-1.5 font-semibold" style={{ color: "var(--pt-b)" }}>B short run</th>
            <th scope="col" className="py-1.5 pl-2 font-semibold" style={{ color: "var(--pt-c)" }}>C long run</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key} className="border-t border-rule text-right">
              <th scope="row" className="py-2 text-left font-normal">{row.name}</th>
              <td className="px-2 py-2">{A[row.key].toFixed(row.digits)}</td>
              <td className="px-2 py-2">{moved ? B[row.key].toFixed(row.digits) + arrow(row, B[row.key]) : "–"}</td>
              <td className="py-2 pl-2 font-semibold">{moved ? C[row.key].toFixed(row.digits) + arrow(row, C[row.key]) : "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
