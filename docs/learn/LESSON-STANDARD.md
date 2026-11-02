# Lesson standard

What every lesson in `/learn` must meet before it is merged. Lesson text lives in
`lib/learn/lessons.ts`; the model in `lib/macro`; the lab pieces in `components/learn`.

## 1. Own words (the rule that overrides the rest)

Every lesson, check, card, headline, drill and explanation is **written for this
app in our own words**. That means:

- no slide text, lecture quotes, problem-set or exam wording, and no close paraphrase of any of them;
- no figures, tables or exercise data copied from course files;
- no course files in this repository, and no pasted excerpts in commits, issues or pull requests;
- headlines in "news to model" tables are **invented examples**, not quotations from real outlets;
- real-world notes use **public facts** (dates, rough magnitudes) stated in our own sentences, and say they are approximate.

If a specific is needed that you cannot state from the standard IS-LM-FE framework, do not guess and do not copy:
use the textbook version, say so in the pull request, and list what the author should compare against the course.

## 2. What a finished lesson contains

1. **Title, one-line summary, and the part it belongs to** (numbers follow the course order in `lessons.ts`).
2. **Reading text** at a 40rem measure: short paragraphs, plain language, symbols defined at first use.
   Define every curve by what it holds fixed; never state a result without saying which curve moves.
3. **Takeaways**: three to five bullets, each a claim a student could be tested on.
4. **A lab**, where the topic has one (`LabSpec`): economy, the shocks offered, and a default shock.
5. **A real-world note** for each shock played (`RealWorldCard`, data in `lib/learn/context.ts`).
6. **A news-to-model table** (`NewsToModel`): headline, driver, curve moved, effect.

A lesson whose text is not written yet shows its outline (`covers`) and says so. It never shows filler.

## 3. The lab

Every lab plays a shock through, in this order:

1. **Choose a shock.** Every shock is a row of the shift table (`lib/macro/shocks.ts`) and is tagged with the curve it moves.
2. **Predict first.** A guess for each of Y, r, P, C, I, N, w and (if open) e and NX, at point B (prices fixed) and point C (prices adjusted).
   The answer is revealed afterwards and scored; "skip" is allowed but never the default.
3. **The eight-step recipe** (`recipeFor`): start at A; name the shock; move the curve; find B; check the side markets;
   compare output with FE; let prices adjust; land at C and compare with A.
4. **Figures that follow the step**: IS, LM and FE with ghost curves and a shift arrow; points **A (black), B (red), C (blue)**;
   all three side markets (saving and investment, money, labour) and, when open, the balance of payments; time paths with a cursor.
5. **A cause chain** that lights up link by link as the recipe reaches each link (`chainFor`).

## 4. Numbers and honesty

- All values are index units from a calibrated toy economy (baseline Y* = 100, r* = 5%, P = 1). Say so near every figure.
- Directions come from the model itself, never typed in by hand. If a lesson claims a direction, a test in `lib/macro` should hold it.
- A result the model cannot determine on its own (it depends on parameters) is labelled as such, not asserted.
- Keep real-world facts and model output visibly separate: the real-world note sits beside the lab, never inside a figure.

## 5. Design and access

- Follow `docs/DESIGN.md`: paper and ink, rules not boxes, one colour per curve, direct labels, no showcase or demo pages.
- Colour is never the only cue: points carry the letters A, B and C; curves are labelled at the line end.
- **Motion is optional.** Under `prefers-reduced-motion: reduce` the figures jump between A, B and C instead of animating,
  the autoplay is replaced by a "Jump to C" button, and CSS transitions are effectively off.
- Works at 390px and 1440px. Every control is reachable by keyboard; figures have a text description; live regions announce the current step.

## 6. Before merging

`npm run lint && npm test && npm run build` must pass, the lesson's page must render, and every old address
for the lesson must redirect to it (`legacySlugs` in `lib/learn/lessons.ts`).
