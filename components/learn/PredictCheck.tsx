"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PickButton } from "@/components/ui/pick-button";
import { variables, type Direction, type Horizon, type Question, type Variable } from "@/lib/macro/predict";

const opts: { v: Direction; sym: string; label: string }[] = [
  { v: "up", sym: "↑", label: "rises" },
  { v: "down", sym: "↓", label: "falls" },
  { v: "same", sym: "–", label: "no change" },
];
const mark: Record<Direction, string> = { up: "↑", down: "↓", same: "–" };
const num = (x: number) => (Math.abs(x) < 10 ? x.toFixed(2) : x.toFixed(1));

/**
 * Predict-then-reveal across Y, r, P, C, I, N, w, e and NX: a guess for each variable at B (short run)
 * and at C (long run), checked against the model once revealed.
 */
export default function PredictCheck({
  questions, revealed, onReveal,
}: { questions: Question[]; revealed: boolean; onReveal: () => void }) {
  const [guess, setGuess] = useState<Record<string, Direction | "">>({});
  const answered = questions.filter((q) => guess[q.id]).length;
  const score = questions.filter((q) => guess[q.id] === q.answer).length;
  const vars = variables.filter((v) => questions.some((q) => q.variable === v.id));
  const get = (v: Variable, h: Horizon) => questions.find((q) => q.variable === v && q.horizon === h)!;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-sm">
          <thead>
            <tr className="border-b border-rule text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="py-1 pr-3 font-semibold">Variable</th>
              <th scope="col" className="py-1 pr-3 font-semibold">At B, prices not yet moved</th>
              <th scope="col" className="py-1 font-semibold">At C, prices fully adjusted</th>
            </tr>
          </thead>
          <tbody>
            {vars.map((v) => (
              <tr key={v.id} className="border-b border-rule align-middle">
                <th scope="row" className="py-2 pr-3 text-left font-normal">{v.label}</th>
                {(["short", "long"] as const).map((h) => {
                  const q = get(v.id, h);
                  const g = guess[q.id] ?? "";
                  const right = revealed && g === q.answer;
                  const wrong = revealed && g && g !== q.answer;
                  return (
                    <td key={h} className="py-2 pr-3">
                      <span className="inline-flex gap-1.5" role="group" aria-label={`${v.label}, ${h === "short" ? "at B" : "at C"}`}>
                        {opts.map((o) => (
                          <PickButton key={o.v} aria-label={`${v.label} ${o.label}`} chosen={g === o.v} disabled={revealed}
                            right={revealed && o.v === q.answer} wrong={revealed && g === o.v && o.v !== q.answer}
                            onClick={() => setGuess((st) => ({ ...st, [q.id]: o.v }))}>{o.sym}</PickButton>
                        ))}
                      </span>
                      {revealed && (
                        <span className={`num ml-2 ${right ? "font-semibold" : ""}`}>
                          {mark[q.answer]} <span className="text-muted-foreground">{num(q.from)} → {num(q.to)}</span>
                          {wrong && <span className="sr-only"> (your answer was wrong)</span>}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {revealed ? (
        <p className="text-sm font-medium">
          {answered ? `You got ${score} of ${questions.length}. ` : ""}Green marks the model&apos;s answer; red marks a miss. Numbers run from A to the point shown.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" disabled={answered < questions.length} onClick={onReveal}>Reveal</Button>
          <Button type="button" variant="ghost" onClick={onReveal}>Skip the prediction</Button>
          <span className="text-sm text-muted-foreground">{answered} of {questions.length} answered</span>
        </div>
      )}
    </div>
  );
}
