import type { Article, ArticleBlock } from '../../../../types';
import type { AdminArticleInput } from '../../../../services/articleService';
import { DEFAULT_AUTHOR_NAME, blockTypeLabel } from '../constants';
import type { ArticleDraft, EditorBlock, TranslationEditorDraft } from '../types';

export const createBlockId = () => {
  if (
    typeof crypto !== 'undefined'
    && typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getTodayDate = () => new Date().toISOString().slice(0, 10);

export const slugify = (value: string) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-{2,}/g, '-');

export const createEmptyBlock = (
  type: ArticleBlock['type'] = 'paragraph',
): EditorBlock => ({
  id: createBlockId(),
  type,
  content: '',
  title: '',
  itemsText: '',
  src: '',
  alt: '',
  caption: '',
  language: type === 'code' ? 'txt' : '',
  fileName: '',
  command: '',
  code: '',
});

export const articleBlocksToEditorBlocks = (
  sections: ArticleBlock[],
): EditorBlock[] => sections.map((section) => {
  if (section.type === 'paragraph' || section.type === 'heading') {
    return {
      ...createEmptyBlock(section.type),
      content: section.content,
    };
  }

  if (section.type === 'list') {
    return {
      ...createEmptyBlock('list'),
      itemsText: section.items.join('\n'),
    };
  }

  if (section.type === 'image') {
    return {
      ...createEmptyBlock('image'),
      src: section.src,
      alt: section.alt,
      caption: section.caption ?? '',
    };
  }

  if (section.type === 'code') {
    return {
      ...createEmptyBlock('code'),
      language: section.language,
      fileName: section.fileName ?? '',
      caption: section.caption ?? '',
      command: section.command ?? '',
      code: section.code,
    };
  }

  return {
    ...createEmptyBlock('highlight'),
    title: section.title,
    content: section.content,
  };
});

export const editorBlocksToArticleBlocks = (
  sections: EditorBlock[],
): ArticleBlock[] => sections.map((section) => {
  if (section.type === 'paragraph' || section.type === 'heading') {
    return {
      type: section.type,
      content: section.content.trim(),
    };
  }

  if (section.type === 'list') {
    return {
      type: 'list',
      items: section.itemsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    };
  }

  if (section.type === 'image') {
    return {
      type: 'image',
      src: section.src.trim(),
      alt: section.alt.trim(),
      caption: section.caption.trim() || undefined,
    };
  }

  if (section.type === 'code') {
    return {
      type: 'code',
      language: section.language.trim(),
      fileName: section.fileName.trim() || undefined,
      caption: section.caption.trim() || undefined,
      command: section.command.trim() || undefined,
      code: section.code,
    };
  }

  return {
    type: 'highlight',
    title: section.title.trim(),
    content: section.content.trim(),
  };
});

const filterMeaningfulArticleBlocks = (
  sections: ArticleBlock[],
): ArticleBlock[] => sections.filter((section) => {
  if (section.type === 'paragraph' || section.type === 'heading') {
    return Boolean(section.content.trim());
  }

  if (section.type === 'list') {
    return section.items.length > 0;
  }

  if (section.type === 'image') {
    return Boolean(section.src.trim() && section.alt.trim());
  }

  if (section.type === 'code') {
    return Boolean(section.language.trim() && section.code.trim());
  }

  return Boolean(section.title.trim() && section.content.trim());
});

export const createEmptyTranslationDraft = (): TranslationEditorDraft => ({
  title: '',
  excerpt: '',
  readTime: '',
  category: '',
  imageAlt: '',
  sections: [createEmptyBlock('paragraph')],
});

export const normalizeTranslationDraft = (
  translation?: NonNullable<Article['translations']>['en'],
): TranslationEditorDraft => ({
  title: typeof translation?.title === 'string' ? translation.title : '',
  excerpt: typeof translation?.excerpt === 'string' ? translation.excerpt : '',
  readTime: typeof translation?.readTime === 'string'
    ? translation.readTime
    : '',
  category: typeof translation?.category === 'string'
    ? translation.category
    : '',
  imageAlt: typeof translation?.imageAlt === 'string'
    ? translation.imageAlt
    : '',
  sections: Array.isArray(translation?.sections)
    ? articleBlocksToEditorBlocks(
        translation.sections.filter(
          (section): section is ArticleBlock => Boolean(section),
        ),
      )
    : [createEmptyBlock('paragraph')],
});

export const createEmptyDraft = (
  author = DEFAULT_AUTHOR_NAME,
): ArticleDraft => ({
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  date: getTodayDate(),
  readTime: '5 min read',
  tags: '',
  category: '',
  author,
  image: '',
  imageAlt: '',
  status: 'draft',
  sections: [createEmptyBlock('paragraph')],
  translations: {
    en: createEmptyTranslationDraft(),
  },
});

export const articleToDraft = (
  article: Article,
  overrides?: Partial<ArticleDraft>,
): ArticleDraft => ({
  id: typeof article.id === 'string' ? article.id : null,
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt,
  date: article.date,
  readTime: article.readTime,
  tags: article.tags.join(', '),
  category: article.category,
  author: article.author,
  image: article.image || '',
  imageAlt: article.imageAlt,
  status: article.status ?? 'draft',
  sections: articleBlocksToEditorBlocks(article.sections),
  translations: article.translations?.en
    ? { en: normalizeTranslationDraft(article.translations.en) }
    : { en: createEmptyTranslationDraft() },
  ...overrides,
});

const buildTranslationInput = (
  translation?: TranslationEditorDraft,
): NonNullable<Article['translations']>['en'] | undefined => {
  if (!translation) {
    return undefined;
  }

  const sections = filterMeaningfulArticleBlocks(
    editorBlocksToArticleBlocks(translation.sections),
  );
  const hasContent = Boolean(
    translation.title.trim()
      || translation.excerpt.trim()
      || translation.readTime.trim()
      || translation.category.trim()
      || translation.imageAlt.trim()
      || sections.length > 0,
  );

  if (!hasContent) {
    return undefined;
  }

  return {
    ...(translation.title.trim()
      ? { title: translation.title.trim() }
      : {}),
    ...(translation.excerpt.trim()
      ? { excerpt: translation.excerpt.trim() }
      : {}),
    ...(translation.readTime.trim()
      ? { readTime: translation.readTime.trim() }
      : {}),
    ...(translation.category.trim()
      ? { category: translation.category.trim() }
      : {}),
    ...(translation.imageAlt.trim()
      ? { imageAlt: translation.imageAlt.trim() }
      : {}),
    ...(sections.length > 0 ? { sections } : {}),
  };
};

export const buildArticleInput = (draft: ArticleDraft): AdminArticleInput => {
  const englishTranslation = buildTranslationInput(draft.translations?.en);

  return {
    id: draft.id,
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    excerpt: draft.excerpt.trim(),
    date: draft.date,
    readTime: draft.readTime.trim(),
    tags: draft.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    category: draft.category.trim(),
    author: draft.author.trim(),
    image: draft.image.trim(),
    imageAlt: draft.imageAlt.trim() || draft.title.trim(),
    status: draft.status,
    translations: englishTranslation ? { en: englishTranslation } : undefined,
    sections: editorBlocksToArticleBlocks(draft.sections),
  };
};

export const validateEditorSections = (
  sections: EditorBlock[],
): string | null => {
  if (sections.length === 0) {
    return 'Tambahkan minimal satu content block.';
  }

  for (const section of sections) {
    if (
      (section.type === 'paragraph' || section.type === 'heading')
      && !section.content.trim()
    ) {
      return `${blockTypeLabel[section.type]} block tidak boleh kosong.`;
    }

    if (
      section.type === 'list'
      && section.itemsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean).length === 0
    ) {
      return 'List block harus punya minimal satu item.';
    }

    if (
      section.type === 'image'
      && (!section.src.trim() || !section.alt.trim())
    ) {
      return 'Image block butuh image URL dan alt text.';
    }

    if (
      section.type === 'code'
      && (!section.language.trim() || !section.code.trim())
    ) {
      return 'Code block butuh language dan isi kode.';
    }

    if (
      section.type === 'highlight'
      && (!section.title.trim() || !section.content.trim())
    ) {
      return 'Highlight block butuh title dan content.';
    }
  }

  return null;
};

