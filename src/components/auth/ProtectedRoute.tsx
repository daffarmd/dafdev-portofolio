import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AuthSetupState from './AuthSetupState';
import { useAuth } from '../../hooks/useAuth';

const AdminLoadingState: React.FC = () => (
  <div className="min-h-screen overflow-hidden">
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6 py-28 md:px-8">
      <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/85 px-4 py-3 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.18)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/80">
        <Loader2 className="h-4 w-4 animate-spin text-slate-700 dark:text-slate-200" />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Menyiapkan admin
        </span>
      </div>
    </div>
  </div>
);

const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const { isConfigured, isAdmin, loading, session } = useAuth();

  if (!isConfigured) {
    return <AuthSetupState title="Admin dashboard butuh Supabase" />;
  }

  if (loading) {
    return <AdminLoadingState />;
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
