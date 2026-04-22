/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
  readonly VITE_RESUME_URL_ID?: string;
  readonly VITE_RESUME_URL_EN?: string;
  readonly VITE_SPOTIFY_CLIENT_ID?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_SUPABASE_STORAGE_BUCKET_COVERS?: string;
  readonly VITE_SUPABASE_STORAGE_BUCKET_ASSETS?: string;
} 

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
