import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CaseChains from "@/components/learn/CaseChains";
import CaseNotes from "@/components/learn/CaseNotes";
import LessonLab from "@/components/learn/LessonLab";
import NewsTable from "@/components/learn/NewsTable";
import Predictions from "@/components/learn/Predictions";
import { LessonStageProvider, ShowThis, StickyFigure } from "@/components/learn/LessonStage";
import { figureFor } from "@/lib/learn/figures";
import Widget from "@/components/learn/widgets";
import { lessonBySlug, lessons, parts } from "@/lib/learn/lessons";

export function generateStaticParams() {
  return lessons.filter((l) => l.kind !== "practice").map((l) => ({ slug: l.slug }));
}

const heading = (l: { n: number; title: string }) => (l.n ? `${l.n}. ${l.title}` : l.title);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const l = lessonBySlug((await params).slug);
  return { title: l ? `${heading(l)} | Interactive IS-LM` : "Lesson" };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const lesson = lessonBySlug((await params).slug);
  if (!lesson) notFound();
  const i = lessons.indexOf(lesson);
  const prev = lessons[i - 1];
  const next = lessons[i + 1];
  const part = parts.find((p) => p.n === lesson.part)!;

  const sections = lesson.sections ?? [];

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-16 pt-8 md:px-8">
      <LessonStageProvider>
        <div className="flex flex-wrap items-start gap-x-12 gap-y-8">
          <article className="min-w-0 max-w-[680px] flex-[999_1_560px]">
            <nav className="font-sans text-[13px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              <Link href="/learn" className="underline-offset-4 hover:underline">Learn</Link> · Part {part.n} · {part.title}
            </nav>
            <h1 className="mt-2 text-4xl leading-[1.1] md:text-[44px]">{heading(lesson)}</h1>
            <p className="reading mt-4 text-muted-foreground">{lesson.summary}</p>

            <div className="reading mt-4 space-y-4">
              {lesson.body ? (
                <>
                  {lesson.body.map((p, k) => <p key={k}>{p}</p>)}
                  {lesson.takeaways && (
                    <ul className="list-disc space-y-1 pl-5">
                      {lesson.takeaways.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  )}
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">The text of this lesson is still being written. It will cover:</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {lesson.covers.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                </>
              )}
            </div>

            {sections.map((sec, i) => (
              <section key={sec.heading} className="mt-8 border-t border-rule pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-[26px] leading-tight">{sec.heading}</h2>
                  <ShowThis index={i} count={sections.length} />
                </div>
                <div className="reading mt-3 space-y-3">
                  {sec.paras.map((t, k) => <p key={k}>{t}</p>)}
                </div>
                {sec.widget && <div className="mt-4 overflow-x-auto"><Widget id={sec.widget} /></div>}
              </section>
            ))}
          </article>

          <div className="min-w-0 flex-[1_1_420px] lg:sticky lg:top-20 lg:self-start">
            <StickyFigure spec={figureFor(lesson)} />
          </div>
        </div>
      </LessonStageProvider>

      {lesson.lab && (
        <div className="mt-10">
          <LessonLab key={lesson.slug} lab={lesson.lab} />
        </div>
      )}

      {lesson.cases && (
        <section className="mt-10 border-t border-rule pt-4">
          <h2 className="text-2xl">Worked real-world cases</h2>
          <div className="mt-3"><CaseNotes cases={lesson.cases} /></div>
        </section>
      )}

      {lesson.chains && (
        <section className="mt-10 border-t border-rule pt-4">
          <h2 className="text-2xl">{lesson.chainsHeading ?? "Cases as cause chains"}</h2>
          <div className="mt-3"><CaseChains cases={lesson.chains} /></div>
        </section>
      )}

      {lesson.news && (
        <section className="mt-10 border-t border-rule pt-4">
          <NewsTable rows={lesson.news} columns={lesson.newsColumns} />
        </section>
      )}

      {lesson.predictions && (
        <section className="mt-10 border-t border-rule pt-4">
          <h2 className="text-2xl">Check your predictions</h2>
          <p className="prose-text mt-1 max-w-2xl text-sm text-muted-foreground">Choose an answer first; the reasoning appears after you check.</p>
          <div className="mt-3"><Predictions items={lesson.predictions} /></div>
        </section>
      )}

      <div className="mt-10 flex justify-between gap-4 border-t border-rule pt-4 font-sans text-sm">
        {prev ? <Link className="underline underline-offset-4" href={`/learn/${prev.slug}`}>← {heading(prev)}</Link> : <span />}
        {next ? <Link className="text-right underline underline-offset-4" href={`/learn/${next.slug}`}>{heading(next)} →</Link> : <span />}
      </div>
    </div>
  );
}
