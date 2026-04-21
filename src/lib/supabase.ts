import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const ARTICLE_COVERS_BUCKET =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET_COVERS || 'article-covers';

export const ARTICLE_ASSETS_BUCKET =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET_ASSETS || 'article-inline-assets';

let supabaseClientPromise: Promise<SupabaseClient> | null = null;

export const getSupabaseClient = async (): Promise<SupabaseClient | null> => {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!supabaseClientPromise) {
    supabaseClientPromise = import('@supabase/supabase-js')
      .then(({ createClient }) => createClient(supabaseUrl as string, supabasePublishableKey as string, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }))
      .catch((error) => {
        supabaseClientPromise = null;
        throw error;
      });
  }

  return supabaseClientPromise;
};
