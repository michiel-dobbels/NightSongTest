--page
-- Create the posts table if it doesn't exist
-- Run this in the Supabase SQL editor


create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  username text not null,
  content text not null,
  created_at timestamp with time zone default now()

);