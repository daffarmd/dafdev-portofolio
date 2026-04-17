import type { RefObject } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  FileText,
  ImageUp,
  Plus,
  Settings2,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ArticleBlock } from '../../../../types';
import { EDITOR_LANGUAGES, blockTypeLabel } from '../constants';
import type {
  ArticleStudioNotice,
  EditorBlock,
  EditorLanguage,
  InsertMenuAnchor,
} from '../types';
import BlockFields from './BlockFields';
import InsertMenu from './InsertMenu';

type EditorCanvasProps = {
  activeExcerpt: string;
  activeImageAlt: string;
  activeLanguageLabel: string;
  activeSections: EditorBlock[];
  activeTitle: string;
  canDeleteCurrent: boolean;
  canPreview: boolean;
  coverImage: string;
  draftTitle: string;
  editorLanguage: EditorLanguage;
  englishHasContent: boolean;
  englishReady: boolean;
  englishStateLabel: string;
  error: string | null;
  estimatedReadLabel: string;
  insertMenuAnchor: InsertMenuAnchor;
  notice: ArticleStudioNotice | null;
  noticeClassName: string;
  previewPath: string;
  storyStateLabel: string;
  storyStatusClassName: string;
  syncLabel: string;
  titleTextareaRef: RefObject<HTMLTextAreaElement | null>;
  uploadingBlockId: string | null;
  wordCountEstimate: number;
  onBlockChange: (blockId: string, updates: Partial<EditorBlock>) => void;
  onBlockImageUpload: (blockId: string, file: File | null) => Promise<void> | void;
  onCoverUpload: (file: File | null) => Promise<void> | void;
  onDeleteCurrentArticle: () => Promise<void> | void;
  onEditorLanguageChange: (language: EditorLanguage) => void;
  onExportLibrary: () => void;
  onGenerateSlug: () => void;
  onInsertBlock: (afterBlockId: string | null, type: ArticleBlock['type']) => void;
  onMoveBlock: (blockId: string, direction: 'up' | 'down') => void;
  onOpenSettings: () => void;
  onPreviewRouteClick: () => void;
  onRemoveBlock: (blockId: string) => void;
  onTitleChange: (value: string, textarea: HTMLTextAreaElement) => void;
  onToggleInsertMenu: (anchorId: string | 'start') => void;
  onUpdateExcerpt: (value: string) => void;
};

