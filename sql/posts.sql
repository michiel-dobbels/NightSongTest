--for-you--page
-- Create a posts table that references profiles
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  content text not null,
  username text not null,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on posts(created_at desc);

