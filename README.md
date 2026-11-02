# Interactive IS-LM model

A small [Next.js](https://nextjs.org/) app for teaching the **IS-LM** framework: goods market (IS), money market (LM), combined **(Y, r)** equilibrium, and a simple link to a stylized labor market. Sliders drive **linear, index-only** curves—they are **not** calibrated to real GDP or interest rates.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The layout is aimed at desktop or tablet; values on the axes are **model index units**.

## What the sliders do

- **Investment / savings** (and optional subcomponents): move the private **I** and **S** schedules in the top-left panel and feed the combined **IS** shift in the IS-LM diagram.
- **Fiscal (G, T)**: shifts the combined **IS** curve in the IS-LM view (higher **G** shifts IS right, higher **T** shifts IS left in this toy).
- **Money supply / demand** (and subcomponents): move the money-market panel and the **LM** curve.
- **Full employment Y*** (and subcomponents): vertical reference in the IS-LM chart; used with equilibrium **Y** to describe output gaps.

Core math lives in [`lib/macro/model.ts`](lib/macro/model.ts) so the simulator and the lessons give the same answers; the simulator's sliders map onto it in [`lib/macro/sim.ts`](lib/macro/sim.ts).

## Scripts

| Command        | Action                |
| -------------- | --------------------- |
| `npm run dev`  | Development server    |
| `npm run build`| Production build      |
| `npm run test` | Vitest unit tests     |
| `npm run lint` | ESLint                |

## License

ISC (see `package.json`).

## Learn course

`/learn` lists thirteen numbered lessons in three parts, then a Practice page as the fourth; each has a page at `/learn/<slug>` (old addresses redirect). Lessons and the simulator run on one model, [`lib/macro/model.ts`](lib/macro/model.ts): IS, LM and FE curves with a labour market, prices that adjust over time, and an open economy with capital mobility, floating or pegged rates, reserves and a linked partner. Lesson text lives in `lib/learn/lessons.ts`; shocks (the shift table) in `lib/macro/shocks.ts`. Rules for lesson authors: [`docs/learn/LESSON-STANDARD.md`](docs/learn/LESSON-STANDARD.md).
