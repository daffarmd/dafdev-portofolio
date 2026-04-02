import type { Article, ArticleBlock, ArticleStatus } from '../types';
import {
  ARTICLE_ASSETS_BUCKET,
  ARTICLE_COVERS_BUCKET,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase';
import {
  dispatchArticleDataUpdated,
  getBuiltInArticles,
  isArticleBlock,
  mergeArticlesBySlug,
} from '../lib/articleStore';

export type ArticleSource = 'supabase' | 'fallback';
export type ArticleAssetKind = 'cover' | 'inline';

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  translations: unknown;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  category: string | null;
  tags: string[] | null;
  read_time: string | null;
  author_name: string | null;
  author_id: string | null;
  status: ArticleStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminArticleInput = {
  id?: string | null;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
  author: string;
  image: string;
  imageAlt: string;
  sections: ArticleBlock[];
  status: ArticleStatus;
  translations?: Article['translations'];
};

const DEFAULT_IMAGE_PATH = '/og-image.png';

const isTranslationsRecord = (value: unknown): value is Article['translations'] => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const translations = value as Record<string, unknown>;
  if (!translations.en || typeof translations.en !== 'object') {
    return false;
  }

  const english = translations.en as Record<string, unknown>;
  return (
    typeof english.title === 'string' &&
    typeof english.excerpt === 'string' &&
    typeof english.readTime === 'string' &&
    typeof english.category === 'string' &&
    typeof english.imageAlt === 'string' &&
    Array.isArray(english.sections) &&
    english.sections.every(isArticleBlock)
  );
};

const coerceBlocks = (value: unknown): ArticleBlock[] => (
  Array.isArray(value)
    ? value.filter(isArticleBlock)
    : []
);

const mapArticleRowToArticle = (row: ArticleRow): Article => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  date: (row.published_at ?? row.created_at).slice(0, 10),
  readTime: row.read_time ?? '',
  tags: row.tags ?? [],
  category: row.category ?? '',
  author: row.author_name ?? 'Muhammad Daffa Ramadhan',
  image: row.cover_image_url || DEFAULT_IMAGE_PATH,
  imageAlt: row.cover_image_alt || row.title,
  sections: coerceBlocks(row.content),
  status: row.status,
  publishedAt: row.published_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  translations: isTranslationsRecord(row.translations) ? row.translations : undefined,
});

const toArticlePayload = (input: AdminArticleInput, authorId?: string | null) => {
  const isPublished = input.status === 'published';
  const publishedAt = isPublished
    ? new Date(`${input.date}T00:00:00.000Z`).toISOString()
    : null;

  return {
    title: input.title.trim(),
    slug: input.slug.trim(),
    excerpt: input.excerpt.trim(),
    content: input.sections,
    translations: input.translations ?? {},
    cover_image_url: input.image.trim() || DEFAULT_IMAGE_PATH,
    cover_image_alt: input.imageAlt.trim() || input.title.trim(),
    category: input.category.trim(),
    tags: input.tags,
    read_time: input.readTime.trim(),
    author_name: input.author.trim(),
    author_id: authorId ?? null,
    status: input.status,
    published_at: publishedAt,
  };
};

const normalizeFileName = (value: string) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-{2,}/g, '-');

const ensureSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  return supabase;
};

export const fetchPublishedArticles = async (): Promise<{ articles: Article[]; source: ArticleSource }> => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      articles: getBuiltInArticles(),
      source: 'fallback',
    };
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    return {
      articles: getBuiltInArticles(),
      source: 'fallback',
    };
  }

  const remoteArticles = (data as ArticleRow[] | null)?.map(mapArticleRowToArticle) ?? [];

  return {
    articles: mergeArticlesBySlug(getBuiltInArticles(), remoteArticles),
    source: 'supabase',
  };
};

export const fetchAdminArticles = async (): Promise<Article[]> => {
  const client = ensureSupabase();

  const { data, error } = await client
    .from('articles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as ArticleRow[] | null)?.map(mapArticleRowToArticle) ?? [];
};

export const fetchArticleBySlug = async (
  slug: string,
  options?: { includeDrafts?: boolean },
): Promise<Article | null> => {
  if (!slug) {
    return null;
  }

  const fallbackArticle = getBuiltInArticles().find((article) => article.slug === slug) ?? null;

  if (!isSupabaseConfigured || !supabase) {
    return fallbackArticle;
  }

  let query = supabase
    .from('articles')
    .select('*')
    .eq('slug', slug);

  if (!options?.includeDrafts) {
    query = query.eq('status', 'published');
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    return fallbackArticle;
  }

  if (!data) {
    return fallbackArticle;
  }

  return mapArticleRowToArticle(data as ArticleRow);
};

export const saveAdminArticle = async (
  input: AdminArticleInput,
  authorId?: string | null,
): Promise<Article> => {
  const client = ensureSupabase();
  const payload = toArticlePayload(input, authorId);

  if (input.id) {
    const { data, error } = await client
      .from('articles')
      .update(payload)
      .eq('id', input.id)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    dispatchArticleDataUpdated();
    return mapArticleRowToArticle(data as ArticleRow);
  }

  const { data, error } = await client
    .from('articles')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  dispatchArticleDataUpdated();
  return mapArticleRowToArticle(data as ArticleRow);
};

export const deleteAdminArticle = async (id: string) => {
  const client = ensureSupabase();

  const { error } = await client
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  dispatchArticleDataUpdated();
};

export const uploadArticleAsset = async (
  file: File,
  kind: ArticleAssetKind,
): Promise<string> => {
  const client = ensureSupabase();
  const bucket = kind === 'cover' ? ARTICLE_COVERS_BUCKET : ARTICLE_ASSETS_BUCKET;
  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const filePath = `${Date.now()}-${normalizeFileName(baseName) || 'asset'}.${extension}`;

  const { data, error } = await client.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data: publicUrlData } = client.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};
