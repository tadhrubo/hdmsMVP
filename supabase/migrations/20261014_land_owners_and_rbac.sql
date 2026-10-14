-- ============================================================
-- HDMS MVP — Migration: Land Owners & Role-Based Access Control (RBAC)
-- ============================================================

-- 1. Roles Enum & Profiles
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('Owner', 'Employee');
  end if;
end $$;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role user_role not null default 'Employee',
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'profiles' and policyname = 'Public profile read'
  ) then
    create policy "Public profile read" on profiles for select to anon, authenticated using (true);
  end if;
end $$;

-- 2. Land Owners Table
create table if not exists land_owners (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  full_name text not null,
  phone text not null,
  nid text,
  email text,
  address text,
  agreement_file_url text,
  created_at timestamptz not null default now()
);
alter table land_owners enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'land_owners' and policyname = 'Anon full access on land_owners'
  ) then
    create policy "Anon full access on land_owners" on land_owners for all to anon, authenticated using (true) with check (true);
  end if;
end $$;

-- 3. Land Owner Agreements Storage Bucket
insert into storage.buckets (id, name, public) 
values ('land_owner_agreements', 'land_owner_agreements', true) 
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'objects' and policyname = 'Public Access LOA'
  ) then
    create policy "Public Access LOA" on storage.objects for select using ( bucket_id = 'land_owner_agreements' );
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'objects' and policyname = 'Allow Uploads LOA'
  ) then
    create policy "Allow Uploads LOA" on storage.objects for insert with check ( bucket_id = 'land_owner_agreements' );
  end if;
end $$;
