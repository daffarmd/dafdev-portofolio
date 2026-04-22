import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Layers3, Mail, UserRound } from 'lucide-react';
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
      };

  const quickLinks = [
    { to: '/about', title: t.about, description: t.aboutDesc, icon: UserRound },
    { to: '/showcase', title: t.showcase, description: t.showcaseDesc, icon: Layers3 },
    { to: '/contact', title: t.contact, description: t.contactDesc, icon: Mail },
  ];

  const spotifyPlaceholder = (
    <section id="recently-played" ref={spotifySectionRef} className="section-shell pt-0 scroll-mt-24">
      <div className="mx-auto max-w-[824px] px-4">
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
                className="h-9 w-32 rounded-[0.8rem] bg-white/10"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-9 w-[88px] rounded-[0.8rem] bg-transparent"
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

            <div className="space-y-3">
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
          <SpotifyFavorites language={language} />
        </Suspense>
      ) : (
        spotifyPlaceholder
      )}
    </div>
  );
};

export default Home;
