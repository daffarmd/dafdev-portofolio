import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  CopyPlus,
  Download,
  Eye,
  FileText,
  ImageUp,
  LayoutDashboard,
  Moon,
  Plus,
  Save,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Upload,
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
  translations?: Article['translations'];
};

type NoticeTone = 'success' | 'error' | 'neutral';
type ArticleFilter = 'all' | 'draft' | 'published';
type StudioTheme = 'nebula' | 'ink';

const DEFAULT_COVER_IMAGE = '/og-image.png';
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
  image: DEFAULT_COVER_IMAGE,
  imageAlt: '',
  status: 'draft',
  sections: [createEmptyBlock('paragraph')],
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
  image: article.image || DEFAULT_COVER_IMAGE,
  imageAlt: article.imageAlt,
  status: article.status ?? 'draft',
  sections: article.sections.map((section) => {
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
  }),
  translations: article.translations,
  ...overrides,
});

const buildArticleInput = (draft: ArticleDraft) => ({
  id: draft.id,
  title: draft.title.trim(),
  slug: draft.slug.trim(),
  excerpt: draft.excerpt.trim(),
  date: draft.date,
  readTime: draft.readTime.trim(),
  tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
  category: draft.category.trim(),
  author: draft.author.trim(),
  image: draft.image.trim() || DEFAULT_COVER_IMAGE,
  imageAlt: draft.imageAlt.trim() || draft.title.trim(),
  status: draft.status,
  translations: draft.translations,
  sections: draft.sections.map((section) => {
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
  }),
});

