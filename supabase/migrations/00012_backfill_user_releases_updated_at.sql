-- Migration: Backfill user_releases.updated_at from created_at
-- Apply via Supabase Dashboard → SQL Editor
-- Must run after 00011 (which adds the column with DEFAULT now()).

UPDATE user_releases
SET updated_at = created_at
WHERE updated_at <> created_at;
