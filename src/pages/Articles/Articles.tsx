import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  PenSquare,
  Sparkles,
} from 'lucide-react';
import type { Article, Language } from '../../types';
import { useArticles } from '../../hooks/useArticles';
import { useAuth } from '../../hooks/useAuth';

const LAST_READ_ARTICLE_KEY = 'lastReadArticleSlug';
const ARTICLE_LANGUAGE_KEY = 'articleLanguage';

type LastReadArticleState = {
  slug: string;
  updatedAt: string;
};

const resolveArticleLanguage = (article: Article, language: Language) => {
  if (language !== 'en' || !article.translations?.en) {
    return article;
  }

  const english = article.translations.en;
  const hasEnglishContent = Boolean(
    english.title?.trim()
    || english.excerpt?.trim()
    || english.readTime?.trim()
    || english.category?.trim()
    || english.imageAlt?.trim()
    || (english.sections?.length ?? 0) > 0
  );

  if (!hasEnglishContent) {
    return article;
  }

  return {
    ...article,
    title: english.title?.trim() || article.title,
    excerpt: english.excerpt?.trim() || article.excerpt,
    readTime: english.readTime?.trim() || article.readTime,
    category: english.category?.trim() || article.category,
    imageAlt: english.imageAlt?.trim() || article.imageAlt,
    sections: english.sections && english.sections.length > 0 ? english.sections : article.sections,
  };
};

const ArticleSkeleton = () => (
  <div className="grid grid-cols-1 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/85 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-dark-800/85 md:grid md:grid-cols-[300px_1fr]"
      >
        <div className="relative min-h-[180px] overflow-hidden sm:min-h-[220px] md:min-h-full">
          <div className="h-full w-full animate-pulse bg-[linear-gradient(110deg,rgba(226,232,240,0.72)_8%,rgba(248,250,252,0.95)_18%,rgba(226,232,240,0.72)_33%)] bg-[length:200%_100%] dark:bg-[linear-gradient(110deg,rgba(30,41,59,0.8)_8%,rgba(51,65,85,0.9)_18%,rgba(30,41,59,0.8)_33%)]" />
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-7 md:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-7 w-28 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
              <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-700/60" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="h-8 w-[92%] animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
              <div className="h-8 w-[78%] animate-pulse rounded-full bg-slate-200/75 dark:bg-slate-700/75" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="h-4 w-full animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
              <div className="h-4 w-[94%] animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
              <div className="h-4 w-[72%] animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
              <div className="h-7 w-24 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
              <div className="h-7 w-16 animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-700/60" />
            </div>

            <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const NotesSkeleton = () => (
  <div className="relative min-h-screen overflow-hidden py-12 pt-28">
    <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(42,150,255,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(15,166,174,0.1),transparent_24%)]" />
    <div className="absolute inset-x-0 top-24 -z-10 mx-auto hidden h-px max-w-6xl bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-slate-700/60 lg:block" />

    <div className="mx-auto w-full max-w-[1120px] px-6 md:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_28px_90px_-48px_rgba(15,23,42,0.28)] backdrop-blur-sm dark:border-slate-700/80 dark:bg-dark-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative p-7 sm:p-9 md:p-12">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary-200/30 blur-3xl dark:bg-primary-700/15" />

            <div className="relative max-w-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="h-8 w-32 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
                <div className="inline-flex rounded-full border border-slate-200/80 bg-white/90 p-1 shadow-sm dark:border-slate-700 dark:bg-dark-700/90">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
                  <div className="mx-1 h-8 w-8 animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-700/60" />
                  <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="h-14 w-[84%] animate-pulse rounded-[1.5rem] bg-slate-200/80 dark:bg-slate-700/80 sm:h-16" />
                <div className="h-14 w-[72%] animate-pulse rounded-[1.5rem] bg-slate-200/70 dark:bg-slate-700/70 sm:h-16" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="h-4 w-[88%] animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
                <div className="h-4 w-[64%] animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="h-12 w-36 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
                <div className="h-12 w-28 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
                <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-700/60" />
              </div>
            </div>
          </div>

          <div className="relative isolate overflow-hidden border-t border-slate-200/70 bg-slate-950 lg:min-h-full lg:border-l lg:border-t-0 dark:border-slate-700/80">
            <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
              <div className="h-full w-full animate-pulse bg-[linear-gradient(110deg,rgba(15,23,42,0.92)_8%,rgba(30,41,59,0.98)_18%,rgba(15,23,42,0.92)_33%)] bg-[length:200%_100%]" />
            </div>

            <div className="relative flex flex-col justify-end bg-slate-950 p-6 text-white sm:p-8 lg:min-h-full lg:bg-transparent lg:p-10">
              <div className="flex flex-wrap items-center gap-2.5 text-sm sm:gap-3">
                <div className="h-7 w-20 animate-pulse rounded-full bg-white/18" />
                <div className="h-7 w-24 animate-pulse rounded-full bg-white/12" />
                <div className="h-7 w-24 animate-pulse rounded-full bg-white/10" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="h-8 w-[86%] animate-pulse rounded-full bg-white/16" />
                <div className="h-8 w-[66%] animate-pulse rounded-full bg-white/12" />
              </div>

              <div className="mt-3 space-y-2">
                <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
                <div className="h-4 w-[84%] animate-pulse rounded-full bg-white/10" />
                <div className="h-4 w-[70%] animate-pulse rounded-full bg-white/10" />
              </div>

              <div className="mt-6 h-5 w-28 animate-pulse rounded-full bg-white/14" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
            <div className="mt-3 h-8 w-56 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
          </div>

          <div className="h-10 w-52 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700/70" />
        </div>

        <ArticleSkeleton />
      </section>
    </div>
  </div>
);

