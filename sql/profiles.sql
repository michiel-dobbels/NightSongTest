-- Ensure the profiles table contains a display_name column

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text,
  created_at timestamp with time zone default now()
);

alter table profiles add column if not exists display_name text;

update profiles set display_name = coalesce(display_name, username);
