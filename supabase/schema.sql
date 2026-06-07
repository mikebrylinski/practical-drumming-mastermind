-- ============================================================================
-- Practical Drumming Mastermind — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Idempotent: safe to re-run.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'member' check (role in ('admin', 'member')),
  created_at  timestamptz not null default now()
);

create table if not exists public.cohorts (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  description       text,
  starts_at         timestamptz,
  livekit_room_name text,
  created_at        timestamptz not null default now()
);

-- For databases created before livekit_room_name existed.
alter table public.cohorts add column if not exists livekit_room_name text;

create table if not exists public.cohort_members (
  id         uuid primary key default gen_random_uuid(),
  cohort_id  uuid not null references public.cohorts (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  joined_at  timestamptz not null default now(),
  unique (cohort_id, user_id)
);

create table if not exists public.sessions (
  id                uuid primary key default gen_random_uuid(),
  cohort_id         uuid references public.cohorts (id) on delete set null,
  title             text not null,
  scheduled_at      timestamptz,
  livekit_room_name text,
  created_at        timestamptz not null default now()
);

create table if not exists public.session_attendance (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  joined_at   timestamptz not null default now(),
  left_at     timestamptz,
  unique (session_id, user_id)
);

create table if not exists public.applications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles (id) on delete set null,
  email       text,
  full_name   text,
  type        text,
  answers     jsonb not null default '{}'::jsonb,
  status      text not null default 'new' check (status in ('new', 'contacted', 'accepted', 'rejected')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.availability_slots (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null default 'discovery-call',
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  is_booked   boolean not null default false,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);

create table if not exists public.bookings (
  id                uuid primary key default gen_random_uuid(),
  slot_id           uuid references public.availability_slots (id) on delete set null,
  user_id           uuid references public.profiles (id) on delete set null,
  name              text,
  email             text,
  livekit_room_name text,
  status            text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'completed')),
  starts_at         timestamptz,
  created_at        timestamptz not null default now()
);

