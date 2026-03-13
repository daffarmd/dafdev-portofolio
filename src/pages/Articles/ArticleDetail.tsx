import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Copy,
  Tag,
  Terminal,
  User,
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { articles } from '../../data/articles';
import type { Article, Language } from '../../types';

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

  return {
    ...article,
    ...article.translations.en,
    sections: article.translations.en.sections,
  };
};

type CodeBlockProps = {
  code: string;
  language: string;
  fileName?: string;
  caption?: string;
  command?: string;
  isCopied: boolean;
  onCopy: (value: string) => Promise<void>;
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  fileName,
  caption,
  command,
  isCopied,
  onCopy,
}) => {
  const lines = code.split('\n');

  return (
    <figure className="article-code-block">
      <div className="article-code-toolbar">
        <div className="article-code-meta">
          <span className="article-code-language">{language}</span>
          {fileName ? <span className="article-code-filename">{fileName}</span> : null}
        </div>

        <button
          type="button"
          onClick={() => void onCopy(code)}
          className="article-code-copy"
          aria-label={isCopied ? 'Kode berhasil disalin' : 'Salin kode'}
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {isCopied ? 'Disalin' : 'Salin'}
        </button>
      </div>

      <div className="article-code-shell">
        <pre className="article-code-scroll">
          <code>
            {lines.map((line, index) => (
              <span key={`${index + 1}-${line}`} className="article-code-line">
                <span className="article-code-line-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="article-code-line-content">{line || ' '}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>

      {caption || command ? (
        <figcaption className="article-code-footer">
          {caption ? <p className="article-code-caption">{caption}</p> : null}
          {command ? (
            <div className="article-code-command">
              <Terminal className="h-4 w-4" />
              <span className="break-all">{command}</span>
            </div>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
};

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((item) => item.slug === slug);
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);
  const [articleLanguage, setArticleLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(ARTICLE_LANGUAGE_KEY);
    if (savedLanguage === 'id' || savedLanguage === 'en') {
      setArticleLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    if (!article) {
      return;
    }

    const nextLastReadState: LastReadArticleState = {
      slug: article.slug,
      updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(LAST_READ_ARTICLE_KEY, JSON.stringify(nextLastReadState));
  }, [article]);

  const handleCopy = async (value: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedBlockId(blockId);
      window.setTimeout(() => {
        setCopiedBlockId((current) => (current === blockId ? null : current));
      }, 1600);
    } catch (error) {
      console.error('Failed to copy code block', error);
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen py-14 pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-3xl px-6 md:px-8">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/92 p-8 text-center shadow-[0_24px_70px_-40px_rgba(15,23,42,0.18)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/92 sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-dark-700 dark:text-slate-300">
              <BookOpen className="h-7 w-7" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              Artikel tidak ditemukan
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600 dark:text-slate-300">
              Halaman yang kamu cari sudah tidak tersedia atau slug artikelnya berubah.
            </p>
            <Link
              to="/my-notes"
              className="mt-8 inline-flex min-h-[48px] items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {articleLanguage === 'id' ? 'Kembali ke My Notes' : 'Back to My Notes'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLanguageChange = (language: Language) => {
    setArticleLanguage(language);
    window.localStorage.setItem(ARTICLE_LANGUAGE_KEY, language);
  };

  const localizedArticle = resolveArticleLanguage(article, articleLanguage);

  const t = articleLanguage === 'id'
    ? {
        back: 'Kembali ke My Notes',
        notFound: 'Artikel tidak ditemukan',
        summary: 'Ringkasan',
        category: 'Kategori',
        readTime: 'Durasi baca',
        tags: 'Tag',
        closingLabel: 'Catatan penutup',
        writtenBy: 'Ditulis oleh',
        allNotes: 'Lihat semua My Notes',
      }
    : {
        back: 'Back to My Notes',
        notFound: 'Article not found',
        summary: 'Summary',
        category: 'Category',
        readTime: 'Read time',
        tags: 'Tags',
        closingLabel: 'Closing note',
        writtenBy: 'Written by',
        allNotes: 'View all My Notes',
      };

  const publishedDate = new Date(localizedArticle.date).toLocaleDateString(articleLanguage === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative min-h-screen overflow-hidden py-12 pt-28 sm:py-16 sm:pt-32">
      <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top,rgba(42,150,255,0.14),transparent_34%),radial-gradient(circle_at_80%_12%,rgba(15,166,174,0.1),transparent_24%)]" />

      <div className="mx-auto w-full max-w-[1120px] px-6 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/my-notes"
            className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/92 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-colors hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-dark-800/88 dark:text-slate-200 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Link>

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

        <article className="mt-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 shadow-[0_28px_90px_-48px_rgba(15,23,42,0.22)] backdrop-blur-sm dark:border-slate-700 dark:bg-dark-800/88">
          <div className="relative isolate overflow-hidden">
            <img
              src={localizedArticle.image}
              alt={localizedArticle.imageAlt}
              className="h-64 w-full object-cover sm:h-[28rem] lg:h-[34rem]"
            />
            <div className="absolute inset-0 hidden bg-gradient-to-t from-slate-950 via-slate-950/68 to-slate-950/18 sm:block" />

            <div className="relative bg-slate-950 p-6 text-white sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-transparent sm:p-8 md:p-10 lg:px-12 lg:pb-12 lg:pt-20">
              <div className="flex flex-wrap items-center gap-2.5 text-sm text-white sm:gap-3">
                <span className="rounded-full border border-sky-300/40 bg-sky-400/25 px-3 py-1 font-semibold text-white shadow-[0_10px_30px_-18px_rgba(56,189,248,0.95)] backdrop-blur-sm">
                  {localizedArticle.category}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/20 bg-slate-900/45 px-3 py-1 font-medium text-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.9)] backdrop-blur-sm sm:bg-white/10">
                  <Clock className="mr-1.5 h-4 w-4" />
                  {localizedArticle.readTime}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/20 bg-slate-900/45 px-3 py-1 font-medium text-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.9)] backdrop-blur-sm sm:bg-white/10">
                  <Calendar className="mr-1.5 h-4 w-4" />
                  {publishedDate}
                </span>
              </div>

              <h1 className="mt-5 max-w-4xl font-display text-[2rem] font-bold leading-[1.04] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {localizedArticle.title}
              </h1>

              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-white/90 sm:mt-5 sm:text-lg sm:leading-8">
                {localizedArticle.excerpt}
              </p>

              <div className="mt-6 inline-flex max-w-full flex-wrap items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/92 backdrop-blur-sm">
                <User className="mr-2 h-4 w-4" />
                {localizedArticle.author}
              </div>
            </div>
          </div>

          <div className="grid gap-10 px-6 py-8 sm:px-8 md:px-10 md:py-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:px-12 lg:py-12">
            <div className="min-w-0">
              <div className="article-rich-text">
                {localizedArticle.sections.map((section, index) => {
                  const blockId = `${section.type}-${index}`;

                  if (section.type === 'heading') {
                    return (
                      <h2 key={blockId} className="article-section-title">
                        {section.content}
                      </h2>
                    );
                  }

                  if (section.type === 'paragraph') {
                    const paragraphClassName = index === 0
                      ? 'article-paragraph article-paragraph-lead'
                      : 'article-paragraph';

                    return (
                      <p key={blockId} className={paragraphClassName}>
                        {section.content}
                      </p>
                    );
                  }

                  if (section.type === 'list') {
                    return (
                      <ul
                        key={blockId}
                        className="article-list list-disc pl-5 marker:text-primary-500"
                      >
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    );
                  }

                  if (section.type === 'code') {
                    return (
                      <CodeBlock
                        key={blockId}
                        code={section.code}
                        language={section.language}
                        fileName={section.fileName}
                        caption={section.caption}
                        command={section.command}
                        isCopied={copiedBlockId === blockId}
                        onCopy={(value) => handleCopy(value, blockId)}
                      />
                    );
                  }

                  return (
                    <div key={blockId} className="article-highlight-card">
                      <p className="article-highlight-label">{t.closingLabel}</p>
                      <h3 className="article-highlight-title">{section.title}</h3>
                      <p className="article-highlight-content">{section.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="self-start lg:sticky lg:top-28">
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/92 p-6 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-dark-700/70">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  {t.summary}
                </p>

                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.category}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {localizedArticle.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.readTime}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {localizedArticle.readTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.tags}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {localizedArticle.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 dark:border-slate-600 dark:bg-dark-800 dark:text-slate-200"
                        >
                          <Tag className="mr-1.5 h-3.5 w-3.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className="border-t border-slate-200/80 bg-slate-50/88 px-6 py-6 dark:border-slate-700 dark:bg-dark-700/65 sm:px-8 md:px-10 lg:px-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center text-sm text-slate-700 dark:text-slate-300">
                <User className="mr-2 h-4 w-4" />
                {t.writtenBy} <span className="ml-1 font-semibold text-slate-950 dark:text-white">{localizedArticle.author}</span>
              </div>

              <Link
                to="/my-notes"
                className="inline-flex items-center text-sm font-semibold text-slate-800 transition-colors hover:text-primary-700 dark:text-slate-100 dark:hover:text-primary-300"
              >
                {t.allNotes}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
