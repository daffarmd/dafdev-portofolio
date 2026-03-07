import React from 'react';
import { Github, Linkedin, Mail, Code2, ArrowUpRight } from 'lucide-react';
import type { Language } from '../../types';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const currentYear = new Date().getFullYear();
  const t = language === 'id'
    ? {
        rights: `(c) ${currentYear} Daf Dev. Seluruh hak cipta dilindungi.`,
        collaboration: 'Terbuka untuk kolaborasi',
        built: 'Dibangun dengan React, Tailwind CSS, dan mindset backend-first.',
      }
    : {
        rights: `(c) ${currentYear} Daf Dev. All rights reserved.`,
        collaboration: 'Open to collaboration',
        built: 'Built with React, Tailwind CSS, and a backend-first mindset.',
      };

  return (
    <footer className="bg-white/40 py-8 backdrop-blur dark:bg-dark-900/80 sm:py-10">
      <div className="mx-auto w-full max-w-[1080px] border-t border-slate-200/80 px-4 pt-8 dark:border-slate-700 sm:px-6 sm:pt-10 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center">
            <div className="rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-dark-800">
              <Code2 className="h-5 w-5 text-slate-800 dark:text-slate-100" />
            </div>
            <span className="ml-3 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
              Daf.Dev
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/daffarmd"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-300 bg-white p-2.5 text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-300 dark:hover:border-slate-400 dark:hover:text-white"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/muhammaddaffaramadhan/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-300 bg-white p-2.5 text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-300 dark:hover:border-slate-400 dark:hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:muhammaddaffarmd@gmail.com"
              className="rounded-full border border-slate-300 bg-white p-2.5 text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-300 dark:hover:border-slate-400 dark:hover:text-white"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700 sm:pt-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">{t.rights}</p>
            <a
              href="mailto:muhammaddaffarmd@gmail.com"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              {t.collaboration}
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">{t.built}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
