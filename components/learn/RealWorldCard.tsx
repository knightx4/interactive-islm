import { realWorld } from "@/lib/learn/context";

/** A short public-facts note beside the toy model: a grey panel with large figures and a source line. */
export default function RealWorldCard({ shockId }: { shockId: string }) {
  const c = realWorld[shockId];
  if (!c) return null;
  return (
    <aside className="panel-wash max-w-2xl p-5" aria-label="Real-world note">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">In the real world · {c.heading}</p>
      {c.stats && (
        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
          {c.stats.map((st) => (
            <div key={st.value} className="max-w-[16rem]">
              <div className="num font-sans text-[28px] font-semibold leading-tight">{st.value}</div>
              <div className="font-sans text-[13px] text-muted-foreground">{st.label}</div>
            </div>
          ))}
        </div>
      )}
      <p className="prose-text mt-3 text-sm">{c.text}</p>
      <p className="mt-3 font-sans text-[13px] text-muted-foreground">
        {c.source ? `Source: ${c.source}. ` : "Public facts, approximate. "}The curves are a toy model in index units, not a forecast.
      </p>
    </aside>
  );
}
