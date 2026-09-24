# FitAI Coach — Frontend Only

This version contains the Next.js frontend only. The local Prisma/PostgreSQL backend and all `app/api/*` route handlers were removed.

## API configuration

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"
```

Replace the URL with the real backend API root.

The frontend calls these external endpoints directly:

- `GET /user`
- `PATCH /user`
- `GET /workouts`
- `GET /workouts/:id`
- `POST /workouts/complete`
- `GET /meals`
- `POST /meals/log`
- `GET /stats?days=N`
- `PATCH /stats/hydration`
- `GET /nutrition`
- `GET /progress`
- `GET /activity?limit=N`
- `GET /coach`
- `POST /coach`

If the backend uses Bearer authentication, the frontend automatically sends a token stored in browser localStorage as `access_token`.

## Run

```bash
pnpm install
pnpm dev
```

The frontend runs on `http://localhost:3000`, but data requests go directly to `NEXT_PUBLIC_API_BASE_URL` instead of `localhost:3000/api`.

## CORS

Because the browser now calls the external API directly, that API must allow the frontend origin, e.g. `http://localhost:3000` during development.
