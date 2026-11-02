import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LessonLab from "@/components/learn/LessonLab";
import { lessonBySlug, lessons, parts } from "@/lib/learn/lessons";

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
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

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 md:px-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/learn" className="underline underline-offset-4">Learn</Link> / Part {part.n}: {part.title}
      </nav>
      <header className="mt-3 max-w-2xl">
        <h1 className="text-3xl md:text-4xl">{heading(lesson)}</h1>
        <p className="prose-text mt-3 text-lg text-muted-foreground">{lesson.summary}</p>
      </header>

      <div className="prose-text mt-4 max-w-2xl space-y-4">
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

      {lesson.lab && (
        <div className="mt-10">
          <LessonLab key={lesson.slug} lab={lesson.lab} />
        </div>
      )}

      <div className="mt-10 flex justify-between gap-4 border-t border-rule pt-4 text-sm">
        {prev ? <Link className="underline underline-offset-4" href={`/learn/${prev.slug}`}>← {heading(prev)}</Link> : <span />}
        {next ? <Link className="text-right underline underline-offset-4" href={`/learn/${next.slug}`}>{heading(next)} →</Link> : <span />}
      </div>
    </div>
  );
}
