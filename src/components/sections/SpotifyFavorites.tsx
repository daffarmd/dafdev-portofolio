import React from 'react';
import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';

const favoriteTracks = [
  {
    title: 'Seasons',
    artist: 'Wave To Earth',
    embedUrl: 'https://open.spotify.com/embed/track/1acVBP8BcK6LTeNeFjfxnh?utm_source=generator',
  }
  ,
  {
    title: 'The Spirit Carries On',
    artist: 'Dream Theater',
    embedUrl: 'https://open.spotify.com/embed/track/7ycz6sgZWp4wvF53BZVTjE?utm_source=generator',
  },
  {
    title: 'Lost',
    artist: 'Avanged Sevenfold',
    embedUrl: 'https://open.spotify.com/embed/track/0EtXiKDaHJcVFFvhWpSfiN?utm_source=generator',
  },
];

const SpotifyFavorites: React.FC = () => {
  return (
    <section id="recently-played" className="section-shell pt-0 scroll-mt-24">
      <div className="section-container">
          <div className="flex items-center">
            <div className="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-dark-800">
              <Music2 className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            </div>
            <h2 className="ml-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Recently Played</h2>
          </div>


          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {favoriteTracks.map((track, index) => (
              <motion.article
                key={track.embedUrl}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-dark-800 sm:p-4"
              >
                <p className="px-1 pb-2 text-sm font-semibold text-slate-900 dark:text-white">{track.title}</p>
                <p className="px-1 pb-3 text-xs text-slate-500 dark:text-slate-400">{track.artist}</p>
                <iframe
                  title={`Spotify track ${track.title}`}
                  src={track.embedUrl}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                />
              </motion.article>
            ))}
          </div>
      </div>
    </section>
  );
};

export default SpotifyFavorites;
