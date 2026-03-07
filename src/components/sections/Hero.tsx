import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronDown, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Language } from '../../types';

interface HeroProps {
  language: Language;
}

const FULL_NAME = 'Hello, Daffa Here';

const Hero: React.FC<HeroProps> = ({ language }) => {
  const [typedName, setTypedName] = useState('');

  useEffect(() => {
    let index = 0;
    setTypedName('');

    const typewriter = window.setInterval(() => {
      index += 1;
      setTypedName(FULL_NAME.slice(0, index));
      if (index >= FULL_NAME.length) {
        window.clearInterval(typewriter);
      }
    }, 70);

    return () => window.clearInterval(typewriter);
  }, [language]);

  const t = language === 'id'
    ? {
        kicker: 'Backend Developer',
        shortInfo: 'Membuat apapun yang bisa di buat.',
        stackInfo: '',
        aboutBtn: 'Lihat About',
      }
    : {
        kicker: 'Backend Developer',
        shortInfo: 'Make anything that can be made.',
        stackInfo: '',
        aboutBtn: 'Open About',
      };

  return (
    <section id="hero" className="relative flex min-h-[72vh] items-center overflow-hidden pb-12 pt-20 sm:min-h-[78vh] sm:pt-28 md:pt-32">
      <div className="absolute inset-0 soft-grid-bg opacity-60"></div>
      <div className="pointer-events-none absolute -top-16 right-[-80px] h-72 w-72 rounded-full bg-slate-200/40 blur-3xl dark:bg-slate-700/20"></div>

      <div className="section-container relative z-10">
        <motion.div
          className="max-w-4xl md:pr-8 lg:pr-14"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <h1 className="mt-5 min-h-[60px] text-[2rem] font-extrabold tracking-tight text-slate-900 sm:mt-6 sm:min-h-[72px] sm:text-4xl md:min-h-[88px] md:text-6xl dark:text-white">
            {typedName}
            <span className="caret-blink ml-1 inline-block h-[0.95em] w-[2px] bg-slate-900 align-[-0.08em] dark:bg-white"></span>
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:mt-5 md:text-lg dark:text-slate-300">
            {t.shortInfo}
          </p>
          <p className="mt-2 text-sm text-slate-500 md:text-base dark:text-slate-400">
            {t.stackInfo}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {['Golang', 'PostgreSQL', 'Backend API', 'Svelte'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-dark-800 dark:text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="https://github.com/daffarmd"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/muhammaddaffaramadhan/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full sm:w-auto"
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </a>
            <RouterLink to="/about" className="btn-outline w-full sm:w-auto">
              {t.aboutBtn}
            </RouterLink>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 hidden w-full justify-center sm:flex">
        <RouterLink
          to="/about"
          className="rounded-full border border-slate-300 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:bg-dark-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
        >
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </RouterLink>
      </div>
    </section>
  );
};

export default Hero;
