import type { ChangeEvent } from 'react';
import { Copy, Download, Eye, FileText, Save, Trash2, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Article, ArticleStatus } from '../../../../types';
import { CATEGORY_OPTIONS, DRAFT_IMPORT_ACCEPT } from '../constants';
import type {
  ArticleDraft,
  DraftFieldUpdater,
  EditorLanguage,
  LocalizedDraftField,
} from '../types';

type SettingsPanelProps = {
  activeCategory: string;
  activeImageAlt: string;
  activeReadTime: string;
  canDeleteCurrent: boolean;
  canPreview: boolean;
  currentArticle: Article | null;
  draft: ArticleDraft;
  draftTags: string[];
  editorLanguage: EditorLanguage;
  isOpen: boolean;
  isSaving: boolean;
  isUploadingCover: boolean;
  metaDescriptionPreview: string;
  metaTitlePreview: string;
  previewPath: string;
  onCopyDraftMarkdown: () => Promise<void> | void;
  onCoverUpload: (file: File | null) => Promise<void> | void;
  onDeleteCurrentArticle: () => Promise<void> | void;
  onDraftChange: DraftFieldUpdater;
  onExportDraftJson: () => void;
  onExportDraftMarkdown: () => void;
  onGenerateSlug: () => void;
  onImportInputChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => Promise<void> | void;
  onLocalizedFieldChange: (field: LocalizedDraftField, value: string) => void;
  onPreviewRouteClick: () => void;
  onPublishArticle: () => Promise<void> | void;
  onResetDraft: () => void;
};

const SettingsPanel = ({
  activeCategory,
  activeImageAlt,
  activeReadTime,
  canDeleteCurrent,
  canPreview,
  currentArticle,
  draft,
  draftTags,
  editorLanguage,
  isOpen,
  isSaving,
  isUploadingCover,
  metaDescriptionPreview,
  metaTitlePreview,
  previewPath,
  onCopyDraftMarkdown,
  onCoverUpload,
  onDeleteCurrentArticle,
  onDraftChange,
  onExportDraftJson,
  onExportDraftMarkdown,
  onGenerateSlug,
  onImportInputChange,
  onLocalizedFieldChange,
  onPreviewRouteClick,
  onPublishArticle,
  onResetDraft,
}: SettingsPanelProps) => (
  <aside
    id="studio-settings"
    className={`studio-medium-support-panel ${isOpen ? '' : 'hidden'}`}
  >
    <datalist id="article-category-options">
      {CATEGORY_OPTIONS.map((option) => (
        <option key={option} value={option} />
      ))}
    </datalist>

    <section className="studio-medium-panel studio-medium-panel-muted studio-medium-panel-meta">
      <div>
        <p className="studio-medium-kicker">Story settings</p>
        <h2 className="studio-medium-panel-title">Metadata</h2>
        <p className="studio-medium-panel-copy">
          Keep publishing fields separate from the writing canvas so the editor
          stays focused.
        </p>
        <p className="studio-medium-helper mt-3">
          Slug, date, author, tags, and cover image are shared. Read time,
          category, alt text, and body follow the active language tab.
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="studio-medium-field">
          <span className="studio-medium-label">Slug</span>
          <input
            type="text"
            value={draft.slug}
            onChange={(event) => onDraftChange('slug', event.target.value)}
            className="studio-medium-text-input"
            placeholder="mengenal-conventional-commit-message"
          />
        </label>

        <button
          type="button"
          onClick={onGenerateSlug}
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
              onChange={(event) =>
                onDraftChange('status', event.target.value as ArticleStatus)}
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
              onChange={(event) => onDraftChange('date', event.target.value)}
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
              onChange={(event) =>
                onLocalizedFieldChange('readTime', event.target.value)}
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
              onChange={(event) =>
                onLocalizedFieldChange('category', event.target.value)}
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
            onChange={(event) => onDraftChange('author', event.target.value)}
            className="studio-medium-text-input"
            placeholder="Muhammad Daffa Ramadhan"
          />
        </label>

        <label className="studio-medium-field">
          <span className="studio-medium-label">Tags</span>
          <input
            type="text"
            value={draft.tags}
            onChange={(event) => onDraftChange('tags', event.target.value)}
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

    <section className="studio-medium-panel studio-medium-panel-cover">
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
            onChange={(event) => onDraftChange('image', event.target.value)}
            className="studio-medium-text-input"
            placeholder="https://..."
          />
        </label>

        <label className="studio-medium-field">
          <span className="studio-medium-label">
            Cover image alt ({editorLanguage.toUpperCase()})
          </span>
          <input
            type="text"
            value={activeImageAlt}
            onChange={(event) =>
              onLocalizedFieldChange('imageAlt', event.target.value)}
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
            onChange={(event) =>
              void onCoverUpload(event.target.files?.[0] ?? null)}
          />
        </label>

        <p className="studio-medium-helper">
          The uploaded file will go to the public cover bucket in Supabase
          Storage.
        </p>
      </div>
    </section>

    <section className="studio-medium-panel studio-medium-panel-preview">
      <div>
        <p className="studio-medium-kicker">SEO preview</p>
        <h2 className="studio-medium-panel-title">What the note will show</h2>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4 shadow-[0_16px_50px_-38px_rgba(15,23,42,0.22)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-700">
          Route
        </p>
        <p className="mt-2 break-all text-sm font-medium text-slate-600">
          {previewPath}
        </p>
        <h3 className="mt-5 text-lg font-semibold leading-tight text-slate-900">
          {metaTitlePreview}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {metaDescriptionPreview}
        </p>
      </div>
    </section>

    <section className="studio-medium-panel studio-medium-panel-finalize">
      <div>
        <p className="studio-medium-kicker">Publishing actions</p>
        <h2 className="studio-medium-panel-title">Finalize</h2>
      </div>

      <div className="mt-5 grid gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="studio-medium-toolbar-button w-full justify-center"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save article'}
        </button>
        <button
          type="button"
          onClick={() => void onPublishArticle()}
          disabled={isSaving}
          className="studio-medium-publish-button w-full justify-center"
        >
          {draft.status === 'published' ? 'Update publication' : 'Publish story'}
        </button>
        {canPreview ? (
          <Link
            to={previewPath}
            onClick={onPreviewRouteClick}
            className="studio-medium-toolbar-button w-full justify-center"
          >
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
            onChange={(event) => void onImportInputChange(event)}
          />
        </label>
        <button
          type="button"
          onClick={onExportDraftJson}
          className="studio-medium-toolbar-button w-full justify-center"
        >
          <Download className="h-4 w-4" />
          Export draft JSON
        </button>
        <button
          type="button"
          onClick={onExportDraftMarkdown}
          className="studio-medium-toolbar-button w-full justify-center"
        >
          <FileText className="h-4 w-4" />
          Export draft Markdown
        </button>
        <button
          type="button"
          onClick={() => void onCopyDraftMarkdown()}
          className="studio-medium-toolbar-button w-full justify-center"
        >
          <Copy className="h-4 w-4" />
          Copy Markdown
        </button>
        <button
          type="button"
          onClick={onResetDraft}
          className="studio-medium-toolbar-button w-full justify-center"
        >
          Reset form
        </button>
        {canDeleteCurrent ? (
          <button
            type="button"
            onClick={() => void onDeleteCurrentArticle()}
            className="studio-medium-toolbar-button studio-medium-toolbar-danger w-full justify-center"
          >
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
          Fresh draft mode. Shape the story in the center canvas, then publish
          when the metadata is ready.
        </div>
      )}
    </section>
  </aside>
);

export default SettingsPanel;
