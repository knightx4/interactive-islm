import type { Metadata } from "next";

export const metadata: Metadata = { title: "Style | Interactive IS-LM" };

const curves = [
  ["IS", "text-is", "bg-is", "Goods market: Y = C + I + G + NX"],
  ["LM", "text-lm", "bg-lm", "Money market: M/P = L(Y, r)"],
  ["FE", "text-fe", "bg-fe", "Full employment output"],
  ["Labour", "text-labour", "bg-labour", "Labour market: N and the real wage"],
  ["Money", "text-money", "bg-money", "Money supply and demand"],
] as const;

export default function DesignPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Style</p>
      <h1 className="mt-1 text-4xl">A design language for a text, not a kit</h1>
      <p className="prose-text mt-4 text-lg text-foreground/90">
        Paper, ink and hairline rules. Serif for reading, sans for controls, tabular figures
        for numbers, and one fixed colour for each curve wherever it appears.
      </p>

      <section className="mt-10 border-t border-ink pt-4">
        <h2 className="text-2xl">Curve colours</h2>
        <ul className="mt-4 divide-y divide-rule border-y border-rule">
          {curves.map(([name, text, bg, desc]) => (
            <li key={name} className="flex items-center gap-4 py-3">
              <span className={`h-0.5 w-10 ${bg}`} aria-hidden />
              <span className={`w-16 font-semibold ${text}`}>{name}</span>
              <span className="text-sm text-muted-foreground">{desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 border-t border-ink pt-4">
        <h2 className="text-2xl">Type</h2>
        <h3 className="mt-4 text-xl">Heading three, serif</h3>
        <p className="prose-text mt-2 max-w-[40rem]">
          Reading text is set in a serif at a comfortable measure. When the central bank raises
          the money supply, the <span className="font-semibold text-lm">LM</span> curve shifts
          right; with prices fixed, output rises along the{" "}
          <span className="font-semibold text-is">IS</span> curve.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">Controls and captions: sans, 14px.</p>
        <table className="num mt-4 w-full border-y border-rule text-sm">
          <thead>
            <tr className="border-b border-ink text-left text-muted-foreground">
              <th className="py-2 font-medium">Variable</th>
              <th className="py-2 text-right font-medium">Before</th>
              <th className="py-2 text-right font-medium">After</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            <tr><td className="py-2">Output Y</td><td className="py-2 text-right">1,000.0</td><td className="py-2 text-right">1,042.5</td></tr>
            <tr><td className="py-2">Interest rate r (%)</td><td className="py-2 text-right">4.00</td><td className="py-2 text-right">3.35</td></tr>
          </tbody>
        </table>
      </section>

      <section className="mt-10 border-t border-ink pt-4">
        <h2 className="text-2xl">Chart, in the house style</h2>
        <figure className="mt-4">
          <svg viewBox="0 0 480 300" className="w-full" role="img" aria-label="Example IS and LM curves intersecting">
            <g className="stroke-rule" strokeWidth="1">
              {[60, 110, 160, 210].map((y) => <line key={y} x1="48" x2="460" y1={y} y2={y} />)}
            </g>
            <g className="stroke-ink" strokeWidth="1" fill="none">
              <path d="M48 10V260H460" />
            </g>
            <g className="fill-muted-foreground" fontSize="12" textAnchor="middle">
              <text x="254" y="290">Output, Y</text>
              <text transform="translate(14 135) rotate(-90)">Interest rate, r</text>
            </g>
            <path d="M70 40 L430 230" className="stroke-is" strokeWidth="2" fill="none" />
            <path d="M70 230 L430 40" className="stroke-lm" strokeWidth="2" fill="none" />
            <line x1="250" x2="250" y1="135" y2="260" className="stroke-ink" strokeDasharray="2 3" />
            <line x1="48" x2="250" y1="135" y2="135" className="stroke-ink" strokeDasharray="2 3" />
            <circle cx="250" cy="135" r="4" className="fill-ink" />
            <text x="436" y="236" fontSize="14" fontWeight="600" className="fill-is">IS</text>
            <text x="436" y="44" fontSize="14" fontWeight="600" className="fill-lm">LM</text>
          </svg>
          <figcaption className="mt-2 text-sm text-muted-foreground">
            Figure 1. Curves are named at the line end in their own colour; the equilibrium is an
            ink dot with dotted guides.
          </figcaption>
        </figure>
      </section>

      <section className="mt-10 border-t border-ink pt-4">
        <h2 className="text-2xl">Controls</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="border border-ink bg-ink px-4 py-2 text-sm text-paper">Primary</button>
          <button className="border border-ink px-4 py-2 text-sm">Secondary</button>
          <button className="px-1 py-2 text-sm underline underline-offset-4">Text action</button>
        </div>
      </section>
    </div>
  );
}
