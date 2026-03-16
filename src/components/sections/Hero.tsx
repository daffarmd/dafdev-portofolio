import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronDown, Github, Linkedin, ArrowUpRight, Music2 } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Language } from '../../types';
import golangIcon from '../../assets/golang-icon.png';
import postgresIcon from '../../assets/postgres-icon.png';
import reactIcon from '../../assets/react-icon.png';
import svelteIcon from '../../assets/svelte-icon.png';

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
const MUSIC_ORB_EVADE_DURATION = 2600;
const MUSIC_ORB_THRESHOLD = 160;
const MUSIC_ORB_MOVE_INTERVAL = 220;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const randomBetween = (min: number, max: number) => min + (Math.random() * (max - min));

const getRandomMusicPosition = () => {
  const zones = [
    { x: [68, 84], y: [16, 28] },
    { x: [76, 88], y: [38, 54] },
    { x: [60, 74], y: [62, 76] },
    { x: [36, 48], y: [66, 78] },
  ];

  const zone = zones[Math.floor(Math.random() * zones.length)];

  return {
    x: randomBetween(zone.x[0], zone.x[1]),
    y: randomBetween(zone.y[0], zone.y[1]),
  };
};

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
    label: 'Svelte',
    image: svelteIcon,
    className: 'border-rose-200/80 bg-rose-50/90 text-rose-700 shadow-rose-200/60 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 dark:shadow-rose-900/20',
  },
];

