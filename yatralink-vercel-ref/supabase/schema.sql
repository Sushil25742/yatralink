create extension if not exists pgcrypto;

create table if not exists public.users_custom (
  email text primary key,
  name text not null,
  role text not null check (role in ('traveler','operator','superadmin','engineer')),
  password_hash text not null,
  password_salt text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  email text not null references public.users_custom(email) on delete cascade,
  name text not null,
  role text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists sessions_email_idx on public.sessions(email);
create index if not exists sessions_expiry_idx on public.sessions(expires_at);

create table if not exists public.user_settings (
  email text primary key references public.users_custom(email) on delete cascade,
  name text not null,
  language text not null default 'English',
  crowd_alerts boolean not null default true,
  location_sharing boolean not null default false,
  accessibility text not null default 'Standard',
  travel_pace text not null default 'Balanced',
  dark_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.operators (
  id text primary key,
  name text not null,
  business text not null,
  email text not null unique,
  status text not null default 'Pending',
  experiences integer not null default 0,
  rating numeric not null default 0,
  revenue numeric not null default 0
);

create table if not exists public.places (
  id text primary key,
  name text not null,
  category text not null,
  zone text not null,
  status text not null default 'Active',
  crowd text not null default 'Low',
  capacity integer not null default 1 check (capacity > 0),
  visits integer not null default 0,
  lat double precision not null,
  lng double precision not null
);

create table if not exists public.crowd_sites (
  id text primary key references public.places(id) on delete cascade,
  name text not null,
  level text not null,
  score integer not null,
  wait text not null,
  lat double precision not null,
  lng double precision not null,
  source text not null default 'Demo estimate',
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id text primary key,
  title text not null,
  operator_id text not null references public.operators(id) on delete cascade,
  category text not null,
  price numeric not null default 0 check (price >= 0),
  capacity integer not null default 1 check (capacity > 0),
  status text not null default 'Pending',
  bookings integer not null default 0,
  rating numeric not null default 0
);

create table if not exists public.slots (
  id text primary key,
  experience_id text not null references public.experiences(id) on delete cascade,
  operator_id text not null references public.operators(id) on delete cascade,
  day text not null default 'Today',
  time text not null,
  available boolean not null default true,
  capacity integer not null default 1 check (capacity > 0),
  booked integer not null default 0 check (booked >= 0),
  created_at timestamptz not null default now(),
  unique(experience_id, day, time)
);

create table if not exists public.bookings (
  id text primary key,
  guest text not null,
  user_email text,
  experience_id text not null references public.experiences(id),
  experience_title text not null,
  operator_id text not null references public.operators(id),
  date date not null,
  time text not null,
  guests integer not null check (guests > 0),
  amount numeric not null check (amount >= 0),
  status text not null default 'Confirmed',
  seats_released boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists bookings_user_email_idx on public.bookings(user_email);
create index if not exists bookings_operator_id_idx on public.bookings(operator_id);

create table if not exists public.reviews (
  id text primary key,
  experience_id text not null references public.experiences(id) on delete cascade,
  operator_id text not null references public.operators(id) on delete cascade,
  guest text not null,
  rating integer not null check (rating between 1 and 5),
  text text not null,
  reply text not null default ''
);

create table if not exists public.engineer_nodes (
  engineer_email text not null,
  id text not null,
  name text not null,
  type text not null,
  lat double precision not null,
  lng double precision not null,
  primary key(engineer_email,id)
);

create table if not exists public.engineer_routes (
  engineer_email text not null,
  id text not null,
  name text not null,
  node_ids jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  primary key(engineer_email,id)
);

create table if not exists public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  email text not null references public.users_custom(email) on delete cascade,
  label text not null,
  cost integer not null check (cost > 0),
  created_at timestamptz not null default now()
);
create index if not exists reward_redemptions_email_idx on public.reward_redemptions(email);

create table if not exists public.realtime_events (
  id bigint generated always as identity primary key,
  entity_type text not null,
  entity_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists realtime_events_entity_idx on public.realtime_events(entity_type,entity_id,id desc);

-- Keep application data server-only. Only the tiny realtime event feed is readable by the public browser key.
alter table public.users_custom enable row level security;
alter table public.sessions enable row level security;
alter table public.user_settings enable row level security;
alter table public.operators enable row level security;
alter table public.places enable row level security;
alter table public.crowd_sites enable row level security;
alter table public.experiences enable row level security;
alter table public.slots enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.engineer_nodes enable row level security;
alter table public.engineer_routes enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.realtime_events enable row level security;

drop policy if exists "read realtime events" on public.realtime_events;
create policy "read realtime events" on public.realtime_events for select to anon, authenticated using (true);
grant select on table public.realtime_events to anon, authenticated;

-- Supabase Realtime needs this table in the publication.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='realtime_events'
  ) then
    alter publication supabase_realtime add table public.realtime_events;
  end if;
end $$;

create or replace function public.create_yatralink_booking(
  p_email text,
  p_guest text,
  p_experience_id text,
  p_time text,
  p_guests integer
) returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_exp experiences%rowtype;
  v_op operators%rowtype;
  v_slot slots%rowtype;
  v_booking bookings%rowtype;
  v_id text;
begin
  if p_guests is null or p_guests < 1 or p_guests > 12 then
    raise exception 'invalid_guest_count';
  end if;

  select * into v_exp from experiences where id=p_experience_id and status='Published' for update;
  if not found then raise exception 'experience_not_bookable'; end if;

  select * into v_op from operators where id=v_exp.operator_id and status='Verified';
  if not found then raise exception 'operator_unavailable'; end if;

  select * into v_slot from slots
  where experience_id=p_experience_id and day='Today' and time=p_time
  for update;
  if not found or not v_slot.available then raise exception 'slot_unavailable'; end if;
  if v_slot.booked + p_guests > v_slot.capacity then raise exception 'not_enough_seats'; end if;

  update slots set booked=booked+p_guests,
    available=(booked+p_guests)<capacity
  where id=v_slot.id;

  update experiences set bookings=bookings+1 where id=v_exp.id;

  v_id := 'YL-' || right((extract(epoch from clock_timestamp())*1000)::bigint::text, 9);
  insert into bookings(id,guest,user_email,experience_id,experience_title,operator_id,date,time,guests,amount,status)
  values(
    v_id,p_guest,lower(p_email),v_exp.id,v_exp.title,v_exp.operator_id,
    (now() at time zone 'Asia/Kathmandu')::date,p_time,p_guests,v_exp.price*p_guests,'Confirmed'
  ) returning * into v_booking;

  return to_jsonb(v_booking);
end;
$$;

create or replace function public.update_yatralink_booking_status(
  p_booking_id text,
  p_status text
) returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_booking bookings%rowtype;
  v_release boolean;
begin
  select * into v_booking from bookings where id=p_booking_id for update;
  if not found then raise exception 'booking_not_found'; end if;

  v_release := p_status in ('Cancelled','Refunded') and not v_booking.seats_released;
  if v_release then
    update slots
      set booked=greatest(0,booked-v_booking.guests), available=true
      where experience_id=v_booking.experience_id and time=v_booking.time and day='Today';
    v_booking.seats_released := true;
  end if;

  update bookings
    set status=p_status, seats_released=v_booking.seats_released
    where id=p_booking_id
    returning * into v_booking;

  return to_jsonb(v_booking);
end;
$$;
