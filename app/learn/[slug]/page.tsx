import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LessonLab from "@/components/learn/LessonLab";
import { lessonBySlug, lessons, parts } from "@/lib/learn/lessons";

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const l = lessonBySlug((await params).slug);
  return { title: l ? `${l.n}. ${l.title} | Interactive IS-LM` : "Lesson" };
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
        <h1 className="text-3xl md:text-4xl">{lesson.n}. {lesson.title}</h1>
        <p className="prose-text mt-3 text-lg text-muted-foreground">{lesson.summary}</p>
      </header>
      <div className="prose-text mt-4 max-w-2xl space-y-4">
        {lesson.body.map((p, k) => <p key={k}>{p}</p>)}
        <ul className="list-disc space-y-1 pl-5">
          {lesson.takeaways.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>

      <div className="mt-10">
        <LessonLab key={lesson.slug} regime={lesson.regime} defaultShock={lesson.defaultShock} />
      </div>

      <aside className="mt-10 max-w-2xl border-t border-ink pt-4">
        <h2 className="text-xl">{lesson.realWorld.heading}</h2>
        <p className="prose-text mt-1">{lesson.realWorld.text}</p>
      </aside>

      <div className="mt-10 flex justify-between gap-4 border-t border-rule pt-4 text-sm">
        {prev ? <Link className="underline underline-offset-4" href={`/learn/${prev.slug}`}>← {prev.n}. {prev.title}</Link> : <span />}
        {next ? <Link className="text-right underline underline-offset-4" href={`/learn/${next.slug}`}>{next.n}. {next.title} →</Link> : <span />}
      </div>
    </div>
  );
}
