export type SpotifyTab = 'recently-played' | 'top-tracks';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  albumImageUrl: string | null;
  spotifyUrl: string;
  previewUrl: string | null;
  durationMs: number;
  popularity: number;
  playedAt?: string;
}

export interface SpotifyPayload {
  recentlyPlayed: SpotifyTrack[];
  topTracks: SpotifyTrack[];
  fetchedAt: string;
  errors?: string[];
}

export interface SpotifyTokenResponse {
  accessToken: string;
  refreshToken: string;
  scope: string;
  tokenType: string;
  expiresIn: number;
}
