-- Migration: add username column to posts
ALTER TABLE posts ADD COLUMN username text;
