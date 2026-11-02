import { realWorld } from "@/lib/learn/context";

/** A short public-facts note beside the toy model; a ruled aside, not a box. */
export default function RealWorldCard({ shockId }: { shockId: string }) {
  const c = realWorld[shockId];
  if (!c) return null;
  return (
    <aside className="max-w-2xl border-t border-ink pt-3" aria-label="Real-world note">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">In the real world</div>
      <h3 className="mt-0.5 text-lg">{c.heading}</h3>
      <p className="prose-text mt-1 text-sm">{c.text}</p>
      <p className="mt-1 text-xs text-muted-foreground">Public facts, approximate. The curves are a toy model in index units, not a forecast.</p>
    </aside>
  );
}
