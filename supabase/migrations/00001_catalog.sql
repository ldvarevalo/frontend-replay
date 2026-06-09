-- Migration: Create catalog tables for crate-app
-- Apply via Supabase Dashboard → SQL Editor

-- Enums

CREATE TYPE release_status AS ENUM ('owned', 'want', 'listened');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE artist_role AS ENUM ('primary', 'featured', 'remixer');
CREATE TYPE listening_scope AS ENUM ('full', 'partial', 'sampled');

-- releases

CREATE TABLE releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  cover_url TEXT,
  release_year TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- artists

CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

-- release_artists

CREATE TABLE release_artists (
  release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  role artist_role NOT NULL DEFAULT 'primary',
  PRIMARY KEY (release_id, artist_id)
);

-- genres

CREATE TABLE genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

-- release_genres

CREATE TABLE release_genres (
  release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (release_id, genre_id)
);

-- tracks

CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_seconds INTEGER,
  side TEXT,
  position INTEGER NOT NULL DEFAULT 0
);

-- user_releases

CREATE TABLE user_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  status release_status NOT NULL DEFAULT 'want',
  priority priority_level DEFAULT 'medium',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, release_id)
);

-- Indexes

CREATE INDEX IF NOT EXISTS idx_user_releases_user_id ON user_releases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_releases_status ON user_releases(status);
CREATE INDEX IF NOT EXISTS idx_tracks_release_id ON tracks(release_id);
CREATE INDEX IF NOT EXISTS idx_release_artists_release_id ON release_artists(release_id);
CREATE INDEX IF NOT EXISTS idx_release_artists_artist_id ON release_artists(artist_id);

-- RLS

ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_genres ENABLE ROW LEVEL SECURITY;

-- RLS policies: authenticated users can read catalog tables

CREATE POLICY "authenticated_select_releases" ON releases
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_artists" ON artists
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_release_artists" ON release_artists
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_tracks" ON tracks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_genres" ON genres
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_select_release_genres" ON release_genres
  FOR SELECT TO authenticated USING (true);

-- RLS policies: user_releases are private per user

CREATE POLICY "user_select_own_releases" ON user_releases
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "user_insert_own_releases" ON user_releases
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
