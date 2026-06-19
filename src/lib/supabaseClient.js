import { createClient } from '@supabase/supabase-js';
import { getRuntimeEnv } from './runtimeConfig';

let client = null;

function getSupabaseUrl() {
  const runtime = getRuntimeEnv('VITE_SUPABASE_URL');
  if (runtime) return runtime;
  const vite = import.meta.env.VITE_SUPABASE_URL;
  return vite && String(vite).trim() ? String(vite).trim() : '';
}

function getSupabaseAnonKey() {
  const runtime = getRuntimeEnv('VITE_SUPABASE_ANON_KEY');
  if (runtime) return runtime;
  const vite = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return vite && String(vite).trim() ? String(vite).trim() : '';
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
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
