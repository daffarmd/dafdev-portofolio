import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronDown, Github, Linkedin, ArrowUpRight } from 'lucide-react';
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
    <section
      id="hero"
      className="relative flex min-h-[72vh] items-center overflow-hidden pb-12 pt-20 sm:min-h-[78vh] sm:pt-28 md:pt-32"
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
        className="pointer-events-none absolute bottom-8 left-[16%] hidden h-36 w-64 rounded-[2.5rem] border border-white/25 bg-white/20 blur-2xl sm:block dark:border-white/10 dark:bg-slate-500/10"
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
          <motion.div variants={HERO_ITEM_VARIANTS} className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.3)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/80 dark:text-slate-300">
            <motion.span
              className="h-2.5 w-2.5 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.35, 1], opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            {t.kicker}
          </motion.div>

          <motion.h1 variants={HERO_ITEM_VARIANTS} className="mt-5 min-h-[60px] text-[2rem] font-extrabold tracking-tight text-slate-900 sm:mt-6 sm:min-h-[72px] sm:text-4xl md:min-h-[88px] md:text-6xl dark:text-white">
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
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 hidden w-full justify-center sm:flex"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <RouterLink
          to="/about"
          className="rounded-full border border-slate-300 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:bg-dark-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </RouterLink>
      </motion.div>
    </section>
  );
};

export default Hero;
