import { ImageUp } from 'lucide-react';
import type { EditorLanguage } from '../types';
import type { EditorBlock } from '../types';

type BlockFieldsProps = {
  block: EditorBlock;
  editorLanguage: EditorLanguage;
  index: number;
  uploadingBlockId: string | null;
  onBlockChange: (blockId: string, updates: Partial<EditorBlock>) => void;
  onBlockImageUpload: (blockId: string, file: File | null) => Promise<void> | void;
};

const BlockFields = ({
  block,
  editorLanguage,
  index,
  uploadingBlockId,
  onBlockChange,
  onBlockImageUpload,
}: BlockFieldsProps) => {
  const blockPlaceholderLead = editorLanguage === 'en'
    ? 'Write the English version of this section...'
    : 'Tell the story like you are writing a Medium draft...';

  if (block.type === 'paragraph' || block.type === 'heading') {
    return (
      <textarea
        value={block.content}
        onChange={(event) =>
          onBlockChange(block.id, { content: event.target.value })}
        className={
          block.type === 'heading'
            ? 'studio-medium-heading-input'
            : 'studio-medium-body-input'
        }
        placeholder={block.type === 'heading'
          ? editorLanguage === 'en'
            ? 'English subheading'
            : 'Subheading'
          : index === 0
            ? blockPlaceholderLead
            : editorLanguage === 'en'
              ? 'Continue the English translation, keep the meaning consistent, and refine the phrasing here...'
              : 'Continue the narrative, explain the idea, or drop implementation details here...'}
        spellCheck
      />
    );
  }

  if (block.type === 'list') {
    return (
      <div className="studio-medium-field-stack">
        <textarea
          value={block.itemsText}
          onChange={(event) =>
            onBlockChange(block.id, { itemsText: event.target.value })}
          className="studio-medium-body-input studio-medium-body-input-compact"
          placeholder={editorLanguage === 'en'
            ? 'First bullet in English\nSecond bullet in English\nThird bullet in English'
            : 'First bullet\nSecond bullet\nThird bullet'}
          spellCheck
        />
        <p className="studio-medium-helper">
          One line becomes one bullet point in the published article.
        </p>
      </div>
    );
  }

  if (block.type === 'table') {
    return (
      <div className="studio-medium-field-stack">
        <label className="studio-medium-field">
          <span className="studio-medium-label">Table headers</span>
          <input
            type="text"
            value={block.tableHeaders}
            onChange={(event) =>
              onBlockChange(block.id, { tableHeaders: event.target.value })}
            className="studio-medium-text-input"
            placeholder="Name | Role | Notes"
            spellCheck={false}
          />
        </label>

        <label className="studio-medium-field">
          <span className="studio-medium-label">Table rows</span>
          <textarea
            value={block.tableRows}
            onChange={(event) =>
              onBlockChange(block.id, { tableRows: event.target.value })}
            className="studio-medium-table-input"
            placeholder={'Daffa | Developer | Backend\nRara | Designer | UI'}
            spellCheck={false}
          />
        </label>

        <p className="studio-medium-helper">
          Use <span className="font-semibold text-slate-700 dark:text-slate-300">|</span> to separate columns. Every row should follow the same column count as the header.
        </p>
      </div>
    );
  }

  if (block.type === 'image') {
    return (
      <div className="studio-medium-field-stack">
        {block.src ? (
          <div className="studio-medium-inline-preview">
            <img
              src={block.src}
              alt={block.alt || `Inline block ${index + 1}`}
              className="h-60 w-full rounded-[1.35rem] object-cover"
            />
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="studio-medium-field">
            <span className="studio-medium-label">Image URL</span>
            <input
              type="text"
              value={block.src}
              onChange={(event) =>
                onBlockChange(block.id, { src: event.target.value })}
              className="studio-medium-text-input"
              placeholder="https://..."
            />
          </label>

          <label className="studio-medium-field">
            <span className="studio-medium-label">Alt text</span>
            <input
              type="text"
              value={block.alt}
              onChange={(event) =>
                onBlockChange(block.id, { alt: event.target.value })}
              className="studio-medium-text-input"
              placeholder="Describe the image context"
            />
          </label>
        </div>

        <label className="studio-medium-field">
          <span className="studio-medium-label">Caption</span>
          <input
            type="text"
            value={block.caption}
            onChange={(event) =>
              onBlockChange(block.id, { caption: event.target.value })}
            className="studio-medium-text-input"
            placeholder="Optional caption"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <label className="studio-medium-toolbar-button cursor-pointer">
            <ImageUp className="h-4 w-4" />
            {uploadingBlockId === block.id ? 'Uploading...' : 'Upload image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                void onBlockImageUpload(block.id, event.target.files?.[0] ?? null)}
            />
          </label>
          <p className="studio-medium-helper">
            Inline assets go to the Supabase storage bucket for article images.
          </p>
        </div>
      </div>
    );
  }

  if (block.type === 'code') {
    return (
      <div className="studio-medium-field-stack">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="studio-medium-field">
            <span className="studio-medium-label">Language</span>
            <input
              type="text"
              value={block.language}
              onChange={(event) =>
                onBlockChange(block.id, { language: event.target.value })}
              className="studio-medium-text-input"
              placeholder="ts"
            />
          </label>

          <label className="studio-medium-field">
            <span className="studio-medium-label">File name</span>
            <input
              type="text"
              value={block.fileName}
              onChange={(event) =>
                onBlockChange(block.id, { fileName: event.target.value })}
              className="studio-medium-text-input"
              placeholder="article-editor.tsx"
            />
          </label>

          <label className="studio-medium-field">
            <span className="studio-medium-label">Caption</span>
            <input
              type="text"
              value={block.caption}
              onChange={(event) =>
                onBlockChange(block.id, { caption: event.target.value })}
              className="studio-medium-text-input"
              placeholder="Optional context"
            />
          </label>

          <label className="studio-medium-field">
            <span className="studio-medium-label">Command</span>
            <input
              type="text"
              value={block.command}
              onChange={(event) =>
                onBlockChange(block.id, { command: event.target.value })}
              className="studio-medium-text-input"
              placeholder="npm run build"
            />
          </label>
        </div>

        <label className="studio-medium-field">
          <span className="studio-medium-label">Code block</span>
          <textarea
            value={block.code}
            onChange={(event) =>
              onBlockChange(block.id, { code: event.target.value })}
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
          value={block.title}
          onChange={(event) =>
            onBlockChange(block.id, { title: event.target.value })}
          className="studio-medium-text-input"
          placeholder="Key takeaway"
        />
      </label>

      <label className="studio-medium-field">
        <span className="studio-medium-label">Highlight content</span>
        <textarea
          value={block.content}
          onChange={(event) =>
            onBlockChange(block.id, { content: event.target.value })}
          className="studio-medium-body-input studio-medium-body-input-compact"
          placeholder="Summarize the core insight, decision, or next action..."
          spellCheck
        />
      </label>
    </div>
  );
};

export default BlockFields;
