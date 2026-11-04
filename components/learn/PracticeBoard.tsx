"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PickButton } from "@/components/ui/pick-button";
import { lessons } from "@/lib/learn/lessons";
import { practiceQuestions, resolve, type PracticeQuestion } from "@/lib/learn/practice";
import { variables, type Direction } from "@/lib/macro/predict";
import { viewFor } from "@/lib/macro/view";
import CurvesFigure from "./CurvesFigure";
import useReducedMotion from "./useReducedMotion";

const KEY = "islm-practice-tally-v1";
type Tally = Record<string, { right: number; total: number }>;
const numbered = lessons.filter((l) => l.n > 0);
const opts: { v: Direction; l: string; n: string }[] = [{ v: "up", l: "↑", n: "Up" }, { v: "down", l: "↓", n: "Down" }, { v: "same", l: "–", n: "Same" }];

const readTally = (): Tally => {
  try {
    const raw = window.localStorage.getItem(KEY);
    const t = raw ? JSON.parse(raw) : {};
    return t && typeof t === "object" ? t : {};
  } catch { return {}; }
};
const writeTally = (t: Tally) => { try { window.localStorage.setItem(KEY, JSON.stringify(t)); } catch { /* storage unavailable: the page works without it */ } };

function Question({ pq, onAnswer }: { pq: PracticeQuestion; onAnswer: (right: boolean) => void }) {
  const reduced = useReducedMotion();
  const [pick, setPick] = useState<Direction | null>(null);
  const [done, setDone] = useState(false);
  const [stage, setStage] = useState(0);
  const r = useMemo(() => resolve(pq), [pq]);
  const v = variables.find((x) => x.id === pq.variable)!;
  const last = pq.horizon === "long" ? 7 : 3;
  const steps = pq.horizon === "long" ? [0, 3, 7] : [0, 3];
  useEffect(() => {
    if (!done) return;
    if (reduced) { setStage(steps.length - 1); return; }
    if (stage >= steps.length - 1) return;
    const t = setTimeout(() => setStage(stage + 1), stage === 0 ? 700 : 1500);
    return () => clearTimeout(t);
  }, [done, stage, reduced, steps.length]);
  const view = viewFor(r.sim, done ? steps[Math.min(stage, steps.length - 1)] : 0, r.sim.frames.length - 1);
  const right = pick === r.truth;
  const lesson = numbered.find((l) => l.slug === pq.lesson)!;
  const check = () => { if (!pick) return; setDone(true); setStage(0); onAnswer(right); };
  const when = pq.horizon === "short" ? "right after the shock, with prices not yet moved (point B)" : "once prices have fully adjusted (point C)";
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lesson {lesson.n}. {lesson.title} · {pq.regime === "closed" ? "closed economy" : pq.regime === "floating" ? "floating rate" : "pegged rate"}</p>
        <p className="prose-text mt-2 text-lg">{pq.brief}</p>
        <p className="mt-3 font-semibold">Predict: {v.label}, {when}.</p>
        <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Your prediction">
          {opts.map((o) => (
            <PickButton key={o.v} role="radio" aria-checked={pick === o.v} aria-label={o.n} chosen={pick === o.v} disabled={done}
              right={done && o.v === r.truth} wrong={done && pick === o.v && o.v !== r.truth} onClick={() => setPick(o.v)}>{o.l}</PickButton>
          ))}
        </div>
        {!done ? (
          <Button type="button" size="sm" className="mt-3" disabled={!pick} onClick={check}>Check</Button>
        ) : (
          <div className="mt-3 space-y-2" aria-live="polite" role="status">
            <p className="font-semibold">{right ? "Right." : `Not quite: the answer is ${r.truth}.`}</p>
            <p className="prose-text text-sm">{pq.reason}</p>
            <p className="num text-sm text-muted-foreground">{v.label}: {r.from.toFixed(2)} → {r.to.toFixed(2)} (index units, from the model).</p>
          </div>
        )}
      </div>
      <div>
        {done ? (
          <>
            <CurvesFigure sim={r.sim} view={view} />
            <p className="num mt-1 text-sm font-semibold" aria-live="polite">{steps[Math.min(stage, steps.length - 1)] === 0 ? "Point A: before the shock" : steps[Math.min(stage, steps.length - 1)] === 3 ? "Point B: impact, prices not yet moved" : "Point C: prices fully adjusted"}</p>
            {stage < steps.length - 1 && !reduced && <p className="text-xs text-muted-foreground">Playing from A to {pq.horizon === "long" ? "C" : "B"}…</p>}
            {last === 7 && reduced && <p className="text-xs text-muted-foreground">Reduced motion is on: the figure jumps to the end.</p>}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">The figure appears once you have checked your answer.</p>
        )}
      </div>
    </div>
  );
}

