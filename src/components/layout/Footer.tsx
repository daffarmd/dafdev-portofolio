import React from 'react';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Language } from '../../types';
import meImage from '../../assets/me.png';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const currentYear = new Date().getFullYear();
  const t = language === 'id'
    ? {
        rights: `(c) ${currentYear} Daf Dev. Seluruh hak cipta dilindungi.`,
        collaboration: 'Terbuka untuk kolaborasi',
        emailAction: 'Email saya',
      }
    : {
        rights: `(c) ${currentYear} Daf Dev. All rights reserved.`,
        collaboration: 'Open to collaboration',
        emailAction: 'Email me',
      };

  return (
    <footer className="pb-8 pt-6 sm:pb-10 sm:pt-8">
      <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-6 md:px-8">
        <div className="border-t border-slate-200/80 pt-6 dark:border-slate-700 sm:pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-dark-800 sm:rounded-2xl"
                animate={{ y: [0, -2, 0], rotate: [-1, 1, -1] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.04, rotate: 0 }}
              >
                <motion.img
                  src={meImage}
                  alt="Daf Dev logo"
                  className="h-11 w-11 object-cover sm:h-12 sm:w-12"
                  whileHover={{ scale: 1.06 }}
                />
              </motion.div>
              <div className="min-w-0">
                <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">Daf.Dev</p>
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{t.collaboration}</p>
              </div>
            </div>

            <div className="grid grid-cols-[auto_auto_minmax(0,1fr)] gap-3 sm:flex sm:flex-wrap sm:items-center">
              <a
                href="https://github.com/daffarmd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-300 dark:hover:border-slate-400 dark:hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/muhammaddaffaramadhan/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-300 dark:hover:border-slate-400 dark:hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:muhammaddaffarmd@gmail.com"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:w-auto"
              >
                <Mail className="mr-2 h-4 w-4" />
                {t.emailAction}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200/80 pt-5 dark:border-slate-700">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-left">
              {t.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
