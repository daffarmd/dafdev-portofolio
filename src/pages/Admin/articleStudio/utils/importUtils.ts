import type { ArticleStatus } from '../../../../types';
import type { ArticleDraft, EditorBlock } from '../types';
import { createEmptyBlock, getTodayDate, slugify } from './draftUtils';

const stripWrappedQuotes = (value: string) =>
  value.trim().replace(/^"(.*)"$/s, '$1').replace(/\\"/g, '"');

const normalizeDraftStatus = (value: unknown): ArticleStatus =>
  value === 'published' ? 'published' : 'draft';

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

export const normalizeImportedDraft = (
  value: unknown,
  fallbackAuthor: string,
): ArticleDraft => {
  if (!value || typeof value !== 'object') {
    throw new Error('Isi file JSON tidak valid untuk draft artikel.');
  }

  const raw = value as Record<string, unknown>;
  const sectionsRaw = Array.isArray(raw.sections) ? raw.sections : [];
  const sections = sectionsRaw
    .map(toEditorBlock)
    .filter((section): section is EditorBlock => Boolean(section));

  const tags = Array.isArray(raw.tags)
    ? raw.tags
        .filter((tag): tag is string => typeof tag === 'string')
        .join(', ')
    : typeof raw.tags === 'string'
      ? raw.tags
      : '';

  const title = typeof raw.title === 'string' ? raw.title : '';
  const slug =
    typeof raw.slug === 'string' && raw.slug.trim()
      ? raw.slug
      : slugify(title);
  const rawTranslations =
    raw.translations && typeof raw.translations === 'object'
      ? (raw.translations as Record<string, unknown>)
      : null;
  const rawEnglishTranslation =
    rawTranslations?.en && typeof rawTranslations.en === 'object'
      ? (rawTranslations.en as Record<string, unknown>)
      : null;
  const translationSections = Array.isArray(rawEnglishTranslation?.sections)
    ? rawEnglishTranslation.sections
        .map(toEditorBlock)
        .filter((section): section is EditorBlock => Boolean(section))
    : [];

  return {
    id: null,
    title,
    slug,
    excerpt: typeof raw.excerpt === 'string' ? raw.excerpt : '',
    date:
      typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date)
        ? raw.date
        : getTodayDate(),
    readTime:
      typeof raw.readTime === 'string' && raw.readTime.trim()
        ? raw.readTime
        : '5 min read',
    tags,
    category: typeof raw.category === 'string' ? raw.category : '',
    author:
      typeof raw.author === 'string' && raw.author.trim()
        ? raw.author
        : fallbackAuthor,
    image: typeof raw.image === 'string' ? raw.image : '',
    imageAlt: typeof raw.imageAlt === 'string' ? raw.imageAlt : '',
    status: normalizeDraftStatus(raw.status),
    sections: sections.length > 0 ? sections : [createEmptyBlock('paragraph')],
    translations: {
      en: {
        title:
          typeof rawEnglishTranslation?.title === 'string'
            ? rawEnglishTranslation.title
            : '',
        excerpt:
          typeof rawEnglishTranslation?.excerpt === 'string'
            ? rawEnglishTranslation.excerpt
            : '',
        readTime:
          typeof rawEnglishTranslation?.readTime === 'string'
            ? rawEnglishTranslation.readTime
            : '',
        category:
          typeof rawEnglishTranslation?.category === 'string'
            ? rawEnglishTranslation.category
            : '',
        imageAlt:
          typeof rawEnglishTranslation?.imageAlt === 'string'
            ? rawEnglishTranslation.imageAlt
            : '',
        sections:
          translationSections.length > 0
            ? translationSections
            : [createEmptyBlock('paragraph')],
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

export const parseMarkdownToDraft = (
  markdown: string,
  fallbackAuthor: string,
): ArticleDraft => {
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n').trim();
  const { frontmatter, body } = parseFrontmatter(normalizedMarkdown);
  const lines = body.split('\n');
  const sections: EditorBlock[] = [];

  let title = typeof frontmatter.title === 'string' ? frontmatter.title : '';
  const slug = typeof frontmatter.slug === 'string' ? frontmatter.slug : '';
  let excerpt = '';
  const date =
    typeof frontmatter.date === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date)
      ? frontmatter.date
      : getTodayDate();
  const readTime =
    typeof frontmatter.readTime === 'string'
      ? frontmatter.readTime
      : '5 min read';
  const category =
    typeof frontmatter.category === 'string' ? frontmatter.category : '';
  const author =
    typeof frontmatter.author === 'string' && frontmatter.author.trim()
      ? frontmatter.author
      : fallbackAuthor;
  const status = normalizeDraftStatus(frontmatter.status);
  let image =
    typeof frontmatter.coverImage === 'string' ? frontmatter.coverImage : '';
  let imageAlt =
    typeof frontmatter.coverImageAlt === 'string'
      ? frontmatter.coverImageAlt
      : '';
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
    while (
      index < lines.length
      && !isBlank(lines[index])
      && !isDivider(lines[index])
      && !isHeading(lines[index])
      && !isListItem(lines[index])
      && !isCodeFence(lines[index])
      && !isImage(lines[index])
      && !isQuote(lines[index])
    ) {
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
        content: titleMatch
          ? quoteLines.slice(1).join('\n').trim()
          : quoteLines.join('\n').trim(),
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

    if (
      /^\*\*(.+)\*\*$/.test(trimmed)
      && index + 1 < lines.length
      && isCodeFence(lines[index + 1])
    ) {
      const fileName = trimmed.replace(/^\*\*|\*\*$/g, '').trim();
      const language =
        lines[index + 1].trim().replace(/^```/, '').trim() || 'txt';
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
    while (
      index < lines.length
      && !isBlank(lines[index])
      && !isDivider(lines[index])
      && !isHeading(lines[index])
      && !isListItem(lines[index])
      && !isCodeFence(lines[index])
      && !isImage(lines[index])
      && !isQuote(lines[index])
    ) {
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
