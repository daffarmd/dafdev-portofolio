import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthSetupState from './AuthSetupState';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const { isConfigured, isAdmin, loading, session } = useAuth();

  if (!isConfigured) {
    return <AuthSetupState title="Admin dashboard butuh Supabase" />;
  }

  if (loading) {
    return (
      <div className="min-h-[40vh] px-6 py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="h-24 rounded-[2rem] border border-slate-200/80 bg-white/70 dark:border-slate-700 dark:bg-dark-800/70" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-14 pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-3xl px-6 md:px-8">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/92 p-8 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.18)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/92 sm:p-12">
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              Akses admin ditolak
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              Account ini berhasil login, tapi role-nya belum `admin`. Update role user di tabel `profiles` Supabase terlebih dahulu.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
