# NightSongTest

This project is a React Native/Expo application that uses Supabase for backend services. It includes a minimal setup with authentication and a simple post feed.

## Database migrations

To avoid the `PGRST204` error when creating posts, ensure the `posts` table has a `username` column. An example SQL migration is provided under `db/migrations/add_username_to_posts.sql`:

```sql
-- Migration: add username column to posts
ALTER TABLE posts ADD COLUMN username text;
```

Run this migration on your Supabase database (or create the column manually) before using the posting feature.

## Development

Install dependencies and start the Expo server:

```bash
npm install
npm start
```

The TypeScript project currently relies on Expo's defaults; `npx tsc -p tsconfig.json --noEmit` may fail due to missing types.
