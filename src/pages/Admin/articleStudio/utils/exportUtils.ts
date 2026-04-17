import type { ArticleDraft } from '../types';
import {
  splitTableCells,
  tableToMarkdown,
} from '../../../../lib/articleTable';
import { slugify } from './draftUtils';

export const downloadJson = (fileName: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();

  URL.revokeObjectURL(objectUrl);
};

export const downloadText = (
  fileName: string,
  data: string,
  mimeType = 'text/plain;charset=utf-8',
) => {
  const blob = new Blob([data], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();

  URL.revokeObjectURL(objectUrl);
};

export const getDraftExportBaseName = (draft: ArticleDraft) =>
  slugify(draft.slug || draft.title || 'untitled-story');

const escapeMarkdown = (value: string) =>
  value.replace(/([*_`[\]])/g, '\\$1');

export const draftToMarkdown = (draft: ArticleDraft) => {
  const tags = draft.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
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
    ...(tags.length > 0
      ? tags.map((tag) => `  - "${tag.replace(/"/g, '\\"')}"`)
      : ['  - ""']),
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
    lines.push(
      `![${draft.imageAlt.trim() || draft.title.trim() || 'cover image'}](${draft.image.trim()})`,
      '',
    );
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
      const items = section.itemsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

      if (items.length > 0) {
        lines.push(...items.map((item) => `- ${item}`), '');
      }
      return;
    }

    if (section.type === 'table') {
      const headers = splitTableCells(section.tableHeaders);
      const rows = section.tableRows
        .split('\n')
        .map((row) => row.trim())
        .filter(Boolean)
        .map((row) => splitTableCells(row));

      const tableMarkdown = tableToMarkdown(headers, rows);
      if (tableMarkdown) {
        lines.push(tableMarkdown, '');
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

    if (
      section.type === 'highlight'
      && (section.title.trim() || section.content.trim())
    ) {
      if (section.title.trim()) {
        lines.push(`> **${section.title.trim()}**`);
      }
      if (section.content.trim()) {
        lines.push(
          ...section.content.trim().split('\n').map((line) => `> ${line}`),
        );
      }
      lines.push('');
    }
  });

  return lines.join('\n').trimEnd();
};
