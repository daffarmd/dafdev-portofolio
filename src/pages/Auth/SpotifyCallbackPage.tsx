import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Music2,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import type { SpotifyTokenResponse } from '../../types/spotify';
import {
  buildSpotifyAuthorizeUrl,
  clearSpotifyStoredState,
  getSpotifyRedirectUri,
  readSpotifyStoredState,
} from '../../lib/spotifyAuth';

type CallbackStatus = 'idle' | 'loading' | 'success' | 'error';
type CopyTarget = 'refresh' | 'env' | null;

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID?.trim();

interface SpotifyCodeExchangeRecord {
  promise: Promise<SpotifyTokenResponse>;
  value?: SpotifyTokenResponse;
  error?: Error;
}

const spotifyCodeExchangeCache = new Map<string, SpotifyCodeExchangeRecord>();

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = await response.json() as { message?: unknown } | null;
    if (payload && typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
  } catch {
    // Ignore JSON parse issues and fall back to a generic message below.
  }

  return `Spotify token exchange failed (${response.status}${response.statusText ? ` ${response.statusText}` : ''}).`;
}

async function exchangeSpotifyAuthorizationCode(
  code: string,
  redirectUri: string,
): Promise<SpotifyTokenResponse> {
  const response = await fetch('/api/spotify-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      code,
      redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json() as Promise<SpotifyTokenResponse>;
}

const SpotifyCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [tokenResponse, setTokenResponse] = useState<SpotifyTokenResponse | null>(null);
  const [copyTarget, setCopyTarget] = useState<CopyTarget>(null);

  const redirectUri = useMemo(() => getSpotifyRedirectUri(), []);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  const t = {
    kicker: 'Spotify OAuth',
    title: 'Connect Spotify for the portfolio',
    subtitle: 'Use this page to authorize the app, exchange the code on the server, and copy the refresh token into your production env.',
    connect: 'Connect Spotify',
    retry: 'Try again',
    backHome: 'Back to home',
    stepOne: '1. The dashboard redirect URI must match this callback exactly.',
    stepTwo: '2. Spotify will send back an authorization code on success.',
    stepThree: '3. The backend exchanges that code for a refresh token.',
    missingClientId: 'VITE_SPOTIFY_CLIENT_ID is missing. Add it to .env before starting the auth flow.',
    exchangeTitle: 'Token exchange',
    exchangeLoading: 'Exchanging authorization code...',
    exchangeSuccess: 'Spotify authorized successfully.',
    exchangeError: 'Spotify authorization could not be completed.',
    refreshToken: 'Refresh token',
    refreshTokenNote: 'Copy this value into SPOTIFY_REFRESH_TOKEN on the server side.',
    envSnippet: 'Env snippet',
    copy: 'Copy',
    copied: 'Copied',
    accessScope: 'Scopes',
    expiresIn: 'Expires in',
    seconds: 'seconds',
    stateMismatch: 'OAuth state mismatch. Start the flow again from this page.',
    missingState: 'No OAuth state was found in this browser session. Start the flow again from this page.',
    redirectMismatch: 'Could not determine the callback URL for this session.',
    spotifyError: 'Spotify returned an error during authorization.',
    noCode: 'No authorization code found yet. Start the flow below.',
    successNote: 'Save the refresh token in your backend env, then use the main Spotify section on the home page.',
    returnNote: 'After saving the env, reload the home page and the Spotify section will fetch data dynamically.',
  } as const;

  const copyValue = async (value: string, target: CopyTarget) => {
    try {
      setMessage(null);
      await navigator.clipboard.writeText(value);
      setCopyTarget(target);
      window.setTimeout(() => setCopyTarget(null), 1600);
    } catch {
      setMessage('Clipboard copy failed. You can select the text and copy it manually.');
    }
  };

  const startSpotifyAuthorization = () => {
    if (!SPOTIFY_CLIENT_ID) {
      setStatus('error');
      setMessage(t.missingClientId);
      return;
    }

    if (!redirectUri) {
      setStatus('error');
      setMessage(t.redirectMismatch);
      return;
    }

    const { url } = buildSpotifyAuthorizeUrl(SPOTIFY_CLIENT_ID, redirectUri);
    window.location.assign(url);
  };

  useEffect(() => {
    if (error) {
      setStatus('error');
      setMessage(`${t.spotifyError}${error ? ` (${error})` : ''}`);
      return;
    }

    if (!code) {
      setStatus('idle');
      return;
    }

    if (!redirectUri) {
      setStatus('error');
      setMessage(t.redirectMismatch);
      return;
    }

    const expectedState = readSpotifyStoredState();
    if (!expectedState) {
      setStatus('error');
      setMessage(t.missingState);
      return;
    }

    if (state !== expectedState) {
      setStatus('error');
      setMessage(t.stateMismatch);
      return;
    }

    const exchangeKey = `${code}:${state}`;
    let exchangeRecord = spotifyCodeExchangeCache.get(exchangeKey);
    if (!exchangeRecord) {
      exchangeRecord = {
        promise: exchangeSpotifyAuthorizationCode(code, redirectUri),
      };

      spotifyCodeExchangeCache.set(exchangeKey, exchangeRecord);
      exchangeRecord.promise.then((payload) => {
        exchangeRecord.value = payload;
      }).catch((exchangeError) => {
        exchangeRecord.error = exchangeError instanceof Error ? exchangeError : new Error(t.exchangeError);
      });
    }

    if (exchangeRecord.value) {
      setTokenResponse(exchangeRecord.value);
      setStatus('success');
      clearSpotifyStoredState();
      window.history.replaceState(null, '', '/callback');
      return;
    }

    if (exchangeRecord.error) {
      setStatus('error');
      setMessage(exchangeRecord.error.message);
      return;
    }

    const exchangeCode = async () => {
      setStatus('loading');
      setMessage(null);
      setTokenResponse(null);

      try {
        const payload = await exchangeRecord.promise;
        setTokenResponse(payload);
        setStatus('success');
        clearSpotifyStoredState();
        window.history.replaceState(null, '', '/callback');
      } catch (exchangeError) {
        setStatus('error');
        setMessage(exchangeError instanceof Error ? exchangeError.message : t.exchangeError);
      }
    };

    void exchangeCode();
  }, [code, error, redirectUri, state, t.exchangeError, t.missingState, t.redirectMismatch, t.spotifyError, t.stateMismatch]);

  const refreshTokenSnippet = tokenResponse ? `SPOTIFY_REFRESH_TOKEN=${tokenResponse.refreshToken}` : '';
  const envSnippet = tokenResponse
    ? [
        '# Backend environment',
        `SPOTIFY_REFRESH_TOKEN=${tokenResponse.refreshToken}`,
        '',
        '# Frontend environment for this callback page',
        `VITE_SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID ?? ''}`,
      ].join('\n')
    : '';

  const copyButtonLabel = (target: CopyTarget) => (copyTarget === target ? t.copied : t.copy);
  const secondaryActionLabel = status === 'error' ? t.retry : t.connect;

  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-16 sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.92))]" />
      <div className="absolute left-[10%] top-[18%] h-48 w-48 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10" />
      <div className="absolute right-[8%] top-[8%] h-64 w-64 rounded-full bg-slate-300/20 blur-3xl dark:bg-slate-500/10" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-dark-800/80 dark:text-slate-300">
            <Music2 className="h-3.5 w-3.5 text-emerald-500" />
            {t.kicker}
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="glass-card rounded-[2rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-dark-900/90 sm:p-6"
          >
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.exchangeTitle}
            </h2>

            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-dark-800/80">
                {t.stepOne}
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-dark-800/80">
                {t.stepTwo}
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-dark-800/80">
                {t.stepThree}
              </li>
            </ol>

            <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-dark-800/80">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Redirect URI
              </p>
              <p className="mt-2 break-all text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {redirectUri || t.redirectMismatch}
              </p>
            </div>

            {!SPOTIFY_CLIENT_ID ? (
              <div className="mt-5 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
                {t.missingClientId}
              </div>
            ) : null}

            <button
              type="button"
              onClick={startSpotifyAuthorization}
              className="btn-primary mt-5 w-full"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {t.connect}
            </button>

            <RouterLink
              to="/"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-dark-700"
            >
              {t.backHome}
            </RouterLink>
          </motion.aside>

          <motion.main
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="glass-card rounded-[2rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-dark-900/90 sm:p-6"
          >
            {status === 'loading' ? (
              <div className="flex min-h-[28rem] flex-col items-center justify-center text-center">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {t.exchangeLoading}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  The backend is exchanging the Spotify code for an access token and refresh token.
                </p>
              </div>
            ) : status === 'success' && tokenResponse ? (
              <div className="space-y-5">
                <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-300" />
                    <div>
                      <p className="font-semibold">{t.exchangeSuccess}</p>
                      <p className="mt-1 text-sm leading-relaxed text-emerald-800/90 dark:text-emerald-100/90">
                        {t.successNote}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-dark-800/80">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                        {t.refreshToken}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {t.refreshTokenNote}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyValue(refreshTokenSnippet, 'refresh')}
                      className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:bg-dark-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-dark-700"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copyButtonLabel('refresh')}
                    </button>
                  </div>
                  <pre className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 dark:border-slate-700 dark:bg-dark-950 dark:text-slate-100">
                    {refreshTokenSnippet}
                  </pre>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-dark-800/80">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      {t.accessScope}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {tokenResponse.scope || '-'}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-dark-800/80">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      {t.expiresIn}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {tokenResponse.expiresIn} {t.seconds}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-dark-800/80">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {t.envSnippet}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        Copy this block if you want a quick reminder of the values to store.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyValue(envSnippet, 'env')}
                      className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:bg-dark-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-dark-700"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copyButtonLabel('env')}
                    </button>
                  </div>
                  <pre className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 dark:border-slate-700 dark:bg-dark-950 dark:text-slate-100">
                    {envSnippet}
                  </pre>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-dark-800/80 dark:text-slate-300">
                  {t.returnNote}
                </div>

                {message ? (
                  <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
                    {message}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex min-h-[28rem] flex-col justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-dark-800 dark:text-slate-200">
                  <ExternalLink className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {t.noCode}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Open the connect button on the left, approve the app in Spotify, and this panel will show the refresh token.
                </p>

                {message ? (
                  <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-100">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-300" />
                      <p className="text-sm leading-relaxed">{message}</p>
                    </div>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={startSpotifyAuthorization}
                  className="btn-primary mt-2 w-full sm:w-auto"
                >
                  {status === 'error' ? <RefreshCcw className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {secondaryActionLabel}
                </button>
              </div>
            )}
          </motion.main>
        </div>
      </div>
    </section>
  );
};

export default SpotifyCallbackPage;
