
# NightSongTest

This project uses Supabase for authentication and storing posts.

## Database setup

Use the SQL editor in your Supabase dashboard to run the scripts in the `sql/` directory.
These scripts create the `profiles` and `posts` tables if they do not exist and add the
required `display_name` column.

1. Open the Supabase dashboard for your project.
2. Navigate to **SQL Editor** and choose **New query**.
3. Copy the contents of `sql/profiles.sql` and run it.
4. Then copy `sql/posts.sql` and run it.

After running the scripts, the app can store profiles and posts without the
`display_name` error.
=======