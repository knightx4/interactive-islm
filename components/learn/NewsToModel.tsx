import { news } from "@/lib/learn/context";
import { baselineEconomy, simulate } from "@/lib/macro/model";
import { direction, type Direction } from "@/lib/macro/predict";
import { shockById } from "@/lib/macro/shocks";

const arrow: Record<Direction, string> = { up: "↑", down: "↓", same: "–" };
const name: Record<Direction, string> = { up: "rises", down: "falls", same: "no change" };

/** Reading a headline as a shock: which driver, which curve, and what the model says. The active row is marked. */
export default function NewsToModel({ activeShock }: { activeShock?: string }) {
  const rows = news.map((n) => {
    const shock = shockById(n.shockId)!;
    const sim = simulate(baselineEconomy("closed"), shock.apply, 60);
    const a = sim.baseline, b = sim.impact, c = sim.longRun;
    return { n, shock, Y: direction(a.Y, b.Y), r: direction(a.r, b.r), Ylr: direction(a.Y, c.Y), P: direction(a.P, c.P, 0.01) };
  });
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="pb-2 text-left text-xl font-serif font-semibold">From the news to the model</caption>
        <thead>
          <tr className="border-b border-ink text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="py-1 pr-3 font-semibold">In the news</th>
            <th scope="col" className="py-1 pr-3 font-semibold">Driver</th>
            <th scope="col" className="py-1 pr-3 font-semibold">Curve</th>
            <th scope="col" className="py-1 pr-3 font-semibold">Short run: Y, r</th>
            <th scope="col" className="py-1 font-semibold">Long run: Y, P</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ n, shock, Y, r, Ylr, P }) => (
            <tr key={n.shockId} aria-current={n.shockId === activeShock ? "true" : undefined}
              className={`border-b border-rule align-top ${n.shockId === activeShock ? "bg-wash font-medium" : ""}`}>
              <td className="py-1.5 pr-3">{n.headline}</td>
              <td className="py-1.5 pr-3">{shock.label}</td>
              <td className="py-1.5 pr-3 whitespace-nowrap">
                <span className={shock.curve === "IS" ? "text-is" : shock.curve === "LM" ? "text-lm" : "text-fe"}>{shock.curve}</span> {shock.dir}
                {shock.also ? `, ${shock.also.curve} ${shock.also.dir}` : ""}
              </td>
              <td className="num py-1.5 pr-3 whitespace-nowrap" title={`Output ${name[Y]}, interest rate ${name[r]}`}>Y {arrow[Y]} r {arrow[r]}</td>
              <td className="num py-1.5 whitespace-nowrap" title={`Output ${name[Ylr]}, prices ${name[P]}`}>Y {arrow[Ylr]} P {arrow[P]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
