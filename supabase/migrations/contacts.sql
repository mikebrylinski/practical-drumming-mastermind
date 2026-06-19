-- Admin-managed contacts directory (manually added leads / students / prospects).
create table if not exists public.contacts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  type       text not null default 'Lead' check (type in ('Lead', 'Student', 'Prospect', 'Other')),
  notes      text,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

-- Admins have full access; no one else can read or write.
drop policy if exists "contacts_admin_all" on public.contacts;
create policy "contacts_admin_all" on public.contacts
  for all
  using (public.is_admin())
  with check (public.is_admin());
