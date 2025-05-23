--for-you--page
-- Create or update the profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  created_at timestamptz not null default now()

);

alter table profiles
  add column if not exists display_name text;

