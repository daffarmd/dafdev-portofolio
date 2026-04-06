import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole, LogIn, Sparkles } from 'lucide-react';
import AuthSetupState from '../../components/auth/AuthSetupState';
import { useAuth } from '../../hooks/useAuth';

type LocationState = {
  from?: string;
};

type LoginBufferStateProps = {
  destinationLabel: string;
};

const LoginBufferState: React.FC<LoginBufferStateProps> = ({ destinationLabel }) => (
  <div className="min-h-screen overflow-hidden py-14 pt-28 sm:pt-32">
    <div className="mx-auto w-full max-w-3xl px-6 md:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 shadow-[0_28px_90px_-48px_rgba(15,23,42,0.22)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/92">
        <div className="relative isolate p-8 sm:p-12">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-primary-200/30 blur-3xl dark:bg-primary-700/15" />
          <div className="absolute left-0 top-0 h-24 w-24 rounded-full bg-sky-200/30 blur-2xl dark:bg-sky-700/10" />

          <div className="relative flex flex-col items-center text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-dark-700 dark:text-white">
              <LockKeyhole className="h-7 w-7" />
            </div>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 dark:border-slate-700 dark:bg-dark-700 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5" />
              Buffering access
            </p>

            <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Opening admin area
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
              Sesi kamu sudah valid. Kami sedang menyiapkan dashboard admin dengan aman sebelum membuka {destinationLabel}.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <span className="h-3 w-3 animate-bounce rounded-full bg-primary-500 [animation-delay:-0.24s]" />
              <span className="h-3 w-3 animate-bounce rounded-full bg-sky-500 [animation-delay:-0.12s]" />
              <span className="h-3 w-3 animate-bounce rounded-full bg-emerald-500" />
            </div>

            <div className="mt-8 w-full max-w-lg">
              <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/90 p-5 dark:border-slate-700 dark:bg-dark-700/70">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary-600 dark:text-primary-300" />
                  <div className="flex-1">
                    <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
                    <div className="mt-3 h-3 w-3/4 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="h-4 w-full animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
                  <div className="h-4 w-[84%] animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isConfigured, isAdmin, loading, session, signInWithPassword } = useAuth();
  const redirectTimerRef = useRef<number | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = (location.state as LocationState | null)?.from || '/admin/articles';
  const redirectLabel = redirectTo === '/admin/articles' ? 'admin dashboard' : redirectTo;

  useEffect(() => {
    if (!loading && session && isAdmin) {
      if (redirectTimerRef.current !== null) {
        return undefined;
      }

      setIsBuffering(true);
      redirectTimerRef.current = window.setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 1100);

      return () => {
        if (redirectTimerRef.current !== null) {
          window.clearTimeout(redirectTimerRef.current);
          redirectTimerRef.current = null;
        }
      };
    }

    if (!loading && (!session || !isAdmin)) {
      setIsBuffering(false);
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
    }
  }, [isAdmin, loading, navigate, redirectTo, session]);

  useEffect(() => {
    if (!session) {
      setIsBuffering(false);
    }
  }, [session]);

  if (!isConfigured) {
    return <AuthSetupState title="Login admin butuh Supabase" />;
  }

  if (isBuffering) {
    return <LoginBufferState destinationLabel={redirectLabel} />;
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
        setIsBuffering(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login gagal dijalankan.');
      setIsBuffering(false);
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="studio-input pr-14"
                  placeholder="Your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-0 top-1/2 flex h-[48px] w-12 -translate-y-1/2 items-center justify-center text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex justify-end">
              <Link
                to="/reset-password"
                className="text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900 dark:text-primary-300 dark:hover:text-primary-100"
              >
                Forgot password?
              </Link>
            </div>

            {error ? (
              <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800 dark:border-rose-900 dark:bg-rose-900/20 dark:text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || loading || isBuffering}
              className="btn-primary w-full"
            >
              {isSubmitting || isBuffering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              {isBuffering ? 'Opening admin...' : isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
