-- Migration: Add source_format to listening_sessions

ALTER TABLE listening_sessions
  ADD COLUMN source_format TEXT NOT NULL DEFAULT 'vinyl';
