import { createClient } from '@supabase/supabase-js';
import { getRuntimeEnv } from './runtimeConfig';

let client = null;

export function isSupabaseConfigured() {
  return Boolean(getRuntimeEnv('VITE_SUPABASE_URL') && getRuntimeEnv('VITE_SUPABASE_ANON_KEY'));
}

export function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(
      getRuntimeEnv('VITE_SUPABASE_URL'),
      getRuntimeEnv('VITE_SUPABASE_ANON_KEY'),
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    );
  }
  return client;
}