const Articles: React.FC = () => {
  const { articles, loading } = useArticles();
  const { isAdmin } = useAuth();
  const featuredArticle = articles[0] ?? null;
  const [spotlightArticle, setSpotlightArticle] = useState<Article | null>(featuredArticle);
  const [spotlightMode, setSpotlightMode] = useState<'recent' | 'latest'>('latest');
  const [articleLanguage, setArticleLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(ARTICLE_LANGUAGE_KEY);
    if (savedLanguage === 'id' || savedLanguage === 'en') {
      setArticleLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    if (!featuredArticle) {
      setSpotlightArticle(null);
      setSpotlightMode('latest');
      return;
    }

    const savedLastReadArticle = window.localStorage.getItem(LAST_READ_ARTICLE_KEY);
    if (!savedLastReadArticle) {
      setSpotlightArticle(featuredArticle);
      setSpotlightMode('latest');
      return;
    }

    let lastReadState: LastReadArticleState | null = null;
    try {
      const parsedState = JSON.parse(savedLastReadArticle) as Partial<LastReadArticleState>;
      if (typeof parsedState.slug === 'string' && typeof parsedState.updatedAt === 'string') {
        lastReadState = {
          slug: parsedState.slug,
          updatedAt: parsedState.updatedAt,
        };
      }
    } catch {
      window.localStorage.removeItem(LAST_READ_ARTICLE_KEY);
    }

    const lastReadArticle = lastReadState
      ? articles.find((article) => article.slug === lastReadState.slug)
      : null;

    if (lastReadArticle) {
      setSpotlightArticle(lastReadArticle);
      setSpotlightMode('recent');
      return;
    }

    setSpotlightArticle(featuredArticle);
    setSpotlightMode('latest');
  }, [articles, featuredArticle]);

  const handleLanguageChange = (language: Language) => {
    setArticleLanguage(language);
    window.localStorage.setItem(ARTICLE_LANGUAGE_KEY, language);
  };

  if (loading && articles.length === 0) {
    return <NotesSkeleton />;
  }

  if (!featuredArticle || !spotlightArticle) {
    return (
      <div className="min-h-screen py-14 pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-3xl px-6 md:px-8">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/92 p-8 text-center shadow-[0_24px_70px_-40px_rgba(15,23,42,0.18)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/92 sm:p-12">
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              No notes yet
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600 dark:text-slate-300">
              {loading
                ? 'Memuat artikel...'
                : 'Tambahkan artikel pertama dari dashboard admin agar halaman ini langsung terisi.'}
            </p>
            {isAdmin ? (
              <Link
                to="/admin/articles"
                className="mt-8 inline-flex min-h-[48px] items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
              >
                <PenSquare className="mr-2 h-4 w-4" />
                Open Studio
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  const localizedSpotlightArticle = resolveArticleLanguage(spotlightArticle, articleLanguage);

  const t = articleLanguage === 'id'
      ? {
        label: 'Daf Notes',
        title: 'Catatan dari perjalanan saya.',
        subtitle: ':)',
        cta: 'Mulai baca',
        studio: 'Buka studio',
        articleCount: `${articles.length} catatan tersedia`,
        recent: 'Baru dibaca',
        latest: 'Catatan terbaru',
        readNow: 'Baca sekarang',
        continue: 'Lanjut baca',
        sectionLabel: 'My Notes',
        sectionTitle: 'Catatan terbaru',
        updated: 'Terakhir update',
        readArticle: 'Baca catatan',
      }
    : {
        label: 'Daf Notes',
        title: 'Notes from my journey.',
        subtitle: ':)',
        cta: 'Start reading',
        studio: 'Open studio',
        articleCount: `${articles.length} notes available`,
        recent: 'Recently read',
        latest: 'Latest note',
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
                  {isAdmin ? (
                    <Link
                      to="/admin/articles"
                      className="inline-flex min-h-[48px] items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 dark:border-slate-600 dark:bg-dark-700 dark:text-slate-100 dark:hover:text-white"
                    >
                      <PenSquare className="mr-2 h-4 w-4" />
                      {t.studio}
                    </Link>
                  ) : null}
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
                    {spotlightMode === 'recent' ? t.recent : t.latest}
                  </span>
                  <span className="rounded-full border border-sky-300/35 bg-sky-400/18 px-3 py-1 font-medium text-white shadow-[0_10px_30px_-18px_rgba(56,189,248,0.85)] backdrop-blur-sm">
                    {localizedSpotlightArticle.category}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
                    <Clock3 className="mr-1.5 h-4 w-4" />
                    {localizedSpotlightArticle.readTime}
                  </span>
                </div>

                <h2 className="mt-4 max-w-lg min-h-[3.4rem] break-words text-xl font-bold leading-tight sm:mt-5 sm:min-h-[4.2rem] sm:text-2xl lg:min-h-[5.2rem] lg:text-3xl">
                  {localizedSpotlightArticle.title}
                </h2>

                <p className="mt-3 max-w-xl min-h-[4.5rem] text-sm leading-6 text-white/90 line-clamp-3 sm:mt-4 sm:min-h-[5.25rem] sm:text-base sm:leading-7">
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

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/80 dark:text-slate-300">
                {t.updated} {new Date(featuredArticle.date).toLocaleDateString(articleLanguage === 'id' ? 'id-ID' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>

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

                      <h3 className="mt-5 max-w-3xl min-h-[3.9rem] break-words text-2xl font-bold tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-primary-700 dark:text-white dark:group-hover:text-primary-300">
                        {localizedArticle.title}
                      </h3>

                      <p className="mt-4 max-w-3xl min-h-[6rem] text-base leading-8 text-slate-600 line-clamp-3 dark:text-slate-300">
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
