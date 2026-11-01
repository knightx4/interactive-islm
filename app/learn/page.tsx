import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lessons, parts } from "@/lib/learn/lessons";

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <section className="space-y-2 rounded-xl border bg-card p-5 shadow-sm md:p-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Learn IS-LM</h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            A short course in {lessons.length} lessons across four parts. Each lesson lets you pick a
            shock, predict what happens, then watch the IS, LM and FE curves and the markets behind
            them adjust over time.
          </p>
        </section>
        {parts.map((part) => (
          <section key={part.n} className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold">Part {part.n}: {part.title}</h2>
              <p className="text-sm text-muted-foreground">{part.blurb}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {lessons.filter((l) => l.part === part.n).map((l) => (
                <Link key={l.slug} href={`/learn/${l.slug}`} className="block">
                  <Card className="h-full transition-colors hover:bg-accent/40">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base">{l.n}. {l.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5 text-sm text-muted-foreground">{l.summary}</CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
