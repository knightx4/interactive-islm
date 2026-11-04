import type { NewsRow } from "@/lib/learn/lessons";

const defaultCols: [string, string, string, string] = ["In the news", "Driver", "Curve moved", "Effect"];

/** Names each curve (IS, LM, FE) in its own colour wherever it appears in the cell. */
function coloured(text: string) {
  return text.split(/(\bIS\b|\bLM\b|\bFE\b)/).map((part, i) =>
    part === "IS" ? <span key={i} className="text-is">IS</span> : part === "LM" ? <span key={i} className="text-lm">LM</span> : part === "FE" ? <span key={i} className="text-fe">FE</span> : part
  );
}

/** A lesson's own news-to-model table. The headlines are invented examples. */
export default function NewsTable({ rows, columns = defaultCols }: { rows: NewsRow[]; columns?: [string, string, string, string] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="pb-2 text-left font-serif text-[22px] font-semibold">From the news to the model</caption>
        <thead>
          <tr className="border-b border-rule text-xs uppercase tracking-wide text-muted-foreground">
            {columns.map((c) => <th key={c} scope="col" className="py-1 pr-3 font-semibold">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.headline} className="border-b border-rule align-top">
              <td className="py-2 pr-3 italic">&ldquo;{r.headline}&rdquo;</td>
              <td className="py-1.5 pr-3">{r.driver}</td>
              <td className="py-2 pr-3 font-semibold">{coloured(r.curve)}</td>
              <td className="py-1.5">{r.effect}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1 text-xs text-muted-foreground">Headlines are invented examples written for this course.</p>
    </div>
  );
}
