import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Layers3, Mail, Music2, UserRound } from 'lucide-react';
import Hero from '../components/sections/Hero';
import type { Language } from '../types';

const SpotifyFavorites = lazy(() => import('../components/sections/SpotifyFavorites'));

interface HomeProps {
  language: Language;
}

const Home: React.FC<HomeProps> = ({ language }) => {
  const [shouldRenderSpotify, setShouldRenderSpotify] = useState(false);
  const spotifySectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (shouldRenderSpotify) {
      return;
    }

    const target = spotifySectionRef.current;
    if (!target || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRenderSpotify(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '120px 0px',
        threshold: 0.25,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [shouldRenderSpotify]);

  const loadSpotify = () => {
    setShouldRenderSpotify(true);
  };

  const t = language === 'id'
    ? {
        nextTitle: 'Jelajahi Portofolio Muhammad Daffa Ramadhan',
        nextDesc: 'Temukan profil, showcase produk, artikel teknis, dan kanal kontak untuk kolaborasi project backend, automation, dan AI.',
        about: 'Menu About',
        showcase: 'Menu Showcase',
        contact: 'Menu Kontak',
        aboutDesc: 'Profil, pengalaman, dan semua project utama ada di sini.',
        showcaseDesc: 'Kumpulan project dummy untuk demo konsep produk.',
        contactDesc: 'Diskusi kebutuhan project dan peluang kolaborasi.',
        open: 'Buka',
        spotifyTitle: 'Diputar Terakhir',
        spotifyDesc: 'Spotify embed dimuat hanya ketika section ini masuk viewport.',
        spotifyHint: 'Tekan tombol jika ingin memuat lebih awal.',
        spotifyButton: 'Muat Spotify',
      }
    : {
        nextTitle: 'Explore My Portfolio',
        nextDesc: 'Discover profile, product showcase, technical notes, and collaboration contact channels for backend, automation, and AI projects.',
        about: 'About Page',
        showcase: 'Showcase Page',
        contact: 'Contact Page',
        aboutDesc: 'Profile, experience, and all main projects are available here.',
        showcaseDesc: 'A curated set of dummy projects for product concept demos.',
        contactDesc: 'Discuss project needs and collaboration opportunities.',
        open: 'Open',
        spotifyTitle: 'Recently Played',
        spotifyDesc: 'Spotify embeds are loaded only when this section enters the viewport.',
        spotifyHint: 'Tap the button if you want to load them earlier.',
        spotifyButton: 'Load Spotify',
      };

  const quickLinks = [
    { to: '/about', title: t.about, description: t.aboutDesc, icon: UserRound },
    { to: '/showcase', title: t.showcase, description: t.showcaseDesc, icon: Layers3 },
    { to: '/contact', title: t.contact, description: t.contactDesc, icon: Mail },
  ];

  const spotifyPlaceholder = (
    <section id="recently-played" ref={spotifySectionRef} className="section-shell pt-0 scroll-mt-24">
      <div className="section-container">
        <div className="glass-card flex min-h-[18rem] flex-col justify-between p-5 sm:p-6">
          <div className="flex items-center">
            <div className="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-dark-800">
              <Music2 className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            </div>
            <h2 className="ml-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t.spotifyTitle}</h2>
          </div>

          <div className="mt-6 max-w-2xl">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {t.spotifyDesc}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {t.spotifyHint}
            </p>
            <button
              type="button"
              onClick={loadSpotify}
              className="btn-primary mt-5 w-full sm:w-auto"
            >
              {t.spotifyButton}
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="relative isolate">
      <Hero language={language} />

      <section id="home-overview" className="section-shell relative z-10 -mt-10 pt-0 scroll-mt-24 sm:-mt-12 md:-mt-14">
        <div className="section-container relative">
          <div className="glass-card bg-white/86 p-5 dark:bg-dark-800/84 sm:p-7 md:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t.nextTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.nextDesc}</p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map(({ to, title, description, icon: Icon }, index) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <RouterLink
                    to={to}
                    className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/92 p-4 transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-dark-800/80 dark:hover:border-slate-500 sm:p-5"
                  >
                    <Icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                    <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {t.open}
                      <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </span>
                  </RouterLink>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {shouldRenderSpotify ? (
        <Suspense fallback={spotifyPlaceholder}>
          <SpotifyFavorites />
        </Suspense>
      ) : (
        spotifyPlaceholder
      )}
    </div>
  );
};

export default Home;
