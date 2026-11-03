import type { Case } from "@/lib/learn/lessons";

/** Worked real-world cases: ruled asides with an honest note about how approximate the figures are. */
export default function CaseNotes({ cases }: { cases: Case[] }) {
  return (
    <div className="space-y-6">
      {cases.map((c) => (
        <aside key={c.heading} className="max-w-2xl border-t border-rule pt-3" aria-label={`Real-world case: ${c.heading}`}>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">In the real world</div>
          <h3 className="mt-0.5 text-lg">{c.heading}</h3>
          <p className="prose-text mt-1 text-sm">{c.text}</p>
          <p className="mt-1 text-xs text-muted-foreground">{c.approx}</p>
        </aside>
      ))}
    </div>
  );
}
