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
- **`VITE_DEMO_LOGIN=true`** → shows the same seed-data chooser on `/login` even
  when Supabase is configured (for production reviewers). Choosing Member or
  Admin loads built-in demo fixtures instead of live database rows.
- **No LiveKit keys** → `/room/:roomName` shows a graceful placeholder.
- **No Resend key** → emails are skipped but still logged to `email_logs`.

## Environment variables

See [.env.example](.env.example). Client vars are prefixed `VITE_`; the rest are
server-only and must never be exposed to the browser.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | client | Supabase (RLS-enforced) |
| `VITE_LIVEKIT_URL` | client (+ build) | LiveKit websocket URL (`wss://…`) |
| `LIVEKIT_URL` | server | Same URL for `/api/livekit/token` (set on Vercel) |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | server | Privileged serverless ops |
| `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` | server | Mint LiveKit JWTs |
| `RESEND_API_KEY` / `EMAIL_FROM` | server | Transactional email |
| `PUBLIC_BASE_URL` | server | Links inside emails |

## Vercel deployment (LiveKit + API)

The production site needs env vars in the [Vercel project settings](https://vercel.com/docs/projects/environment-variables) — a local `.env` is **not** uploaded with git.

For video rooms, add all of these to **Production** and **Preview**, then **redeploy** (required so `VITE_LIVEKIT_URL` is baked into the client build):

| Variable | Example |
| --- | --- |
| `LIVEKIT_API_KEY` | From [LiveKit Cloud](https://cloud.livekit.io) → Project → Keys |
| `LIVEKIT_API_SECRET` | Same keys page |
| `VITE_LIVEKIT_URL` | `wss://your-project.livekit.cloud` |
| `LIVEKIT_URL` | Same as `VITE_LIVEKIT_URL` (server token route) |

CLI (from project root, with values in `.env`):

```bash
vercel env pull   # optional: download remote env
# Or add each var in the Vercel dashboard, then:
vercel --prod     # production redeploy
```

If rooms still show “credentials not configured”, open `/api/livekit/token` in the browser network tab: `mock: true` means missing API keys; a 503 means keys exist but `LIVEKIT_URL` / `VITE_LIVEKIT_URL` is missing.

### Admin room recording (LiveKit Egress)

1. Enable **Egress** on your LiveKit Cloud project.
2. Configure storage — either:
   - **S3-compatible bucket:** set `LIVEKIT_EGRESS_S3_BUCKET`, `LIVEKIT_EGRESS_S3_ACCESS_KEY`, `LIVEKIT_EGRESS_S3_SECRET`, and optionally `LIVEKIT_EGRESS_S3_REGION` / `LIVEKIT_EGRESS_S3_ENDPOINT` (R2), **or**
   - **LiveKit Cloud default bucket:** set `LIVEKIT_EGRESS_USE_CLOUD_STORAGE=true` after configuring default storage in the LiveKit dashboard.
3. Run the latest [supabase/schema.sql](supabase/schema.sql) to create `session_recordings`.
4. (Recommended) Add a LiveKit webhook pointing to  
   `https://your-domain.com/api/livekit/egress/webhook` for `egress_ended` events.
5. Join a room as an **admin** → tap **Record** → **Stop recording** when done.  
   Saved MP4s show in **Video Vault** (`/vault`) and via “Open saved recording” in the room.

API routes: `POST /api/livekit/egress/start`, `POST /api/livekit/egress/stop`, `GET /api/livekit/egress/status`, `GET /api/recordings/list`.

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
  `ConnectionStrengthMeter`. Admins see a **Record** button that starts/stops
  LiveKit composite egress; completed files appear in the member **Video Vault**.
- **CRM** — `/admin/leads` (data layer `src/lib/crm/getLeads.ts`): lead list,
  filters, timeline, heatmap, admin actions, and Realtime "LIVE" updates.

## Routes

Public: `/`, `/about`, `/club`, `/apply`, `/faq`, `/login`, `/book/:slug`
Member: `/dashboard`, `/cohorts`, `/sessions`, `/profile`, `/my-bookings`, `/room/:roomName`
Admin: `/admin`, `/admin/members`, `/admin/member/:id`, `/admin/cohorts`, `/admin/sessions`, `/admin/applications`, `/admin/availability`, `/admin/bookings`, `/admin/leads`
