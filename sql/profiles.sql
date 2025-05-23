--page
-- Create the profiles table if it doesn't exist and ensure a display_name column
-- Run this script in the Supabase SQL editor

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text,
  created_at timestamp with time zone default now()
);

alter table profiles
  add column if not exists display_name text;

