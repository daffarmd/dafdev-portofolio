import type { ArticleBlock } from '../../../types';

export const DEFAULT_AUTHOR_NAME = 'Muhammad Daffa Ramadhan';
export const DRAFT_IMPORT_ACCEPT =
  '.json,.md,.markdown,application/json,text/markdown,text/plain';

export const CATEGORY_OPTIONS = [
  'Backend Engineering',
  'Frontend Systems',
  'DevOps',
  'Product Notes',
  'Case Study',
  'Open Source',
];

export const BLOCK_TYPES = [
  'paragraph',
  'heading',
  'list',
  'table',
  'image',
  'code',
  'highlight',
] as const;

export const EDITOR_LANGUAGES = ['id', 'en'] as const;

export const blockTypeLabel: Record<ArticleBlock['type'], string> = {
  paragraph: 'Paragraph',
  heading: 'Heading',
  list: 'List',
  table: 'Table',
  image: 'Image',
  code: 'Code',
  highlight: 'Highlight',
};
