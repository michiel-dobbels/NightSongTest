# Supabase setup

This project expects a `profiles` table with a primary key `id` and a `posts` table that references it via `user_id`.

If posting fails with an error like `23503: insert or update on table "posts" violates foreign key constraint "posts_user_id_fkey"`, it usually means the current authenticated user does not have an entry in `profiles`.

Use Supabase's SQL Editor to ensure the schema includes the necessary columns and that every user has a profile row. Example queries:

```sql
-- create username column on posts if it does not exist
alter table posts add column if not exists username text;

-- insert a profile row for a new user
insert into profiles (id, username) values ('<auth_user_id>', '<your_username>');
```

After applying schema changes, refresh the API cache from **Settings → API → Refresh** so PostgREST recognizes new columns.
