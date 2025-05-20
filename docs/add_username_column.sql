-- Adds a username column to the posts table for associating author names
ALTER TABLE posts
ADD COLUMN username text NOT NULL;
