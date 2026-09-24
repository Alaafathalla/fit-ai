# Database setup for FitAI Coach

This project is a single Next.js application: the UI and `/api/*` backend routes are in the same app.
The API still requires a PostgreSQL database because all main endpoints use Prisma.

## Required environment variables

Create `.env` locally, or add these values in your hosting environment:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
FITAI_USER_ID="u1"
NEXT_PUBLIC_BASE_URL="https://YOUR-DOMAIN.com"
```

## First production setup

Run once after `DATABASE_URL` is configured:

```bash
pnpm install
pnpm db:generate
pnpm db:setup
pnpm build
pnpm start
```

`pnpm db:setup` now applies the initial production migration and seeds the demo user/data.

## Existing database

If the schema already exists and you do NOT want to reseed demo data, run only:

```bash
pnpm db:deploy
```

## Health check

Open:

```text
/api/health
```

Expected result:

```json
{"status":"ok","database":"connected"}
```

If it reports `database: unavailable`, check `DATABASE_URL`, PostgreSQL network access, credentials, and SSL requirements.