const validateDraft = (draft: ArticleDraft, allArticles: Article[]): string | null => {
  if (!draft.title.trim()) {
    return 'Title wajib diisi.';
  }

  if (!draft.slug.trim()) {
    return 'Slug wajib diisi.';
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug.trim())) {
    return 'Slug harus lowercase, tanpa spasi, dan pakai tanda minus.';
  }

  if (allArticles.some((article) => article.slug === draft.slug.trim() && article.id !== draft.id)) {
    return 'Slug sudah dipakai artikel lain.';
  }

  if (!draft.excerpt.trim()) {
    return 'Excerpt wajib diisi.';
  }

  if (!draft.category.trim()) {
    return 'Category wajib diisi.';
  }

  if (!draft.author.trim()) {
    return 'Author wajib diisi.';
  }

  if (!draft.readTime.trim()) {
    return 'Read time wajib diisi.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) {
    return 'Date harus memakai format YYYY-MM-DD.';
  }

  if (draft.sections.length === 0) {
    return 'Tambahkan minimal satu content block.';
  }

  for (const section of draft.sections) {
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

const downloadJson = (fileName: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
};

const getInitials = (value: string) => value
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase() ?? '')
  .join('') || 'AD';

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
  const [studioTheme, setStudioTheme] = useState<StudioTheme>('nebula');
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const defaultAuthor = profile?.fullName || profile?.email || 'Muhammad Daffa Ramadhan';

  const markDraftDirty = () => {
    setHasPendingChanges(true);
  };

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetDraft = () => {
    setDraft(createEmptyDraft(defaultAuthor));
    setHasPendingChanges(false);
    setLastSavedAt(null);
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
    markDraftDirty();
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section) => (
        section.id === blockId
          ? { ...section, ...updates }
          : section
      )),
    }));
  };

  const handleAddBlock = (type: ArticleBlock['type']) => {
    markDraftDirty();
    setDraft((current) => ({
      ...current,
      sections: [...current.sections, createEmptyBlock(type)],
    }));
  };

  const handleRemoveBlock = (blockId: string) => {
    markDraftDirty();
    setDraft((current) => ({
      ...current,
      sections: current.sections.filter((section) => section.id !== blockId),
    }));
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    markDraftDirty();
    setDraft((current) => {
      const index = current.sections.findIndex((section) => section.id === blockId);
      if (index < 0) {
        return current;
      }

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.sections.length) {
        return current;
      }

      const nextSections = [...current.sections];
      const [movedSection] = nextSections.splice(index, 1);
      nextSections.splice(targetIndex, 0, movedSection);

      return {
        ...current,
        sections: nextSections,
      };
    });
  };

  const handleLoadAdminArticle = (article: Article) => {
    setDraft(articleToDraft(article));
    setHasPendingChanges(false);
    setLastSavedAt(article.updatedAt ?? article.publishedAt ?? null);
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

  const handleExport = () => {
    downloadJson('supabase-articles-export.json', adminArticles);
    setNotice({
      tone: 'success',
      message: 'Database article export berhasil dibuat.',
    });
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
  const draftTags = draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  const avatarName = profile?.fullName || profile?.email || 'Admin';
  const avatarInitials = getInitials(avatarName);
  const previewPath = `/my-notes/${draft.slug || 'your-slug'}`;
  const lastSyncedLabel = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;
  const syncLabel = isSaving
    ? 'Syncing to Supabase...'
    : hasPendingChanges
      ? 'Unsaved local changes'
      : lastSyncedLabel
        ? `Last synced at ${lastSyncedLabel}`
        : 'Ready to write';
  const metaTitlePreview = draft.title.trim() || 'Your title becomes the meta title preview';
  const metaDescriptionPreview = draft.excerpt.trim() || 'Your excerpt becomes the meta description preview';
  const noticeClassName = notice?.tone === 'success'
    ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-100'
    : notice?.tone === 'error'
      ? 'border-rose-400/30 bg-rose-500/10 text-rose-100'
      : 'border-white/10 bg-white/5 text-slate-200';
  const articleFilterTabs: Array<{ id: ArticleFilter; label: string; count: number }> = [
    { id: 'all', label: 'All', count: adminArticles.length },
    { id: 'draft', label: 'Draft', count: draftCount },
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

  const renderBlockFields = (section: EditorBlock, index: number) => {
    if (section.type === 'paragraph' || section.type === 'heading') {
      return (
        <label className="studio-admin-field mt-5">
          <span className="studio-admin-label">
            {section.type === 'heading' ? 'Heading text' : 'Paragraph content'}
          </span>
          <textarea
            value={section.content}
            onChange={(event) => handleBlockChange(section.id, { content: event.target.value })}
            className={`studio-admin-textarea ${section.type === 'paragraph' ? 'min-h-[240px]' : 'min-h-[160px]'}`}
            placeholder={section.type === 'heading'
              ? 'Write a section heading...'
              : index === 0
                ? 'Start writing your article...'
                : 'Continue the narrative, explain the idea, or drop implementation details here...'}
          />
        </label>
      );
    }

    if (section.type === 'list') {
      return (
        <label className="studio-admin-field mt-5">
          <span className="studio-admin-label">List items</span>
          <textarea
            value={section.itemsText}
            onChange={(event) => handleBlockChange(section.id, { itemsText: event.target.value })}
            className="studio-admin-textarea min-h-[220px]"
            placeholder={'First bullet\nSecond bullet\nThird bullet'}
          />
          <span className="studio-admin-helper">Use one line per bullet item.</span>
        </label>
      );
    }

    if (section.type === 'image') {
      return (
        <div className="mt-5 grid gap-4">
          {section.src ? (
            <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/60 p-2">
              <img
                src={section.src}
                alt={section.alt || `Inline block ${index + 1}`}
                className="h-52 w-full rounded-[1rem] object-cover"
              />
            </div>
          ) : null}

          <label className="studio-admin-field">
            <span className="studio-admin-label">Image URL</span>
            <input
              type="text"
              value={section.src}
              onChange={(event) => handleBlockChange(section.id, { src: event.target.value })}
              className="studio-admin-input"
              placeholder="https://..."
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="studio-admin-field">
              <span className="studio-admin-label">Alt text</span>
              <input
                type="text"
                value={section.alt}
                onChange={(event) => handleBlockChange(section.id, { alt: event.target.value })}
                className="studio-admin-input"
                placeholder="Describe the image context"
              />
            </label>

            <label className="studio-admin-field">
              <span className="studio-admin-label">Caption</span>
              <input
                type="text"
                value={section.caption}
                onChange={(event) => handleBlockChange(section.id, { caption: event.target.value })}
                className="studio-admin-input"
                placeholder="Optional caption"
              />
            </label>
          </div>

          <label className="studio-admin-field">
            <span className="studio-admin-label">Upload inline image</span>
            <label className="studio-admin-secondary-button w-fit cursor-pointer">
              <ImageUp className="h-4 w-4" />
              {uploadingBlockId === section.id ? 'Uploading...' : 'Upload image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => void handleBlockImageUpload(section.id, event.target.files?.[0] ?? null)}
              />
            </label>
          </label>
        </div>
      );
    }

    if (section.type === 'code') {
      return (
        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="studio-admin-field">
              <span className="studio-admin-label">Language</span>
              <input
                type="text"
                value={section.language}
                onChange={(event) => handleBlockChange(section.id, { language: event.target.value })}
                className="studio-admin-input"
                placeholder="ts"
              />
            </label>

            <label className="studio-admin-field">
              <span className="studio-admin-label">File name</span>
              <input
                type="text"
                value={section.fileName}
                onChange={(event) => handleBlockChange(section.id, { fileName: event.target.value })}
                className="studio-admin-input"
                placeholder="article-editor.tsx"
              />
            </label>

            <label className="studio-admin-field">
              <span className="studio-admin-label">Caption</span>
              <input
                type="text"
                value={section.caption}
                onChange={(event) => handleBlockChange(section.id, { caption: event.target.value })}
                className="studio-admin-input"
                placeholder="Optional context"
              />
            </label>

            <label className="studio-admin-field">
              <span className="studio-admin-label">Command</span>
              <input
                type="text"
                value={section.command}
                onChange={(event) => handleBlockChange(section.id, { command: event.target.value })}
                className="studio-admin-input"
                placeholder="npm run build"
              />
            </label>
          </div>

          <label className="studio-admin-field">
            <span className="studio-admin-label">Code block</span>
            <textarea
              value={section.code}
              onChange={(event) => handleBlockChange(section.id, { code: event.target.value })}
              className="studio-admin-textarea min-h-[300px] font-mono text-sm leading-7"
              placeholder="export const articleEditor = () => {"
            />
          </label>
        </div>
      );
    }

    return (
      <div className="mt-5 grid gap-4">
        <label className="studio-admin-field">
          <span className="studio-admin-label">Highlight title</span>
          <input
            type="text"
            value={section.title}
            onChange={(event) => handleBlockChange(section.id, { title: event.target.value })}
            className="studio-admin-input"
            placeholder="Key takeaway"
          />
        </label>

        <label className="studio-admin-field">
          <span className="studio-admin-label">Highlight content</span>
          <textarea
            value={section.content}
            onChange={(event) => handleBlockChange(section.id, { content: event.target.value })}
            className="studio-admin-textarea min-h-[220px]"
            placeholder="Summarize the core insight, decision, or next action..."
          />
        </label>
      </div>
    );
  };

  return (
    <div className={`dark studio-admin-shell ${studioTheme === 'ink' ? 'studio-admin-shell-muted' : ''}`}>
      <div className="mx-auto w-full max-w-[1580px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header id="studio-dashboard-home" className="studio-admin-topbar">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <Link to="/admin/articles" className="studio-admin-brand">
              <span className="studio-admin-brand-mark">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">Daf.Dev Studio</span>
                <span className="block truncate text-xs text-slate-400">Article editor dashboard</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-2 xl:flex">
              <button type="button" onClick={() => jumpTo('studio-dashboard-home')} className="studio-admin-nav-link studio-admin-nav-link-active">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
              <button type="button" onClick={() => jumpTo('studio-library')} className="studio-admin-nav-link">
                <BookOpen className="h-4 w-4" />
                Articles
              </button>
              <button type="button" onClick={() => { setArticleFilter('draft'); jumpTo('studio-library'); }} className="studio-admin-nav-link">
                <FileText className="h-4 w-4" />
                Drafts
              </button>
              <button type="button" onClick={() => jumpTo('studio-publishing')} className="studio-admin-nav-link">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 sm:flex">
              <span className={`h-2.5 w-2.5 rounded-full ${isSaving ? 'bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.95)]' : hasPendingChanges ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.85)]' : 'bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.85)]'}`} />
              {syncLabel}
            </div>
            <button type="button" onClick={() => setStudioTheme((current) => (current === 'nebula' ? 'ink' : 'nebula'))} className="studio-admin-icon-button" aria-label="Toggle admin theme">
              {studioTheme === 'nebula' ? <Moon className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </button>
            <div className="studio-admin-avatar">
              <span className="studio-admin-avatar-mark">{avatarInitials}</span>
              <div className="hidden min-w-0 text-left sm:block">
                <p className="truncate text-sm font-semibold text-white">{avatarName}</p>
                <p className="truncate text-xs text-slate-400">{profile?.role ?? 'admin'}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="studio-admin-hero-card">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="studio-admin-stat-card">
              <span className="studio-admin-stat-label">Articles</span>
              <p className="studio-admin-stat-value">{adminArticles.length}</p>
              <p className="studio-admin-stat-copy">Total entries stored in Supabase.</p>
            </div>
            <div className="studio-admin-stat-card">
              <span className="studio-admin-stat-label">Published</span>
              <p className="studio-admin-stat-value">{publishedCount}</p>
              <p className="studio-admin-stat-copy">Live notes visible on the public notes page.</p>
            </div>
            <div className="studio-admin-stat-card">
              <span className="studio-admin-stat-label">Draft Queue</span>
              <p className="studio-admin-stat-value">{draftCount}</p>
              <p className="studio-admin-stat-copy">In-progress notes waiting for review.</p>
            </div>
            <div className="studio-admin-stat-card">
              <span className="studio-admin-stat-label">Focus</span>
              <p className="studio-admin-stat-value">{draft.sections.length}</p>
              <p className="studio-admin-stat-copy">Blocks inside the active article canvas.</p>
            </div>
          </div>

          {notice && notice.tone !== 'neutral' ? (
            <div className={`mt-6 rounded-[1.4rem] border px-4 py-3 text-sm leading-6 ${noticeClassName}`}>
              {notice.message}
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-[1.4rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100">
              {error}
            </div>
          ) : null}
        </section>

        <div className="studio-dashboard-shell mt-8">
          <aside id="studio-library" className="studio-sidebar">
            <div className="studio-sidebar-card studio-admin-sidebar-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="studio-admin-card-label">Workspace</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    {draft.id ? 'Editing article' : 'Create new article'}
                  </h2>
                </div>
                <span className="studio-admin-badge">{draft.id ? 'Editing' : 'New draft'}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Search the library, pull an existing note into focus, or start a fresh draft from scratch.
              </p>

              <div className="mt-5 grid gap-3">
                <button type="button" onClick={resetDraft} className="studio-admin-primary-button w-full justify-center">
                  <Plus className="h-4 w-4" />
                  New Article
                </button>
                <button
                  type="button"
                  onClick={() => handleDraftChange('slug', slugify(draft.title))}
                  className="studio-admin-secondary-button w-full justify-center"
                >
                  <FileText className="h-4 w-4" />
                  Generate Slug
                </button>
                <button type="button" onClick={handleExport} className="studio-admin-secondary-button w-full justify-center">
                  <Download className="h-4 w-4" />
                  Export JSON
                </button>
                {draft.slug ? (
                  <Link to={previewPath} className="studio-admin-secondary-button w-full justify-center">
                    <Eye className="h-4 w-4" />
                    Open Preview Route
                  </Link>
                ) : null}
              </div>

              <div className="mt-6 studio-admin-search">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={libraryQuery}
                  onChange={(event) => setLibraryQuery(event.target.value)}
                  placeholder="Search title, slug, tag, or category"
                  className="studio-admin-search-input"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {articleFilterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setArticleFilter(tab.id)}
                    className={`studio-admin-filter-chip ${articleFilter === tab.id ? 'studio-admin-filter-chip-active' : ''}`}
                  >
                    {tab.label}
                    <span className="studio-admin-filter-count">{tab.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="studio-sidebar-card studio-admin-sidebar-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="studio-admin-card-label">Articles</p>
                  <h2 className="mt-2 text-lg font-semibold text-white">Supabase library</h2>
                </div>
                <span className="studio-admin-badge">{filteredAdminArticles.length}</span>
              </div>

              <div className="mt-5 space-y-3">
                {loading ? (
                  <div className="studio-admin-empty-card">
                    Loading your article library...
                  </div>
                ) : filteredAdminArticles.length === 0 ? (
                  <div className="studio-admin-empty-card">
                    {libraryQuery.trim() ? 'No articles matched your current search.' : 'No articles yet. Create the first draft from the workspace actions above.'}
                  </div>
                ) : (
                  filteredAdminArticles.map((article) => (
                    <article
                      key={article.slug}
                      className={`studio-sidebar-item studio-admin-article-card ${draft.id === article.id ? 'studio-admin-article-card-active' : ''}`}
                    >
                      <button
                        type="button"
                        onClick={() => handleLoadAdminArticle(article)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className={`studio-admin-status-chip ${article.status === 'published' ? 'studio-admin-status-chip-live' : ''}`}>
                            {article.status ?? 'draft'}
                          </span>
                          <span className="text-xs text-slate-500">{article.date}</span>
                        </div>
                        <h3 className="mt-4 text-sm font-semibold leading-6 text-white">
                          {article.title}
                        </h3>
                        <p className="mt-2 text-xs leading-5 text-slate-400">
                          {article.category || 'Uncategorized'} • /my-notes/{article.slug}
                        </p>
                      </button>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link to={`/my-notes/${article.slug}`} className="studio-admin-soft-button">
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                        <button type="button" onClick={() => void handleDeleteArticle(article)} className="studio-admin-soft-button studio-admin-soft-danger">
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="studio-sidebar-card studio-admin-sidebar-card">
              <p className="studio-admin-card-label">Templates</p>
              <h2 className="mt-2 text-lg font-semibold text-white">Built-in source notes</h2>

              <div className="mt-5 space-y-3">
                {builtInArticles.map((article) => (
                  <article key={article.slug} className="studio-sidebar-item studio-admin-template-card">
                    <div className="flex items-center justify-between gap-3">
                      <span className="studio-admin-status-chip">source</span>
                      <span className="text-xs text-slate-500">
                        {article.date}
                      </span>
                    </div>
                    <h3 className="mt-4 text-sm font-semibold leading-6 text-white">
                      {article.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => handleUseAsTemplate(article)} className="studio-admin-soft-button">
                        <CopyPlus className="h-3.5 w-3.5" />
                        Use template
                      </button>
                      <Link to={`/my-notes/${article.slug}`} className="studio-admin-soft-button">
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </aside>

          <section className="studio-admin-editor-shell">
            <div className="studio-editor-header studio-admin-editor-header">
              <div>
                <p className="studio-admin-card-label">Article Canvas</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  {draft.title || 'Untitled article'}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {currentArticle
                    ? `You are editing an existing entry from Supabase. Refine the copy, update metadata, then sync changes.`
                    : 'Start from a clean page, capture the core idea, and shape the narrative before publishing.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`studio-admin-status-chip ${draft.status === 'published' ? 'studio-admin-status-chip-live' : ''}`}>
                  {draft.status}
                </span>
                <span className="studio-admin-status-chip">{draft.sections.length} blocks</span>
              </div>
            </div>

            <form className="studio-admin-form-layout" onSubmit={handleSave}>
              <datalist id="article-category-options">
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>

              <section id="studio-basics" className="studio-editor-section">
                <div className="studio-editor-section-head">
                  <div>
                    <p className="studio-section-kicker">Basics</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">Article identity</h3>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className="studio-field">
                  <span className="studio-label">Title</span>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(event) => handleDraftChange('title', event.target.value)}
                    className="studio-input"
                    placeholder="Belajar Docker Dasar..."
                  />
                </label>

                <label className="studio-field">
                  <span className="studio-label">Slug</span>
                  <input
                    type="text"
                    value={draft.slug}
                    onChange={(event) => handleDraftChange('slug', slugify(event.target.value))}
                    className="studio-input"
                    placeholder="belajar-docker-dasar"
                  />
                </label>

                <label className="studio-field md:col-span-2">
                  <span className="studio-label">Excerpt</span>
                  <textarea
                    value={draft.excerpt}
                    onChange={(event) => handleDraftChange('excerpt', event.target.value)}
                    className="studio-textarea min-h-[112px]"
                    placeholder="Ringkasan singkat artikel..."
                  />
                </label>
                </div>
              </section>

              <section id="studio-publishing" className="studio-editor-section">
                <div className="studio-editor-section-head">
                  <div>
                    <p className="studio-section-kicker">Publishing</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">Status and metadata</h3>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className="studio-field">
                  <span className="studio-label">Status</span>
                  <select
                    value={draft.status}
                    onChange={(event) => handleDraftChange('status', event.target.value as ArticleStatus)}
                    className="studio-input"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                  </select>
                </label>

                <label className="studio-field">
                  <span className="studio-label">Date</span>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(event) => handleDraftChange('date', event.target.value)}
                    className="studio-input"
                  />
                </label>

                <label className="studio-field">
                  <span className="studio-label">Read Time</span>
                  <input
                    type="text"
                    value={draft.readTime}
                    onChange={(event) => handleDraftChange('readTime', event.target.value)}
                    className="studio-input"
                    placeholder="6 min read"
                  />
                </label>

                <label className="studio-field">
                  <span className="studio-label">Category</span>
                  <input
                    type="text"
                    list="article-category-options"
                    value={draft.category}
                    onChange={(event) => handleDraftChange('category', event.target.value)}
                    className="studio-input"
                    placeholder="Backend Engineering"
                  />
                </label>

                <label className="studio-field">
                  <span className="studio-label">Author</span>
                  <input
                    type="text"
                    value={draft.author}
                    onChange={(event) => handleDraftChange('author', event.target.value)}
                    className="studio-input"
                    placeholder="Muhammad Daffa Ramadhan"
                  />
                </label>

                <label className="studio-field md:col-span-2">
                  <span className="studio-label">Tags</span>
                  <input
                    type="text"
                    value={draft.tags}
                    onChange={(event) => handleDraftChange('tags', event.target.value)}
                    className="studio-input"
                    placeholder="Docker, DevOps, Containers"
                  />
                  <span className="studio-helper">Pisahkan tag dengan koma.</span>
                  {draftTags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {draftTags.map((tag) => (
                        <span key={tag} className="studio-admin-tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </label>
                </div>
              </section>

              <section id="studio-cover" className="studio-editor-section">
                <div className="studio-editor-section-head">
                  <div>
                    <p className="studio-section-kicker">Cover & Media</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">Cover image</h3>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className="studio-field">
                  <span className="studio-label">Cover Image URL</span>
                  <input
                    type="text"
                    value={draft.image}
                    onChange={(event) => handleDraftChange('image', event.target.value)}
                    className="studio-input"
                    placeholder="https://..."
                  />
                </label>

                <label className="studio-field">
                  <span className="studio-label">Cover Image Alt</span>
                  <input
                    type="text"
                    value={draft.imageAlt}
                    onChange={(event) => handleDraftChange('imageAlt', event.target.value)}
                    className="studio-input"
                    placeholder="Cover article image"
                  />
                </label>

                <label className="studio-field md:col-span-2">
                  <span className="studio-label">Upload Cover Image</span>
                  <label className="studio-action-button w-fit cursor-pointer">
                    <Upload className="h-3.5 w-3.5" />
                    {isUploadingCover ? 'Uploading...' : 'Upload cover'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => void handleCoverUpload(event.target.files?.[0] ?? null)}
                    />
                  </label>
                  <span className="studio-helper">File akan diupload ke Supabase Storage bucket cover.</span>
                </label>
                </div>

                <div className="mt-5 studio-cover-preview">
                  <img
                    src={draft.image || '/og-image.png'}
                    alt={draft.imageAlt || draft.title || 'Cover preview'}
                    className="h-48 w-full rounded-[1.4rem] object-cover"
                  />
                </div>
              </section>

              <section id="studio-content" className="studio-editor-section">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="studio-section-kicker">Content Blocks</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">Compose article body</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {BLOCK_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleAddBlock(type)}
                        className="studio-action-button"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        {blockTypeLabel[type]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {draft.sections.map((section, index) => (
                    <div key={section.id} className="studio-block-card">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="studio-chip">{section.type}</span>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Block {index + 1}
                          </p>
                        </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleMoveBlock(section.id, 'up')}
                            className="studio-icon-button"
                            aria-label="Move block up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveBlock(section.id, 'down')}
                            className="studio-icon-button"
                            aria-label="Move block down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveBlock(section.id)}
                            className="studio-icon-button studio-icon-danger"
                            aria-label="Delete block"
                          >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                      {renderBlockFields(section, index)}
                    </div>
                  ))}
                </div>
              </section>

              <section id="studio-actions" className="studio-editor-section">
                <div className="studio-editor-section-head">
                  <div>
                    <p className="studio-section-kicker">Finalize</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">Save actions</h3>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="studio-field">
                    <span className="studio-label">Meta title preview</span>
                    <input type="text" value={metaTitlePreview} readOnly className="studio-input" />
                    <span className="studio-helper">Saat ini mengikuti judul artikel.</span>
                  </label>
                  <label className="studio-field">
                    <span className="studio-label">Meta description preview</span>
                    <textarea value={metaDescriptionPreview} readOnly className="studio-textarea min-h-[112px]" />
                    <span className="studio-helper">Saat ini mengikuti excerpt artikel.</span>
                  </label>
                </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-6 dark:border-slate-700">
                <div className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Route artikel: <span className="font-semibold text-slate-700 dark:text-slate-200">{previewPath}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {draft.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        const currentArticle = adminArticles.find((article) => article.id === draft.id);
                        if (currentArticle) {
                          void handleDeleteArticle(currentArticle);
                        }
                      }}
                      className="btn-outline border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800 dark:border-rose-900/40 dark:text-rose-200 dark:hover:border-rose-800"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Article
                    </button>
                  ) : null}
                  <button type="button" onClick={resetDraft} className="btn-outline">
                    Reset Form
                  </button>
                  <button type="submit" disabled={isSaving} className="btn-primary">
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Article'}
                  </button>
                </div>
              </div>
              </section>
            </form>
          </section>
        </div>

        <div className="studio-admin-floating-actions">
          <button type="button" onClick={() => void persistDraft('draft')} disabled={isSaving} className="studio-admin-secondary-button">
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button type="button" onClick={() => void persistDraft('published')} disabled={isSaving} className="studio-admin-primary-button">
            <Sparkles className="h-4 w-4" />
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleStudio;
