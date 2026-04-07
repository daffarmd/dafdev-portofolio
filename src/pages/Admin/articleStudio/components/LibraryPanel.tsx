import type { ChangeEvent } from 'react';
import { Download, Eye, FileText, Plus, Search, Trash2, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Article } from '../../../../types';
import { DRAFT_IMPORT_ACCEPT } from '../constants';
import type { ArticleFilter, ArticleFilterTab } from '../types';

type LibraryPanelProps = {
  articleFilter: ArticleFilter;
  articleFilterTabs: ArticleFilterTab[];
  currentDraftId: string | null;
  filteredArticles: Article[];
  isOpen: boolean;
  libraryQuery: string;
  loading: boolean;
  publishedCount: number;
  storyStateLabel: string;
  storyStatusClassName: string;
  totalStories: number;
  onArticleFilterChange: (filter: ArticleFilter) => void;
  onCreateNew: () => void;
  onDeleteArticle: (article: Article) => Promise<void> | void;
  onExportLibrary: () => void;
  onGenerateSlug: () => void;
  onImportInputChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => Promise<void> | void;
  onLibraryQueryChange: (value: string) => void;
  onLoadArticle: (article: Article) => void;
};

const LibraryPanel = ({
  articleFilter,
  articleFilterTabs,
  currentDraftId,
  filteredArticles,
  isOpen,
  libraryQuery,
  loading,
  publishedCount,
  storyStateLabel,
  storyStatusClassName,
  totalStories,
  onArticleFilterChange,
  onCreateNew,
  onDeleteArticle,
  onExportLibrary,
  onGenerateSlug,
  onImportInputChange,
  onLibraryQueryChange,
  onLoadArticle,
}: LibraryPanelProps) => (
  <aside
    id="studio-library"
    className={`studio-medium-support-panel ${isOpen ? '' : 'hidden'}`}
  >
    <section className="studio-medium-panel studio-medium-panel-library">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="studio-medium-kicker">Story desk</p>
          <h2 className="studio-medium-panel-title">Library and workflow</h2>
          <p className="studio-medium-panel-copy">
            Pull an existing story into focus, start a new draft, or branch
            from a built-in template.
          </p>
        </div>
        <span className={`studio-medium-draft-label ${storyStatusClassName}`}>
          {storyStateLabel}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          onClick={onCreateNew}
          className="studio-medium-publish-button w-full justify-center"
        >
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
            onChange={(event) => void onImportInputChange(event)}
          />
        </label>
        <button
          type="button"
          onClick={onGenerateSlug}
          className="studio-medium-toolbar-button w-full justify-center"
        >
          <FileText className="h-4 w-4" />
          Generate slug
        </button>
        <button
          type="button"
          onClick={onExportLibrary}
          className="studio-medium-toolbar-button w-full justify-center"
        >
          <Download className="h-4 w-4" />
          Export JSON
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="studio-medium-mini-stat">
          <span className="studio-medium-mini-label">Stories</span>
          <strong>{totalStories}</strong>
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
          onChange={(event) => onLibraryQueryChange(event.target.value)}
          placeholder="Search title, slug, tag, or category"
          className="studio-medium-search-input"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {articleFilterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onArticleFilterChange(tab.id)}
            className={`studio-medium-filter-chip ${articleFilter === tab.id ? 'studio-medium-filter-chip-active' : ''}`}
          >
            {tab.label}
            <span className="studio-medium-filter-count">{tab.count}</span>
          </button>
        ))}
      </div>
    </section>

    <section className="studio-medium-panel studio-medium-panel-saved">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="studio-medium-kicker">Supabase</p>
          <h2 className="studio-medium-panel-title">Saved stories</h2>
        </div>
        <span className="studio-medium-filter-count">
          {filteredArticles.length}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="studio-medium-empty-state">
            Loading your story library...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="studio-medium-empty-state">
            {libraryQuery.trim()
              ? 'No stories matched the current filter.'
              : 'No stories yet. Start a new draft from the action card above.'}
          </div>
        ) : (
          filteredArticles.map((article) => (
            <article
              key={article.slug}
              className={`studio-medium-story-card ${currentDraftId === article.id ? 'studio-medium-story-card-active' : ''}`}
            >
              <button
                type="button"
                onClick={() => onLoadArticle(article)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`studio-medium-draft-label ${article.status === 'published' ? 'studio-medium-status-live' : 'studio-medium-status-draft'}`}
                  >
                    {article.status ?? 'draft'}
                  </span>
                  <span className="text-xs text-slate-500">{article.date}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold leading-6 text-slate-900">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                  {article.excerpt}
                </p>
                <div className="mt-3 studio-medium-story-meta">
                  <span>{article.category || 'Uncategorized'}</span>
                  <span>{article.readTime}</span>
                </div>
              </button>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/my-notes/${article.slug}`}
                  className="studio-medium-toolbar-button"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => void onDeleteArticle(article)}
                  className="studio-medium-toolbar-button studio-medium-toolbar-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>

    <section className="studio-medium-panel studio-medium-panel-templates">
      <div>
        <p className="studio-medium-kicker">Built-in notes</p>
        <h2 className="studio-medium-panel-title">Templates</h2>
        <p className="studio-medium-panel-copy">
          Built-in article templates have been removed. Create a new draft or
          import content from file instead.
        </p>
      </div>

      <div className="mt-5">
        <div className="studio-medium-empty-state">
          No templates are bundled in the source code anymore.
        </div>
      </div>
    </section>
  </aside>
);

export default LibraryPanel;