const EditorCanvas = ({
  activeExcerpt,
  activeImageAlt,
  activeLanguageLabel,
  activeSections,
  activeTitle,
  canDeleteCurrent,
  canPreview,
  coverImage,
  draftTitle,
  editorLanguage,
  englishHasContent,
  englishReady,
  englishStateLabel,
  error,
  estimatedReadLabel,
  insertMenuAnchor,
  notice,
  noticeClassName,
  previewPath,
  storyStateLabel,
  storyStatusClassName,
  syncLabel,
  titleTextareaRef,
  uploadingBlockId,
  wordCountEstimate,
  onBlockChange,
  onBlockImageUpload,
  onCoverUpload,
  onDeleteCurrentArticle,
  onEditorLanguageChange,
  onExportLibrary,
  onGenerateSlug,
  onInsertBlock,
  onMoveBlock,
  onOpenSettings,
  onPreviewRouteClick,
  onRemoveBlock,
  onTitleChange,
  onToggleInsertMenu,
  onUpdateExcerpt,
}: EditorCanvasProps) => (
  <main className="studio-medium-editor-main">
    {notice && notice.tone !== 'neutral' ? (
      <div className={noticeClassName}>{notice.message}</div>
    ) : null}

    {error ? (
      <div className="studio-medium-notice studio-medium-notice-error">
        {error}
      </div>
    ) : null}

    <section className="studio-medium-canvas">
      <div className="studio-medium-meta-strip">
        <span className={`studio-medium-draft-label ${storyStatusClassName}`}>
          {storyStateLabel}
        </span>
        <span className="studio-medium-meta-pill">
          {activeSections.length} block{activeSections.length === 1 ? '' : 's'}
        </span>
        <span className="studio-medium-meta-pill">{wordCountEstimate} words</span>
        <span className="studio-medium-meta-pill">{estimatedReadLabel}</span>
        <span className="studio-medium-meta-pill">{syncLabel}</span>
      </div>

      <div className="studio-medium-language-strip">
        <div className="studio-medium-language-tabs">
          {EDITOR_LANGUAGES.map((language) => (
            <button
              key={language}
              type="button"
              onClick={() => onEditorLanguageChange(language)}
              className={`studio-medium-language-tab ${editorLanguage === language ? 'studio-medium-language-tab-active' : ''}`}
            >
              {language.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="studio-medium-language-meta">
          <span className="studio-medium-language-copy">{activeLanguageLabel}</span>
          <span
            className={`studio-medium-language-badge ${englishReady ? 'studio-medium-language-badge-ready' : englishHasContent ? 'studio-medium-language-badge-pending' : ''}`}
          >
            {englishStateLabel}
          </span>
        </div>
      </div>

      <textarea
        ref={titleTextareaRef}
        value={activeTitle}
        onChange={(event) => onTitleChange(event.target.value, event.currentTarget)}
        className="studio-medium-title-input"
        placeholder={editorLanguage === 'en' ? 'English title' : 'Title'}
        rows={1}
        spellCheck
      />

      <textarea
        value={activeExcerpt}
        onChange={(event) => onUpdateExcerpt(event.target.value)}
        className="studio-medium-dek-input"
        placeholder={editorLanguage === 'en'
          ? 'Write the English summary so readers know what this story is about.'
          : 'Write a short dek or opening summary so readers know what this story is about.'}
        spellCheck
      />

      <div className="studio-medium-cover-preview studio-medium-cover-preview-hero">
        {coverImage ? (
          <img
            src={coverImage}
            alt={activeImageAlt || activeTitle || draftTitle || 'Cover preview'}
            className="studio-medium-cover-image"
          />
        ) : (
          <div className="studio-medium-cover-empty">
            <ImageUp className="h-8 w-8" />
            <p className="studio-medium-cover-empty-title">No cover image yet</p>
            <p className="studio-medium-cover-empty-copy">
              Upload an image or paste a URL from settings to give the story a
              visual entry point.
            </p>
          </div>
        )}
      </div>

      <div className="studio-medium-cover-toolbar">
        <label
          className="studio-medium-cover-action cursor-pointer"
          aria-label="Upload cover image"
        >
          <ImageUp className="h-4 w-4" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => void onCoverUpload(event.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="button"
          onClick={onOpenSettings}
          className="studio-medium-cover-action"
          aria-label="Open settings"
        >
          <Settings2 className="h-4 w-4" />
        </button>
        {canPreview ? (
          <Link
            to={previewPath}
            onClick={onPreviewRouteClick}
            className="studio-medium-cover-action"
            aria-label="Preview story"
          >
            <Eye className="h-4 w-4" />
          </Link>
        ) : null}
        <button
          type="button"
          onClick={onGenerateSlug}
          className="studio-medium-cover-action"
          aria-label="Generate slug"
        >
          <FileText className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onExportLibrary}
          className="studio-medium-cover-action"
          aria-label="Export library"
        >
          <Download className="h-4 w-4" />
        </button>
        {canDeleteCurrent ? (
          <button
            type="button"
            onClick={() => void onDeleteCurrentArticle()}
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
            onClick={() => onToggleInsertMenu('start')}
            className="studio-medium-insert-anchor"
            aria-label="Insert the first block"
          >
            <Plus className="h-4 w-4" />
          </button>
          <InsertMenu
            anchorId="start"
            isOpen={insertMenuAnchor === 'start'}
            afterBlockId={null}
            onInsertBlock={onInsertBlock}
          />
        </div>
        <div className="min-w-0">
          <p className="studio-medium-kicker">Start writing</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Start with a paragraph, heading, list, table, image, code block,
            or highlight without leaving the main writing lane.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {activeSections.map((section, index) => (
          <div key={section.id} className="studio-medium-block-shell">
            <div className="studio-medium-block-rail">
              <button
                type="button"
                onClick={() => onToggleInsertMenu(section.id)}
                className="studio-medium-insert-anchor"
                aria-label={`Insert a block after block ${index + 1}`}
              >
                <Plus className="h-4 w-4" />
              </button>
              <InsertMenu
                anchorId={section.id}
                isOpen={insertMenuAnchor === section.id}
                afterBlockId={section.id}
                onInsertBlock={onInsertBlock}
              />
            </div>

            <div className="studio-medium-block-card">
              <div className="studio-medium-block-toolbar">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="studio-medium-block-type">
                    {blockTypeLabel[section.type]}
                  </span>
                  <span className="text-sm text-slate-400">
                    Section {index + 1}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onMoveBlock(section.id, 'up')}
                    className="studio-medium-toolbar-button"
                    aria-label="Move block up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveBlock(section.id, 'down')}
                    className="studio-medium-toolbar-button"
                    aria-label="Move block down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveBlock(section.id)}
                    className="studio-medium-toolbar-button studio-medium-toolbar-danger"
                    aria-label="Delete block"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <BlockFields
                block={section}
                editorLanguage={editorLanguage}
                index={index}
                uploadingBlockId={uploadingBlockId}
                onBlockChange={onBlockChange}
                onBlockImageUpload={onBlockImageUpload}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="studio-medium-route-note">
        <p className="studio-medium-kicker">Narrative route</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your story will be published at{' '}
          <span className="font-semibold text-slate-900">{previewPath}</span>
        </p>
      </div>
    </section>
  </main>
);

export default EditorCanvas;
