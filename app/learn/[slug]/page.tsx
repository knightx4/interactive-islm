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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <nav className="text-sm text-muted-foreground">
          <Link href="/learn" className="hover:underline">Learn</Link> / Part {part.n}: {part.title}
        </nav>
        <section className="space-y-3 rounded-xl border bg-card p-5 shadow-sm md:p-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{lesson.n}. {lesson.title}</h1>
          <p className="text-muted-foreground">{lesson.summary}</p>
          {lesson.body.map((p, k) => <p key={k} className="text-gray-800">{p}</p>)}
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-800">
            {lesson.takeaways.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>

        <LessonLab key={lesson.slug} regime={lesson.regime} defaultShock={lesson.defaultShock} />

        <section className="rounded-xl border border-dashed bg-card p-4 text-sm">
          <h2 className="font-semibold">{lesson.realWorld.heading}</h2>
          <p className="mt-1 text-gray-700">{lesson.realWorld.text}</p>
        </section>

        <div className="flex justify-between text-sm">
          {prev ? <Link className="hover:underline" href={`/learn/${prev.slug}`}>← {prev.n}. {prev.title}</Link> : <span />}
          {next ? <Link className="hover:underline" href={`/learn/${next.slug}`}>{next.n}. {next.title} →</Link> : <span />}
        </div>
      </div>
    </div>
  );
}
