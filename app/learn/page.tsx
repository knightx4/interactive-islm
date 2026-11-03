import Link from "next/link";
import { lessons, parts } from "@/lib/learn/lessons";

export default function LearnPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 md:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl">Learn IS-LM</h1>
        <p className="prose-text mt-3 text-lg text-foreground/90">
          A short course in {lessons.filter((l) => l.n).length} numbered lessons across four parts, ending with a practice page. Each lesson lets you pick a
          shock, predict what happens, then watch the <span className="font-semibold text-is">IS</span>,{" "}
          <span className="font-semibold text-lm">LM</span> and <span className="font-semibold text-fe">FE</span>{" "}
          curves and the markets behind them adjust over time.
        </p>
      </header>
      {parts.map((part) => (
        <section key={part.n} className="mt-10 border-t border-rule pt-4">
          <h2 className="text-2xl">Part {part.n}: {part.title}</h2>
          <p className="mt-1 text-muted-foreground">{part.blurb}</p>
          <ol className="mt-3 divide-y divide-rule border-y border-rule">
            {lessons.filter((l) => l.part === part.n).map((l) => (
              <li key={l.slug}>
                <Link href={`/learn/${l.slug}`} className="group flex gap-4 py-3">
                  <span className="num w-6 shrink-0 text-muted-foreground">{l.n ? `${l.n}.` : ""}</span>
                  <span>
                    <span className="font-serif text-lg font-semibold group-hover:underline underline-offset-4">{l.title}</span>
                    <span className="block text-sm text-muted-foreground">{l.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
