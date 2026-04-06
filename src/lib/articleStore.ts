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

export const dispatchArticleDataUpdated = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(ARTICLE_DATA_UPDATED_EVENT));
};