export const validateDraft = (
  draft: ArticleDraft,
  allArticles: Article[],
): string | null => {
  if (!draft.title.trim()) return 'Title wajib diisi.';
  if (!draft.slug.trim()) return 'Slug wajib diisi.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug.trim())) {
    return 'Slug harus lowercase, tanpa spasi, dan pakai tanda minus.';
  }
  if (
    allArticles.some(
      (article) => article.slug === draft.slug.trim() && article.id !== draft.id,
    )
  ) {
    return 'Slug sudah dipakai artikel lain.';
  }
  if (!draft.excerpt.trim()) return 'Excerpt wajib diisi.';
  if (!draft.category.trim()) return 'Category wajib diisi.';
  if (!draft.author.trim()) return 'Author wajib diisi.';
  if (!draft.readTime.trim()) return 'Read time wajib diisi.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) {
    return 'Date harus memakai format YYYY-MM-DD.';
  }

  return validateEditorSections(draft.sections);
};

export const getInitials = (value: string) => value
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase() ?? '')
  .join('') || 'AD';

export const getBlockPlainText = (section: EditorBlock) => {
  if (section.type === 'paragraph' || section.type === 'heading') {
    return section.content;
  }
  if (section.type === 'list') {
    return section.itemsText;
  }
  if (section.type === 'image') {
    return `${section.alt} ${section.caption}`.trim();
  }
  if (section.type === 'code') {
    return `${section.fileName} ${section.caption} ${section.command} ${section.code}`.trim();
  }

  return `${section.title} ${section.content}`.trim();
};

export const countWords = (value: string) => value
  .trim()
  .split(/\s+/)
  .filter(Boolean).length;
