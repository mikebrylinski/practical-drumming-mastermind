-- Platform updates migration (idempotent)

-- contact_submissions
create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  ip_address  text,
  created_at  timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

drop policy if exists contact_submissions_admin on public.contact_submissions;
create policy contact_submissions_admin on public.contact_submissions
  for select using (public.is_admin());

-- lead_events: IP tracking
alter table public.lead_events add column if not exists ip_address text;

-- bookings: soft hide
alter table public.bookings add column if not exists hidden boolean not null default false;

-- availability_slots: prevent duplicate start times per slug
create unique index if not exists availability_slots_slug_starts_unique
  on public.availability_slots (slug, starts_at);

-- cohorts: optional preview image
alter table public.cohorts add column if not exists image_url text;

-- session_recordings: publish toggle
alter table public.session_recordings add column if not exists is_published boolean not null default false;

-- community forum
create table if not exists public.community_posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  title       text not null,
  body        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.community_replies (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.community_posts (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists community_posts_created_idx on public.community_posts (created_at desc);
create index if not exists community_replies_post_idx on public.community_replies (post_id, created_at);

alter table public.community_posts enable row level security;
alter table public.community_replies enable row level security;

drop policy if exists community_posts_select on public.community_posts;
create policy community_posts_select on public.community_posts
  for select using (auth.role() = 'authenticated');

drop policy if exists community_posts_insert on public.community_posts;
create policy community_posts_insert on public.community_posts
  for insert with check (user_id = auth.uid());

drop policy if exists community_posts_update on public.community_posts;
create policy community_posts_update on public.community_posts
  for update using (user_id = auth.uid() or public.is_admin());

drop policy if exists community_posts_delete on public.community_posts;
create policy community_posts_delete on public.community_posts
  for delete using (user_id = auth.uid() or public.is_admin());

drop policy if exists community_replies_select on public.community_replies;
create policy community_replies_select on public.community_replies
  for select using (auth.role() = 'authenticated');

drop policy if exists community_replies_insert on public.community_replies;
create policy community_replies_insert on public.community_replies
  for insert with check (user_id = auth.uid());

drop policy if exists community_replies_delete on public.community_replies;
create policy community_replies_delete on public.community_replies
  for delete using (user_id = auth.uid() or public.is_admin());

-- session_recordings: members only see published
drop policy if exists session_recordings_read on public.session_recordings;
create policy session_recordings_read on public.session_recordings
  for select using (
    public.is_admin()
    or (auth.role() = 'authenticated' and is_published = true)
  );
