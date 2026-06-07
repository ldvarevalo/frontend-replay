import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Helpers
 */

const getSupabaseUrl = (): string => {
  const url = import.meta.env.VITE_SUPABASE_URL;

  if (!url) {
    throw new Error('VITE_SUPABASE_URL is not defined');
  }

  return url;
};

const getSupabaseAnonKey = (): string => {
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error('VITE_SUPABASE_ANON_KEY is not defined');
  }

  return key;
};

/**
 * createSupabaseClient
 */

export const createSupabaseClient = (): SupabaseClient => {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  return createClient(supabaseUrl, supabaseAnonKey);
};
