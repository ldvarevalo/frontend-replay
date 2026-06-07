import type { SupabaseClient } from '@supabase/supabase-js';
import type { Repositories } from '../types';
import { SupabaseReleasesRepository } from './releases';
import { SupabaseStatsRepository } from './stats';
import { SupabaseTracksRepository } from './tracks';
import { SupabaseUserReleasesRepository } from './user-releases';

/**
 * createSupabaseRepositories
 */

export const createSupabaseRepositories = (
  supabase: SupabaseClient
): Repositories => ({
  releases: new SupabaseReleasesRepository(supabase),
  userReleases: new SupabaseUserReleasesRepository(supabase),
  tracks: new SupabaseTracksRepository(supabase),
  stats: new SupabaseStatsRepository(supabase),
});
