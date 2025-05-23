create table if not exists posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  username text not null,
  content text not null,
  created_at timestamp with time zone default now()
);
