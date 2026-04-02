import React from 'react';

type AuthSetupStateProps = {
  title?: string;
  message?: string;
};

const AuthSetupState: React.FC<AuthSetupStateProps> = ({
  title = 'Supabase belum dikonfigurasi',
  message = 'Isi env Supabase di project ini dulu agar login admin dan article dashboard bisa terhubung ke database.',
}) => (
  <div className="min-h-screen py-14 pt-28 sm:pt-32">
    <div className="mx-auto w-full max-w-3xl px-6 md:px-8">
      <div className="rounded-[2rem] border border-slate-200/80 bg-white/92 p-8 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.18)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/92 sm:p-12">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          {message}
        </p>
        <div className="mt-8 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-dark-700 dark:text-slate-200">
          <p className="font-semibold">Tambahkan env berikut:</p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-slate-600 dark:text-slate-300">
{`VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_STORAGE_BUCKET_COVERS=article-covers
VITE_SUPABASE_STORAGE_BUCKET_ASSETS=article-inline-assets`}
          </pre>
        </div>
      </div>
    </div>
  </div>
);

export default AuthSetupState;
