
# NightSong React Native App

This project uses Supabase for authentication and data storage. On first run you may encounter the error:

```
PGRST204: Could not find the 'display_name' column of 'profiles' in the schema cache
```

This happens when the `profiles` table in your Supabase project does not include a `display_name` column. Run the SQL scripts in the `sql` directory to set up the required tables.

## Applying the SQL scripts

1. Open your Supabase project and navigate to **SQL Editor**.
2. Create a new query and paste the contents of `sql/profiles.sql`. Execute the query.
3. Create another query and paste the contents of `sql/posts.sql`. Execute this query as well.

These scripts create the `profiles` and `posts` tables (or update them if they already exist) with the necessary columns. After running them, signup and posting from the app will work without errors.

