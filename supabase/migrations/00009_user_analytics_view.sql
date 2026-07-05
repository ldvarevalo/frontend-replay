-- Migration: Create user_analytics view with security_invoker for RLS enforcement

CREATE VIEW user_analytics WITH (security_invoker = true) AS
SELECT
  ur.user_id,
  ls.id AS session_id,
  ls.duration_seconds,
  ls.listened_at,
  ls.scope,
  r.id AS release_id,
  r.title AS release_title,
  r.cover_url,
  ra.artist_name,
  rg.genre_name,
  ur.status,
  ur.is_listened,
  ur.created_at AS added_at
FROM listening_sessions ls
JOIN user_releases ur ON ur.id = ls.user_release_id
JOIN releases r ON r.id = ur.release_id
LEFT JOIN LATERAL (
  SELECT a.name AS artist_name
  FROM release_artists ra
  JOIN artists a ON a.id = ra.artist_id
  WHERE ra.release_id = r.id AND ra.role = 'primary'
  LIMIT 1
) ra ON true
LEFT JOIN LATERAL (
  SELECT g.name AS genre_name
  FROM release_genres rg
  JOIN genres g ON g.id = rg.genre_id
  WHERE rg.release_id = r.id
  LIMIT 1
) rg ON true;
