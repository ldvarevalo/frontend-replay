-- Migration: Add partial_release to listening_scope enum
-- Used by the compact listening session form in the Discover view

ALTER TYPE listening_scope ADD VALUE IF NOT EXISTS 'partial_release';
