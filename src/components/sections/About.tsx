import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import type { Language } from '../../types';
import arjunaImage from '../../assets/arjuna.jpeg';
import batuImage from '../../assets/batu.jpeg';
import reguloImage from '../../assets/regulo.jpeg';
import bromoImage from '../../assets/bromo.jpeg';
import dinnerImage from '../../assets/dinner.jpeg';
import beachImage from '../../assets/beach.jpeg';


interface AboutProps {
  language: Language;
}

const About: React.FC<AboutProps> = ({ language }) => {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const t = language === 'id'
    ? {
        kicker: 'About Me',
        title: 'Cerita Di Balik Kode',
        subtitle: 'Momen personal yang membentuk cara kerja saya.',
        photoTitle: 'Photo Memories',
        photoSubtitle: 'Hover atau tap kartu untuk flip.',
        locationLabel: 'Lokasi',
        flipHint: 'Hover / tap untuk flip',
      }
    : {
        kicker: 'About Me',
        title: 'Stories Behind The Code',
        subtitle: 'Personal moments that shape how I work.',
        photoTitle: 'Photo Memories',
        photoSubtitle: 'Hover or tap cards to flip.',
        locationLabel: 'Location',
        flipHint: 'Hover / tap to flip',
      };

  const photoCards = [
    {
      id: 'arjuna',
      title: 'Arjuna',
      location: language === 'id' ? 'Gunung Arjuno' : 'Arjuno Mountain',
      backText: language === 'id'
        ? '3000++ mdpl pertamaku. Capek Mending Tidur.'
        : 'My first 3000++m peak. Too tired, better sleep.',
      image: arjunaImage,
      floatDelay: '0s',
      floatDuration: '7.2s',
    },
    {
      id: 'batu',
      title: 'Batu',
      location: language === 'id' ? 'Batu, Malang' : 'Batu, Malang',
      backText: language === 'id'
        ? 'Kota dingin favorit buat recharge habis sprint project.'
        : 'My favorite cool city to recharge after project sprints.',
      image: batuImage,
      floatDelay: '0.6s',
      floatDuration: '8s',
    },
    {
      id: 'regulo',
      title: 'Regulo',
      location: language === 'id' ? 'Ranu Regulo' : 'Ranu Regulo',
      backText: language === 'id'
        ? 'Lebih tenang dari timeline, cocok buat reset pikiran.'
        : 'Quieter than any timeline, perfect for a mind reset.',
      image: reguloImage,
      floatDelay: '1.1s',
      floatDuration: '7.6s',
    },
    {
      id: 'bromo',
      title: 'Bromo',
      location: language === 'id' ? 'Bromo, Jawa Timur' : 'Bromo, East Java',
      backText: language === 'id'
        ? 'Sunrise di sini ngingetin: proses itu selalu worth it.'
        : 'This sunrise reminds me: the process is always worth it.',
      image: bromoImage,
      floatDelay: '1.6s',
      floatDuration: '8.4s',
    },
    {
      id: 'dinner',
      title: 'Eat XD',
      location: language === 'id' ? 'Malam Di Malang' : 'Night in Malang',
      backText: language === 'id'
        ? 'Sesi santai sambil evaluasi hari. Ide sering muncul di sini.'
        : 'A calm review session. Good ideas often start here.',
      image: dinnerImage,
      floatDelay: '2s',
      floatDuration: '7s',
    },
    {
      id: 'beach',
      title: 'Beach',
      location: language === 'id' ? 'Pantai Selatan' : 'Southern Coast',
      backText: language === 'id'
        ? 'Angin lautnya selalu bikin kepala jadi lebih jernih.'
        : 'Sea breeze always helps me reset and think clearly.',
      image: beachImage,
      floatDelay: '2.5s',
      floatDuration: '8.8s',
    },
  ];

  return (
    <section id="about" className="section-shell">
      <div className="section-container">
        <div className="max-w-3xl">
          <motion.span
            className="section-kicker"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {t.kicker}
          </motion.span>
          <motion.h2
            className="section-title mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t.title}
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.photoTitle}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.photoSubtitle}</p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photoCards.map((card) => {
              const isFlipped = flippedCard === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setFlippedCard((prev) => (prev === card.id ? null : card.id))}
                  className="group w-full text-left"
                  aria-pressed={isFlipped}
                >
                  <div
                    className="animate-float"
                    style={{ animationDelay: card.floatDelay, animationDuration: card.floatDuration }}
                  >
                    <div className="flip-card h-[250px] sm:h-[320px]">
                    <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                      <div className="flip-face overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-dark-800 sm:rounded-2xl">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/85 to-transparent p-4">
                          <p className="text-base font-semibold text-white">{card.title}</p>
                          <p className="mt-1 inline-flex items-center text-xs text-slate-200">
                            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                            {t.flipHint}
                          </p>
                        </div>
                      </div>

                      <div className="flip-face flip-back rounded-[1.4rem] border border-slate-200 bg-slate-900 p-4 text-white shadow-lg dark:border-slate-600 dark:bg-slate-100 dark:text-slate-900 sm:rounded-2xl sm:p-5">
                        <p className="text-xs uppercase tracking-[0.12em] opacity-70">{t.photoTitle}</p>
                        <div className="mt-6">
                          <h4 className="text-lg font-bold">{card.title}</h4>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] opacity-70">
                            {t.locationLabel}: {card.location}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed opacity-90">{card.backText}</p>
                        </div>
                        <p className="mt-auto inline-flex items-center pt-6 text-xs font-semibold opacity-75">
                          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                          {t.flipHint}
                        </p>
                      </div>
                    </div>
                  </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
