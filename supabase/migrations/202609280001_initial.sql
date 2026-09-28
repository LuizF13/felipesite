create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  city text not null,
  neighborhood text,
  address text,
  property_type text not null default 'Apartamento',
  status text not null default 'draft'
    check (status in ('available','reserved','sold','unavailable','draft')),
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  bedrooms integer not null default 0 check (bedrooms >= 0),
  suites integer not null default 0 check (suites >= 0),
  bathrooms integer not null default 0 check (bathrooms >= 0),
  garages integer not null default 0 check (garages >= 0),
  private_area numeric(12,2),
  total_area numeric(12,2),
  price_cents bigint check (price_cents is null or price_cents >= 0),
  price_on_request boolean not null default false,
  developer text,
  delivery_label text,
  description text,
  video_url text,
  cover_image_url text,
  amenities text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_public_idx
  on public.properties (is_published, status, sort_order);

create index if not exists properties_slug_idx
  on public.properties (slug);

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  storage_path text,
  alt_text text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists property_images_property_idx
  on public.property_images (property_id, position);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  name text not null,
  whatsapp text not null,
  email text,
  country text,
  budget_range text,
  goal text,
  message text,
  status text not null default 'new'
    check (status in ('new','contacted','proposal','won','lost')),
  created_at timestamptz not null default now()
);

create index if not exists leads_created_idx
  on public.leads (created_at desc);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, is_admin)
  values (new.id, false)
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public;
revoke all on function private.handle_new_user() from anon;
revoke all on function private.handle_new_user() from authenticated;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure private.handle_new_user();

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;

create trigger properties_set_updated_at
  before update on public.properties
  for each row execute procedure private.set_updated_at();

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.leads enable row level security;

drop policy if exists "profiles read self" on public.profiles;
create policy "profiles read self"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "public read published properties" on public.properties;
create policy "public read published properties"
on public.properties
for select
to anon, authenticated
using (
  is_published = true
  and status in ('available','reserved','sold')
);

drop policy if exists "admin read all properties" on public.properties;
create policy "admin read all properties"
on public.properties
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

drop policy if exists "admin insert properties" on public.properties;
create policy "admin insert properties"
on public.properties
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

drop policy if exists "admin update properties" on public.properties;
create policy "admin update properties"
on public.properties
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

drop policy if exists "admin delete properties" on public.properties;
create policy "admin delete properties"
on public.properties
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

drop policy if exists "public read published property images" on public.property_images;
create policy "public read published property images"
on public.property_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.properties p
    where p.id = property_id
      and p.is_published = true
      and p.status in ('available','reserved','sold')
  )
);

drop policy if exists "admin read all property images" on public.property_images;
create policy "admin read all property images"
on public.property_images
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

drop policy if exists "admin insert property images" on public.property_images;
create policy "admin insert property images"
on public.property_images
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

drop policy if exists "admin update property images" on public.property_images;
create policy "admin update property images"
on public.property_images
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

drop policy if exists "admin delete property images" on public.property_images;
create policy "admin delete property images"
on public.property_images
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

drop policy if exists "public create lead" on public.leads;
create policy "public create lead"
on public.leads
for insert
to anon, authenticated
with check (status = 'new');

drop policy if exists "admin read leads" on public.leads;
create policy "admin read leads"
on public.leads
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

drop policy if exists "admin update leads" on public.leads;
create policy "admin update leads"
on public.leads
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

grant usage on schema public to anon, authenticated;

grant select on public.properties to anon, authenticated;
grant select on public.property_images to anon, authenticated;
grant insert on public.leads to anon, authenticated;

grant select on public.profiles to authenticated;
grant insert, update, delete on public.properties to authenticated;
grant insert, update, delete on public.property_images to authenticated;
grant select, update on public.leads to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'property-media',
  'property-media',
  true,
  10485760,
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin select property media" on storage.objects;
create policy "admin select property media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'property-media'
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

drop policy if exists "admin insert property media" on storage.objects;
create policy "admin insert property media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'property-media'
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

drop policy if exists "admin update property media" on storage.objects;
create policy "admin update property media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'property-media'
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
)
with check (
  bucket_id = 'property-media'
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);

drop policy if exists "admin delete property media" on storage.objects;
create policy "admin delete property media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'property-media'
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.is_admin = true
  )
);
