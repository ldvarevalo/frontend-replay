-- Migration: Add listening_sessions table
-- Extends listening_scope enum with values matching the DBML design

ALTER TYPE listening_scope ADD VALUE IF NOT EXISTS 'full_release';
ALTER TYPE listening_scope ADD VALUE IF NOT EXISTS 'side_a';
ALTER TYPE listening_scope ADD VALUE IF NOT EXISTS 'side_b';
ALTER TYPE listening_scope ADD VALUE IF NOT EXISTS 'side_c';
ALTER TYPE listening_scope ADD VALUE IF NOT EXISTS 'side_d';

CREATE TABLE listening_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_release_id UUID NOT NULL REFERENCES user_releases(id) ON DELETE CASCADE,
  scope listening_scope NOT NULL DEFAULT 'full_release',
  duration_seconds INTEGER,
  listened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_listening_sessions_user_release
  ON listening_sessions(user_release_id);
CREATE INDEX IF NOT EXISTS idx_listening_sessions_listened_at
  ON listening_sessions(listened_at);
CREATE INDEX IF NOT EXISTS idx_listening_sessions_scope
  ON listening_sessions(scope);

ALTER TABLE listening_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_select_own_sessions" ON listening_sessions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_releases
      WHERE user_releases.id = listening_sessions.user_release_id
      AND user_releases.user_id = auth.uid()
    )
  );

CREATE POLICY "user_insert_own_sessions" ON listening_sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_releases
      WHERE user_releases.id = listening_sessions.user_release_id
      AND user_releases.user_id = auth.uid()
    )
  );
