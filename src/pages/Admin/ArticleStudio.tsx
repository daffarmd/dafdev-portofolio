import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Article, ArticleBlock, ArticleStatus } from '../../types';
import { useArticles } from '../../hooks/useArticles';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import {
  deleteAdminArticle,
  saveAdminArticle,
  uploadArticleAsset,
} from '../../services/articleService';
import EditorCanvas from './articleStudio/components/EditorCanvas';
import HelperDock from './articleStudio/components/HelperDock';
import LibraryPanel from './articleStudio/components/LibraryPanel';
import SettingsPanel from './articleStudio/components/SettingsPanel';
import TopBar from './articleStudio/components/TopBar';
import type {
  ArticleDraft,
  ArticleFilter,
  ArticleFilterTab,
  ArticleStudioNotice,
  DraftFieldUpdater,
  EditorBlock,
  EditorLanguage,
  LocalizedDraftField,
  SupportPanelId,
  TranslationEditorDraft,
} from './articleStudio/types';
import {
  articleToDraft,
  buildArticleInput,
  countWords,
  createEmptyBlock,
  createEmptyDraft,
  createEmptyTranslationDraft,
  getBlockPlainText,
  getInitials,
  slugify,
  validateDraft,
  validateEditorSections,
} from './articleStudio/utils/draftUtils';
import {
  downloadJson,
  downloadText,
  draftToMarkdown,
  getDraftExportBaseName,
} from './articleStudio/utils/exportUtils';
import {
  normalizeImportedDraft,
  parseMarkdownToDraft,
} from './articleStudio/utils/importUtils';

const INITIAL_NOTICE: ArticleStudioNotice = {
  tone: 'neutral',
  message:
    'Supabase sync aktif. Gunakan editor ini untuk menulis, mengelola, dan menerbitkan artikel langsung dari dashboard.',
};

