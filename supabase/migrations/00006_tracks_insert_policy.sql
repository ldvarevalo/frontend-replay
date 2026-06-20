-- Migration: Add INSERT policy for tracks table

CREATE POLICY "authenticated_insert_tracks" ON tracks
  FOR INSERT TO authenticated WITH CHECK (true);
