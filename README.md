# Practical Drumming — Mastermind Club

A Vite + React 19 SPA (React Router v7, TailwindCSS v4) with Vercel serverless
functions and a mirrored local Express dev server. It now includes a full
mastermind SaaS layer: auth + RBAC, CRM lead intelligence, a booking system,
LiveKit video classrooms, and transactional email.

> Note: this project is a Vite SPA, **not** Next.js. App-Router-style routes are
> implemented with React Router, and "route handlers" are Vercel serverless
> functions in `/api` (mirrored in `server/index.js` for local dev).

## Quick start

```bash
npm install
cp .env.example .env   # fill in keys (optional — see "Demo mode")
npm run dev            # runs Vite + the local API server concurrently
```

- `npm run dev` — client (Vite) + API (Express) together
- `npm run build` — type-check then production build
- `npm run lint` — ESLint

## Demo mode (no keys required)

Every integration degrades gracefully:

- **No Supabase keys** → the app runs in mock mode. Auth is mocked (enter as
  Admin or Member from `/login`), and data views show seeded fixtures so the
  CRM, booking, and dashboards are fully explorable.
- **No LiveKit keys** → `/room/:roomName` shows a graceful placeholder.
- **No Resend key** → emails are skipped but still logged to `email_logs`.

## Environment variables

See [.env.example](.env.example). Client vars are prefixed `VITE_`; the rest are
server-only and must never be exposed to the browser.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | client | Supabase (RLS-enforced) |
| `VITE_LIVEKIT_URL` | client | LiveKit websocket URL |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | server | Privileged serverless ops |
| `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` | server | Mint LiveKit JWTs |
| `RESEND_API_KEY` / `EMAIL_FROM` | server | Transactional email |
| `PUBLIC_BASE_URL` | server | Links inside emails |

## Supabase setup

1. Create a Supabase project; copy the URL + anon key into `VITE_*` and the
   URL + service-role key into the server vars.
2. Run [supabase/schema.sql](supabase/schema.sql) in the SQL editor. It creates
   all tables, the `is_admin()` helper, RLS policies, a profile-on-signup
   trigger, and adds CRM tables to the Realtime publication.
3. (Optional) Run [supabase/seed.sql](supabase/seed.sql) for sample cohorts and
   availability slots. Promote yourself to admin:
   `update public.profiles set role = 'admin' where email = 'you@example.com';`

## Systems

- **Auth + RBAC** — `src/lib/auth/AuthProvider.tsx`, guarded routes in
  `src/components/auth/ProtectedRoute.tsx`. Roles stored in `profiles.role`.
- **Lead tracking** — `src/lib/leads/useLeadTracking.ts` → `/api/leads/event`.
- **Email** — `/api/email/send` + `server/lib/emailTemplates.js`, logged to
  `email_logs`.
- **Booking** — `/book/:slug`, `/api/bookings/create`, `/api/bookings/cancel`,
  admin at `/admin/availability` and `/admin/bookings`.
- **LiveKit** — `/api/livekit/token`, room at `/room/:roomName` with a live
  `ConnectionStrengthMeter`.
- **CRM** — `/admin/leads` (data layer `src/lib/crm/getLeads.ts`): lead list,
  filters, timeline, heatmap, admin actions, and Realtime "LIVE" updates.

## Routes

Public: `/`, `/about`, `/club`, `/apply`, `/faq`, `/login`, `/book/:slug`
Member: `/dashboard`, `/cohorts`, `/sessions`, `/profile`, `/my-bookings`, `/room/:roomName`
Admin: `/admin`, `/admin/members`, `/admin/member/:id`, `/admin/cohorts`, `/admin/sessions`, `/admin/applications`, `/admin/availability`, `/admin/bookings`, `/admin/leads`
