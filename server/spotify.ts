/// <reference types="node" />

import type { SpotifyPayload, SpotifyTokenResponse, SpotifyTrack } from '../src/types/spotify';

type SpotifyTimeRange = 'short_term' | 'medium_term' | 'long_term';

interface SpotifyConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  recentlyPlayedLimit: number;
  topTracksLimit: number;
  topTracksTimeRange: SpotifyTimeRange;
}

interface SpotifyClientConfig {
  clientId: string;
  clientSecret: string;
}

interface SpotifyImage {
  url: string;
  height?: number | null;
  width?: number | null;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyAlbum {
  name: string;
  images?: SpotifyImage[];
}

interface SpotifyTrackApiObject {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  preview_url: string | null;
  duration_ms: number;
  popularity: number;
  external_urls: {
    spotify?: string;
  };
}

interface RecentlyPlayedItem {
  track: SpotifyTrackApiObject;
  played_at: string;
}

interface TopTracksResponse {
  items: SpotifyTrackApiObject[];
}

interface RecentlyPlayedResponse {
  items: RecentlyPlayedItem[];
}

interface SpotifyTokenApiResponse {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

interface SpotifyAccessTokenResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

const SPOTIFY_ACCOUNTS_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
const DEFAULT_TRACK_LIMIT = 5;
const MAX_TRACK_LIMIT = 10;

export class SpotifyConfigError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'SpotifyConfigError';
    this.statusCode = statusCode;
  }
}

function clampTrackLimit(value: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(MAX_TRACK_LIMIT, Math.max(1, Math.trunc(value)));
}

function parseTrackLimit(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt((value ?? '').trim(), 10);
  return clampTrackLimit(parsed, fallback);
}

function parseTimeRange(value: string | undefined): SpotifyTimeRange {
  const normalized = value?.trim();
  if (normalized === 'short_term' || normalized === 'medium_term' || normalized === 'long_term') {
    return normalized;
  }

  return 'medium_term';
}

function requireEnvValue(env: NodeJS.ProcessEnv, key: string, message: string): string {
  const value = env[key]?.trim();
  if (!value) {
    throw new SpotifyConfigError(message, 500);
  }

  return value;
}

export function resolveSpotifyClientConfig(env: NodeJS.ProcessEnv = process.env): SpotifyClientConfig {
  return {
    clientId: requireEnvValue(env, 'SPOTIFY_CLIENT_ID', 'Spotify API is not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.'),
    clientSecret: requireEnvValue(env, 'SPOTIFY_CLIENT_SECRET', 'Spotify API is not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.'),
  };
}

export function resolveSpotifyConfig(env: NodeJS.ProcessEnv = process.env): SpotifyConfig {
  const clientConfig = resolveSpotifyClientConfig(env);

  return {
    ...clientConfig,
    refreshToken: requireEnvValue(env, 'SPOTIFY_REFRESH_TOKEN', 'Spotify API is not configured. Set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN.'),
    recentlyPlayedLimit: parseTrackLimit(env.SPOTIFY_RECENTLY_PLAYED_LIMIT, DEFAULT_TRACK_LIMIT),
    topTracksLimit: parseTrackLimit(env.SPOTIFY_TOP_TRACKS_LIMIT, DEFAULT_TRACK_LIMIT),
    topTracksTimeRange: parseTimeRange(env.SPOTIFY_TOP_TRACKS_TIME_RANGE),
  };
}

function normalizeSpotifyErrorMessage(reason: unknown, fallback: string): string {
  if (reason instanceof Error) {
    return reason.message;
  }

  if (typeof reason === 'string' && reason.trim()) {
    return reason;
  }

  return fallback;
}

async function readResponseSnippet(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text.trim().slice(0, 220);
  } catch {
    return '';
  }
}

function buildSpotifyTokenExchangeErrorMessage(
  operation: 'refresh token' | 'authorization code exchange',
  response: Response,
  snippet: string,
): string {
  const statusText = response.statusText ? ` ${response.statusText}` : '';
  const baseMessage = `Spotify ${operation} failed (${response.status}${statusText})`;

  if (snippet.includes('"error":"invalid_grant"')) {
    if (operation === 'authorization code exchange') {
      return `${baseMessage}: invalid_grant. The authorization code is single-use, can expire quickly, and must use the exact same redirect URI and client ID as the authorize step. Start the flow again with a fresh code.`;
    }

    return `${baseMessage}: invalid_grant. The refresh token was rejected by Spotify. Reconnect the account and generate a new refresh token.`;
  }

  return snippet ? `${baseMessage}: ${snippet}` : baseMessage;
}

function buildBasicAuthHeader(config: SpotifyClientConfig): string {
  return `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`;
}

function validateSpotifyRedirectUri(redirectUri: string): void {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(redirectUri);
  } catch {
    throw new SpotifyConfigError('Invalid Spotify redirect URI.', 400);
  }

  if (parsedUrl.pathname !== '/callback') {
    throw new SpotifyConfigError('Spotify redirect URI must point to /callback.', 400);
  }

  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    throw new SpotifyConfigError('Spotify redirect URI must use http or https.', 400);
  }
}

