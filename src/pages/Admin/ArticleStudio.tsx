import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy,
  CopyPlus,
  Download,
  Eye,
  FileText,
  ImageUp,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Save,
  Search,
  Settings2,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { Article, ArticleBlock, ArticleStatus } from '../../types';
import { useArticles } from '../../hooks/useArticles';
import { useAuth } from '../../hooks/useAuth';
import { getBuiltInArticles } from '../../lib/articleStore';
import {
  deleteAdminArticle,
  saveAdminArticle,
  uploadArticleAsset,
} from '../../services/articleService';

type EditorBlock = {
  id: string;
  type: ArticleBlock['type'];
  content: string;
  title: string;
  itemsText: string;
  src: string;
  alt: string;
  caption: string;
  language: string;
  fileName: string;
  command: string;
  code: string;
};

type TranslationEditorDraft = {
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  imageAlt: string;
  sections: EditorBlock[];
};

type ArticleTranslationDrafts = {
  en?: TranslationEditorDraft;
};

type ArticleDraft = {
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

type NoticeTone = 'success' | 'error' | 'neutral';
type ArticleFilter = 'all' | 'draft' | 'published';
type EditorLanguage = 'id' | 'en';

const DRAFT_IMPORT_ACCEPT = '.json,.md,.markdown,application/json,text/markdown,text/plain';

const CATEGORY_OPTIONS = [
  'Backend Engineering',
  'Frontend Systems',
  'DevOps',
  'Product Notes',
  'Case Study',
  'Open Source',
];
const BLOCK_TYPES = ['paragraph', 'heading', 'list', 'image', 'code', 'highlight'] as const;

const createBlockId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const slugify = (value: string) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-{2,}/g, '-');

const blockTypeLabel: Record<ArticleBlock['type'], string> = {
  paragraph: 'Paragraph',
  heading: 'Heading',
  list: 'List',
  image: 'Image',
  code: 'Code',
  highlight: 'Highlight',
};

