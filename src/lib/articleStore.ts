import { articles as builtInArticles } from '../data/articles';
import type { Article, ArticleBlock } from '../types';

export const ARTICLE_DATA_UPDATED_EVENT = 'dafdev:articles-updated';

const ARTICLE_BLOCK_TYPES = new Set<ArticleBlock['type']>([
  'paragraph',
  'heading',
  'image',
  'list',
  'highlight',
  'code',
]);

const cloneArticle = (article: Article): Article => JSON.parse(JSON.stringify(article)) as Article;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isArticleBlock = (value: unknown): value is ArticleBlock => {
  if (!isPlainObject(value) || typeof value.type !== 'string' || !ARTICLE_BLOCK_TYPES.has(value.type as ArticleBlock['type'])) {
    return false;
  }

  switch (value.type) {
    case 'paragraph':
    case 'heading':
      return typeof value.content === 'string';
    case 'image':
      return typeof value.src === 'string' && typeof value.alt === 'string' && (value.caption === undefined || typeof value.caption === 'string');
    case 'list':
      return Array.isArray(value.items) && value.items.every((item) => typeof item === 'string');
    case 'highlight':
      return typeof value.title === 'string' && typeof value.content === 'string';
    case 'code':
      return (
        typeof value.language === 'string' &&
        typeof value.code === 'string' &&
        (value.fileName === undefined || typeof value.fileName === 'string') &&
        (value.caption === undefined || typeof value.caption === 'string') &&
        (value.command === undefined || typeof value.command === 'string')
      );
    default:
      return false;
  }
};

export const sortArticlesByDate = (items: Article[]) => [...items].sort((left, right) => {
  const rightDate = new Date(right.publishedAt ?? right.date).getTime();
  const leftDate = new Date(left.publishedAt ?? left.date).getTime();

  if (Number.isNaN(leftDate) || Number.isNaN(rightDate)) {
    return String(right.id).localeCompare(String(left.id));
  }

  return rightDate - leftDate;
});

export const getBuiltInArticles = (): Article[] => sortArticlesByDate(builtInArticles.map(cloneArticle));

export const mergeArticlesBySlug = (...collections: Article[][]): Article[] => {
  const articleMap = new Map<string, Article>();

  collections.flat().forEach((article) => {
    articleMap.set(article.slug, cloneArticle(article));
  });

  return sortArticlesByDate(Array.from(articleMap.values()));
};

export const dispatchArticleDataUpdated = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(ARTICLE_DATA_UPDATED_EVENT));
};
