import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import AuthSetupState from '../../components/auth/AuthSetupState';
import { useAuth } from '../../hooks/useAuth';

type LocationState = {
  from?: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isConfigured, isAdmin, loading, session, signInWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = (location.state as LocationState | null)?.from || '/admin/articles';

  useEffect(() => {
    if (!loading && session) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, navigate, redirectTo, session]);

  if (!isConfigured) {
    return <AuthSetupState title="Login admin butuh Supabase" />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signInWithPassword(email, password);
      if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login gagal dijalankan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-14 pt-28 sm:pt-32">
      <div className="mx-auto w-full max-w-3xl px-6 md:px-8">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/92 p-8 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.18)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/92 sm:p-12">
          <Link
            to="/my-notes"
            className="inline-flex items-center text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Notes
          </Link>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
            Admin login
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Masuk dengan akun Supabase Auth yang role-nya sudah ditandai sebagai `admin` di tabel `profiles`.
          </p>
          {!loading && session && !isAdmin ? (
            <div className="mt-5 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
              Login berhasil, tapi account ini belum punya role `admin` di tabel `profiles`.
            </div>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="studio-field">
              <span className="studio-label">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="studio-input"
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </label>

            <label className="studio-field">
              <span className="studio-label">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="studio-input"
                placeholder="Your password"
                autoComplete="current-password"
              />
            </label>

            {error ? (
              <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800 dark:border-rose-900 dark:bg-rose-900/20 dark:text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="btn-primary w-full"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
