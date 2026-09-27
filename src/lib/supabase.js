import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

export function isSupabaseConfigured() {
  if (process.env.TEST_MODE === 'true' || process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
    return false;
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder') && !key.includes('placeholder'));
}

export function createSupabaseClient() {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase no configurado. Define SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el entorno.'
    );
  }

  cachedClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

export const supabase = () => createSupabaseClient();