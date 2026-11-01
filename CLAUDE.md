# interactive-islm

Next.js app for teaching the IS-LM model (see README.md). Core math is in `lib/islmModel.ts`.

## Run
- Install: `npm ci`
- Dev server: `npm run dev` (http://localhost:3000)

## Check (run before merging to main)
`npm run lint && npm test && npm run build`

(lint currently has one unused-variable warning, no errors; tests are Vitest.)

## Workflow
- Plan steps are built here, checked, merged to `main` and pushed.
- Plan rows live in the person's dashboard, knightx4/PersonalDashboard, not in this repo.
