-- Terminbuchungen für jj.detailing01
-- Zugriff nur serverseitig über den Service-Role-Key (Next.js Route Handler).
-- RLS ist aktiv und hat keine Policies: anon/authenticated können nichts lesen oder schreiben.

create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  service       text not null check (service in ('aussen', 'innen', 'komplett', 'keramik')),
  vehicle_size  text not null check (vehicle_size in ('klein', 'mittel', 'gross')),
  date          date not null,
  time          text not null check (time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  name          text not null check (char_length(name) between 2 and 120),
  email         text not null check (char_length(email) between 5 and 200),
  phone         text not null check (char_length(phone) between 6 and 40),
  car           text not null check (char_length(car) between 2 and 120),
  notes         text check (char_length(notes) <= 1000),
  status        text not null default 'angefragt'
                check (status in ('angefragt', 'bestaetigt', 'erledigt', 'storniert'))
);

-- Ein Slot kann nur einmal aktiv gebucht sein. Stornierte Buchungen geben ihn wieder frei.
create unique index if not exists bookings_active_slot_unique
  on public.bookings (date, time)
  where status <> 'storniert';

create index if not exists bookings_date_idx on public.bookings (date);

alter table public.bookings enable row level security;