export default function PracticeBoard() {
  const [lesson, setLesson] = useState<string>("all");
  const [order, setOrder] = useState<string[]>(() => practiceQuestions.map((x) => x.id));
  const [i, setI] = useState(0);
  const [tally, setTally] = useState<Tally>({});
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTally(readTally()); setLoaded(true); }, []);
  const pool = useMemo(() => order.map((id) => practiceQuestions.find((x) => x.id === id)!).filter((x) => lesson === "all" || x.lesson === lesson), [order, lesson]);
  const pq = pool[Math.min(i, pool.length - 1)];
  const record = (slug: string, right: boolean) => {
    setTally((t) => {
      const cur = t[slug] ?? { right: 0, total: 0 };
      const next = { ...t, [slug]: { right: cur.right + (right ? 1 : 0), total: cur.total + 1 } };
      writeTally(next);
      return next;
    });
  };
  const shuffle = () => {
    const a = practiceQuestions.map((x) => x.id);
    for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; }
    setOrder(a); setI(0);
  };
  const reset = () => { setTally({}); writeTally({}); };
  const totals = Object.values(tally).reduce((s, x) => ({ right: s.right + x.right, total: s.total + x.total }), { right: 0, total: 0 });
  const weakest = numbered.filter((l) => (tally[l.slug]?.total ?? 0) >= 2).sort((a, b) => tally[a.slug].right / tally[a.slug].total - tally[b.slug].right / tally[b.slug].total)[0];

  return (
    <div className="space-y-10">
      <section aria-label="Mode" className="border-t border-rule pt-4">
        <h2 className="text-xl">Choose what to practise</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span>Questions from</span>
            <select value={lesson} onChange={(e) => { setLesson(e.target.value); setI(0); }} className="border-b border-ink bg-transparent py-1">
              <option value="all">All lessons, mixed ({practiceQuestions.length})</option>
              {numbered.map((l) => <option key={l.slug} value={l.slug}>{l.n}. {l.title} ({practiceQuestions.filter((x) => x.lesson === l.slug).length})</option>)}
            </select>
          </label>
          <Button type="button" size="sm" variant="outline" onClick={shuffle}>Shuffle</Button>
        </div>
      </section>

      <section aria-label="Question" className="border-t border-rule pt-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl">Question {Math.min(i, pool.length - 1) + 1} of {pool.length}</h2>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" disabled={i <= 0} onClick={() => setI(i - 1)}>Previous</Button>
            <Button type="button" size="sm" variant="outline" disabled={i >= pool.length - 1} onClick={() => setI(i + 1)}>Next</Button>
          </div>
        </div>
        <div className="mt-4">
          {pq && <Question key={pq.id} pq={pq} onAnswer={(right) => record(pq.lesson, right)} />}
        </div>
      </section>

      <section aria-label="Tally" className="border-t border-rule pt-4">
        <h2 className="text-xl">Your tally by lesson</h2>
        <p className="mt-1 text-sm text-muted-foreground">Kept in this browser only. {loaded ? "" : "Loading…"}</p>
        <table className="num mt-3 w-full max-w-2xl text-sm">
          <thead><tr className="border-b border-ink text-left"><th className="py-1 font-semibold">Lesson</th><th className="font-semibold">Right</th><th className="font-semibold">Answered</th><th className="w-32 font-semibold">Share</th></tr></thead>
          <tbody>
            {numbered.map((l) => {
              const t = tally[l.slug] ?? { right: 0, total: 0 };
              const share = t.total ? t.right / t.total : 0;
              return (
                <tr key={l.slug} className="border-b border-rule">
                  <td className="py-1 pr-2 font-sans">{l.n}. {l.title}</td><td>{t.right}</td><td>{t.total}</td>
                  <td><span className="block h-2 bg-wash" role="img" aria-label={t.total ? `${Math.round(share * 100)} percent right` : "not answered yet"}><span className="block h-2" style={{ width: `${share * 100}%`, background: "var(--c-fe)" }} /></span></td>
                </tr>
              );
            })}
          </tbody>
          <tfoot><tr><td className="py-1 font-semibold">All lessons</td><td className="font-semibold">{totals.right}</td><td className="font-semibold">{totals.total}</td><td /></tr></tfoot>
        </table>
        <p className="prose-text mt-2 text-sm" aria-live="polite">{weakest ? `Most to review: lesson ${weakest.n}, ${weakest.title} (${tally[weakest.slug].right} of ${tally[weakest.slug].total} right).` : "Answer at least two questions from a lesson and the one you miss most will show here."}</p>
        <Button type="button" size="sm" variant="outline" className="mt-2" onClick={reset}>Reset tally</Button>
      </section>
    </div>
  );
}
