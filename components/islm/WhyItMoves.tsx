"use client";

import { cn } from "@/lib/utils";
import { explain } from "@/lib/macro/why";
import type { Run } from "@/lib/macro/sim";
import type { Phase } from "@/lib/macro/playback";

const COLOR = { IS: "var(--c-is)", LM: "var(--c-lm)", FE: "var(--c-fe)" } as const;

/** Every moved cause under the curve it shifts, then what happens before and after prices adjust. */
export default function WhyItMoves({ run, at }: { run: Run; at: Phase | "moving" }) {
  const why = explain(run);
  return (
    <section className="panel flex flex-col gap-3 p-4" aria-label="Why it moves">
      <h2 className="font-sans text-sm font-semibold">Why it moves</h2>
      {!why.groups.length && (
        <p className="text-sm text-muted-foreground">Move any slider and the chain from cause to curve shows here, for every cause you have moved.</p>
      )}
      {why.groups.map((g) => (
        <div key={g.curve} className="flex flex-col gap-1.5">
          <h3 className="flex items-center gap-2 font-sans text-[13px] font-semibold" style={{ color: COLOR[g.curve] }}>
            <span className="size-2.5 rounded-full" style={{ background: COLOR[g.curve] }} aria-hidden />
            {g.head}
          </h3>
          {g.items.map((it) => (
            <p key={it.id} className="ml-[18px] text-sm leading-snug">
              <span className="font-semibold">{it.lead}.</span> {it.text}
            </p>
          ))}
        </div>
      ))}
      {why.short && (
        <ol className="flex flex-col gap-2">
          <li className={cn("flex gap-2.5 text-sm leading-snug", at === "A" ? "text-muted-foreground" : "")}>
            <span className="num w-[18px] shrink-0 text-xs font-semibold" style={{ color: "var(--pt-b)" }}>B</span>
            <span>Short run: {why.short}</span>
          </li>
          <li className={cn("flex gap-2.5 text-sm leading-snug", at === "C" ? "" : "text-muted-foreground")}>
            <span className="num w-[18px] shrink-0 text-xs font-semibold" style={{ color: "var(--pt-c)" }}>C</span>
            <span>Long run: {why.long}</span>
          </li>
        </ol>
      )}
    </section>
  );
}
