-- ============================================================================
-- Seed data for local development.
-- Run AFTER schema.sql. Assumes at least one auth user exists; promote it to
-- admin by email below, then create sample cohorts / availability slots.
-- ============================================================================

-- Promote a user to admin (replace the email).
-- update public.profiles set role = 'admin' where email = 'you@example.com';

insert into public.cohorts (name, description, starts_at, livekit_room_name)
values
  ('Spring Mastermind', 'Twelve-week flagship mentorship cohort with weekly live coaching.', now() - interval '21 days', 'cohort-spring-mastermind'),
  ('Foundations Circle', 'Entry cohort for new members building core technique.', now() - interval '7 days', 'cohort-foundations-circle'),
  ('Groove & Pocket Lab', 'Weekly feel-focused workshop on time and subdivision.', now() - interval '3 days', 'cohort-groove-pocket-lab'),
  ('Advanced Independence', 'Four-way coordination, odd meters, and improvisation.', now() + interval '7 days', 'cohort-advanced-independence')
on conflict do nothing;

-- Weekly recurring sessions for each cohort: next 6 weeks, spaced 7 days apart.
insert into public.sessions (cohort_id, title, scheduled_at, livekit_room_name)
select
  c.id,
  c.name || ' — Weekly Live',
  base.t + (g.n * interval '7 days'),
  c.livekit_room_name
from public.cohorts c
cross join lateral (
  values
    ('cohort-spring-mastermind', date_trunc('week', now()) + interval '3 days' + interval '19 hours'),
    ('cohort-foundations-circle', date_trunc('week', now()) + interval '1 days' + interval '18 hours'),
    ('cohort-groove-pocket-lab', date_trunc('week', now()) + interval '4 days' + interval '19 hours'),
    ('cohort-advanced-independence', date_trunc('week', now()) + interval '6 days' + interval '11 hours')
) as base(room, t)
cross join generate_series(0, 5) as g(n)
where c.livekit_room_name = base.room
  and base.t + (g.n * interval '7 days') >= now() - interval '1 hour'
on conflict do nothing;

-- Sample availability slots for the public booking page (/book/discovery-call).
insert into public.availability_slots (slug, starts_at, ends_at)
select
  'discovery-call',
  d,
  d + interval '30 minutes'
from generate_series(
  date_trunc('hour', now()) + interval '1 day',
  date_trunc('hour', now()) + interval '6 days',
  interval '2 hours'
) as d
where extract(hour from d) between 13 and 19
on conflict do nothing;
