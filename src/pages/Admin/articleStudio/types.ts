import type { ArticleBlock, ArticleStatus } from '../../../types';

export type EditorBlock = {
  id: string;
  type: ArticleBlock['type'];
  content: string;
  title: string;
  itemsText: string;
  tableHeaders: string;
  tableRows: string;
  src: string;
  alt: string;
  caption: string;
  language: string;
  fileName: string;
  command: string;
  code: string;
};

export type TranslationEditorDraft = {
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  imageAlt: string;
  sections: EditorBlock[];
};

export type ArticleTranslationDrafts = {
  en?: TranslationEditorDraft;
};

export type ArticleDraft = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string;
  category: string;
  author: string;
  image: string;
  imageAlt: string;
  status: ArticleStatus;
  sections: EditorBlock[];
  translations?: ArticleTranslationDrafts;
};

export type NoticeTone = 'success' | 'error' | 'neutral';
export type ArticleFilter = 'all' | 'draft' | 'published';
export type EditorLanguage = 'id' | 'en';
export type InsertMenuAnchor = string | 'start' | null;
export type SupportPanelId = 'studio-library' | 'studio-settings';

export type ArticleStudioNotice = {
  tone: NoticeTone;
  message: string;
};

export type LocalizedDraftField = keyof Pick<
  TranslationEditorDraft,
  'title' | 'excerpt' | 'readTime' | 'category' | 'imageAlt'
>;

export type ArticleFilterTab = {
  id: ArticleFilter;
  label: string;
  count: number;
};

export type DraftFieldUpdater = <K extends keyof ArticleDraft>(
  field: K,
  value: ArticleDraft[K],
) => void;
