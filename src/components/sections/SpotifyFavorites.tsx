import { useCallback, useEffect, useMemo, useRef, useState, type FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Play, Pause } from 'lucide-react';
import type { Language } from '../../types';
import type { SpotifyPayload, SpotifyTab, SpotifyTrack } from '../../types/spotify';

interface SpotifyFavoritesProps {
  language: Language;
}

const SPOTIFY_EMBED_ROOT = 'https://open.spotify.com/embed/track';
const TRACK_CARD_HEIGHT = 92;
const MAIN_CARD_HEIGHT = 392;

function buildSpotifyEmbedUrl(trackId: string): string {
  return `${SPOTIFY_EMBED_ROOT}/${trackId}?utm_source=generator&theme=0`;
}

function getTrackArtists(track: SpotifyTrack): string {
  return track.artists.length > 0 ? track.artists.join(', ') : 'Unknown artist';
}

function getTrackTone(index: number): string {
  const tones = [
    'bg-[#0b60b4]',
    'bg-[#676767]',
    'bg-[#2f4360]',
    'bg-[#5f5f5f]',
  ];

  return tones[index % tones.length];
}

interface SpotifyEmbedFrameProps {
  track: SpotifyTrack;
  height: number;
  className?: string;
}

const SpotifyEmbedFrame: FC<SpotifyEmbedFrameProps> = ({ track, height, className }) => {
  const artistText = getTrackArtists(track);
  return (
    <iframe
      title={`Spotify track player for ${track.name} by ${artistText}`}
      src={buildSpotifyEmbedUrl(track.id)}
      width="100%"
      height={height}
      className={`block w-full border-0 align-middle ${className ?? ''}`}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
};

// Small helper to format track duration in mm:ss
function formatDuration(ms: number) {
  const seconds = Math.round(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function readErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'Failed to load Spotify data.';
}

// Skeleton component removed - no pulsing animation needed

const SpotifyFavorites: FC<SpotifyFavoritesProps> = ({ language }) => {
  const [payload, setPayload] = useState<SpotifyPayload | null>(null);
  const [activeTab, setActiveTab] = useState<SpotifyTab>('recently-played');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);
  const tracksRef = useRef<HTMLDivElement>(null);

  const copy = useMemo(() => {
    if (language === 'id') {
      return {
        titleRecent: 'Diputar Terbaru',
        titleTop: 'Top Tracks',
        retry: 'Coba lagi',
        emptyTitle: 'Data Spotify belum tersedia.',
        emptyBody: 'Hubungkan akun Spotify atau coba muat ulang nanti.',
      };
    }

    return {
      titleRecent: 'Recently Played',
      titleTop: 'Top Tracks',
      retry: 'Try again',
      emptyTitle: 'No Spotify tracks available.',
      emptyBody: 'Refresh the section or reconnect the Spotify account.',
      };
  }, [language]);

  useEffect(() => {
    const controller = new AbortController();

    const loadSpotify = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/spotify', {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Spotify request failed with status ${response.status}.`);
        }

        const data = await response.json() as SpotifyPayload;

        if (!controller.signal.aborted) {
          setPayload({
            recentlyPlayed: Array.isArray(data.recentlyPlayed) ? data.recentlyPlayed : [],
            topTracks: Array.isArray(data.topTracks) ? data.topTracks : [],
            fetchedAt: typeof data.fetchedAt === 'string' ? data.fetchedAt : new Date().toISOString(),
            ...(Array.isArray(data.errors) && data.errors.length > 0 ? { errors: data.errors } : {}),
          });
        }
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError(readErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadSpotify();

    return () => {
      controller.abort();
    };
  }, [reloadTick]);

  const currentTracks = useMemo(() => {
    if (!payload) {
      return [];
    }

    return activeTab === 'recently-played' ? payload.recentlyPlayed : payload.topTracks;
  }, [activeTab, payload]);

  const mainTrack = currentTracks[0] ?? null;
  const sideTracks = currentTracks.slice(1, 5);
  const sectionTitle = activeTab === 'recently-played' ? copy.titleRecent : copy.titleTop;

  const handleTabClick = useCallback((tab: SpotifyTab) => {
    setActiveTab(tab);

    const tracksSection = tracksRef.current;
    if (!tracksSection || typeof window === 'undefined') {
      return;
    }

    const rect = tracksSection.getBoundingClientRect();
    const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

    if (!isFullyVisible) {
      tracksSection.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, []);

  const handleRetry = useCallback(() => {
    setReloadTick((value) => value + 1);
  }, []);

  if (loading) {
    return (
      <section id="recently-played" className="section-shell pt-0 scroll-mt-24">
        <div className="section-container">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="h-7 w-44 rounded-full bg-white/10"
              />
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="h-9 w-32 rounded-[0.85rem] bg-white/10"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="h-9 w-22 rounded-[0.85rem] bg-transparent"
                />
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="overflow-hidden rounded-[1.2rem] bg-[#686868]"
              >
                <div className="h-[392px] rounded-[1.2rem] bg-[#5f5f5f]" />
              </motion.div>

            <div className="space-y-2.5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <motion.div
                    key={`spotify-skeleton-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.12 }}
                    className={`overflow-hidden rounded-[1rem] ${index % 2 === 0 ? 'bg-[#0b60b4]' : 'bg-[#676767]'}`}
                  >
                    <div className="flex h-[92px] items-center gap-2.5 px-3">
                      <div className="h-16 w-16 rounded-[0.55rem] bg-white/10" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-3.5 w-3/4 rounded-full bg-white/10" />
                        <div className="h-3 w-1/2 rounded-full bg-white/10" />
                        <div className="h-4 w-16 rounded-[0.25rem] bg-white/10" />
                      </div>
                      <div className="h-6 w-6 rounded-full bg-white/10" />
                      <div className="ml-auto flex items-center gap-1.5">
                        <div className="h-7 w-7 rounded-full bg-white/10" />
                        <div className="h-7 w-7 rounded-full bg-white/10" />
                        <div className="h-9 w-9 rounded-full bg-white/10" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="recently-played" className="section-shell pt-0 scroll-mt-24">
        <div className="section-container">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5 shadow-[0_18px_54px_-36px_rgba(0,0,0,0.8)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{copy.emptyTitle}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/70">{error}</p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    {copy.retry}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="recently-played" className="section-shell pt-0 scroll-mt-24">
      <div className="section-container">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[1.35rem] font-bold tracking-tight sm:text-[1.45rem]">{sectionTitle}</h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTabClick('recently-played')}
                className={`rounded-[0.8rem] px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                  activeTab === 'recently-played'
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                {copy.titleRecent}
              </button>
              <button
                type="button"
                onClick={() => handleTabClick('top-tracks')}
                className={`rounded-[0.8rem] px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                  activeTab === 'top-tracks'
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                {copy.titleTop}
              </button>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="overflow-hidden rounded-[1.2rem]">
              <div className="flex h-[392px] flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mainTrack?.id ?? activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-full flex-col"
                  >
                    {mainTrack ? (
                      <>
                        <SpotifyEmbedFrame
                          track={mainTrack}
                          height={MAIN_CARD_HEIGHT}
                          className="rounded-[1.2rem]"
                        />
                      </>
                    ) : (
                      <div className="flex h-full flex-col rounded-[1.2rem] bg-[#5f5f5f] p-4">
                        <div className="mt-auto rounded-[0.85rem] bg-white/10 px-3 py-2 text-sm text-white/70">
                          {copy.emptyBody}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div ref={tracksRef} className="space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {sideTracks.length > 0 ? (
                    sideTracks.map((track, index) => (
                          <motion.div
                            key={track.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.2 }}
                            className="overflow-hidden rounded-[1rem]"
                          >
                            <SpotifyEmbedFrame
                              track={track}
                              height={TRACK_CARD_HEIGHT}
                              className="rounded-[1rem]"
                            />
                          </motion.div>
                    ))
                  ) : (
                    <div className="rounded-[0.95rem] bg-white/5 p-4 text-sm text-white/70">
                      {copy.emptyBody}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="h-px bg-white/10" />
        </div>
      </div>
    </section>
  );
};

export default SpotifyFavorites;
