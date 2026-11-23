# FitAI Coach

A fitness dashboard demo with workout, nutrition, progress and coaching interfaces.

[Live demo](https://fit-ai-delta-brown.vercel.app/)

## Included interfaces

- Workout, nutrition, planner and progress interfaces.
- User and coach-facing routes.
- Local fake API used through the shared API module.
- Demo mutations persisted in browser localStorage.

## Built with

Next.js, React, TypeScript and Tailwind CSS.

## Run locally

Install a Node.js version supported by the framework dependencies in `package.json`.

```bash
npm install
npm run dev
```

Open the local URL printed by the development server.

## Production build

```bash
npm run build
```

## Project structure

- `app/`
- `components/`
- `lib/`
- `prisma/`
- `public/`
- `scripts/`

## Other scripts

- `npm run typecheck`

## Demo scope

Demo data is handled by a local fake API and persisted in browser localStorage. This is not a live AI coaching service or a production health-data backend.
