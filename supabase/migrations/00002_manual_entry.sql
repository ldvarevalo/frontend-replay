-- Migration: Add INSERT policies for manual entry flow
-- Allows authenticated users to insert releases, artists, genres, and their junction records

-- releases

CREATE POLICY "authenticated_insert_releases" ON releases
  FOR INSERT TO authenticated WITH CHECK (true);

-- artists

CREATE POLICY "authenticated_insert_artists" ON artists
  FOR INSERT TO authenticated WITH CHECK (true);

-- release_artists

CREATE POLICY "authenticated_insert_release_artists" ON release_artists
  FOR INSERT TO authenticated WITH CHECK (true);

-- genres

CREATE POLICY "authenticated_insert_genres" ON genres
  FOR INSERT TO authenticated WITH CHECK (true);

-- release_genres

CREATE POLICY "authenticated_insert_release_genres" ON release_genres
  FOR INSERT TO authenticated WITH CHECK (true);
