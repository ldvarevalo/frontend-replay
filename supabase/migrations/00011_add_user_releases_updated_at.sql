-- Migration: Add updated_at column to user_releases
-- Bumped explicitly by the Supabase repository on every write (upsert, markAsListened, updatePriority, archive, unarchive).
-- No DB trigger; consistent with listening_sessions convention.

ALTER TABLE user_releases
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
