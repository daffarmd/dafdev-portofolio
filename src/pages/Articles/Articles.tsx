import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Sparkles,
} from 'lucide-react';
import { articles, featuredArticle } from '../../data/articles';
import type { Article, Language } from '../../types';

const LAST_READ_ARTICLE_KEY = 'lastReadArticleSlug';
const ARTICLE_LANGUAGE_KEY = 'articleLanguage';

const resolveArticleLanguage = (article: Article, language: Language) => {
  if (language !== 'en' || !article.translations?.en) {
    return article;
  }

  return {
    ...article,
    ...article.translations.en,
    sections: article.translations.en.sections,
  };
};

const getRandomArticle = () => {
  if (articles.length === 0) {
    return featuredArticle;
  }

  const randomIndex = Math.floor(Math.random() * articles.length);
  return articles[randomIndex];
};

const Articles: React.FC = () => {
  const [spotlightArticle, setSpotlightArticle] = useState<Article>(featuredArticle);
  const [spotlightMode, setSpotlightMode] = useState<'recent' | 'random'>('random');
  const [articleLanguage, setArticleLanguage] = useState<Language>('id');

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(ARTICLE_LANGUAGE_KEY);
    if (savedLanguage === 'id' || savedLanguage === 'en') {
      setArticleLanguage(savedLanguage);
    }

    const lastReadSlug = window.localStorage.getItem(LAST_READ_ARTICLE_KEY);
    const lastReadArticle = articles.find((article) => article.slug === lastReadSlug);

    if (lastReadArticle) {
      setSpotlightArticle(lastReadArticle);
      setSpotlightMode('recent');
      return;
    }

    setSpotlightArticle(getRandomArticle());
    setSpotlightMode('random');
  }, []);

  const handleLanguageChange = (language: Language) => {
    setArticleLanguage(language);
    window.localStorage.setItem(ARTICLE_LANGUAGE_KEY, language);
  };

  const localizedSpotlightArticle = resolveArticleLanguage(spotlightArticle, articleLanguage);

  const t = articleLanguage === 'id'
    ? {
        label: 'Daf Notes',
        title: 'Catatan tentang pengalaman saya.',
        subtitle: ':)',
        cta: 'Mulai baca',
        articleCount: `${articles.length} artikel tersedia`,
        recent: 'Baru dibaca',
        random: 'Coba baca ini',
        readNow: 'Baca sekarang',
        continue: 'Lanjut baca',
        sectionLabel: 'My Notes',
        sectionTitle: 'Tulisan terbaru',
        updated: 'Update terakhir',
        readArticle: 'Baca artikel',
      }
    : {
        label: 'Daf Notes',
        title: 'Notes from my journey.',
        subtitle: ':)',
        cta: 'Start reading',
        articleCount: `${articles.length} notes available`,
        recent: 'Recently read',
        random: 'Try this note',
        readNow: 'Read now',
        continue: 'Continue reading',
        sectionLabel: 'My Notes',
        sectionTitle: 'Latest notes',
        updated: 'Last updated',
        readArticle: 'Read note',
      };

  return (
    <div className="relative min-h-screen overflow-hidden py-12 pt-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(42,150,255,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(15,166,174,0.12),transparent_24%)]" />
      <div className="absolute inset-x-0 top-24 -z-10 mx-auto hidden h-px max-w-6xl bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-slate-700/60 lg:block" />

      <div className="mx-auto w-full max-w-[1120px] px-6 md:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_28px_90px_-48px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-slate-700/80 dark:bg-dark-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative p-7 sm:p-9 md:p-12">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-700/20" />

              <div className="relative max-w-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 dark:border-slate-700 dark:bg-dark-700 dark:text-slate-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t.label}
                  </span>

                  <div className="inline-flex rounded-full border border-slate-200/80 bg-white/90 p-1 shadow-sm dark:border-slate-700 dark:bg-dark-700/90">
                    {(['id', 'en'] as const).map((language) => (
                      <button
                        key={language}
                        type="button"
                        onClick={() => handleLanguageChange(language)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                          articleLanguage === language
                            ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                        }`}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>

                <h1 className="mt-6 font-display text-4xl font-bold leading-[0.96] tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                  {t.title}
                </h1>

                <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
                  {t.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/my-notes/${localizedSpotlightArticle.slug}`}
                    className="inline-flex min-h-[48px] items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                  >
                    {t.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {t.articleCount}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to={`/my-notes/${localizedSpotlightArticle.slug}`}
              className="group relative isolate overflow-hidden border-t border-slate-200/70 bg-slate-950 lg:min-h-full lg:border-l lg:border-t-0 dark:border-slate-700/80"
            >
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
                <img
                  src={localizedSpotlightArticle.image}
                  alt={localizedSpotlightArticle.imageAlt}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105 sm:object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-slate-950/5 lg:from-slate-950 lg:via-slate-950/62 lg:to-slate-950/10" />
              </div>

              <div className="relative flex flex-col justify-end bg-slate-950 p-6 text-white sm:p-8 lg:min-h-full lg:bg-transparent lg:p-10">
                <div className="flex flex-wrap items-center gap-2.5 text-sm text-white/88 sm:gap-3">
                  <span className="rounded-full border border-emerald-300/35 bg-emerald-400/20 px-3 py-1 font-medium text-white shadow-[0_10px_30px_-18px_rgba(74,222,128,0.9)] backdrop-blur-sm">
                    {spotlightMode === 'recent' ? t.recent : t.random}
                  </span>
                  <span className="rounded-full border border-sky-300/35 bg-sky-400/18 px-3 py-1 font-medium text-white shadow-[0_10px_30px_-18px_rgba(56,189,248,0.85)] backdrop-blur-sm">
                    {localizedSpotlightArticle.category}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
                    <Clock3 className="mr-1.5 h-4 w-4" />
                    {localizedSpotlightArticle.readTime}
                  </span>
                </div>

                <h2 className="mt-4 max-w-lg text-xl font-bold leading-tight sm:mt-5 sm:text-2xl lg:text-3xl">
                  {localizedSpotlightArticle.title}
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/90 sm:mt-4 sm:text-base sm:leading-7">
                  {localizedSpotlightArticle.excerpt}
                </p>

                <span className="mt-6 inline-flex items-center text-sm font-semibold text-white">
                  {spotlightMode === 'recent' ? t.continue : t.readNow}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {t.sectionLabel}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 md:text-4xl dark:text-white">
                {t.sectionTitle}
              </h2>
            </div>

            <div className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/80 dark:text-slate-300">
              {t.updated} {new Date(featuredArticle.date).toLocaleDateString(articleLanguage === 'id' ? 'id-ID' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {articles.map((article) => {
              const localizedArticle = resolveArticleLanguage(article, articleLanguage);

              return (
                <Link
                  key={localizedArticle.slug}
                  to={`/my-notes/${localizedArticle.slug}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/85 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-42px_rgba(15,23,42,0.35)] dark:border-slate-700 dark:bg-dark-800/85 md:grid md:grid-cols-[300px_1fr]"
                >
                  <div className="relative min-h-[180px] overflow-hidden sm:min-h-[220px] md:min-h-full">
                    <img
                      src={localizedArticle.image}
                      alt={localizedArticle.imageAlt}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent md:hidden" />
                  </div>

                  <div className="flex flex-col justify-between p-6 sm:p-7 md:p-8">
                    <div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="rounded-full bg-primary-50 px-3 py-1 font-semibold text-primary-700 dark:bg-primary-900/20 dark:text-primary-200">
                          {localizedArticle.category}
                        </span>
                        <span className="inline-flex items-center">
                          <CalendarDays className="mr-1.5 h-4 w-4" />
                          {new Date(localizedArticle.date).toLocaleDateString(articleLanguage === 'id' ? 'id-ID' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="inline-flex items-center">
                          <Clock3 className="mr-1.5 h-4 w-4" />
                          {localizedArticle.readTime}
                        </span>
                      </div>

                      <h3 className="mt-5 max-w-3xl text-2xl font-bold tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-primary-700 dark:text-white dark:group-hover:text-primary-300">
                        {localizedArticle.title}
                      </h3>

                      <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
                        {localizedArticle.excerpt}
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        {localizedArticle.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:border-slate-700 dark:bg-dark-700 dark:text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <span className="inline-flex items-center text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {t.readArticle}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Articles;
