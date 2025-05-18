# Supabase Setup

This project expects a `username` column on the `posts` table. If it is missing,
insert it using the SQL editor in Supabase:

```sql
ALTER TABLE posts
ADD COLUMN username text NOT NULL;
```

After running the command, refresh the schema cache so Supabase's API is aware of
the new column.