create table if not exists public.email_logs (
  id          uuid primary key default gen_random_uuid(),
  template    text not null,
  to_email    text not null,
  subject     text,
  status      text not null default 'sent' check (status in ('sent', 'skipped', 'error')),
  provider_id text,
  error       text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- CORE CRM intelligence layer
create table if not exists public.lead_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles (id) on delete set null,
  visitor_id  text,
  type        text not null,
  path        text,
  metadata    jsonb not null default '{}'::jsonb,
  score_delta integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists lead_events_user_idx on public.lead_events (user_id);
create index if not exists lead_events_visitor_idx on public.lead_events (visitor_id);
create index if not exists lead_events_created_idx on public.lead_events (created_at desc);
create index if not exists bookings_user_idx on public.bookings (user_id);
create index if not exists applications_user_idx on public.applications (user_id);

-- ----------------------------------------------------------------------------
-- Helpers
-- ----------------------------------------------------------------------------

-- SECURITY DEFINER => reads profiles bypassing RLS (avoids policy recursion).
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------

alter table public.profiles            enable row level security;
alter table public.cohorts             enable row level security;
alter table public.cohort_members      enable row level security;
alter table public.sessions            enable row level security;
alter table public.session_attendance  enable row level security;
alter table public.applications        enable row level security;
alter table public.availability_slots  enable row level security;
alter table public.bookings            enable row level security;
alter table public.email_logs          enable row level security;
alter table public.lead_events         enable row level security;

-- profiles: read/update own; admins full access.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_admin_write on public.profiles;
create policy profiles_admin_write on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- cohorts: any authenticated member can read; admins write.
drop policy if exists cohorts_select on public.cohorts;
create policy cohorts_select on public.cohorts
  for select using (auth.role() = 'authenticated');

drop policy if exists cohorts_admin on public.cohorts;
create policy cohorts_admin on public.cohorts
  for all using (public.is_admin()) with check (public.is_admin());

-- cohort_members: read own membership; admins all.
drop policy if exists cohort_members_select on public.cohort_members;
create policy cohort_members_select on public.cohort_members
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists cohort_members_admin on public.cohort_members;
create policy cohort_members_admin on public.cohort_members
  for all using (public.is_admin()) with check (public.is_admin());

-- sessions: authenticated read; admins write.
drop policy if exists sessions_select on public.sessions;
create policy sessions_select on public.sessions
  for select using (auth.role() = 'authenticated');

drop policy if exists sessions_admin on public.sessions;
create policy sessions_admin on public.sessions
  for all using (public.is_admin()) with check (public.is_admin());

-- session_attendance: read/insert own; admins all.
drop policy if exists attendance_select on public.session_attendance;
create policy attendance_select on public.session_attendance
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists attendance_insert on public.session_attendance;
create policy attendance_insert on public.session_attendance
  for insert with check (user_id = auth.uid() or public.is_admin());

drop policy if exists attendance_admin on public.session_attendance;
create policy attendance_admin on public.session_attendance
  for all using (public.is_admin()) with check (public.is_admin());

-- applications: read/insert own; admins all. (serverless uses service role)
drop policy if exists applications_select on public.applications;
create policy applications_select on public.applications
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists applications_insert on public.applications;
create policy applications_insert on public.applications
  for insert with check (user_id = auth.uid() or user_id is null or public.is_admin());

drop policy if exists applications_admin on public.applications;
create policy applications_admin on public.applications
  for all using (public.is_admin()) with check (public.is_admin());

-- availability_slots: public read (booking page is public); admins write.
drop policy if exists slots_select on public.availability_slots;
create policy slots_select on public.availability_slots
  for select using (true);

drop policy if exists slots_admin on public.availability_slots;
create policy slots_admin on public.availability_slots
  for all using (public.is_admin()) with check (public.is_admin());

-- bookings: read/insert own; admins all. (serverless uses service role)
drop policy if exists bookings_select on public.bookings;
create policy bookings_select on public.bookings
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists bookings_insert on public.bookings;
create policy bookings_insert on public.bookings
  for insert with check (user_id = auth.uid() or user_id is null or public.is_admin());

drop policy if exists bookings_admin on public.bookings;
create policy bookings_admin on public.bookings
  for all using (public.is_admin()) with check (public.is_admin());

-- email_logs: admin read only. Writes happen via service role (bypasses RLS).
drop policy if exists email_logs_admin on public.email_logs;
create policy email_logs_admin on public.email_logs
  for select using (public.is_admin());

-- lead_events: admin read only. Writes happen via service role (bypasses RLS).
drop policy if exists lead_events_admin on public.lead_events;
create policy lead_events_admin on public.lead_events
  for select using (public.is_admin());

-- session_recordings: saved LiveKit room composite recordings.
create table if not exists public.session_recordings (
  id                uuid primary key default gen_random_uuid(),
  session_id        uuid references public.sessions (id) on delete set null,
  room_name         text not null,
  title             text,
  egress_id         text,
  status            text not null default 'starting'
    check (status in ('starting', 'active', 'processing', 'complete', 'failed', 'stopped')),
  filepath          text,
  playback_url      text,
  duration_seconds  int,
  started_by        uuid references public.profiles (id) on delete set null,
  started_at        timestamptz not null default now(),
  ended_at          timestamptz,
  error_message     text,
  created_at        timestamptz not null default now()
);

create index if not exists session_recordings_room_name_idx
  on public.session_recordings (room_name);

create index if not exists session_recordings_status_idx
  on public.session_recordings (status);

alter table public.session_recordings enable row level security;

drop policy if exists session_recordings_read on public.session_recordings;
create policy session_recordings_read on public.session_recordings
  for select using (auth.role() = 'authenticated');

drop policy if exists session_recordings_admin on public.session_recordings;
create policy session_recordings_admin on public.session_recordings
  for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- Realtime: expose CRM tables to the supabase_realtime publication.
-- ----------------------------------------------------------------------------
do $$
begin
  begin
    alter publication supabase_realtime add table public.lead_events;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.bookings;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.applications;
  exception when duplicate_object then null;
  end;
end $$;
