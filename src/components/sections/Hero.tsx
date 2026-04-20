import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, ChevronRight, FileText, Github, Linkedin } from 'lucide-react';
import type { Language } from '../../types';
import golangIcon from '../../assets/golang-icon.png';
import postgresIcon from '../../assets/postgres-icon.png';
import reactIcon from '../../assets/react-icon.png';
import n8nIcon from '../../assets/n8n-images.png';
import svelteIcon from '../../assets/svelte-icon.png';

const RESUME_URL_ID = import.meta.env.VITE_RESUME_URL_ID?.trim() || '/CV_MuhammadDaffaRamadhan_ID.pdf';
const RESUME_URL_EN = import.meta.env.VITE_RESUME_URL_EN?.trim() || '/CV_MuhammadDaffaRamadhan_ENG.pdf';

interface HeroProps {
  language: Language;
}

const GREETINGS = [
  'Hello, Daffa here',
  'Halo, Daffa di sini',
  'Bonjour, Daffa ici',
  'Hola, Daffa aqui',
  'Ciao, Daffa qui',
  'Konnichiwa, Daffa desu',
  'Annyeong, Daffa imnida',
  'Namaste, main Daffa hoon',
  'Guten Tag, Daffa hier',
  'Salaam, Daffa huna',
  'Ola, Daffa aqui',
  'Merhaba, Daffa burada',
];

const TYPE_SPEED = 70;
const GREETING_PAUSE = 2200;
const HERO_COPY_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      staggerChildren: 0.12,
    },
  },
};

const HERO_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const TECH_STACK = [
  {
    label: 'Golang',
    image: golangIcon,
    className: 'border-sky-200/80 bg-sky-50/90 text-sky-700 shadow-sky-200/60 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200 dark:shadow-sky-900/20',
  },
  {
    label: 'PostgreSQL',
    image: postgresIcon,
    className: 'border-emerald-200/80 bg-emerald-50/90 text-emerald-700 shadow-emerald-200/60 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200 dark:shadow-emerald-900/20',
  },
  {
    label: 'React',
    image: reactIcon,
    className: 'border-amber-200/80 bg-amber-50/90 text-amber-700 shadow-amber-200/60 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200 dark:shadow-amber-900/20',
  },
  {
    label: 'n8n',
    image: n8nIcon,
    className: 'border-orange-200/80 bg-orange-50/90 text-orange-700 shadow-orange-200/60 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200 dark:shadow-orange-900/20',
  },
  {
    label: 'Svelte',
    image: svelteIcon,
    className: 'border-rose-200/80 bg-rose-50/90 text-rose-700 shadow-rose-200/60 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 dark:shadow-rose-900/20',
  },
];