const ArticleStudio = () => {
  const { articles: adminArticles, loading, error } = useArticles({
    scope: 'admin',
  });
  const { user, profile } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [draft, setDraft] = useState<ArticleDraft>(() =>
    createEmptyDraft(
      profile?.fullName || profile?.email || 'Muhammad Daffa Ramadhan',
    ),
  );
  const [notice, setNotice] = useState<ArticleStudioNotice | null>(INITIAL_NOTICE);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const [libraryQuery, setLibraryQuery] = useState('');
  const [articleFilter, setArticleFilter] = useState<ArticleFilter>('all');
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [insertMenuAnchor, setInsertMenuAnchor] = useState<
    string | 'start' | null
  >(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelperVisible, setIsHelperVisible] = useState(true);
  const [editorLanguage, setEditorLanguage] = useState<EditorLanguage>('id');
  const titleTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const defaultAuthor =
    profile?.fullName || profile?.email || 'Muhammad Daffa Ramadhan';

  const ensureEnglishTranslationDraft = (
    current: ArticleDraft,
  ): TranslationEditorDraft =>
    current.translations?.en ?? createEmptyTranslationDraft();

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

  const showNotice = (tone: ArticleStudioNotice['tone'], message: string) => {
    setNotice({ tone, message });
  };

  const showErrorNotice = (errorValue: unknown, fallbackMessage: string) => {
    showNotice(
      'error',
      errorValue instanceof Error ? errorValue.message : fallbackMessage,
    );
  };

  const markDraftDirty = () => {
    setHasPendingChanges(true);
  };

  const updateEnglishTranslationDraft = (
    updater: (current: TranslationEditorDraft) => TranslationEditorDraft,
  ) => {
    markDraftDirty();
    setDraft((current) => ({
      ...current,
      translations: {
        ...(current.translations ?? {}),
        en: updater(ensureEnglishTranslationDraft(current)),
      },
    }));
  };

  const updateActiveSections = (
    updater: (sections: EditorBlock[]) => EditorBlock[],
  ) => {
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

  const revealSupportPanel = (panelId: SupportPanelId) => {
    window.setTimeout(() => {
      document
        .getElementById(panelId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    showNotice(
      'neutral',
      'Fresh draft ready. Isi judul, metadata, lalu mulai menulis isi artikel.',
    );
  };

  const handleDraftChange: DraftFieldUpdater = (field, value) => {
    markDraftDirty();
    const normalizedValue = (
      field === 'slug' && typeof value === 'string'
        ? slugify(value)
        : value
    ) as ArticleDraft[typeof field];

    setDraft((current) => ({
      ...current,
      [field]: normalizedValue,
    }));
  };

  const handleLocalizedFieldChange = (
    field: LocalizedDraftField,
    value: string,
  ) => {
    if (editorLanguage === 'id') {
      handleDraftChange(field, value);
      return;
    }

    updateEnglishTranslationDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleTitleChange = (
    value: string,
    textarea: HTMLTextAreaElement,
  ) => {
    handleLocalizedFieldChange('title', value);
    syncTextareaHeight(textarea);
  };

  const handleBlockChange = (
    blockId: string,
    updates: Partial<EditorBlock>,
  ) => {
    updateActiveSections((sections) =>
      sections.map((section) =>
        section.id === blockId ? { ...section, ...updates } : section,
      ),
    );
  };

  const insertBlockAt = (
    afterBlockId: string | null,
    type: ArticleBlock['type'],
  ) => {
    updateActiveSections((currentSections) => {
      const nextBlock = createEmptyBlock(type);
      const nextSections = [...currentSections];

      if (!afterBlockId) {
        nextSections.unshift(nextBlock);
      } else {
        const index = nextSections.findIndex(
          (section) => section.id === afterBlockId,
        );
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
    const lastBlockId =
      activeSections.length > 0 ? activeSections[activeSections.length - 1].id : null;
    insertBlockAt(lastBlockId, type);
    setInsertMenuAnchor(null);
  };

  const handleInsertBlockAfter = (
    afterBlockId: string | null,
    type: ArticleBlock['type'],
  ) => {
    insertBlockAt(afterBlockId, type);
    setInsertMenuAnchor(null);
  };

  const handleToggleInsertMenu = (anchorId: string | 'start') => {
    setInsertMenuAnchor((current) => (current === anchorId ? null : anchorId));
  };

  const handleRemoveBlock = (blockId: string) => {
    setInsertMenuAnchor((current) => (current === blockId ? null : current));
    updateActiveSections((sections) => {
      const remainingSections = sections.filter((section) => section.id !== blockId);
      return remainingSections.length > 0
        ? remainingSections
        : [createEmptyBlock('paragraph')];
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
    showNotice('neutral', `Editing "${article.title}" from Supabase.`);
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
      showNotice('success', `Artikel "${article.title}" dihapus dari database.`);
    } catch (deleteError) {
      showErrorNotice(deleteError, 'Gagal menghapus artikel.');
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
    showNotice('success', 'Database article export berhasil dibuat.');
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
      sections:
        englishTranslation.sections.length > 0
          ? englishTranslation.sections
          : draft.sections,
      translations: undefined,
    };
  };

  const handleExportDraftJson = () => {
    const fileName = `${getDraftExportBaseName(draft)}.article.json`;
    downloadJson(fileName, buildArticleInput(draft));
    showNotice('success', `Draft aktif berhasil diexport ke ${fileName}.`);
  };

  const handleExportDraftMarkdown = () => {
    const activeDraft = buildActiveMarkdownDraft();
    const fileName = `${getDraftExportBaseName(activeDraft)}${editorLanguage === 'en' ? '-en' : ''}.md`;
    downloadText(
      fileName,
      draftToMarkdown(activeDraft),
      'text/markdown;charset=utf-8',
    );
    showNotice('success', `Draft aktif berhasil diexport ke ${fileName}.`);
  };

  const handleCopyDraftMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(
        draftToMarkdown(buildActiveMarkdownDraft()),
      );
      showNotice(
        'success',
        'Markdown draft aktif berhasil dicopy ke clipboard.',
      );
    } catch (copyError) {
      showErrorNotice(copyError, 'Gagal copy markdown ke clipboard.');
    }
  };

  const applyImportedDraft = (nextDraft: ArticleDraft, sourceLabel: string) => {
    setDraft({
      ...nextDraft,
      id: null,
      author: nextDraft.author.trim() || defaultAuthor,
      sections:
        nextDraft.sections.length > 0
          ? nextDraft.sections
          : [createEmptyBlock('paragraph')],
    });
    setHasPendingChanges(true);
    setLastSavedAt(null);
    setInsertMenuAnchor(null);
    setIsLibraryOpen(false);
    setIsSettingsOpen(false);
    setIsHelperVisible(true);
    setEditorLanguage('id');
    showNotice(
      'success',
      `Draft dari ${sourceLabel} berhasil diimport. Review isi lalu simpan ke Supabase.`,
    );
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
      } else if (
        lowerFileName.endsWith('.md')
        || lowerFileName.endsWith('.markdown')
        || file.type.includes('markdown')
      ) {
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
      showErrorNotice(importError, 'Gagal import draft dari file.');
    }
  };

  const handleImportInputChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0] ?? null;
    await handleImportDraftFile(file);
    input.value = '';
  };

  const persistDraft = async (nextStatus: ArticleStatus = draft.status) => {
    const nextDraft =
      nextStatus === draft.status ? draft : { ...draft, status: nextStatus };
    const validationMessage = validateDraft(nextDraft, adminArticles);

    if (validationMessage) {
      showNotice('error', validationMessage);
      return;
    }

    setIsSaving(true);

    try {
      const savedArticle = await saveAdminArticle(
        buildArticleInput(nextDraft),
        user?.id ?? null,
      );
      setDraft(articleToDraft(savedArticle));
      setHasPendingChanges(false);
      setLastSavedAt(new Date().toISOString());
      setInsertMenuAnchor(null);
      showNotice(
        'success',
        savedArticle.status === 'published'
          ? `Artikel "${savedArticle.title}" berhasil dipublish ke Supabase.`
          : `Draft "${savedArticle.title}" berhasil disimpan ke Supabase.`,
      );
    } catch (saveError) {
      showErrorNotice(saveError, 'Gagal menyimpan artikel.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
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
      showNotice('success', 'Cover image berhasil diupload.');
    } catch (uploadError) {
      showErrorNotice(uploadError, 'Gagal upload cover image.');
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
      showNotice('success', 'Inline image berhasil diupload.');
    } catch (uploadError) {
      showErrorNotice(uploadError, 'Gagal upload inline image.');
    } finally {
      setUploadingBlockId(null);
    }
  };

  const handlePreviewRouteClick = () => {
    window.localStorage.setItem('articleLanguage', editorLanguage);
  };

  const handleToggleLibrary = () => {
    const nextOpen = !isLibraryOpen;
    setIsLibraryOpen(nextOpen);

    if (nextOpen) {
      setIsSettingsOpen(false);
      revealSupportPanel('studio-library');
    }
  };

  const handleToggleSettings = () => {
    const nextOpen = !isSettingsOpen;
    setIsSettingsOpen(nextOpen);

    if (nextOpen) {
      setIsLibraryOpen(false);
      revealSupportPanel('studio-settings');
    }
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
    setIsLibraryOpen(false);
    revealSupportPanel('studio-settings');
  };

  const publishedCount = adminArticles.filter(
    (article) => article.status === 'published',
  ).length;
  const draftCount = adminArticles.filter(
    (article) => article.status !== 'published',
  ).length;
  const currentArticle =
    adminArticles.find((article) => article.id === draft.id) ?? null;
  const englishTranslationDraft = ensureEnglishTranslationDraft(draft);
  const activeTitle =
    editorLanguage === 'id' ? draft.title : englishTranslationDraft.title;
  const activeExcerpt =
    editorLanguage === 'id' ? draft.excerpt : englishTranslationDraft.excerpt;
  const activeReadTime =
    editorLanguage === 'id' ? draft.readTime : englishTranslationDraft.readTime;
  const activeCategory =
    editorLanguage === 'id' ? draft.category : englishTranslationDraft.category;
  const activeImageAlt =
    editorLanguage === 'id' ? draft.imageAlt : englishTranslationDraft.imageAlt;
  const activeSections =
    editorLanguage === 'id' ? draft.sections : englishTranslationDraft.sections;
  const draftTags = draft.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  const avatarName = profile?.fullName || profile?.email || 'Admin';
  const avatarInitials = getInitials(avatarName);
  const previewPath = `/my-notes/${draft.slug || 'your-slug'}`;
  const storyStateLabel = draft.status === 'published' ? 'Published' : 'Draft';
  const lastSyncedLabel = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
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
  const metaTitlePreview =
    activeTitle.trim() || 'Your title becomes the meta title preview';
  const metaDescriptionPreview =
    activeExcerpt.trim()
    || 'Your excerpt becomes the meta description preview';
  const wordCountEstimate = countWords(
    [activeTitle, activeExcerpt, ...activeSections.map(getBlockPlainText)].join(
      ' ',
    ),
  );
  const estimatedReadLabel =
    wordCountEstimate > 0
      ? `${Math.max(1, Math.ceil(wordCountEstimate / 220))} min estimate`
      : 'Start writing to estimate';
  const englishSectionValidation = validateEditorSections(
    englishTranslationDraft.sections,
  );
  const englishHasContent = Boolean(
    englishTranslationDraft.title.trim()
      || englishTranslationDraft.excerpt.trim()
      || englishTranslationDraft.readTime.trim()
      || englishTranslationDraft.category.trim()
      || englishTranslationDraft.imageAlt.trim()
      || englishTranslationDraft.sections.some(
        (section) =>
          getBlockPlainText(section).trim() || section.type === 'image',
      ),
  );
  const englishReady = Boolean(
    englishTranslationDraft.title.trim()
      && englishTranslationDraft.excerpt.trim()
      && englishTranslationDraft.readTime.trim()
      && englishTranslationDraft.category.trim()
      && englishTranslationDraft.imageAlt.trim()
      && !englishSectionValidation,
  );
  const englishStateLabel = englishReady
    ? 'EN ready'
    : englishHasContent
      ? 'EN incomplete'
      : 'EN empty';
  const activeLanguageLabel =
    editorLanguage === 'id' ? 'Bahasa utama' : 'English translation';
  const storyStatusClassName =
    draft.status === 'published'
      ? 'studio-medium-status-live'
      : hasPendingChanges
        ? 'studio-medium-status-pending'
        : 'studio-medium-status-draft';
  const noticeClassName =
    notice?.tone === 'success'
      ? 'studio-medium-notice studio-medium-notice-success'
      : notice?.tone === 'error'
        ? 'studio-medium-notice studio-medium-notice-error'
        : 'studio-medium-notice studio-medium-notice-neutral';
  const articleFilterTabs: ArticleFilterTab[] = [
    { id: 'all', label: 'All stories', count: adminArticles.length },
    { id: 'draft', label: 'Drafts', count: draftCount },
    { id: 'published', label: 'Published', count: publishedCount },
  ];
  const filteredAdminArticles = adminArticles.filter((article) => {
    const matchesFilter =
      articleFilter === 'all'
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
    ]
      .join(' ')
      .toLowerCase();

    return matchesFilter && haystack.includes(normalizedQuery);
  });

  return (
    <div className="studio-medium-shell">
      <div className="studio-medium-frame">
        <TopBar
          avatarInitials={avatarInitials}
          canPreview={Boolean(draft.slug)}
          darkMode={darkMode}
          isSaving={isSaving}
          previewPath={previewPath}
          publishLabel={draft.status === 'published' ? 'Update' : 'Publish'}
          saveStateLabel={saveStateLabel}
          storyStateLabel={storyStateLabel}
          storyStatusClassName={storyStatusClassName}
          onExportLibrary={handleExport}
          onPreviewRouteClick={handlePreviewRouteClick}
          onPublish={() => void persistDraft('published')}
          onToggleLibrary={handleToggleLibrary}
          onToggleSettings={handleToggleSettings}
          onToggleTheme={toggleDarkMode}
        />

        <div className="studio-medium-layout">
          <LibraryPanel
            articleFilter={articleFilter}
            articleFilterTabs={articleFilterTabs}
            currentDraftId={draft.id}
            filteredArticles={filteredAdminArticles}
            isOpen={isLibraryOpen}
            libraryQuery={libraryQuery}
            loading={loading}
            publishedCount={publishedCount}
            storyStateLabel={storyStateLabel}
            storyStatusClassName={storyStatusClassName}
            totalStories={adminArticles.length}
            onArticleFilterChange={setArticleFilter}
            onCreateNew={resetDraft}
            onDeleteArticle={handleDeleteArticle}
            onExportLibrary={handleExport}
            onGenerateSlug={() => handleDraftChange('slug', draft.title)}
            onImportInputChange={handleImportInputChange}
            onLibraryQueryChange={setLibraryQuery}
            onLoadArticle={handleLoadAdminArticle}
          />

          <form className="studio-medium-editor-form" onSubmit={handleSave}>
            <EditorCanvas
              activeExcerpt={activeExcerpt}
              activeImageAlt={activeImageAlt}
              activeLanguageLabel={activeLanguageLabel}
              activeSections={activeSections}
              activeTitle={activeTitle}
              canDeleteCurrent={Boolean(draft.id)}
              canPreview={Boolean(draft.slug)}
              coverImage={draft.image}
              draftTitle={draft.title}
              editorLanguage={editorLanguage}
              englishHasContent={englishHasContent}
              englishReady={englishReady}
              englishStateLabel={englishStateLabel}
              error={error}
              estimatedReadLabel={estimatedReadLabel}
              insertMenuAnchor={insertMenuAnchor}
              notice={notice}
              noticeClassName={noticeClassName}
              previewPath={previewPath}
              storyStateLabel={storyStateLabel}
              storyStatusClassName={storyStatusClassName}
              syncLabel={syncLabel}
              titleTextareaRef={titleTextareaRef}
              uploadingBlockId={uploadingBlockId}
              wordCountEstimate={wordCountEstimate}
              onBlockChange={handleBlockChange}
              onBlockImageUpload={handleBlockImageUpload}
              onCoverUpload={handleCoverUpload}
              onDeleteCurrentArticle={handleDeleteCurrentArticle}
              onEditorLanguageChange={setEditorLanguage}
              onExportLibrary={handleExport}
              onGenerateSlug={() => handleDraftChange('slug', draft.title)}
              onInsertBlock={handleInsertBlockAfter}
              onMoveBlock={handleMoveBlock}
              onOpenSettings={handleOpenSettings}
              onPreviewRouteClick={handlePreviewRouteClick}
              onRemoveBlock={handleRemoveBlock}
              onTitleChange={handleTitleChange}
              onToggleInsertMenu={handleToggleInsertMenu}
              onUpdateExcerpt={(value) =>
                handleLocalizedFieldChange('excerpt', value)}
            />

            <SettingsPanel
              activeCategory={activeCategory}
              activeImageAlt={activeImageAlt}
              activeReadTime={activeReadTime}
              canDeleteCurrent={Boolean(draft.id)}
              canPreview={Boolean(draft.slug)}
              currentArticle={currentArticle}
              draft={draft}
              draftTags={draftTags}
              editorLanguage={editorLanguage}
              isOpen={isSettingsOpen}
              isSaving={isSaving}
              isUploadingCover={isUploadingCover}
              metaDescriptionPreview={metaDescriptionPreview}
              metaTitlePreview={metaTitlePreview}
              previewPath={previewPath}
              onCopyDraftMarkdown={handleCopyDraftMarkdown}
              onCoverUpload={handleCoverUpload}
              onDeleteCurrentArticle={handleDeleteCurrentArticle}
              onDraftChange={handleDraftChange}
              onExportDraftJson={handleExportDraftJson}
              onExportDraftMarkdown={handleExportDraftMarkdown}
              onGenerateSlug={() => handleDraftChange('slug', draft.title)}
              onImportInputChange={handleImportInputChange}
              onLocalizedFieldChange={handleLocalizedFieldChange}
              onPreviewRouteClick={handlePreviewRouteClick}
              onPublishArticle={() => persistDraft('published')}
              onResetDraft={resetDraft}
            />
          </form>

          <HelperDock
            isSaving={isSaving}
            isVisible={isHelperVisible}
            onAddBlock={handleAddBlock}
            onCopyDraftMarkdown={handleCopyDraftMarkdown}
            onExportDraftJson={handleExportDraftJson}
            onExportDraftMarkdown={handleExportDraftMarkdown}
            onImportInputChange={handleImportInputChange}
            onPersistDraft={() => persistDraft('draft')}
            onReopen={() => setIsHelperVisible(true)}
            onToggleVisibility={() => setIsHelperVisible(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleStudio;
