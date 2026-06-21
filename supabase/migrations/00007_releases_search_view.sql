-- Migration: Add releases_search view for text search
-- Apply via Supabase Dashboard → SQL Editor

CREATE OR REPLACE VIEW releases_search AS
SELECT
  r.id,
  r.title,
  r.cover_url,
  r.release_year,
  COALESCE(
    (
      SELECT a.name
      FROM release_artists ra
      JOIN artists a ON a.id = ra.artist_id
      WHERE ra.release_id = r.id
        AND ra.role = 'primary'
      LIMIT 1
    ),
    (
      SELECT a.name
      FROM release_artists ra
      JOIN artists a ON a.id = ra.artist_id
      WHERE ra.release_id = r.id
      LIMIT 1
    ),
    ''
  ) AS primary_artist_name
FROM releases r;

ALTER VIEW releases_search SET (security_invoker = true);

COMMENT ON VIEW releases_search IS
  'Flattened releases + primary artist name for simple text search.';
