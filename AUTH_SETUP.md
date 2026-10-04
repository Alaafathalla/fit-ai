# FitAI authentication

The project is still frontend-only, so authentication is implemented as a browser-persisted demo auth layer in `lib/auth.ts` rather than a production identity server.

## Routes

- `/auth/login` — Athlete / Coach login
- `/auth/register` — Athlete / Coach registration
- `/auth/forgot-password` — Password recovery
- `/auth/reset-password` — Reset flow
- `/coach-portal` — Coach-only workspace

Convenience aliases are also available at `/login`, `/register`, `/user-login`, `/coach-login`, and `/forgot-password`.

## Demo credentials

Athlete:
- Email: `athlete@fitai.app`
- Password: `FitAI123!`

Coach:
- Email: `coach@fitai.app`
- Password: `FitAI123!`

## Behavior

- Athlete logins land on `/dashboard`.
- Coach logins land on `/coach-portal`.
- Pages using `Shell` require a valid session.
- Coach-only `Shell` pages can pass `allowedRoles={['COACH']}`.
- Sign out is available from the sidebar account panel.
- Session duration is 30 days with “Keep me signed in”, otherwise 12 hours for the browser session.

## Production note

For production, move account creation, password hashing, session issuance, password reset emails, and authorization checks to a server-side identity/API layer. The current browser storage implementation is intentionally suitable for this standalone demo build only.
