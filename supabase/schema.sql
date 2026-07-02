-- Enable PostGIS
create extension if not exists postgis;

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('citizen', 'ambassador', 'mediator', 'volunteer')) default 'citizen',
  neighborhood text,
  points integer default 0,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read all profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'citizen')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Green spaces (parks, gardens, community gardens)
create table public.green_spaces (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text check (type in ('park', 'garden', 'hort', 'square')) default 'park',
  description text,
  location geography(Point, 4326) not null,
  address text,
  district text,
  neighborhood text,
  needs_help boolean default false,
  participant_count integer default 0,
  -- 'example' = curated demo rows; 'ajuntament' = imported from city open data
  source text not null default 'example',
  external_id text,
  -- hort classification from source (municipal / comunitari / social); null otherwise
  subtype text,
  created_at timestamptz default now()
);

alter table public.green_spaces enable row level security;
create policy "Anyone can read green_spaces" on public.green_spaces for select using (true);
create policy "Authenticated users can insert" on public.green_spaces for insert with check (auth.role() = 'authenticated');

-- Spatial index for map queries
create index green_spaces_location_idx on public.green_spaces using gist (location);

-- Idempotent imports: one row per (source, external_id) when external_id is set
create unique index green_spaces_source_external_idx
  on public.green_spaces (source, external_id) where external_id is not null;

-- Trees (individual tree registrations by ambassadors)
create table public.trees (
  id uuid default gen_random_uuid() primary key,
  name text,
  species text,
  location geography(Point, 4326) not null,
  green_space_id uuid references public.green_spaces(id),
  ambassador_id uuid references public.profiles(id),
  health text check (health in ('excellent', 'good', 'needs_care', 'critical')) default 'good',
  notes text,
  photo_url text,
  named_after text,
  source text not null default 'example',
  created_at timestamptz default now()
);

alter table public.trees enable row level security;
create policy "Anyone can read trees" on public.trees for select using (true);
create policy "Ambassadors can insert trees" on public.trees for insert with check (auth.role() = 'authenticated');
create policy "Ambassadors can update own trees" on public.trees for update using (auth.uid() = ambassador_id);

create index trees_location_idx on public.trees using gist (location);

-- Seed: a few Barcelona green spaces
insert into public.green_spaces (name, type, description, location, district, neighborhood) values
  ('Parc de la Ciutadella', 'park', 'El parc més gran del centre de Barcelona', st_point(2.1860, 41.3867), 'Sant Martí', 'Vila Olímpica'),
  ('Jardins de Laribal', 'garden', 'Jardins en terrasses al turó de Montjuïc', st_point(2.1538, 41.3649), 'Sants-Montjuïc', 'Font de la Guatlla'),
  ('Parc del Laberint d''Horta', 'park', 'El parc més antic de Barcelona', st_point(2.1463, 41.4322), 'Horta-Guinardó', 'Horta'),
  ('Hort de l''Eixample', 'hort', 'Hort urbà comunitari al centre', st_point(2.1604, 41.3936), 'Eixample', 'Esquerra de l''Eixample'),
  ('Parc de la Creueta del Coll', 'park', 'Parc amb llac artificial al turó', st_point(2.1531, 41.4120), 'Gràcia', 'Vallcarca'),
  ('Jardins de Gràcia', 'garden', 'Jardins tranquils al cor de Gràcia', st_point(2.1584, 41.4020), 'Gràcia', 'Vila de Gràcia');