const Hero: React.FC<HeroProps> = ({ language }) => {
  const [typedName, setTypedName] = useState('');
  const [musicOrbPosition, setMusicOrbPosition] = useState(getRandomMusicPosition);
  const [isMusicOrbEvading, setIsMusicOrbEvading] = useState(false);
  const [isCompactHero, setIsCompactHero] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 140, damping: 22, mass: 0.55 });
  const smoothY = useSpring(pointerY, { stiffness: 140, damping: 22, mass: 0.55 });
  const musicOrbCooldownRef = useRef(0);
  const musicOrbLastMoveRef = useRef(0);
  const musicOrbTimerRef = useRef<number | undefined>(undefined);

  const contentX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const contentY = useTransform(smoothY, [-1, 1], [-12, 12]);
  const contentRotateX = useTransform(smoothY, [-1, 1], [3, -3]);
  const contentRotateY = useTransform(smoothX, [-1, 1], [-4, 4]);

  const accentLeftX = useTransform(smoothX, [-1, 1], [-42, 42]);
  const accentLeftY = useTransform(smoothY, [-1, 1], [-26, 26]);
  const accentRightX = useTransform(smoothX, [-1, 1], [36, -36]);
  const accentRightY = useTransform(smoothY, [-1, 1], [24, -24]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px), (hover: none), (pointer: coarse)');
    const syncCompactHero = () => {
      setIsCompactHero(mediaQuery.matches);
    };

    syncCompactHero();

    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', syncCompactHero);
    } else {
      mediaQuery.addListener(syncCompactHero);
    }

    return () => {
      if ('removeEventListener' in mediaQuery) {
        mediaQuery.removeEventListener('change', syncCompactHero);
      } else {
        mediaQuery.removeListener(syncCompactHero);
      }
    };
  }, []);

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
      if (typeof musicOrbTimerRef.current === 'number') {
        window.clearTimeout(musicOrbTimerRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const normalizedX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const normalizedY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    pointerX.set(normalizedX);
    pointerY.set(normalizedY);

    if (isCompactHero) {
      return;
    }

    const now = Date.now();
    const orbX = (musicOrbPosition.x / 100) * bounds.width;
    const orbY = (musicOrbPosition.y / 100) * bounds.height;
    const pointerOffsetX = event.clientX - bounds.left;
    const pointerOffsetY = event.clientY - bounds.top;
    const distance = Math.hypot(orbX - pointerOffsetX, orbY - pointerOffsetY);

    const shouldEvade = distance < MUSIC_ORB_THRESHOLD || now < musicOrbCooldownRef.current;

    if (!shouldEvade || now - musicOrbLastMoveRef.current < MUSIC_ORB_MOVE_INTERVAL) {
      return;
    }

    const angle = Math.atan2(orbY - pointerOffsetY, orbX - pointerOffsetX);
    const travelDistance = randomBetween(160, 240);
    const sidewaysDrift = randomBetween(-70, 70);
    const targetX = orbX + (Math.cos(angle) * travelDistance) + (Math.sin(angle) * sidewaysDrift);
    const targetY = orbY + (Math.sin(angle) * travelDistance) - (Math.cos(angle) * sidewaysDrift);
    const nextX = clamp(((targetX / bounds.width) * 100), 10, 90);
    const nextY = clamp(((targetY / bounds.height) * 100), 14, 84);

    musicOrbCooldownRef.current = now + MUSIC_ORB_EVADE_DURATION;
    musicOrbLastMoveRef.current = now;
    setMusicOrbPosition({ x: nextX, y: nextY });
    setIsMusicOrbEvading(true);

    if (typeof musicOrbTimerRef.current === 'number') {
      window.clearTimeout(musicOrbTimerRef.current);
    }

    musicOrbTimerRef.current = window.setTimeout(() => {
      setIsMusicOrbEvading(false);
    }, MUSIC_ORB_EVADE_DURATION);
  };

  const handleMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const t = language === 'id'
    ? {
        shortInfo: 'Membuat apapun yang bisa di buat.',
        stackInfo: '',
        aboutBtn: 'Lihat About',
        scrollLabel: 'Scroll ke bawah',
        scrollHint: 'Project, contact, dan recently played ada di bawah',
        spotifyTeaser: 'Lihat recently played',
      }
    : {
        shortInfo: 'Make anything that can be made.',
        stackInfo: '',
        aboutBtn: 'Open About',
        scrollLabel: 'Scroll down',
        scrollHint: 'Projects, contact, and recently played are just below',
        spotifyTeaser: 'See recently played',
      };

  return (
    <section
      id="hero"
      className="relative flex min-h-[60vh] items-center overflow-hidden pb-24 pt-20 sm:min-h-[64vh] sm:pt-24 sm:pb-28 md:min-h-[68vh] md:pt-28 md:pb-32"
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

          <motion.p variants={HERO_ITEM_VARIANTS} className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:mt-5 md:text-lg dark:text-slate-300">
            {t.shortInfo}
          </motion.p>
          <motion.p variants={HERO_ITEM_VARIANTS} className="mt-2 text-sm text-slate-500 md:text-base dark:text-slate-400">
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
            <motion.div className="w-full sm:w-auto" whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <RouterLink to="/about" className="btn-outline w-full sm:w-auto">
                {t.aboutBtn}
              </RouterLink>
            </motion.div>
          </motion.div>

          <motion.div variants={HERO_ITEM_VARIANTS} className="mt-4 flex flex-col gap-3 sm:hidden">
            <a
              href="#recently-played"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-300 bg-white/88 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-colors hover:border-slate-400 hover:text-slate-950 dark:border-slate-700 dark:bg-dark-800/88 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
            >
              <Music2 className="mr-2 h-4 w-4" />
              {t.spotifyTeaser}
            </a>
            <a
              href="#home-overview"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-300 bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-950 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              {t.scrollLabel}
            </a>
          </motion.div>

        </motion.div>
      </div>

      {!isCompactHero ? (
        <motion.a
          href="#recently-played"
          className="absolute z-20 inline-flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/78 text-slate-600 shadow-[0_14px_32px_-22px_rgba(15,23,42,0.65)] backdrop-blur-sm transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-700/80 dark:bg-dark-800/78 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
          style={{
            left: `${musicOrbPosition.x}%`,
            top: `${musicOrbPosition.y}%`,
            transition: isMusicOrbEvading
              ? 'left 620ms cubic-bezier(0.22, 1, 0.36, 1), top 620ms cubic-bezier(0.22, 1, 0.36, 1)'
              : 'left 900ms cubic-bezier(0.22, 1, 0.36, 1), top 900ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          animate={{
            y: [0, -6, 0],
            scale: [1, 1.04, 1],
            rotate: [0, -6, 4, 0],
          }}
          transition={{
            duration: isMusicOrbEvading ? 1.9 : 4.2,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          whileHover={{ scale: 1.06 }}
          initial={false}
          aria-label={t.spotifyTeaser}
          title={t.spotifyTeaser}
        >
          <Music2 className="h-4 w-4" />
          <span className="sr-only">{t.spotifyTeaser}</span>
        </motion.a>
      ) : null}

      <motion.div
        className="absolute bottom-6 z-20 hidden w-full justify-center sm:flex"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <a
          href="#home-overview"
          className="inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white/92 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-colors hover:border-slate-400 hover:text-slate-950 dark:border-slate-700 dark:bg-dark-800/90 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
          <div className="flex flex-col leading-tight">
            <span>{t.scrollLabel}</span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{t.scrollHint}</span>
          </div>
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
