# Design language

The app should read like a considered economics text: a textbook figure or a
financial-press chart, not a component kit.

## Principles
The approved direction is the Workbench (reference artboards in
`docs/references/workbench/`: Main = desktop, Phone = 390px, Lesson).

1. **White page, grey panels.** The page is white (`--paper` #ffffff; #111317 in
   dark). Panels have a #e3e6eb hairline (`--rule`) and 12px corners (`.panel`);
   quiet blocks use the #f4f6f8 wash (`--wash`, `.panel-wash`). No gradients and no
   drop shadows.
2. **Hairlines over heavy rules.** Sections are separated by `--rule` hairlines
   and whitespace. Control borders are the slightly stronger `--rule-control`
   (#d9dde3). Ink-black borders mark only the active control.
3. **Type.** IBM Plex Sans for controls, labels and chart text. Source Serif 4
   only for page titles and lesson reading text (`.reading`, about 19px / 1.65).
   Numbers use tabular figures (`.num`) so values never jitter.
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
   apart at a glance. Curves are drawn 2.5px; FE is always dashed; ghosts are 1.5px, dashed, at 45%.
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
`--rule`, `--rule-control`, `--wash`, the reset-pill tokens (`--reset-bg`, `--reset-fg`, `--reset-border`), plus the curve colours. shadcn names (`--background`,
`--border`, ...) map onto these.

## Shared controls (`components/ui`)
Use these rather than restyling buttons per screen.

| Component | File | Look |
| --- | --- | --- |
| `ScenarioChip` | `scenario-chip.tsx` | Rounded-full chip, 36px high, 13px medium; `active` fills it with ink. |
| `ResetPill` | `reset-pill.tsx` | Red pill: fill #fdecea, text #b42318, border #f1b9b3, reset icon, "Reset all". |
| `PhaseButton` | `phase-button.tsx` | A / B / C button: coloured letter over a short name, 44px min height, `active` adds an ink ring. |
| `CurveTabs`, `CurveTabPanel` | `curve-tabs.tsx` | IS / LM / FE / Open strip on Radix tabs; each label in its curve colour; ink underline when active. |
| `CauseSliderRow` | `cause-slider-row.tsx` | Name, "through …" line, then falls / slider / rises / value. The value sits in a fixed 44px slot (`CAUSE_VALUE_SLOT_PX`) so it never clips. Range −3 to +3 in half steps. |

`Slider` takes its colour from the `--slider-color` CSS variable (the curve token).

## Motion
Animation never carries information that a still frame lacks. With
`prefers-reduced-motion: reduce`, transitions are off and the lab jumps between
points A, B and C. See `docs/learn/LESSON-STANDARD.md` for lesson rules.
