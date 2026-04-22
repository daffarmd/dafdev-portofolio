export const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
export const SPOTIFY_CALLBACK_PATH = '/callback';
export const SPOTIFY_SCOPES = [
  'user-read-recently-played',
  'user-top-read',
];
export const SPOTIFY_STATE_STORAGE_KEY = 'spotify_oauth_state';

export function createSpotifyState(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
}

export function getSpotifyRedirectUri(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return `${window.location.origin}${SPOTIFY_CALLBACK_PATH}`;
}

export function buildSpotifyAuthorizeUrl(clientId: string, redirectUri: string) {
  const state = createSpotifyState();

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(SPOTIFY_STATE_STORAGE_KEY, state);
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: SPOTIFY_SCOPES.join(' '),
    redirect_uri: redirectUri,
    state,
  });

  return {
    state,
    url: `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`,
  };
}

export function readSpotifyStoredState(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(SPOTIFY_STATE_STORAGE_KEY);
}

export function clearSpotifyStoredState(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(SPOTIFY_STATE_STORAGE_KEY);
}
