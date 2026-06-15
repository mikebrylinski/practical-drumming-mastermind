-- Quick fix: enable hide on admin bookings list
alter table public.bookings add column if not exists hidden boolean not null default false;
