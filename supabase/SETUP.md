# Supabase setup — auth, users, and recording storage

Follow these steps once per environment (Production on Vercel + your Supabase project).

## Access model

| Area | Routes | Who can access |
| --- | --- | --- |
| Marketing | `/`, `/club`, `/about`, `/apply` | Public |
| Member club | `/dashboard`, `/cohorts`, `/vault`, `/sessions`, `/profile`, `/room/*` | Signed-in users (`profiles.role = member` or `admin`) |
| Admin | `/admin/*` | Signed-in users with `profiles.role = admin` |

New sign-ups get `role = member` automatically. Promote admins manually in SQL (below).

## 1. Create the Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Copy **Project URL** and **anon public key** → Vercel env:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL` (same URL, server-side)
3. Copy **service_role** key (Settings → API) → Vercel env:
   - `SUPABASE_SERVICE_ROLE_KEY` (never expose to the browser)

## 2. Run SQL migrations

In **SQL Editor**, run in order:

1. [`schema.sql`](./schema.sql) — tables, RLS, profiles trigger
2. [`profile-fields.sql`](./profile-fields.sql) — avatar + contact fields, avatars storage bucket
3. [`storage.sql`](./storage.sql) — `session-recordings` bucket + policies
4. [`seed.sql`](./seed.sql) — optional sample cohorts/slots for dev

## 3. Enable auth (email + password)

1. **Authentication → Providers → Email** → enable Email provider.
2. Confirm **Confirm email** is on for production (off only for quick local testing).
3. **Authentication → URL configuration**:
   - **Site URL**: your production URL, e.g. `https://practical-drumming-mastermind.vercel.app`
   - **Redirect URLs** (add all that apply):
     - `http://localhost:5173/**`
     - `http://127.0.0.1:5173/**`
     - `https://practical-drumming-mastermind.vercel.app/**`
4. Set `PUBLIC_BASE_URL` on Vercel to the same production URL (used in emails/links).

### Create Mike's admin account

1. Sign up once on `/login` (or invite via Supabase Auth dashboard).
2. In SQL Editor, promote to admin:

```sql
update public.profiles
set role = 'admin', full_name = coalesce(full_name, 'Mike Malinin')
where email = 'you@example.com';
```

New sign-ups automatically get a `profiles` row via the `handle_new_user` trigger (default role: `member`).

## 4. Storage for LiveKit recordings (S3-compatible)

LiveKit Egress uploads MP4s directly into Supabase Storage.

1. **Storage → New bucket** — should exist after `storage.sql` as `session-recordings` (private).
2. **Project Settings → Storage → S3 Connection** → enable S3 protocol.
3. **Create S3 access keys** (access key + secret).
4. Add to **Vercel** (Production + Preview):

| Variable | Value |
| --- | --- |
| `SUPABASE_STORAGE_BUCKET` | `session-recordings` |
| `SUPABASE_STORAGE_S3_ACCESS_KEY` | From Supabase S3 keys |
| `SUPABASE_STORAGE_S3_SECRET_KEY` | From Supabase S3 keys |
| `SUPABASE_STORAGE_S3_REGION` | `us-east-1` |
| `SUPABASE_STORAGE_S3_ENDPOINT` | `https://<project-ref>.storage.supabase.co/storage/v1/s3` |

The app auto-derives the endpoint from `SUPABASE_URL` if you omit `SUPABASE_STORAGE_S3_ENDPOINT`.

Legacy aliases still work: `LIVEKIT_EGRESS_S3_*` (same values).

5. **Redeploy Vercel** after adding env vars.

### Optional: public bucket (simpler playback, less secure)

If you prefer direct public URLs instead of signed URLs:

```sql
update storage.buckets set public = true where id = 'session-recordings';
```

Then set `SUPABASE_STORAGE_PUBLIC=true` on Vercel.

## 5. LiveKit egress webhook (recommended)

In [LiveKit Cloud](https://cloud.livekit.io) → **Webhooks**, add:

- URL: `https://your-domain.com/api/livekit/egress/webhook`
- Events: `egress_ended`

This saves recording metadata + file path when a room recording finishes.

## 6. Verify

| Check | Expected |
| --- | --- |
| `/login` with real email | Creates user + profile row |
| Admin SQL promote | `/admin` and **Record** in video rooms |
| `POST /api/livekit/egress/start` as admin | `200` (not `503`) |
| After a test recording | Row in `session_recordings`, file in Storage bucket |
| `/vault` | Recording appears with playable video |
