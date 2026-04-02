import React, { useMemo, useState } from 'react';
import { ArrowLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthSetupState from '../../components/auth/AuthSetupState';
import { useAuth } from '../../hooks/useAuth';

const ResetPasswordPage: React.FC = () => {
  const {
    isConfigured,
    loading,
    session,
    requestPasswordReset,
    updatePassword,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmittingResetEmail, setIsSubmittingResetEmail] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const hashParams = useMemo(() => {
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash;

    return new URLSearchParams(hash);
  }, []);

  const isRecoveryLink = hashParams.get('type') === 'recovery';
  const canSetNewPassword = Boolean(session) || isRecoveryLink;
  const redirectTo = `${window.location.origin}/reset-password`;

  if (!isConfigured) {
    return <AuthSetupState title="Reset password butuh Supabase" />;
  }

  const handleSendResetEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError('Email wajib diisi.');
      return;
    }

    setIsSubmittingResetEmail(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await requestPasswordReset(email.trim(), redirectTo);
      if (result.error) {
        setError(result.error);
        return;
      }

      setSuccessMessage(`Link reset password sudah dikirim. Pastikan Supabase Auth mengizinkan redirect ke ${redirectTo}.`);
    } finally {
      setIsSubmittingResetEmail(false);
    }
  };

  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password || !confirmPassword) {
      setError('Password baru dan konfirmasi password wajib diisi.');
      return;
    }

    if (password.length < 8) {
      setError('Password baru minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    setIsSubmittingPassword(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await updatePassword(password);
      if (result.error) {
        setError(result.error);
        return;
      }

      setSuccessMessage('Password berhasil diperbarui. Sekarang kamu bisa login dengan password baru.');
      setPassword('');
      setConfirmPassword('');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="min-h-screen py-14 pt-28 sm:pt-32">
      <div className="mx-auto w-full max-w-3xl px-6 md:px-8">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/92 p-8 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.18)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/92 sm:p-12">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
            Reset admin password
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Halaman ini bisa dipakai untuk minta email reset password atau menyimpan password baru setelah kamu membuka link recovery dari Supabase.
          </p>

          <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-dark-700 dark:text-slate-200">
            Redirect URL yang harus diizinkan di Supabase Auth: <span className="font-semibold">{redirectTo}</span>
          </div>

          {successMessage ? (
            <div className="mt-5 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200">
              {successMessage}
            </div>
          ) : null}

          {error ? (
            <div className="mt-5 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800 dark:border-rose-900 dark:bg-rose-900/20 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-6 dark:border-slate-700 dark:bg-dark-700/60">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Kirim link recovery</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Masukkan email admin yang terdaftar di Supabase Auth.</p>
                </div>
              </div>

              <form className="mt-6 space-y-5" onSubmit={handleSendResetEmail}>
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

                <button
                  type="submit"
                  disabled={isSubmittingResetEmail || loading}
                  className="btn-primary w-full"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {isSubmittingResetEmail ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
            </section>

            <section className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-6 dark:border-slate-700 dark:bg-dark-700/60">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary-100 text-secondary-900 dark:bg-secondary-900/30 dark:text-secondary-100">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Simpan password baru</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {canSetNewPassword
                      ? 'Recovery session terdeteksi. Isi password baru di bawah ini.'
                      : 'Buka link recovery dari email dulu, lalu kembali ke halaman ini untuk set password baru.'}
                  </p>
                </div>
              </div>

              <form className="mt-6 space-y-5" onSubmit={handleUpdatePassword}>
                <label className="studio-field">
                  <span className="studio-label">Password baru</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="studio-input"
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    disabled={!canSetNewPassword || loading}
                  />
                </label>

                <label className="studio-field">
                  <span className="studio-label">Konfirmasi password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="studio-input"
                    placeholder="Ulangi password baru"
                    autoComplete="new-password"
                    disabled={!canSetNewPassword || loading}
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmittingPassword || loading || !canSetNewPassword}
                  className="btn-primary w-full"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  {isSubmittingPassword ? 'Updating...' : 'Update password'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
