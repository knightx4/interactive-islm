# Design language

The app should read like a considered economics text: a textbook figure or a
financial-press chart, not a component kit.

## Principles
1. **Paper and ink.** Cool off-white background (#f6f7f9; #111317 in dark), near-black ink text, no gradients.
2. **Rules, not boxes.** Sections are separated by hairline rules and whitespace.
   No cards, no card-in-card, no drop shadows, no pastel pills. Corner radius is
   2px at most.
3. **Type.** Source Serif 4 for headings and reading text; Source Sans 3 for
   controls, labels and chart text. Numbers use tabular lining figures (`.num`).
4. **One colour per curve**, the same everywhere (charts, legends, prose, tables):

   | Curve  | Light     | Dark      | Token        |
   | ------ | --------- | --------- | ------------ |
   | IS     | `#1f4e79` | `#6fa3d6` | `--c-is`     |
   | LM     | `#a3302b` | `#e57d72` | `--c-lm`     |
   | FE     | `#2e6b3c` | `#6dba7d` | `--c-fe`     |
   | Labour | `#a8670f` | `#dba04a` | `--c-labour` |
   | Money  | `#5a4a86` | `#a594d6` | `--c-money`  |

   Tailwind: `text-is`, `stroke-lm`, `bg-fe`, etc. Colour is never the only cue:
   curves are also labelled directly.
   **Points.** A (start), B (impact) and C (long run) are black, red and blue
   (`--pt-a`, `--pt-b`, `--pt-c`) and always carry their letter. Ghost curves are
   dashed with a shift arrow in the curve's colour.
5. **Charts** (see `components/chart`): hairline axes with ticks, no box, light
   horizontal gridlines only, axis labels at least 12px in sans, curves 2px
   with the name set at the line end in the curve's colour, no corner legends.
   Equilibrium is a small ink dot with dotted guides to the axes. Charts fill
   their column; they are never squashed into a corner.
6. **Dark mode** follows `prefers-color-scheme`; `data-theme="light|dark"` on
   `<html>` overrides. Only tokens change, never component code.
7. **Responsive.** Reading width is 40rem for prose; layouts must work at
   390px and 1440px.

## Tokens
Defined in `app/globals.css`: `--paper`, `--ink`, `--ink-soft`, `--ink-faint`,
`--rule`, `--wash`, plus the curve colours. shadcn names (`--background`,
`--border`, ...) map onto these.

## Motion
Animation never carries information that a still frame lacks. With
`prefers-reduced-motion: reduce`, transitions are off and the lab jumps between
points A, B and C. See `docs/learn/LESSON-STANDARD.md` for lesson rules.