const createEmptyBlock = (type: ArticleBlock['type'] = 'paragraph'): EditorBlock => ({
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

const articleBlocksToEditorBlocks = (sections: ArticleBlock[]): EditorBlock[] => sections.map((section) => {
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

const editorBlocksToArticleBlocks = (sections: EditorBlock[]): ArticleBlock[] => sections.map((section) => {
  if (section.type === 'paragraph' || section.type === 'heading') {
    return {
      type: section.type,
      content: section.content.trim(),
    };
  }

  if (section.type === 'list') {
    return {
      type: 'list' as const,
      items: section.itemsText.split('\n').map((item) => item.trim()).filter(Boolean),
    };
  }

  if (section.type === 'image') {
    return {
      type: 'image' as const,
      src: section.src.trim(),
      alt: section.alt.trim(),
      caption: section.caption.trim() || undefined,
    };
  }

  if (section.type === 'code') {
    return {
      type: 'code' as const,
      language: section.language.trim(),
      fileName: section.fileName.trim() || undefined,
      caption: section.caption.trim() || undefined,
      command: section.command.trim() || undefined,
      code: section.code,
    };
  }

  return {
    type: 'highlight' as const,
    title: section.title.trim(),
    content: section.content.trim(),
  };
});

const filterMeaningfulArticleBlocks = (sections: ArticleBlock[]): ArticleBlock[] => sections.filter((section) => {
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

const createEmptyTranslationDraft = (): TranslationEditorDraft => ({
  title: '',
  excerpt: '',
  readTime: '',
  category: '',
  imageAlt: '',
  sections: [createEmptyBlock('paragraph')],
});

const normalizeTranslationDraft = (translation?: NonNullable<Article['translations']>['en']): TranslationEditorDraft => ({
  title: typeof translation?.title === 'string' ? translation.title : '',
  excerpt: typeof translation?.excerpt === 'string' ? translation.excerpt : '',
  readTime: typeof translation?.readTime === 'string' ? translation.readTime : '',
  category: typeof translation?.category === 'string' ? translation.category : '',
  imageAlt: typeof translation?.imageAlt === 'string' ? translation.imageAlt : '',
  sections: Array.isArray(translation?.sections)
    ? articleBlocksToEditorBlocks(translation.sections.filter((section): section is ArticleBlock => Boolean(section)))
    : [createEmptyBlock('paragraph')],
});

const createEmptyDraft = (author = 'Muhammad Daffa Ramadhan'): ArticleDraft => ({
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

const articleToDraft = (article: Article, overrides?: Partial<ArticleDraft>): ArticleDraft => ({
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

const buildTranslationInput = (translation?: TranslationEditorDraft): NonNullable<Article['translations']>['en'] | undefined => {
  if (!translation) {
    return undefined;
  }

  const sections = filterMeaningfulArticleBlocks(editorBlocksToArticleBlocks(translation.sections));
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
    ...(translation.title.trim() ? { title: translation.title.trim() } : {}),
    ...(translation.excerpt.trim() ? { excerpt: translation.excerpt.trim() } : {}),
    ...(translation.readTime.trim() ? { readTime: translation.readTime.trim() } : {}),
    ...(translation.category.trim() ? { category: translation.category.trim() } : {}),
    ...(translation.imageAlt.trim() ? { imageAlt: translation.imageAlt.trim() } : {}),
    ...(sections.length > 0 ? { sections } : {}),
  };
};

const buildArticleInput = (draft: ArticleDraft) => {
  const englishTranslation = buildTranslationInput(draft.translations?.en);

  return {
    id: draft.id,
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    excerpt: draft.excerpt.trim(),
    date: draft.date,
    readTime: draft.readTime.trim(),
    tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    category: draft.category.trim(),
    author: draft.author.trim(),
    image: draft.image.trim(),
    imageAlt: draft.imageAlt.trim() || draft.title.trim(),
    status: draft.status,
    translations: englishTranslation ? { en: englishTranslation } : undefined,
    sections: editorBlocksToArticleBlocks(draft.sections),
  };
};

const validateEditorSections = (sections: EditorBlock[]): string | null => {
  if (sections.length === 0) return 'Tambahkan minimal satu content block.';

  for (const section of sections) {
    if ((section.type === 'paragraph' || section.type === 'heading') && !section.content.trim()) {
      return `${blockTypeLabel[section.type]} block tidak boleh kosong.`;
    }
    if (section.type === 'list' && section.itemsText.split('\n').map((item) => item.trim()).filter(Boolean).length === 0) {
      return 'List block harus punya minimal satu item.';
    }
    if (section.type === 'image' && (!section.src.trim() || !section.alt.trim())) {
      return 'Image block butuh image URL dan alt text.';
    }
    if (section.type === 'code' && (!section.language.trim() || !section.code.trim())) {
      return 'Code block butuh language dan isi kode.';
    }
    if (section.type === 'highlight' && (!section.title.trim() || !section.content.trim())) {
      return 'Highlight block butuh title dan content.';
    }
  }

  return null;
};

const validateDraft = (draft: ArticleDraft, allArticles: Article[]): string | null => {
  if (!draft.title.trim()) return 'Title wajib diisi.';
  if (!draft.slug.trim()) return 'Slug wajib diisi.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug.trim())) return 'Slug harus lowercase, tanpa spasi, dan pakai tanda minus.';
  if (allArticles.some((article) => article.slug === draft.slug.trim() && article.id !== draft.id)) return 'Slug sudah dipakai artikel lain.';
  if (!draft.excerpt.trim()) return 'Excerpt wajib diisi.';
  if (!draft.category.trim()) return 'Category wajib diisi.';
  if (!draft.author.trim()) return 'Author wajib diisi.';
  if (!draft.readTime.trim()) return 'Read time wajib diisi.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) return 'Date harus memakai format YYYY-MM-DD.';

  return validateEditorSections(draft.sections);
};

const downloadJson = (fileName: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
};

const downloadText = (fileName: string, data: string, mimeType = 'text/plain;charset=utf-8') => {
  const blob = new Blob([data], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
};

const getDraftExportBaseName = (draft: ArticleDraft) => slugify(draft.slug || draft.title || 'untitled-story');

const escapeMarkdown = (value: string) => value.replace(/([*_`[\]])/g, '\\$1');

const draftToMarkdown = (draft: ArticleDraft) => {
  const tags = draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  const lines: string[] = [
    '---',
    `title: "${draft.title.replace(/"/g, '\\"')}"`,
    `slug: "${draft.slug.replace(/"/g, '\\"')}"`,
    `date: "${draft.date}"`,
    `readTime: "${draft.readTime.replace(/"/g, '\\"')}"`,
    `category: "${draft.category.replace(/"/g, '\\"')}"`,
    `author: "${draft.author.replace(/"/g, '\\"')}"`,
    `status: "${draft.status}"`,
    `coverImage: "${draft.image.replace(/"/g, '\\"')}"`,
    `coverImageAlt: "${draft.imageAlt.replace(/"/g, '\\"')}"`,
    'tags:',
    ...(tags.length > 0 ? tags.map((tag) => `  - "${tag.replace(/"/g, '\\"')}"`) : ['  - ""']),
    '---',
    '',
  ];

  if (draft.title.trim()) {
    lines.push(`# ${draft.title.trim()}`, '');
  }

  if (draft.excerpt.trim()) {
    lines.push(draft.excerpt.trim(), '');
  }

  if (draft.image.trim()) {
    lines.push(`![${draft.imageAlt.trim() || draft.title.trim() || 'cover image'}](${draft.image.trim()})`, '');
  }

  draft.sections.forEach((section) => {
    if (section.type === 'paragraph' && section.content.trim()) {
      lines.push(section.content.trim(), '');
      return;
    }

    if (section.type === 'heading' && section.content.trim()) {
      lines.push(`## ${section.content.trim()}`, '');
      return;
    }

    if (section.type === 'list') {
      const items = section.itemsText.split('\n').map((item) => item.trim()).filter(Boolean);
      if (items.length > 0) {
        lines.push(...items.map((item) => `- ${item}`), '');
      }
      return;
    }

    if (section.type === 'image' && section.src.trim()) {
      lines.push(`![${section.alt.trim() || 'image'}](${section.src.trim()})`);
      if (section.caption.trim()) {
        lines.push(`_${section.caption.trim()}_`);
      }
      lines.push('');
      return;
    }

    if (section.type === 'code' && section.code.trim()) {
      if (section.fileName.trim()) {
        lines.push(`**${escapeMarkdown(section.fileName.trim())}**`);
      }
      if (section.caption.trim()) {
        lines.push(section.caption.trim());
      }
      lines.push(`\`\`\`${section.language.trim() || 'txt'}`, section.code, '```');
      if (section.command.trim()) {
        lines.push('', `Command: \`${section.command.trim()}\``);
      }
      lines.push('');
      return;
    }

    if (section.type === 'highlight' && (section.title.trim() || section.content.trim())) {
      if (section.title.trim()) {
        lines.push(`> **${section.title.trim()}**`);
      }
      if (section.content.trim()) {
        lines.push(...section.content.trim().split('\n').map((line) => `> ${line}`));
      }
      lines.push('');
    }
  });

  return lines.join('\n').trimEnd();
};

const stripWrappedQuotes = (value: string) => value.trim().replace(/^"(.*)"$/s, '$1').replace(/\\"/g, '"');

const normalizeDraftStatus = (value: unknown): ArticleStatus => value === 'published' ? 'published' : 'draft';

const toEditorBlock = (section: unknown): EditorBlock | null => {
  if (!section || typeof section !== 'object') {
    return null;
  }

  const block = section as Record<string, unknown>;
  const type = block.type;
  if (type === 'paragraph' || type === 'heading') {
    return {
      ...createEmptyBlock(type),
      content: typeof block.content === 'string' ? block.content : '',
    };
  }

  if (type === 'list') {
    const items = Array.isArray(block.items)
      ? block.items.filter((item): item is string => typeof item === 'string')
      : [];

    return {
      ...createEmptyBlock('list'),
      itemsText: items.join('\n'),
    };
  }

  if (type === 'image') {
    return {
      ...createEmptyBlock('image'),
      src: typeof block.src === 'string' ? block.src : '',
      alt: typeof block.alt === 'string' ? block.alt : '',
      caption: typeof block.caption === 'string' ? block.caption : '',
    };
  }

  if (type === 'code') {
    return {
      ...createEmptyBlock('code'),
      language: typeof block.language === 'string' ? block.language : 'txt',
      fileName: typeof block.fileName === 'string' ? block.fileName : '',
      caption: typeof block.caption === 'string' ? block.caption : '',
      command: typeof block.command === 'string' ? block.command : '',
      code: typeof block.code === 'string' ? block.code : '',
    };
  }

  if (type === 'highlight') {
    return {
      ...createEmptyBlock('highlight'),
      title: typeof block.title === 'string' ? block.title : '',
      content: typeof block.content === 'string' ? block.content : '',
    };
  }

  return null;
};

const normalizeImportedDraft = (value: unknown, fallbackAuthor: string): ArticleDraft => {
  if (!value || typeof value !== 'object') {
    throw new Error('Isi file JSON tidak valid untuk draft artikel.');
  }

  const raw = value as Record<string, unknown>;
  const sectionsRaw = Array.isArray(raw.sections) ? raw.sections : [];
  const sections = sectionsRaw.map(toEditorBlock).filter((section): section is EditorBlock => Boolean(section));

  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((tag): tag is string => typeof tag === 'string').join(', ')
    : typeof raw.tags === 'string'
      ? raw.tags
      : '';

  const title = typeof raw.title === 'string' ? raw.title : '';
  const slug = typeof raw.slug === 'string' && raw.slug.trim() ? raw.slug : slugify(title);
  const rawTranslations = raw.translations && typeof raw.translations === 'object'
    ? raw.translations as Record<string, unknown>
    : null;
  const rawEnglishTranslation = rawTranslations?.en && typeof rawTranslations.en === 'object'
    ? rawTranslations.en as Record<string, unknown>
    : null;
  const translationSections = Array.isArray(rawEnglishTranslation?.sections)
    ? rawEnglishTranslation.sections.map(toEditorBlock).filter((section): section is EditorBlock => Boolean(section))
    : [];

  return {
    id: null,
    title,
    slug,
    excerpt: typeof raw.excerpt === 'string' ? raw.excerpt : '',
    date: typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date) ? raw.date : getTodayDate(),
    readTime: typeof raw.readTime === 'string' && raw.readTime.trim() ? raw.readTime : '5 min read',
    tags,
    category: typeof raw.category === 'string' ? raw.category : '',
    author: typeof raw.author === 'string' && raw.author.trim() ? raw.author : fallbackAuthor,
    image: typeof raw.image === 'string' ? raw.image : '',
    imageAlt: typeof raw.imageAlt === 'string' ? raw.imageAlt : '',
    status: normalizeDraftStatus(raw.status),
    sections: sections.length > 0 ? sections : [createEmptyBlock('paragraph')],
    translations: {
      en: {
        title: typeof rawEnglishTranslation?.title === 'string' ? rawEnglishTranslation.title : '',
        excerpt: typeof rawEnglishTranslation?.excerpt === 'string' ? rawEnglishTranslation.excerpt : '',
        readTime: typeof rawEnglishTranslation?.readTime === 'string' ? rawEnglishTranslation.readTime : '',
        category: typeof rawEnglishTranslation?.category === 'string' ? rawEnglishTranslation.category : '',
        imageAlt: typeof rawEnglishTranslation?.imageAlt === 'string' ? rawEnglishTranslation.imageAlt : '',
        sections: translationSections.length > 0 ? translationSections : [createEmptyBlock('paragraph')],
      },
    },
  };
};

const parseFrontmatter = (markdown: string) => {
  if (!markdown.startsWith('---\n')) {
    return {
      frontmatter: {} as Record<string, string | string[]>,
      body: markdown,
    };
  }

  const closingIndex = markdown.indexOf('\n---', 4);
  if (closingIndex < 0) {
    return {
      frontmatter: {} as Record<string, string | string[]>,
      body: markdown,
    };
  }

  const rawFrontmatter = markdown.slice(4, closingIndex);
  const body = markdown.slice(closingIndex + 4).replace(/^\n/, '');
  const frontmatter: Record<string, string | string[]> = {};
  let currentArrayKey: string | null = null;

  rawFrontmatter.split('\n').forEach((line) => {
    const arrayItemMatch = line.match(/^\s*-\s+(.*)$/);
    if (currentArrayKey && arrayItemMatch) {
      const current = frontmatter[currentArrayKey];
      if (Array.isArray(current)) {
        current.push(stripWrappedQuotes(arrayItemMatch[1]));
      }
      return;
    }

    currentArrayKey = null;
    const keyValueMatch = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!keyValueMatch) {
      return;
    }

    const [, key, rawValue] = keyValueMatch;
    if (!rawValue.trim()) {
      frontmatter[key] = [];
      currentArrayKey = key;
      return;
    }

    frontmatter[key] = stripWrappedQuotes(rawValue);
  });

  return { frontmatter, body };
};

const parseMarkdownToDraft = (markdown: string, fallbackAuthor: string): ArticleDraft => {
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n').trim();
  const { frontmatter, body } = parseFrontmatter(normalizedMarkdown);
  const lines = body.split('\n');
  const sections: EditorBlock[] = [];

  let title = typeof frontmatter.title === 'string' ? frontmatter.title : '';
  let slug = typeof frontmatter.slug === 'string' ? frontmatter.slug : '';
  let excerpt = '';
  let date = typeof frontmatter.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date) ? frontmatter.date : getTodayDate();
  let readTime = typeof frontmatter.readTime === 'string' ? frontmatter.readTime : '5 min read';
  let category = typeof frontmatter.category === 'string' ? frontmatter.category : '';
  let author = typeof frontmatter.author === 'string' && frontmatter.author.trim() ? frontmatter.author : fallbackAuthor;
  let status = normalizeDraftStatus(frontmatter.status);
  let image = typeof frontmatter.coverImage === 'string' ? frontmatter.coverImage : '';
  let imageAlt = typeof frontmatter.coverImageAlt === 'string' ? frontmatter.coverImageAlt : '';
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.join(', ') : '';

  const isBlank = (line: string) => line.trim() === '';
  const isDivider = (line: string) => /^---+$/.test(line.trim());
  const isHeading = (line: string) => /^##\s+/.test(line.trim());
  const isListItem = (line: string) => /^-\s+/.test(line.trim());
  const isCodeFence = (line: string) => /^```/.test(line.trim());
  const isImage = (line: string) => /^!\[[^\]]*\]\(([^)]+)\)$/.test(line.trim());
  const isQuote = (line: string) => /^>\s?/.test(line.trim());

  const parseImageLine = (line: string) => {
    const match = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    return match ? { alt: match[1], src: match[2] } : null;
  };

  const parseCommandLine = (line: string) => {
    const match = line.trim().match(/^Command:\s*`(.+)`$/);
    return match ? match[1] : '';
  };

  let index = 0;
  while (index < lines.length && isBlank(lines[index])) {
    index += 1;
  }

  if (index < lines.length && /^#\s+/.test(lines[index].trim())) {
    title = lines[index].trim().replace(/^#\s+/, '').trim();
    index += 1;
  }

  while (index < lines.length && isBlank(lines[index])) {
    index += 1;
  }

  if (!excerpt) {
    const excerptLines: string[] = [];
    while (index < lines.length && !isBlank(lines[index]) && !isDivider(lines[index]) && !isHeading(lines[index]) && !isListItem(lines[index]) && !isCodeFence(lines[index]) && !isImage(lines[index]) && !isQuote(lines[index])) {
      excerptLines.push(lines[index].trim());
      index += 1;
    }

    if (excerptLines.length > 0) {
      excerpt = excerptLines.join(' ');
    }
  }

  while (index < lines.length) {
    const currentLine = lines[index];
    const trimmed = currentLine.trim();

    if (isBlank(currentLine) || isDivider(currentLine)) {
      index += 1;
      continue;
    }

    if (isHeading(currentLine)) {
      sections.push({
        ...createEmptyBlock('heading'),
        content: trimmed.replace(/^##\s+/, '').trim(),
      });
      index += 1;
      continue;
    }

    if (!image && isImage(currentLine) && sections.length === 0) {
      const parsedImage = parseImageLine(currentLine);
      if (parsedImage) {
        image = parsedImage.src;
        imageAlt = parsedImage.alt;
      }
      index += 1;
      while (index < lines.length && isBlank(lines[index])) {
        index += 1;
      }
      continue;
    }

    if (isImage(currentLine)) {
      const parsedImage = parseImageLine(currentLine);
      if (!parsedImage) {
        index += 1;
        continue;
      }

      let caption = '';
      if (index + 1 < lines.length) {
        const nextLine = lines[index + 1].trim();
        const captionMatch = nextLine.match(/^_(.+)_$/);
        if (captionMatch) {
          caption = captionMatch[1].trim();
          index += 1;
        }
      }

      sections.push({
        ...createEmptyBlock('image'),
        src: parsedImage.src,
        alt: parsedImage.alt,
        caption,
      });
      index += 1;
      continue;
    }

    if (isQuote(currentLine)) {
      const quoteLines: string[] = [];
      while (index < lines.length && isQuote(lines[index])) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }

      const firstLine = quoteLines[0] ?? '';
      const titleMatch = firstLine.match(/^\*\*(.+)\*\*$/);
      sections.push({
        ...createEmptyBlock('highlight'),
        title: titleMatch ? titleMatch[1].trim() : 'Highlight',
        content: titleMatch ? quoteLines.slice(1).join('\n').trim() : quoteLines.join('\n').trim(),
      });
      continue;
    }

    if (isListItem(currentLine)) {
      const items: string[] = [];
      while (index < lines.length && isListItem(lines[index])) {
        items.push(lines[index].trim().replace(/^-\s+/, '').trim());
        index += 1;
      }

      sections.push({
        ...createEmptyBlock('list'),
        itemsText: items.join('\n'),
      });
      continue;
    }

    if (isCodeFence(currentLine)) {
      const language = trimmed.replace(/^```/, '').trim() || 'txt';
      index += 1;
      const codeLines: string[] = [];
      while (index < lines.length && !isCodeFence(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length && isCodeFence(lines[index])) {
        index += 1;
      }

      let command = '';
      while (index < lines.length && isBlank(lines[index])) {
        index += 1;
      }
      if (index < lines.length && parseCommandLine(lines[index])) {
        command = parseCommandLine(lines[index]);
        index += 1;
      }

      sections.push({
        ...createEmptyBlock('code'),
        language,
        code: codeLines.join('\n'),
        command,
      });
      continue;
    }

    if (/^\*\*(.+)\*\*$/.test(trimmed) && index + 1 < lines.length && isCodeFence(lines[index + 1])) {
      const fileName = trimmed.replace(/^\*\*|\*\*$/g, '').trim();
      const language = lines[index + 1].trim().replace(/^```/, '').trim() || 'txt';
      index += 2;
      const codeLines: string[] = [];
      while (index < lines.length && !isCodeFence(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length && isCodeFence(lines[index])) {
        index += 1;
      }

      let command = '';
      while (index < lines.length && isBlank(lines[index])) {
        index += 1;
      }
      if (index < lines.length && parseCommandLine(lines[index])) {
        command = parseCommandLine(lines[index]);
        index += 1;
      }

      sections.push({
        ...createEmptyBlock('code'),
        language,
        fileName,
        code: codeLines.join('\n'),
        command,
      });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && !isBlank(lines[index]) && !isDivider(lines[index]) && !isHeading(lines[index]) && !isListItem(lines[index]) && !isCodeFence(lines[index]) && !isImage(lines[index]) && !isQuote(lines[index])) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    if (paragraphLines.length > 0) {
      sections.push({
        ...createEmptyBlock('paragraph'),
        content: paragraphLines.join(' '),
      });
    }
  }

  return {
    id: null,
    title,
    slug: slug || slugify(title),
    excerpt,
    date,
    readTime,
    tags,
    category,
    author,
    image,
    imageAlt,
    status,
    sections: sections.length > 0 ? sections : [createEmptyBlock('paragraph')],
  };
};

const getInitials = (value: string) => value
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase() ?? '')
  .join('') || 'AD';

const getBlockPlainText = (section: EditorBlock) => {
  if (section.type === 'paragraph' || section.type === 'heading') return section.content;
  if (section.type === 'list') return section.itemsText;
  if (section.type === 'image') return `${section.alt} ${section.caption}`.trim();
  if (section.type === 'code') return `${section.fileName} ${section.caption} ${section.command} ${section.code}`.trim();
  return `${section.title} ${section.content}`.trim();
};

const countWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

const ArticleStudio: React.FC = () => {
  const { articles: adminArticles, loading, error } = useArticles({ scope: 'admin' });
  const { user, profile } = useAuth();
  const [builtInArticles] = useState<Article[]>(() => getBuiltInArticles());
  const [draft, setDraft] = useState<ArticleDraft>(() => createEmptyDraft(profile?.fullName || profile?.email || 'Muhammad Daffa Ramadhan'));
  const [notice, setNotice] = useState<{ tone: NoticeTone; message: string } | null>({
    tone: 'neutral',
    message: 'Supabase sync aktif. Gunakan editor ini untuk menulis, mengelola, dan menerbitkan artikel langsung dari dashboard.',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const [libraryQuery, setLibraryQuery] = useState('');
  const [articleFilter, setArticleFilter] = useState<ArticleFilter>('all');
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [insertMenuAnchor, setInsertMenuAnchor] = useState<string | 'start' | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelperVisible, setIsHelperVisible] = useState(true);
  const [editorLanguage, setEditorLanguage] = useState<EditorLanguage>('id');
  const titleTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const defaultAuthor = profile?.fullName || profile?.email || 'Muhammad Daffa Ramadhan';
  const ensureEnglishTranslationDraft = (current: ArticleDraft): TranslationEditorDraft => (
    current.translations?.en ?? createEmptyTranslationDraft()
  );

  const syncTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) {
      return;
    }

    textarea.style.height = '0px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    syncTextareaHeight(titleTextareaRef.current);
  }, [draft.title]);

  const markDraftDirty = () => {
    setHasPendingChanges(true);
  };

  const updateEnglishTranslationDraft = (updater: (current: TranslationEditorDraft) => TranslationEditorDraft) => {
    markDraftDirty();
    setDraft((current) => ({
      ...current,
      translations: {
        ...(current.translations ?? {}),
        en: updater(ensureEnglishTranslationDraft(current)),
      },
    }));
  };

  const updateActiveSections = (updater: (sections: EditorBlock[]) => EditorBlock[]) => {
    markDraftDirty();
    setDraft((current) => {
      if (editorLanguage === 'id') {
        return {
          ...current,
          sections: updater(current.sections),
        };
      }

      const englishTranslation = ensureEnglishTranslationDraft(current);
      return {
        ...current,
        translations: {
          ...(current.translations ?? {}),
          en: {
            ...englishTranslation,
            sections: updater(englishTranslation.sections),
          },
        },
      };
    });
  };

  const revealSupportPanel = (panelId: 'studio-library' | 'studio-settings') => {
    window.setTimeout(() => {
      document.getElementById(panelId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };

  const resetDraft = () => {
    setDraft(createEmptyDraft(defaultAuthor));
    setHasPendingChanges(false);
    setLastSavedAt(null);
    setInsertMenuAnchor(null);
    setIsLibraryOpen(false);
    setIsSettingsOpen(false);
    setEditorLanguage('id');
    setNotice({
      tone: 'neutral',
      message: 'Fresh draft ready. Isi judul, metadata, lalu mulai menulis isi artikel.',
    });
  };

  const handleDraftChange = <K extends keyof ArticleDraft,>(field: K, value: ArticleDraft[K]) => {
    markDraftDirty();
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleBlockChange = (blockId: string, updates: Partial<EditorBlock>) => {
    updateActiveSections((sections) => sections.map((section) => (
      section.id === blockId
        ? { ...section, ...updates }
        : section
    )));
  };

  const insertBlockAt = (afterBlockId: string | null, type: ArticleBlock['type']) => {
    updateActiveSections((currentSections) => {
      const nextBlock = createEmptyBlock(type);
      const nextSections = [...currentSections];

      if (!afterBlockId) {
        nextSections.unshift(nextBlock);
      } else {
        const index = nextSections.findIndex((section) => section.id === afterBlockId);
        if (index < 0) {
          nextSections.push(nextBlock);
        } else {
          nextSections.splice(index + 1, 0, nextBlock);
        }
      }

      return nextSections;
    });
  };

  const handleAddBlock = (type: ArticleBlock['type']) => {
    const lastBlockId = activeSections.length > 0 ? activeSections[activeSections.length - 1].id : null;
    insertBlockAt(lastBlockId, type);
    setInsertMenuAnchor(null);
  };

  const handleInsertBlockAfter = (afterBlockId: string | null, type: ArticleBlock['type']) => {
    insertBlockAt(afterBlockId, type);
    setInsertMenuAnchor(null);
  };

  const handleRemoveBlock = (blockId: string) => {
    setInsertMenuAnchor((current) => (current === blockId ? null : current));
    updateActiveSections((sections) => {
      const remainingSections = sections.filter((section) => section.id !== blockId);
      return remainingSections.length > 0 ? remainingSections : [createEmptyBlock('paragraph')];
    });
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    updateActiveSections((sections) => {
      const index = sections.findIndex((section) => section.id === blockId);
      if (index < 0) {
        return sections;
      }

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sections.length) {
        return sections;
      }

      const nextSections = [...sections];
      const [movedSection] = nextSections.splice(index, 1);
      nextSections.splice(targetIndex, 0, movedSection);
      return nextSections;
    });
  };

  const handleLoadAdminArticle = (article: Article) => {
    setDraft(articleToDraft(article));
    setHasPendingChanges(false);
    setLastSavedAt(article.updatedAt ?? article.publishedAt ?? null);
    setInsertMenuAnchor(null);
    setIsLibraryOpen(false);
    setEditorLanguage('id');
    setNotice({
      tone: 'neutral',
      message: `Editing "${article.title}" from Supabase.`,
    });
  };

  const handleUseAsTemplate = (article: Article) => {
    setDraft(articleToDraft(article, {
      id: null,
      status: 'draft',
      title: `${article.title} (Copy)`,
      slug: `${article.slug}-copy`,
      author: defaultAuthor,
    }));
    setHasPendingChanges(true);
    setLastSavedAt(null);
    setInsertMenuAnchor(null);
    setIsLibraryOpen(false);
    setEditorLanguage('id');
    setNotice({
      tone: 'neutral',
      message: `Template loaded from "${article.title}". Fine-tune the copy, then save as a new draft.`,
    });
  };

  const handleDeleteArticle = async (article: Article) => {
    if (typeof article.id !== 'string') {
      return;
    }

    try {
      await deleteAdminArticle(article.id);
      if (draft.id === article.id) {
        resetDraft();
      }
      setNotice({
        tone: 'success',
        message: `Artikel "${article.title}" dihapus dari database.`,
      });
    } catch (deleteError) {
      setNotice({
        tone: 'error',
        message: deleteError instanceof Error ? deleteError.message : 'Gagal menghapus artikel.',
      });
    }
  };

  const handleDeleteCurrentArticle = async () => {
    const article = adminArticles.find((item) => item.id === draft.id);
    if (article) {
      await handleDeleteArticle(article);
    }
  };

  const handleExport = () => {
    downloadJson('supabase-articles-export.json', adminArticles);
    setNotice({
      tone: 'success',
      message: 'Database article export berhasil dibuat.',
    });
  };

  const handleExportDraftJson = () => {
    const fileName = `${getDraftExportBaseName(draft)}.article.json`;
    downloadJson(fileName, buildArticleInput(draft));
    setNotice({
      tone: 'success',
      message: `Draft aktif berhasil diexport ke ${fileName}.`,
    });
  };

  const buildActiveMarkdownDraft = (): ArticleDraft => {
    if (editorLanguage === 'id') {
      return draft;
    }

    const englishTranslation = ensureEnglishTranslationDraft(draft);
    return {
      ...draft,
      title: englishTranslation.title.trim() || draft.title,
      excerpt: englishTranslation.excerpt.trim() || draft.excerpt,
      readTime: englishTranslation.readTime.trim() || draft.readTime,
      category: englishTranslation.category.trim() || draft.category,
      imageAlt: englishTranslation.imageAlt.trim() || draft.imageAlt,
      sections: englishTranslation.sections.length > 0 ? englishTranslation.sections : draft.sections,
      translations: undefined,
    };
  };

  const handleExportDraftMarkdown = () => {
    const activeDraft = buildActiveMarkdownDraft();
    const fileName = `${getDraftExportBaseName(activeDraft)}${editorLanguage === 'en' ? '-en' : ''}.md`;
    downloadText(fileName, draftToMarkdown(activeDraft), 'text/markdown;charset=utf-8');
    setNotice({
      tone: 'success',
      message: `Draft aktif berhasil diexport ke ${fileName}.`,
    });
  };

  const handleCopyDraftMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(draftToMarkdown(buildActiveMarkdownDraft()));
      setNotice({
        tone: 'success',
        message: 'Markdown draft aktif berhasil dicopy ke clipboard.',
      });
    } catch (copyError) {
      setNotice({
        tone: 'error',
        message: copyError instanceof Error ? copyError.message : 'Gagal copy markdown ke clipboard.',
      });
    }
  };

  const applyImportedDraft = (nextDraft: ArticleDraft, sourceLabel: string) => {
    setDraft({
      ...nextDraft,
      id: null,
      author: nextDraft.author.trim() || defaultAuthor,
      sections: nextDraft.sections.length > 0 ? nextDraft.sections : [createEmptyBlock('paragraph')],
    });
    setHasPendingChanges(true);
    setLastSavedAt(null);
    setInsertMenuAnchor(null);
    setIsLibraryOpen(false);
    setIsSettingsOpen(false);
    setIsHelperVisible(true);
    setEditorLanguage('id');
    setNotice({
      tone: 'success',
      message: `Draft dari ${sourceLabel} berhasil diimport. Review isi lalu simpan ke Supabase.`,
    });
  };

  const handleImportDraftFile = async (file: File | null) => {
    if (!file) {
      return;
    }

    try {
      const rawText = await file.text();
      const lowerFileName = file.name.toLowerCase();
      let nextDraft: ArticleDraft;

      if (lowerFileName.endsWith('.json')) {
        const parsed = JSON.parse(rawText) as unknown;
        const candidate = Array.isArray(parsed) ? parsed[0] : parsed;
        if (!candidate) {
          throw new Error('File JSON tidak berisi draft artikel.');
        }
        nextDraft = normalizeImportedDraft(candidate, defaultAuthor);
      } else if (lowerFileName.endsWith('.md') || lowerFileName.endsWith('.markdown') || file.type.includes('markdown')) {
        nextDraft = parseMarkdownToDraft(rawText, defaultAuthor);
      } else {
        try {
          const parsed = JSON.parse(rawText) as unknown;
          const candidate = Array.isArray(parsed) ? parsed[0] : parsed;
          if (!candidate) {
            throw new Error('File JSON tidak berisi draft artikel.');
          }
          nextDraft = normalizeImportedDraft(candidate, defaultAuthor);
        } catch {
          nextDraft = parseMarkdownToDraft(rawText, defaultAuthor);
        }
      }

      applyImportedDraft(nextDraft, file.name);
    } catch (importError) {
      setNotice({
        tone: 'error',
        message: importError instanceof Error ? importError.message : 'Gagal import draft dari file.',
      });
    }
  };

  const handleImportInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0] ?? null;
    await handleImportDraftFile(file);
    input.value = '';
  };

  const persistDraft = async (nextStatus: ArticleStatus = draft.status) => {
    const nextDraft = nextStatus === draft.status
      ? draft
      : { ...draft, status: nextStatus };

    const validationMessage = validateDraft(nextDraft, adminArticles);
    if (validationMessage) {
      setNotice({
        tone: 'error',
        message: validationMessage,
      });
      return;
    }

    setIsSaving(true);

    try {
      const savedArticle = await saveAdminArticle(buildArticleInput(nextDraft), user?.id ?? null);
      setDraft(articleToDraft(savedArticle));
      setHasPendingChanges(false);
      setLastSavedAt(new Date().toISOString());
      setInsertMenuAnchor(null);
      setNotice({
        tone: 'success',
        message: savedArticle.status === 'published'
          ? `Artikel "${savedArticle.title}" berhasil dipublish ke Supabase.`
          : `Draft "${savedArticle.title}" berhasil disimpan ke Supabase.`,
      });
    } catch (saveError) {
      setNotice({
        tone: 'error',
        message: saveError instanceof Error ? saveError.message : 'Gagal menyimpan artikel.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await persistDraft();
  };

  const handleCoverUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    setIsUploadingCover(true);

    try {
      const publicUrl = await uploadArticleAsset(file, 'cover');
      markDraftDirty();
      setDraft((current) => ({
        ...current,
        image: publicUrl,
        imageAlt: current.imageAlt || current.title || file.name,
      }));
      setNotice({
        tone: 'success',
        message: 'Cover image berhasil diupload.',
      });
    } catch (uploadError) {
      setNotice({
        tone: 'error',
        message: uploadError instanceof Error ? uploadError.message : 'Gagal upload cover image.',
      });
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleBlockImageUpload = async (blockId: string, file: File | null) => {
    if (!file) {
      return;
    }

    setUploadingBlockId(blockId);

    try {
      const publicUrl = await uploadArticleAsset(file, 'inline');
      markDraftDirty();
      handleBlockChange(blockId, {
        src: publicUrl,
        alt: file.name,
      });
      setNotice({
        tone: 'success',
        message: 'Inline image berhasil diupload.',
      });
    } catch (uploadError) {
      setNotice({
        tone: 'error',
        message: uploadError instanceof Error ? uploadError.message : 'Gagal upload inline image.',
      });
    } finally {
      setUploadingBlockId(null);
    }
  };

  const publishedCount = adminArticles.filter((article) => article.status === 'published').length;
  const draftCount = adminArticles.filter((article) => article.status !== 'published').length;
  const currentArticle = adminArticles.find((article) => article.id === draft.id) ?? null;
  const englishTranslationDraft = ensureEnglishTranslationDraft(draft);
  const activeTitle = editorLanguage === 'id' ? draft.title : englishTranslationDraft.title;
  const activeExcerpt = editorLanguage === 'id' ? draft.excerpt : englishTranslationDraft.excerpt;
  const activeReadTime = editorLanguage === 'id' ? draft.readTime : englishTranslationDraft.readTime;
  const activeCategory = editorLanguage === 'id' ? draft.category : englishTranslationDraft.category;
  const activeImageAlt = editorLanguage === 'id' ? draft.imageAlt : englishTranslationDraft.imageAlt;
  const activeSections = editorLanguage === 'id' ? draft.sections : englishTranslationDraft.sections;
  const draftTags = draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  const avatarName = profile?.fullName || profile?.email || 'Admin';
  const avatarInitials = getInitials(avatarName);
  const previewPath = `/my-notes/${draft.slug || 'your-slug'}`;
  const handlePreviewRouteClick = () => {
    window.localStorage.setItem('articleLanguage', editorLanguage);
  };
  const storyStateLabel = draft.status === 'published' ? 'Published' : 'Draft';
  const lastSyncedLabel = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;
  const saveStateLabel = isSaving
    ? 'Saving...'
    : hasPendingChanges
      ? 'Unsaved'
      : 'Saved';
  const syncLabel = isSaving
    ? 'Syncing to Supabase...'
    : hasPendingChanges
      ? 'Unsaved local changes'
      : lastSyncedLabel
        ? `Last synced at ${lastSyncedLabel}`
        : 'Ready to write';
  const metaTitlePreview = activeTitle.trim() || 'Your title becomes the meta title preview';
  const metaDescriptionPreview = activeExcerpt.trim() || 'Your excerpt becomes the meta description preview';
  const wordCountEstimate = countWords([
    activeTitle,
    activeExcerpt,
    ...activeSections.map(getBlockPlainText),
  ].join(' '));
  const estimatedReadLabel = wordCountEstimate > 0
    ? `${Math.max(1, Math.ceil(wordCountEstimate / 220))} min estimate`
    : 'Start writing to estimate';
  const englishSectionValidation = validateEditorSections(englishTranslationDraft.sections);
  const englishHasContent = Boolean(
    englishTranslationDraft.title.trim()
    || englishTranslationDraft.excerpt.trim()
    || englishTranslationDraft.readTime.trim()
    || englishTranslationDraft.category.trim()
    || englishTranslationDraft.imageAlt.trim()
    || englishTranslationDraft.sections.some((section) => getBlockPlainText(section).trim() || section.type === 'image'),
  );
  const englishReady = Boolean(
    englishTranslationDraft.title.trim()
    && englishTranslationDraft.excerpt.trim()
    && englishTranslationDraft.readTime.trim()
    && englishTranslationDraft.category.trim()
    && englishTranslationDraft.imageAlt.trim()
    && !englishSectionValidation,
  );
  const englishStateLabel = englishReady ? 'EN ready' : englishHasContent ? 'EN incomplete' : 'EN empty';
  const activeLanguageLabel = editorLanguage === 'id' ? 'Bahasa utama' : 'English translation';
  const storyStatusClassName = draft.status === 'published'
    ? 'studio-medium-status-live'
    : hasPendingChanges
      ? 'studio-medium-status-pending'
      : 'studio-medium-status-draft';
  const noticeClassName = notice?.tone === 'success'
    ? 'studio-medium-notice studio-medium-notice-success'
    : notice?.tone === 'error'
      ? 'studio-medium-notice studio-medium-notice-error'
      : 'studio-medium-notice studio-medium-notice-neutral';
  const articleFilterTabs: Array<{ id: ArticleFilter; label: string; count: number }> = [
    { id: 'all', label: 'All stories', count: adminArticles.length },
    { id: 'draft', label: 'Drafts', count: draftCount },
    { id: 'published', label: 'Published', count: publishedCount },
  ];
  const filteredAdminArticles = adminArticles.filter((article) => {
    const matchesFilter = articleFilter === 'all'
      ? true
      : articleFilter === 'published'
        ? article.status === 'published'
        : article.status !== 'published';

    const normalizedQuery = libraryQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return matchesFilter;
    }

    const haystack = [
      article.title,
      article.slug,
      article.excerpt,
      article.category,
      article.author,
      article.tags.join(' '),
    ].join(' ').toLowerCase();

    return matchesFilter && haystack.includes(normalizedQuery);
  });

  const handleLocalizedFieldChange = (
    field: keyof Pick<TranslationEditorDraft, 'title' | 'excerpt' | 'readTime' | 'category' | 'imageAlt'>,
    value: string,
  ) => {
    if (editorLanguage === 'id') {
      if (field === 'title' || field === 'excerpt' || field === 'readTime' || field === 'category' || field === 'imageAlt') {
        handleDraftChange(field, value);
      }
      return;
    }

    updateEnglishTranslationDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const renderInsertMenu = (anchorId: string | 'start', afterBlockId: string | null) => (
    insertMenuAnchor === anchorId ? (
      <div className="studio-medium-insert-menu">
        {BLOCK_TYPES.map((type) => (
          <button
            key={`${anchorId}-${type}`}
            type="button"
            onClick={() => handleInsertBlockAfter(afterBlockId, type)}
            className="studio-medium-insert-menu-button"
          >
            <Plus className="h-3.5 w-3.5" />
            {blockTypeLabel[type]}
          </button>
        ))}
      </div>
    ) : null
  );

  const renderBlockFields = (section: EditorBlock, index: number) => {
    const blockPlaceholderLead = editorLanguage === 'en'
      ? 'Write the English version of this section...'
      : 'Tell the story like you are writing a Medium draft...';

    if (section.type === 'paragraph' || section.type === 'heading') {
      return (
        <textarea
          value={section.content}
          onChange={(event) => handleBlockChange(section.id, { content: event.target.value })}
          className={section.type === 'heading' ? 'studio-medium-heading-input' : 'studio-medium-body-input'}
          placeholder={section.type === 'heading'
            ? editorLanguage === 'en' ? 'English subheading' : 'Subheading'
            : index === 0
              ? blockPlaceholderLead
              : editorLanguage === 'en'
                ? 'Continue the English translation, keep the meaning consistent, and refine the phrasing here...'
                : 'Continue the narrative, explain the idea, or drop implementation details here...'}
          spellCheck
        />
      );
    }

    if (section.type === 'list') {
      return (
        <div className="studio-medium-field-stack">
          <textarea
            value={section.itemsText}
            onChange={(event) => handleBlockChange(section.id, { itemsText: event.target.value })}
            className="studio-medium-body-input studio-medium-body-input-compact"
            placeholder={editorLanguage === 'en'
              ? 'First bullet in English\nSecond bullet in English\nThird bullet in English'
              : 'First bullet\nSecond bullet\nThird bullet'}
            spellCheck
          />
          <p className="studio-medium-helper">One line becomes one bullet point in the published article.</p>
        </div>
      );
    }

    if (section.type === 'image') {
      return (
        <div className="studio-medium-field-stack">
          {section.src ? (
            <div className="studio-medium-inline-preview">
              <img
                src={section.src}
                alt={section.alt || `Inline block ${index + 1}`}
                className="h-60 w-full rounded-[1.35rem] object-cover"
              />
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="studio-medium-field">
              <span className="studio-medium-label">Image URL</span>
              <input
                type="text"
                value={section.src}
                onChange={(event) => handleBlockChange(section.id, { src: event.target.value })}
                className="studio-medium-text-input"
                placeholder="https://..."
              />
            </label>

            <label className="studio-medium-field">
              <span className="studio-medium-label">Alt text</span>
              <input
                type="text"
                value={section.alt}
                onChange={(event) => handleBlockChange(section.id, { alt: event.target.value })}
                className="studio-medium-text-input"
                placeholder="Describe the image context"
              />
            </label>
          </div>

          <label className="studio-medium-field">
            <span className="studio-medium-label">Caption</span>
            <input
              type="text"
              value={section.caption}
              onChange={(event) => handleBlockChange(section.id, { caption: event.target.value })}
              className="studio-medium-text-input"
              placeholder="Optional caption"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <label className="studio-medium-toolbar-button cursor-pointer">
              <ImageUp className="h-4 w-4" />
              {uploadingBlockId === section.id ? 'Uploading...' : 'Upload image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => void handleBlockImageUpload(section.id, event.target.files?.[0] ?? null)}
              />
            </label>
            <p className="studio-medium-helper">Inline assets go to the Supabase storage bucket for article images.</p>
          </div>
        </div>
      );
    }

    if (section.type === 'code') {
      return (
        <div className="studio-medium-field-stack">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="studio-medium-field">
              <span className="studio-medium-label">Language</span>
              <input
                type="text"
                value={section.language}
                onChange={(event) => handleBlockChange(section.id, { language: event.target.value })}
                className="studio-medium-text-input"
                placeholder="ts"
              />
            </label>

            <label className="studio-medium-field">
              <span className="studio-medium-label">File name</span>
              <input
                type="text"
                value={section.fileName}
                onChange={(event) => handleBlockChange(section.id, { fileName: event.target.value })}
                className="studio-medium-text-input"
                placeholder="article-editor.tsx"
              />
            </label>

            <label className="studio-medium-field">
              <span className="studio-medium-label">Caption</span>
              <input
                type="text"
                value={section.caption}
                onChange={(event) => handleBlockChange(section.id, { caption: event.target.value })}
                className="studio-medium-text-input"
                placeholder="Optional context"
              />
            </label>

            <label className="studio-medium-field">
              <span className="studio-medium-label">Command</span>
              <input
                type="text"
                value={section.command}
                onChange={(event) => handleBlockChange(section.id, { command: event.target.value })}
                className="studio-medium-text-input"
                placeholder="npm run build"
              />
            </label>
          </div>

          <label className="studio-medium-field">
            <span className="studio-medium-label">Code block</span>
            <textarea
              value={section.code}
              onChange={(event) => handleBlockChange(section.id, { code: event.target.value })}
              className="studio-medium-code-input"
              placeholder="export const articleEditor = () => {"
              spellCheck={false}
            />
          </label>
        </div>
      );
    }

    return (
      <div className="studio-medium-field-stack">
        <label className="studio-medium-field">
          <span className="studio-medium-label">Highlight title</span>
          <input
            type="text"
            value={section.title}
            onChange={(event) => handleBlockChange(section.id, { title: event.target.value })}
            className="studio-medium-text-input"
            placeholder="Key takeaway"
          />
        </label>

        <label className="studio-medium-field">
          <span className="studio-medium-label">Highlight content</span>
          <textarea
            value={section.content}
            onChange={(event) => handleBlockChange(section.id, { content: event.target.value })}
            className="studio-medium-body-input studio-medium-body-input-compact"
            placeholder="Summarize the core insight, decision, or next action..."
            spellCheck
          />
        </label>
      </div>
    );
  };

  return (
    <div className="studio-medium-shell">
      <div className="studio-medium-frame">
        <header className="studio-medium-topbar studio-medium-topbar-compact">
          <div className="studio-medium-topbar-left">
            <Link to="/admin/articles" className="studio-medium-brand">
              <span className="studio-medium-brand-wordmark">Daf.Dev</span>
            </Link>

            <div className="studio-medium-topbar-meta">
              <span className={`studio-medium-draft-label ${storyStatusClassName}`}>{storyStateLabel}</span>
              <span className="studio-medium-topbar-meta-copy">{saveStateLabel}</span>
            </div>
          </div>

          <div className="studio-medium-toolbar">
            {draft.slug ? (
              <Link to={previewPath} onClick={handlePreviewRouteClick} className="studio-medium-icon-button" aria-label="Preview story">
                <Eye className="h-4 w-4" />
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => {
                const nextOpen = !isLibraryOpen;
                setIsLibraryOpen(nextOpen);
                if (nextOpen) {
                  setIsSettingsOpen(false);
                  revealSupportPanel('studio-library');
                }
              }}
              className="studio-medium-icon-button"
              aria-label="Toggle story library"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const nextOpen = !isSettingsOpen;
                setIsSettingsOpen(nextOpen);
                if (nextOpen) {
                  setIsLibraryOpen(false);
                  revealSupportPanel('studio-settings');
                }
              }}
              className="studio-medium-icon-button"
              aria-label="Toggle story settings"
            >
              <Settings2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => void persistDraft('published')} disabled={isSaving} className="studio-medium-publish-button studio-medium-publish-button-compact">
              {draft.status === 'published' ? 'Update' : 'Publish'}
            </button>
            <button type="button" onClick={handleExport} className="studio-medium-icon-button" aria-label="Export story library">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <button type="button" className="studio-medium-icon-button" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
            <div className="studio-medium-avatar studio-medium-avatar-compact">
              <span className="studio-medium-avatar-mark">{avatarInitials}</span>
            </div>
          </div>
        </header>

        <div className="studio-medium-layout">
          <aside id="studio-library" className={`studio-medium-support-panel ${isLibraryOpen ? '' : 'hidden'}`}>
            <section className="studio-medium-panel">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="studio-medium-kicker">Story desk</p>
                  <h2 className="studio-medium-panel-title">Library and workflow</h2>
                  <p className="studio-medium-panel-copy">
                    Pull an existing story into focus, start a new draft, or branch from a built-in template.
                  </p>
                </div>
                <span className={`studio-medium-draft-label ${storyStatusClassName}`}>{storyStateLabel}</span>
              </div>

              <div className="mt-5 grid gap-3">
                <button type="button" onClick={resetDraft} className="studio-medium-publish-button w-full justify-center">
                  <Plus className="h-4 w-4" />
                  New story
                </button>
                <label className="studio-medium-toolbar-button w-full cursor-pointer justify-center">
                  <Upload className="h-4 w-4" />
                  Import MD / JSON
                  <input
                    type="file"
                    accept={DRAFT_IMPORT_ACCEPT}
                    className="hidden"
                    onChange={(event) => void handleImportInputChange(event)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleDraftChange('slug', slugify(draft.title))}
                  className="studio-medium-toolbar-button w-full justify-center"
                >
                  <FileText className="h-4 w-4" />
                  Generate slug
                </button>
                <button type="button" onClick={handleExport} className="studio-medium-toolbar-button w-full justify-center">
                  <Download className="h-4 w-4" />
                  Export JSON
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="studio-medium-mini-stat">
                  <span className="studio-medium-mini-label">Stories</span>
                  <strong>{adminArticles.length}</strong>
                </div>
                <div className="studio-medium-mini-stat">
                  <span className="studio-medium-mini-label">Published</span>
                  <strong>{publishedCount}</strong>
                </div>
              </div>

              <div className="mt-6 studio-medium-search">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={libraryQuery}
                  onChange={(event) => setLibraryQuery(event.target.value)}
                  placeholder="Search title, slug, tag, or category"
                  className="studio-medium-search-input"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {articleFilterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setArticleFilter(tab.id)}
                    className={`studio-medium-filter-chip ${articleFilter === tab.id ? 'studio-medium-filter-chip-active' : ''}`}
                  >
                    {tab.label}
                    <span className="studio-medium-filter-count">{tab.count}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="studio-medium-panel">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="studio-medium-kicker">Supabase</p>
                  <h2 className="studio-medium-panel-title">Saved stories</h2>
                </div>
                <span className="studio-medium-filter-count">{filteredAdminArticles.length}</span>
              </div>

              <div className="mt-5 space-y-3">
                {loading ? (
                  <div className="studio-medium-empty-state">Loading your story library...</div>
                ) : filteredAdminArticles.length === 0 ? (
                  <div className="studio-medium-empty-state">
                    {libraryQuery.trim()
                      ? 'No stories matched the current filter.'
                      : 'No stories yet. Start a new draft from the action card above.'}
                  </div>
                ) : (
                  filteredAdminArticles.map((article) => (
                    <article
                      key={article.slug}
                      className={`studio-medium-story-card ${draft.id === article.id ? 'studio-medium-story-card-active' : ''}`}
                    >
                      <button type="button" onClick={() => handleLoadAdminArticle(article)} className="w-full text-left">
                        <div className="flex items-center justify-between gap-3">
                          <span className={`studio-medium-draft-label ${article.status === 'published' ? 'studio-medium-status-live' : 'studio-medium-status-draft'}`}>
                            {article.status ?? 'draft'}
                          </span>
                          <span className="text-xs text-slate-500">{article.date}</span>
                        </div>
                        <h3 className="mt-4 text-base font-semibold leading-6 text-slate-900">
                          {article.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="mt-3 studio-medium-story-meta">
                          <span>{article.category || 'Uncategorized'}</span>
                          <span>{article.readTime}</span>
                        </div>
                      </button>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link to={`/my-notes/${article.slug}`} className="studio-medium-toolbar-button">
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                        <button type="button" onClick={() => void handleDeleteArticle(article)} className="studio-medium-toolbar-button studio-medium-toolbar-danger">
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="studio-medium-panel">
              <div>
                <p className="studio-medium-kicker">Built-in notes</p>
                <h2 className="studio-medium-panel-title">Templates</h2>
                <p className="studio-medium-panel-copy">
                  Pull an existing portfolio note into the editor as a starting point.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {builtInArticles.map((article) => (
                  <article key={article.slug} className="studio-medium-story-card">
                    <div className="flex items-center justify-between gap-3">
                      <span className="studio-medium-draft-label studio-medium-status-draft">Template</span>
                      <span className="text-xs text-slate-500">{article.date}</span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold leading-6 text-slate-900">
                      {article.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => handleUseAsTemplate(article)} className="studio-medium-toolbar-button">
                        <CopyPlus className="h-3.5 w-3.5" />
                        Use template
                      </button>
                      <Link to={`/my-notes/${article.slug}`} className="studio-medium-toolbar-button">
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>

          <form className="studio-medium-editor-form" onSubmit={handleSave}>
            <datalist id="article-category-options">
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>

            <main className="studio-medium-editor-main">
              {notice && notice.tone !== 'neutral' ? (
                <div className={noticeClassName}>{notice.message}</div>
              ) : null}

              {error ? (
                <div className="studio-medium-notice studio-medium-notice-error">{error}</div>
              ) : null}

              <section className="studio-medium-canvas">
                <div className="studio-medium-meta-strip">
                  <span className={`studio-medium-draft-label ${storyStatusClassName}`}>{storyStateLabel}</span>
                  <span className="studio-medium-meta-pill">{activeSections.length} block{activeSections.length === 1 ? '' : 's'}</span>
                  <span className="studio-medium-meta-pill">{wordCountEstimate} words</span>
                  <span className="studio-medium-meta-pill">{estimatedReadLabel}</span>
                  <span className="studio-medium-meta-pill">{syncLabel}</span>
                </div>

                <div className="studio-medium-language-strip">
                  <div className="studio-medium-language-tabs">
                    {(['id', 'en'] as const).map((language) => (
                      <button
                        key={language}
                        type="button"
                        onClick={() => setEditorLanguage(language)}
                        className={`studio-medium-language-tab ${editorLanguage === language ? 'studio-medium-language-tab-active' : ''}`}
                      >
                        {language.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="studio-medium-language-meta">
                    <span className="studio-medium-language-copy">{activeLanguageLabel}</span>
                    <span className={`studio-medium-language-badge ${englishReady ? 'studio-medium-language-badge-ready' : englishHasContent ? 'studio-medium-language-badge-pending' : ''}`}>
                      {englishStateLabel}
                    </span>
                  </div>
                </div>

                <textarea
                  ref={titleTextareaRef}
                  value={activeTitle}
                  onChange={(event) => {
                    handleLocalizedFieldChange('title', event.target.value);
                    syncTextareaHeight(event.currentTarget);
                  }}
                  className="studio-medium-title-input"
                  placeholder={editorLanguage === 'en' ? 'English title' : 'Title'}
                  rows={1}
                  spellCheck
                />

                <textarea
                  value={activeExcerpt}
                  onChange={(event) => handleLocalizedFieldChange('excerpt', event.target.value)}
                  className="studio-medium-dek-input"
                  placeholder={editorLanguage === 'en'
                    ? 'Write the English summary so readers know what this story is about.'
                    : 'Write a short dek or opening summary so readers know what this story is about.'}
                  spellCheck
                />

                <div className="studio-medium-cover-preview studio-medium-cover-preview-hero">
                  {draft.image ? (
                    <img
                      src={draft.image}
                      alt={activeImageAlt || activeTitle || draft.title || 'Cover preview'}
                      className="studio-medium-cover-image"
                    />
                  ) : (
                    <div className="studio-medium-cover-empty">
                      <ImageUp className="h-8 w-8" />
                      <p className="studio-medium-cover-empty-title">No cover image yet</p>
                      <p className="studio-medium-cover-empty-copy">
                        Upload an image or paste a URL from settings to give the story a visual entry point.
                      </p>
                    </div>
                  )}
                </div>

                <div className="studio-medium-cover-toolbar">
                  <label className="studio-medium-cover-action cursor-pointer" aria-label="Upload cover image">
                    <ImageUp className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => void handleCoverUpload(event.target.files?.[0] ?? null)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsLibraryOpen(false);
                      revealSupportPanel('studio-settings');
                    }}
                    className="studio-medium-cover-action"
                    aria-label="Open settings"
                  >
                    <Settings2 className="h-4 w-4" />
                  </button>
                  {draft.slug ? (
                    <Link to={previewPath} onClick={handlePreviewRouteClick} className="studio-medium-cover-action" aria-label="Preview story">
                      <Eye className="h-4 w-4" />
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleDraftChange('slug', slugify(draft.title))}
                    className="studio-medium-cover-action"
                    aria-label="Generate slug"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={handleExport} className="studio-medium-cover-action" aria-label="Export library">
                    <Download className="h-4 w-4" />
                  </button>
                  {draft.id ? (
                    <button
                      type="button"
                      onClick={() => void handleDeleteCurrentArticle()}
                      className="studio-medium-cover-action studio-medium-cover-action-danger"
                      aria-label="Delete article"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                <p className="studio-medium-cover-caption">
                  {activeImageAlt || 'Add a cover alt text from settings for better accessibility.'}
                </p>

                <div className="studio-medium-quick-insert">
                  <div className="studio-medium-block-rail">
                    <button
                      type="button"
                      onClick={() => setInsertMenuAnchor((current) => (current === 'start' ? null : 'start'))}
                      className="studio-medium-insert-anchor"
                      aria-label="Insert the first block"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    {renderInsertMenu('start', null)}
                  </div>
                  <div className="min-w-0">
                    <p className="studio-medium-kicker">Start writing</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Start with a paragraph, heading, list, image, code block, or highlight without leaving the main writing lane.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  {activeSections.map((section, index) => (
                    <div key={section.id} className="studio-medium-block-shell">
                      <div className="studio-medium-block-rail">
                        <button
                          type="button"
                          onClick={() => setInsertMenuAnchor((current) => (current === section.id ? null : section.id))}
                          className="studio-medium-insert-anchor"
                          aria-label={`Insert a block after block ${index + 1}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        {renderInsertMenu(section.id, section.id)}
                      </div>

                      <div className="studio-medium-block-card">
                        <div className="studio-medium-block-toolbar">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="studio-medium-block-type">{blockTypeLabel[section.type]}</span>
                            <span className="text-sm text-slate-400">Section {index + 1}</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleMoveBlock(section.id, 'up')}
                              className="studio-medium-toolbar-button"
                              aria-label="Move block up"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveBlock(section.id, 'down')}
                              className="studio-medium-toolbar-button"
                              aria-label="Move block down"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveBlock(section.id)}
                              className="studio-medium-toolbar-button studio-medium-toolbar-danger"
                              aria-label="Delete block"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {renderBlockFields(section, index)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="studio-medium-route-note">
                  <p className="studio-medium-kicker">Narrative route</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your story will be published at <span className="font-semibold text-slate-900">{previewPath}</span>
                  </p>
                </div>
              </section>
            </main>

            <aside id="studio-settings" className={`studio-medium-support-panel ${isSettingsOpen ? '' : 'hidden'}`}>
              <section className="studio-medium-panel studio-medium-panel-muted">
                <div>
                  <p className="studio-medium-kicker">Story settings</p>
                  <h2 className="studio-medium-panel-title">Metadata</h2>
                  <p className="studio-medium-panel-copy">
                    Keep publishing fields separate from the writing canvas so the editor stays focused.
                  </p>
                  <p className="studio-medium-helper mt-3">
                    Slug, date, author, tags, and cover image are shared. Read time, category, alt text, and body follow the active language tab.
                  </p>
                </div>

                <div className="mt-5 grid gap-4">
                  <label className="studio-medium-field">
                    <span className="studio-medium-label">Slug</span>
                    <input
                      type="text"
                      value={draft.slug}
                      onChange={(event) => handleDraftChange('slug', slugify(event.target.value))}
                      className="studio-medium-text-input"
                      placeholder="mengenal-conventional-commit-message"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDraftChange('slug', slugify(draft.title))}
                    className="studio-medium-toolbar-button w-full justify-center"
                  >
                    <FileText className="h-4 w-4" />
                    Generate slug from title
                  </button>

                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-1">
                    <label className="studio-medium-field">
                      <span className="studio-medium-label">Status</span>
                      <select
                        value={draft.status}
                        onChange={(event) => handleDraftChange('status', event.target.value as ArticleStatus)}
                        className="studio-medium-text-input"
                      >
                        <option value="draft">draft</option>
                        <option value="published">published</option>
                      </select>
                    </label>

                    <label className="studio-medium-field">
                      <span className="studio-medium-label">Date</span>
                      <input
                        type="date"
                        value={draft.date}
                        onChange={(event) => handleDraftChange('date', event.target.value)}
                        className="studio-medium-text-input"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-1">
                    <label className="studio-medium-field">
                      <span className="studio-medium-label">Read time</span>
                      <input
                        type="text"
                        value={activeReadTime}
                        onChange={(event) => handleLocalizedFieldChange('readTime', event.target.value)}
                        className="studio-medium-text-input"
                        placeholder={editorLanguage === 'en' ? '6 min read' : '6 min baca'}
                      />
                    </label>

                    <label className="studio-medium-field">
                      <span className="studio-medium-label">Category</span>
                      <input
                        type="text"
                        list="article-category-options"
                        value={activeCategory}
                        onChange={(event) => handleLocalizedFieldChange('category', event.target.value)}
                        className="studio-medium-text-input"
                        placeholder="Backend Engineering"
                      />
                    </label>
                  </div>

                  <label className="studio-medium-field">
                    <span className="studio-medium-label">Author</span>
                    <input
                      type="text"
                      value={draft.author}
                      onChange={(event) => handleDraftChange('author', event.target.value)}
                      className="studio-medium-text-input"
                      placeholder="Muhammad Daffa Ramadhan"
                    />
                  </label>

                  <label className="studio-medium-field">
                    <span className="studio-medium-label">Tags</span>
                    <input
                      type="text"
                      value={draft.tags}
                      onChange={(event) => handleDraftChange('tags', event.target.value)}
                      className="studio-medium-text-input"
                      placeholder="Git, Conventional Commit, Version Control"
                    />
                    <span className="studio-medium-helper">Separate tags with commas.</span>
                  </label>

                  {draftTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {draftTags.map((tag) => (
                        <span key={tag} className="studio-medium-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="studio-medium-panel">
                <div>
                  <p className="studio-medium-kicker">Cover and accessibility</p>
                  <h2 className="studio-medium-panel-title">Cover image</h2>
                </div>

                <div className="mt-5 grid gap-4">
                  <label className="studio-medium-field">
                    <span className="studio-medium-label">Cover image URL</span>
                    <input
                      type="text"
                      value={draft.image}
                      onChange={(event) => handleDraftChange('image', event.target.value)}
                      className="studio-medium-text-input"
                      placeholder="https://..."
                    />
                  </label>

                  <label className="studio-medium-field">
                    <span className="studio-medium-label">Cover image alt ({editorLanguage.toUpperCase()})</span>
                    <input
                      type="text"
                      value={activeImageAlt}
                      onChange={(event) => handleLocalizedFieldChange('imageAlt', event.target.value)}
                      className="studio-medium-text-input"
                      placeholder="Describe the visual and its context"
                    />
                  </label>

                  <label className="studio-medium-toolbar-button cursor-pointer justify-center">
                    <Upload className="h-4 w-4" />
                    {isUploadingCover ? 'Uploading...' : 'Upload cover'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => void handleCoverUpload(event.target.files?.[0] ?? null)}
                    />
                  </label>

                  <p className="studio-medium-helper">The uploaded file will go to the public cover bucket in Supabase Storage.</p>
                </div>
              </section>

              <section className="studio-medium-panel">
                <div>
                  <p className="studio-medium-kicker">SEO preview</p>
                  <h2 className="studio-medium-panel-title">What the note will show</h2>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4 shadow-[0_16px_50px_-38px_rgba(15,23,42,0.22)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-700">Route</p>
                  <p className="mt-2 break-all text-sm font-medium text-slate-600">{previewPath}</p>
                  <h3 className="mt-5 text-lg font-semibold leading-tight text-slate-900">
                    {metaTitlePreview}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {metaDescriptionPreview}
                  </p>
                </div>
              </section>

              <section className="studio-medium-panel">
                <div>
                  <p className="studio-medium-kicker">Publishing actions</p>
                  <h2 className="studio-medium-panel-title">Finalize</h2>
                </div>

                <div className="mt-5 grid gap-3">
                  <button type="submit" disabled={isSaving} className="studio-medium-toolbar-button w-full justify-center">
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save article'}
                  </button>
                  <button type="button" onClick={() => void persistDraft('published')} disabled={isSaving} className="studio-medium-publish-button w-full justify-center">
                    {draft.status === 'published' ? 'Update publication' : 'Publish story'}
                  </button>
                  {draft.slug ? (
                    <Link to={previewPath} onClick={handlePreviewRouteClick} className="studio-medium-toolbar-button w-full justify-center">
                      <Eye className="h-4 w-4" />
                      Open preview route
                    </Link>
                  ) : null}
                  <label className="studio-medium-toolbar-button w-full cursor-pointer justify-center">
                    <Upload className="h-4 w-4" />
                    Import MD / JSON
                    <input
                      type="file"
                      accept={DRAFT_IMPORT_ACCEPT}
                      className="hidden"
                      onChange={(event) => void handleImportInputChange(event)}
                    />
                  </label>
                  <button type="button" onClick={handleExportDraftJson} className="studio-medium-toolbar-button w-full justify-center">
                    <Download className="h-4 w-4" />
                    Export draft JSON
                  </button>
                  <button type="button" onClick={handleExportDraftMarkdown} className="studio-medium-toolbar-button w-full justify-center">
                    <FileText className="h-4 w-4" />
                    Export draft Markdown
                  </button>
                  <button type="button" onClick={() => void handleCopyDraftMarkdown()} className="studio-medium-toolbar-button w-full justify-center">
                    <Copy className="h-4 w-4" />
                    Copy Markdown
                  </button>
                  <button type="button" onClick={resetDraft} className="studio-medium-toolbar-button w-full justify-center">
                    Reset form
                  </button>
                  {draft.id ? (
                    <button type="button" onClick={() => void handleDeleteCurrentArticle()} className="studio-medium-toolbar-button studio-medium-toolbar-danger w-full justify-center">
                      <Trash2 className="h-4 w-4" />
                      Delete article
                    </button>
                  ) : null}
                </div>

                {currentArticle ? (
                  <div className="mt-5 rounded-[1.35rem] border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                    Editing <span className="font-semibold text-slate-900">{currentArticle.title}</span> from Supabase.
                  </div>
                ) : (
                  <div className="mt-5 rounded-[1.35rem] border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                    Fresh draft mode. Shape the story in the center canvas, then publish when the metadata is ready.
                  </div>
                )}
              </section>
            </aside>
          </form>

          {isHelperVisible ? (
            <div className="studio-medium-helper-dock">
              <button
                type="button"
                onClick={() => setIsHelperVisible(false)}
                className="studio-medium-helper-close"
                aria-label="Hide writing helper"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="studio-medium-helper-copy">
                <p className="studio-medium-helper-title">Use the center canvas to write, then open Library or Settings from the top bar.</p>
                <p className="studio-medium-helper-subtitle">
                  The bottom shortcuts help you add new blocks without leaving the writing flow.
                </p>
              </div>

              <div className="studio-medium-helper-actions">
                {BLOCK_TYPES.map((type) => (
                  <button
                    key={`dock-${type}`}
                    type="button"
                    onClick={() => handleAddBlock(type)}
                    className="studio-medium-helper-action"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {blockTypeLabel[type]}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => void persistDraft('draft')}
                  disabled={isSaving}
                  className="studio-medium-helper-action studio-medium-helper-action-primary"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={handleExportDraftJson}
                  className="studio-medium-helper-action"
                >
                  <Download className="h-3.5 w-3.5" />
                  Draft JSON
                </button>
                <button
                  type="button"
                  onClick={handleExportDraftMarkdown}
                  className="studio-medium-helper-action"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Draft Markdown
                </button>
                <button
                  type="button"
                  onClick={() => void handleCopyDraftMarkdown()}
                  className="studio-medium-helper-action"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Markdown
                </button>
                <label className="studio-medium-helper-action cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  Import MD / JSON
                  <input
                    type="file"
                    accept={DRAFT_IMPORT_ACCEPT}
                    className="hidden"
                    onChange={(event) => void handleImportInputChange(event)}
                  />
                </label>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsHelperVisible(true)}
              className="studio-medium-helper-reopen"
            >
              <Plus className="h-4 w-4" />
              Open writing helper
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleStudio;
