import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Layers3, UserRound, Mail } from 'lucide-react';
import Hero from '../components/sections/Hero';
import type { Language } from '../types';

const SpotifyFavorites = lazy(() => import('../components/sections/SpotifyFavorites'));

interface HomeProps {
  language: Language;
}

const Home: React.FC<HomeProps> = ({ language }) => {
  const [shouldRenderSpotify, setShouldRenderSpotify] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;
    let idleId: number | undefined;

    const enableSpotifySection = () => {
      setShouldRenderSpotify(true);
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(enableSpotifySection, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(enableSpotifySection, 600);
    }

    return () => {
      if (typeof idleId === 'number' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (typeof timeoutId === 'number') {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const t = language === 'id'
    ? {
        nextTitle: 'Jelajahi Portofolio Muhammad Daffa Ramadhan',
        nextDesc: 'Temukan profil, showcase produk, artikel teknis, dan kanal kontak untuk kolaborasi project backend.',
        about: 'Menu About',
        showcase: 'Menu Showcase',
        contact: 'Menu Kontak',
        aboutDesc: 'Profil, pengalaman, dan semua project utama ada di sini.',
        showcaseDesc: 'Kumpulan project dummy untuk demo konsep produk.',
        contactDesc: 'Diskusi kebutuhan project dan peluang kolaborasi.',
        open: 'Buka',
      }
    : {
        nextTitle: 'Explore Muhammad Daffa Ramadhan Portfolio',
        nextDesc: 'Discover profile, product showcase, technical notes, and collaboration contact channels.',
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

  return (
    <div>
      <Hero language={language} />

      <section className="section-shell pt-0">
        <div className="section-container">
          <div className="glass-card p-5 sm:p-7 md:p-8">
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
                    className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-dark-800 dark:hover:border-slate-500 sm:p-5"
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
        <Suspense fallback={<div className="section-shell pt-0" aria-hidden="true" />}>
          <SpotifyFavorites />
        </Suspense>
      ) : null}
    </div>
  );
};

export default Home;
