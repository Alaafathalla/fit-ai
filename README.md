# FitAI Coach — Frontend + Local Fake API

This build is fully standalone. The Prisma/PostgreSQL backend, Next.js `app/api/*`
routes, database setup, and external backend configuration have been removed.

All app data now comes from `lib/fake-api.ts` through the existing `@/lib/api`
imports. Demo mutations such as profile edits, hydration, meal logs, completed
workouts, and coach messages are stored in browser `localStorage`.

## Run

```bash
pnpm install
pnpm dev
```

or:

```bash
npm install
npm run dev
```

No database and no `.env.local` API URL are required.

## Reset demo data

Clear the browser key `fitai-fake-api-v1`, or call `resetFakeApi()` from
`lib/fake-api.ts` during development.
