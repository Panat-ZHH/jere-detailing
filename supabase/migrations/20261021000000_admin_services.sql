-- Anfragen statt Buchungen, Preise/Einstellungen in der DB, Admin-Login.
-- Alle Tabellen haben RLS ohne Policies: Zugriff nur über den Server mit dem Secret Key.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Leistungen / Preise (im Admin bearbeitbar)
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  id          text primary key check (id ~ '^[a-z0-9-]{2,40}$'),
  name        text not null,
  short       text not null default '',
  price_from  integer not null check (price_from >= 0),
  duration    text not null default '',
  category    text not null default 'pflege' check (category in ('pflege', 'innen', 'schutz')),
  includes    text[] not null default '{}',
  image       text not null default '/images/schaum.png',
  featured    boolean not null default false,
  active      boolean not null default true,
  sort        integer not null default 0,
  updated_at  timestamptz not null default now()
);
alter table public.services enable row level security;

insert into public.services (id, name, short, price_from, duration, category, includes, image, featured, sort) values
  ('aussen', 'Aussenpflege', 'Handwäsche mit Vorwäsche, Felgen und Versiegelung.', 89, 'ca. 2 Std.', 'pflege',
    array['Snow-Foam Vorwäsche','Zwei-Eimer-Handwäsche','Felgen und Reifen','Scheiben aussen','Sprühversiegelung'],
    '/images/schaum-front.png', false, 1),
  ('innen', 'Innenraumpflege', 'Gründlich gesaugt, gereinigt und gepflegt.', 119, 'ca. 3 Std.', 'innen',
    array['Saugen inkl. Kofferraum','Kunststoffe und Zierteile','Lederreinigung und Pflege','Scheiben innen','Fussmatten'],
    '/images/innenraum.png', false, 2),
  ('komplett', 'Komplettaufbereitung', 'Innen und aussen, mit Lackreinigung per Knete.', 249, 'ca. 1 Tag', 'pflege',
    array['Alles aus Aussen- und Innenpflege','Flugrost- und Teerentfernung','Lackreinigung mit Knete','Hartwachs-Versiegelung','Motorraum auf Wunsch'],
    '/images/studio.png', true, 0),
  ('keramik', 'Politur & Keramik', 'Kratzer raus, Glanz rein, Schutz für Jahre.', 690, '2 Tage', 'schutz',
    array['Komplette Aussenaufbereitung','Lackmessung','Ein- oder Zweistufen-Politur','Keramikversiegelung','Felgen versiegelt'],
    '/images/keramik-auftrag.png', false, 3)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Einstellungen (eine Zeile)
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  id              integer primary key default 1 check (id = 1),
  phone           text,
  email           text,
  address         text not null default 'Frauenfeld, Thurgau',
  instagram       text not null default 'https://www.instagram.com/jj.detailing01/',
  weekday_slots   text[] not null default array['08:00','10:30','13:30','16:00'],
  saturday_slots  text[] not null default array['09:00','11:30'],
  hours_weekday   text not null default '08:00 - 18:00',
  hours_saturday  text not null default '09:00 - 14:00',
  size_factor_mittel numeric(4,2) not null default 1.15 check (size_factor_mittel between 0.5 and 3),
  size_factor_gross  numeric(4,2) not null default 1.30 check (size_factor_gross between 0.5 and 3),
  updated_at      timestamptz not null default now()
);
alter table public.settings enable row level security;
insert into public.settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Anfragen: Kunden fragen nur an, Jeremia bestätigt im Admin.
-- ---------------------------------------------------------------------------
alter table public.bookings drop constraint if exists bookings_service_check;
alter table public.bookings
  add constraint bookings_service_fkey foreign key (service) references public.services (id) on update cascade;
alter table public.bookings add column if not exists admin_note text check (char_length(admin_note) <= 2000);
alter table public.bookings add column if not exists updated_at timestamptz not null default now();
alter table public.bookings add column if not exists price_estimate integer;

-- Mehrere Anfragen für denselben Wunschtermin sind erlaubt,
-- bestätigt werden kann pro Slot aber nur eine.
drop index if exists bookings_active_slot_unique;
create unique index if not exists bookings_confirmed_slot_unique
  on public.bookings (date, time)
  where status = 'bestaetigt';

-- ---------------------------------------------------------------------------
-- Admin-Login (ein Benutzer, Passwort als bcrypt-Hash)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id              uuid primary key default gen_random_uuid(),
  username        text not null unique,
  password_hash   text not null,
  failed_attempts integer not null default 0,
  locked_until    timestamptz,
  created_at      timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create table if not exists public.admin_sessions (
  token_hash  text primary key,
  user_id     uuid not null references public.admin_users (id) on delete cascade,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);
alter table public.admin_sessions enable row level security;
create index if not exists admin_sessions_expires_idx on public.admin_sessions (expires_at);

-- Passwort setzen oder ändern (nur Service-Role).
create or replace function public.admin_set_password(p_username text, p_password text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if char_length(p_password) < 16 then
    raise exception 'Passwort muss mindestens 16 Zeichen haben';
  end if;
  insert into admin_users (username, password_hash)
  values (p_username, crypt(p_password, gen_salt('bf', 12)))
  on conflict (username) do update
    set password_hash = excluded.password_hash, failed_attempts = 0, locked_until = null;
  delete from admin_sessions s using admin_users u where s.user_id = u.id and u.username = p_username;
end;
$$;

-- Login prüfen. Nach 5 Fehlversuchen 15 Minuten Sperre.
create or replace function public.admin_login(p_username text, p_password text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  u admin_users%rowtype;
begin
  select * into u from admin_users where username = p_username;
  if not found then
    -- gleiche Rechenzeit wie bei einem echten Vergleich
    perform crypt(p_password, gen_salt('bf', 12));
    return null;
  end if;
  if u.locked_until is not null and u.locked_until > now() then
    return null;
  end if;
  if u.password_hash = crypt(p_password, u.password_hash) then
    update admin_users set failed_attempts = 0, locked_until = null where id = u.id;
    return u.id;
  end if;
  update admin_users
    set failed_attempts = failed_attempts + 1,
        locked_until = case when failed_attempts + 1 >= 5 then now() + interval '15 minutes' else null end
    where id = u.id;
  return null;
end;
$$;

revoke all on function public.admin_set_password(text, text) from public, anon, authenticated;
revoke all on function public.admin_login(text, text) from public, anon, authenticated;
grant execute on function public.admin_set_password(text, text) to service_role;
grant execute on function public.admin_login(text, text) to service_role;
