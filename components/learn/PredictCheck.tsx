"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Direction, Question } from "@/lib/macro/predict";

const opts: { v: Direction; label: string }[] = [
  { v: "up", label: "Up" },
  { v: "same", label: "No change" },
  { v: "down", label: "Down" },
];

export default function PredictCheck({
  questions, revealed, onReveal,
}: { questions: Question[]; revealed: boolean; onReveal: () => void }) {
  const [guess, setGuess] = useState<Record<string, Direction>>({});
  const complete = questions.every((q) => guess[q.id]);
  const score = questions.filter((q) => guess[q.id] === q.answer).length;

  return (
    <div className="space-y-3">
      {questions.map((q) => (
        <fieldset key={q.id} className="space-y-1">
          <legend className="text-sm text-foreground">{q.label}</legend>
          <div className="flex flex-wrap gap-2">
            {opts.map((o) => {
              const picked = guess[q.id] === o.v;
              const verdict = revealed && (o.v === q.answer ? "border-fe bg-wash text-fe font-semibold" : picked ? "border-lm bg-wash text-lm" : "");
              return (
                <label key={o.v} className={`cursor-pointer border border-rule px-3 py-1 text-sm ${picked ? "border-ink bg-ink text-paper" : "hover:border-ink"} ${verdict || ""}`}>
                  <input type="radio" className="sr-only" name={q.id} disabled={revealed}
                    checked={picked} onChange={() => setGuess((g) => ({ ...g, [q.id]: o.v }))} />
                  {o.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
      {revealed ? (
        <p className="text-sm font-medium">
          {Object.keys(guess).length ? `You got ${score} of ${questions.length}. ` : ""}
          The model&apos;s answer is outlined in green.
        </p>
      ) : (
        <div className="flex gap-2">
          <Button type="button" disabled={!complete} onClick={onReveal}>Reveal and play</Button>
          <Button type="button" variant="ghost" onClick={onReveal}>Skip prediction</Button>
        </div>
      )}
    </div>
  );
}