const Hero: React.FC<HeroProps> = ({ language }) => {
  const [typedName, setTypedName] = useState('');
  const [resumeMenuOpen, setResumeMenuOpen] = useState(false);
  const resumeMenuRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 140, damping: 22, mass: 0.55 });
  const smoothY = useSpring(pointerY, { stiffness: 140, damping: 22, mass: 0.55 });

  const contentX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const contentY = useTransform(smoothY, [-1, 1], [-12, 12]);
  const contentRotateX = useTransform(smoothY, [-1, 1], [3, -3]);
  const contentRotateY = useTransform(smoothX, [-1, 1], [-4, 4]);

  const accentLeftX = useTransform(smoothX, [-1, 1], [-42, 42]);
  const accentLeftY = useTransform(smoothY, [-1, 1], [-26, 26]);
  const accentRightX = useTransform(smoothX, [-1, 1], [36, -36]);
  const accentRightY = useTransform(smoothY, [-1, 1], [24, -24]);

  useEffect(() => {
    let greetingIndex = 0;
    let charIndex = 0;
    let typewriter: number | undefined;
    let rotationTimer: number | undefined;

    const startTyping = () => {
      const currentGreeting = GREETINGS[greetingIndex];
      charIndex = 0;
      setTypedName('');

      typewriter = window.setInterval(() => {
        charIndex += 1;
        setTypedName(currentGreeting.slice(0, charIndex));

        if (charIndex >= currentGreeting.length) {
          window.clearInterval(typewriter);
          rotationTimer = window.setTimeout(() => {
            greetingIndex = (greetingIndex + 1) % GREETINGS.length;
            startTyping();
          }, GREETING_PAUSE);
        }
      }, TYPE_SPEED);
    };

    startTyping();

    return () => {
      if (typewriter) {
        window.clearInterval(typewriter);
      }
      if (rotationTimer) {
        window.clearTimeout(rotationTimer);
      }
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (resumeMenuRef.current && !resumeMenuRef.current.contains(event.target as Node)) {
        setResumeMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setResumeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const normalizedX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const normalizedY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    pointerX.set(normalizedX);
    pointerY.set(normalizedY);

  };

  const handleMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const t = language === 'id'
    ? {
      shortInfo: 'Membangun sistem backend, automation, dan AI yang rapi dan scalable.',
      stackInfo: 'Backend + Automation + AI Engineer',
      resumeTitle: 'CV / Resume',
      resumeMenuTitle: 'Pilih versi CV',
      resumeMenuHint: 'Buka versi yang paling relevan untuk HRD',
      resumeIdTitle: 'CV Indonesia',
      resumeIdDesc: 'Untuk rekrutmen lokal atau HRD Indonesia',
      resumeEnTitle: 'CV English',
      resumeEnDesc: 'For international hiring or bilingual review',
    }
    : {
        shortInfo: 'Building backend, automation, and AI systems that are clean and scalable.',
        stackInfo: 'Backend + Automation + AI Engineer',
        resumeTitle: 'CV / Resume',
        resumeMenuTitle: 'Choose CV version',
        resumeMenuHint: 'Open the version that fits the recruiter',
        resumeIdTitle: 'Indonesian CV',
        resumeIdDesc: 'For local recruitment or Indonesian HR',
        resumeEnTitle: 'English CV',
        resumeEnDesc: 'For international hiring or bilingual review',
      };

  return (
    <section
      id="hero"
      className="relative flex min-h-[66vh] items-center overflow-hidden pb-24 pt-28 sm:min-h-[64vh] sm:pt-24 sm:pb-28 md:min-h-[68vh] md:pt-36 md:pb-32 lg:min-h-[72vh] lg:pt-40"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 soft-grid-bg opacity-60"></div>
      <motion.div
        className="pointer-events-none absolute -left-16 top-20 h-48 w-80 rounded-[3rem] bg-gradient-to-br from-sky-200/70 via-cyan-100/35 to-transparent blur-3xl dark:from-sky-500/18 dark:via-cyan-500/10 dark:to-transparent"
        style={{ x: accentLeftX, y: accentLeftY }}
      />
      <motion.div
        className="pointer-events-none absolute right-[-6rem] top-20 h-72 w-80 rounded-[3rem] bg-gradient-to-bl from-white/80 via-slate-200/35 to-transparent blur-3xl dark:from-slate-700/22 dark:via-slate-800/12 dark:to-transparent"
        style={{ x: accentRightX, y: accentRightY }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-10 left-[20%] hidden h-28 w-56 rounded-[2.5rem] bg-white/8 opacity-60 blur-3xl sm:block dark:bg-sky-500/5"
        style={{ x: accentRightX, y: accentLeftY }}
      />

      <div className="section-container relative z-10">
        <motion.div
          className="max-w-4xl"
          variants={HERO_COPY_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            style={{
              x: contentX,
              y: contentY,
              rotateX: contentRotateX,
              rotateY: contentRotateY,
              transformPerspective: 1200,
              transformStyle: 'preserve-3d',
            }}
          >
            <motion.h1 variants={HERO_ITEM_VARIANTS} className="min-h-[60px] text-[clamp(1.9rem,5vw,4.4rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-slate-900 sm:min-h-[72px] sm:whitespace-nowrap md:min-h-[80px] dark:text-white">
              {typedName}
              <span className="caret-blink ml-1 inline-block h-[0.95em] w-[2px] bg-slate-900 align-[-0.08em] dark:bg-white"></span>
            </motion.h1>

            <motion.p variants={HERO_ITEM_VARIANTS} className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:mt-5 md:text-lg dark:text-slate-300">
              {t.shortInfo}
            </motion.p>
            <motion.p variants={HERO_ITEM_VARIANTS} className="mt-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-500 md:text-sm dark:text-slate-400">
              {t.stackInfo}
            </motion.p>

            <motion.div variants={HERO_ITEM_VARIANTS} className="mt-6 flex flex-wrap items-center gap-3">
              {TECH_STACK.map(({ label, image, className }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12, scale: 0.92 }}
                  animate={{
                    opacity: 1,
                    y: [0, -6, 0],
                    rotate: [0, index % 2 === 0 ? 3 : -3, 0],
                    scale: [1, 1.04, 1],
                  }}
                  transition={{
                    opacity: { duration: 0.35, delay: 0.35 + (index * 0.08) },
                    y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.18 },
                    rotate: { duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.15 },
                    scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.18 },
                  }}
                  whileHover={{ y: -6, scale: 1.08, rotate: index % 2 === 0 ? 4 : -4 }}
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border shadow-[0_18px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm transition-transform ${className}`}
                  aria-label={label}
                  title={label}
                >
                  <img
                    src={image}
                    alt={label}
                    className="h-6 w-6 object-contain"
                    loading="lazy"
                  />
                  <span className="sr-only">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div variants={HERO_ITEM_VARIANTS} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <motion.a
              href="https://github.com/daffarmd"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/muhammaddaffaramadhan/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full sm:w-auto"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </motion.a>
          </motion.div>

          <motion.div variants={HERO_ITEM_VARIANTS} className="mt-5">
            <div ref={resumeMenuRef} className="relative flex w-full max-w-full flex-col sm:hidden">
              <button
                type="button"
                aria-expanded={resumeMenuOpen}
                aria-haspopup="menu"
                onClick={() => setResumeMenuOpen((current) => !current)}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)] transition-transform duration-300 hover:-translate-y-0.5 sm:w-auto dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                <FileText className="mr-2 h-4 w-4" />
                {t.resumeTitle}
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>

              <AnimatePresence>
                {resumeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -6, y: 0, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -6, y: 0, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-30 mt-3 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.4)] sm:mt-0 sm:w-[clamp(18rem,26vw,24rem)] sm:max-w-[calc(100vw-2rem)] dark:border-slate-700 dark:bg-dark-800"
                  >
                    <div className="px-3 pb-2 pt-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        {t.resumeMenuTitle}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {t.resumeMenuHint}
                      </p>
                    </div>

                    <a
                      href={RESUME_URL_ID}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      onClick={() => setResumeMenuOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-3 py-3 text-left transition-colors hover:bg-slate-100 sm:px-4 dark:hover:bg-slate-700/60"
                    >
                      <div className="pr-3">
                        <p className="text-sm font-semibold text-slate-900 sm:text-[15px] dark:text-white">
                          {t.resumeIdTitle}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">
                          {t.resumeIdDesc}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 flex-none text-slate-400" />
                    </a>

                    <a
                      href={RESUME_URL_EN}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      onClick={() => setResumeMenuOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-3 py-3 text-left transition-colors hover:bg-slate-100 sm:px-4 dark:hover:bg-slate-700/60"
                    >
                      <div className="pr-3">
                        <p className="text-sm font-semibold text-slate-900 sm:text-[15px] dark:text-white">
                          {t.resumeEnTitle}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">
                          {t.resumeEnDesc}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 flex-none text-slate-400" />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div variants={HERO_ITEM_VARIANTS} className="mt-6 hidden sm:block">
            <div className="inline-flex w-fit max-w-full items-stretch gap-1 overflow-hidden rounded-[1.35rem] border border-slate-300/80 bg-white/90 p-1 shadow-[0_18px_44px_-28px_rgba(15,23,42,0.25)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/90">
              <a
                href={language === 'id' ? RESUME_URL_ID : RESUME_URL_EN}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[1rem] bg-slate-950 px-[18px] py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_16px_34px_-22px_rgba(15,23,42,0.45)] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                <FileText className="h-4 w-4" />
                {t.resumeTitle}
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <a
                href={RESUME_URL_ID}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center justify-center rounded-[1rem] px-[18px] py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-dark-700 dark:hover:text-white"
              >
                ID
              </a>

              <a
                href={RESUME_URL_EN}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center justify-center rounded-[1rem] px-[18px] py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-dark-700 dark:hover:text-white"
              >
                EN
              </a>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
