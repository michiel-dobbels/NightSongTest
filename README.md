
# NightSong

This project uses Supabase for authentication and saving posts. Before running the app, create the tables in Supabase.

1. Open the SQL editor in your Supabase project.
2. Run the contents of `sql/profiles.sql` and `sql/posts.sql`.

The `profiles` table stores user accounts with a `display_name` column. The `posts` table stores each post and references the author by `user_id`.

Run the app with `npm start` (Expo) once the tables exist.

