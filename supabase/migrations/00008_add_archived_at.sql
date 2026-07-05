-- Migration: Add archived_at column to user_releases
-- Apply via Supabase Dashboard → SQL Editor

ALTER TABLE user_releases
  ADD COLUMN archived_at TIMESTAMPTZ;
