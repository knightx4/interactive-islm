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
   | IS     | `#0072b2` | `#56b4e9` | `--c-is`     |
   | LM     | `#d55e00` | `#f5844c` | `--c-lm`     |
   | FE     | `#009e73` | `#3cc59a` | `--c-fe`     |
   | Labour | `#b07800` | `#e6a817` | `--c-labour` |
   | Money  | `#b4558e` | `#e08dc0` | `--c-money`  |

   The hues follow the Okabe-Ito palette, chosen to stay apart for colour-blind
   readers and to differ in lightness as well as hue, so IS, LM and FE can be told
   apart at a glance. Curves are drawn 2.5px; ghosts are 1.5px, dashed, at 45%.
   Tailwind: `text-is`, `stroke-lm`, `bg-fe`, etc. Colour is never the only cue:
   curves are also labelled directly.
   **Points.** A (start), B (impact) and C (long run) are grey, purple and black
   (`--pt-a`, `--pt-b`, `--pt-c`), so none shares a hue with a curve, and always carry their letter. Ghost curves are
   dashed with a shift arrow in the curve's colour.
5. **Charts** (see `components/chart`): hairline axes with ticks, no box, light
   horizontal gridlines only, axis labels at least 12px in sans, curves 2px
   with the name set at the line end in the curve's colour, no corner legends.
   Equilibrium is a small ink dot with dotted guides to the axes. Charts fill
   their column; they are never squashed into a corner.
6. **Light by default.** The app is light whatever the device prefers. The dark
   tokens apply only with `data-theme="dark"` on `<html>`. Only tokens change,
   never component code.
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