async function requestSpotifyToken(
  config: SpotifyClientConfig,
  body: URLSearchParams,
): Promise<{ response: Response; payload: SpotifyTokenApiResponse | null }> {
  const response = await fetch(SPOTIFY_ACCOUNTS_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: buildBasicAuthHeader(config),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    return { response, payload: null };
  }

  const payload = await response.json() as SpotifyTokenApiResponse;

  return { response, payload };
}

async function refreshAccessToken(config: SpotifyConfig): Promise<SpotifyAccessTokenResult> {
  const { response, payload } = await requestSpotifyToken(
    config,
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: config.refreshToken,
    }),
  );

  if (!response.ok) {
    const snippet = await readResponseSnippet(response);
    throw new SpotifyConfigError(
      buildSpotifyTokenExchangeErrorMessage('refresh token', response, snippet),
      response.status,
    );
  }

  if (!payload?.access_token) {
    throw new SpotifyConfigError('Spotify token refresh response did not include an access token.');
  }

  return {
    accessToken: payload.access_token,
    tokenType: payload.token_type ?? 'Bearer',
    expiresIn: payload.expires_in ?? 0,
  };
}

export async function exchangeSpotifyAuthorizationCode(
  code: string,
  redirectUri: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<SpotifyTokenResponse> {
  validateSpotifyRedirectUri(redirectUri);

  const clientConfig = resolveSpotifyClientConfig(env);
  const { response, payload } = await requestSpotifyToken(
    clientConfig,
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  );

  if (!response.ok) {
    const snippet = await readResponseSnippet(response);
    throw new SpotifyConfigError(
      buildSpotifyTokenExchangeErrorMessage('authorization code exchange', response, snippet),
      response.status,
    );
  }

  if (!payload?.access_token || !payload.refresh_token) {
    throw new SpotifyConfigError('Spotify token exchange response did not include the required tokens.');
  }

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    scope: payload.scope ?? '',
    tokenType: payload.token_type ?? 'Bearer',
    expiresIn: payload.expires_in ?? 0,
  };
}

function buildSpotifyTrack(track: SpotifyTrackApiObject, playedAt?: string): SpotifyTrack {
  return {
    id: track.id,
    name: track.name,
    artists: track.artists.map((artist) => artist.name).filter(Boolean),
    albumName: track.album.name,
    albumImageUrl: track.album.images?.[0]?.url ?? null,
    spotifyUrl: track.external_urls.spotify || `https://open.spotify.com/track/${track.id}`,
    previewUrl: track.preview_url,
    durationMs: track.duration_ms,
    popularity: track.popularity,
    ...(playedAt ? { playedAt } : {}),
  };
}

async function fetchRecentlyPlayed(accessToken: string, limit: number): Promise<SpotifyTrack[]> {
  const response = await fetch(`${SPOTIFY_API_BASE_URL}/me/player/recently-played?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const snippet = await readResponseSnippet(response);
    throw new SpotifyConfigError(
      `Spotify recently played request failed (${response.status}${response.statusText ? ` ${response.statusText}` : ''})${snippet ? `: ${snippet}` : ''}`,
      response.status,
    );
  }

  const payload = await response.json() as RecentlyPlayedResponse;
  return payload.items.map((item) => buildSpotifyTrack(item.track, item.played_at));
}

async function fetchTopTracks(accessToken: string, limit: number, timeRange: SpotifyTimeRange): Promise<SpotifyTrack[]> {
  const response = await fetch(`${SPOTIFY_API_BASE_URL}/me/top/tracks?limit=${limit}&time_range=${timeRange}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const snippet = await readResponseSnippet(response);
    throw new SpotifyConfigError(
      `Spotify top tracks request failed (${response.status}${response.statusText ? ` ${response.statusText}` : ''})${snippet ? `: ${snippet}` : ''}`,
      response.status,
    );
  }

  const payload = await response.json() as TopTracksResponse;
  return payload.items.map((track) => buildSpotifyTrack(track));
}

export async function fetchSpotifyPayload(env: NodeJS.ProcessEnv = process.env): Promise<SpotifyPayload> {
  const config = resolveSpotifyConfig(env);
  const { accessToken } = await refreshAccessToken(config);

  const [recentlyPlayedResult, topTracksResult] = await Promise.allSettled([
    fetchRecentlyPlayed(accessToken, config.recentlyPlayedLimit),
    fetchTopTracks(accessToken, config.topTracksLimit, config.topTracksTimeRange),
  ]);

  const errors: string[] = [];
  let recentlyPlayed: SpotifyTrack[] = [];
  let topTracks: SpotifyTrack[] = [];

  if (recentlyPlayedResult.status === 'fulfilled') {
    recentlyPlayed = recentlyPlayedResult.value;
  } else {
    errors.push(normalizeSpotifyErrorMessage(recentlyPlayedResult.reason, 'Failed to load recently played tracks.'));
  }

  if (topTracksResult.status === 'fulfilled') {
    topTracks = topTracksResult.value;
  } else {
    errors.push(normalizeSpotifyErrorMessage(topTracksResult.reason, 'Failed to load top tracks.'));
  }

  return {
    recentlyPlayed,
    topTracks,
    fetchedAt: new Date().toISOString(),
    ...(errors.length > 0 ? { errors } : {}),
  };
}
