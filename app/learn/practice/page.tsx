import Link from "next/link";
import type { Metadata } from "next";
import PracticeBoard from "@/components/learn/PracticeBoard";
import { practiceQuestions } from "@/lib/learn/practice";
import { lessons } from "@/lib/learn/lessons";

export const metadata: Metadata = { title: "Practice | Interactive IS-LM" };

export default function PracticePage() {
  const prev = lessons[lessons.length - 2];
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 md:px-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/learn" className="underline underline-offset-4">Learn</Link> / Part 4: Practice
      </nav>
      <header className="mt-3 max-w-2xl">
        <h1 className="text-3xl md:text-4xl">Practice</h1>
        <p className="prose-text mt-3 text-lg text-muted-foreground">
          {practiceQuestions.length} prediction questions across every lesson. Read a short news brief, predict which way a variable moves, then watch the curves
          play it out and read the reason. Answers come from the same model as the lessons. All briefs are invented examples, and index units, not real data.
        </p>
      </header>
      <div className="mt-6"><PracticeBoard /></div>
      <div className="mt-10 flex justify-between gap-4 border-t border-rule pt-4 text-sm">
        <Link className="underline underline-offset-4" href={`/learn/${prev.slug}`}>← {prev.n}. {prev.title}</Link>
        <span />
      </div>
    </div>
  );
}
