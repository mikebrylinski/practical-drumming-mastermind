-- Enable admin vault publish controls
alter table public.session_recordings add column if not exists is_published boolean not null default false;

drop policy if exists session_recordings_read on public.session_recordings;
create policy session_recordings_read on public.session_recordings
  for select using (
    public.is_admin()
    or (auth.role() = 'authenticated' and is_published = true)
  );
