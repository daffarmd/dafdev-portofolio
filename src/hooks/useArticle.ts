import { useEffect, useState } from 'react';
import type { Article } from '../types';
import { ARTICLE_DATA_UPDATED_EVENT } from '../lib/articleStore';
import { fetchArticleBySlug } from '../services/articleService';

type UseArticleOptions = {
  includeDrafts?: boolean;
};

type UseArticleResult = {
  article: Article | null;
  loading: boolean;
  error: string | null;
};

export const useArticle = (slug?: string, options?: UseArticleOptions): UseArticleResult => {
  const includeDrafts = options?.includeDrafts ?? false;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadArticle = async () => {
      if (!slug) {
        setArticle(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const nextArticle = await fetchArticleBySlug(slug, { includeDrafts });
        if (!active) {
          return;
        }

        setArticle(nextArticle);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : 'Gagal memuat artikel.');
        setArticle(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadArticle();

    const handleRefresh = () => {
      void loadArticle();
    };

    window.addEventListener(ARTICLE_DATA_UPDATED_EVENT, handleRefresh as EventListener);

    return () => {
      active = false;
      window.removeEventListener(ARTICLE_DATA_UPDATED_EVENT, handleRefresh as EventListener);
    };
  }, [includeDrafts, slug]);

  return {
    article,
    loading,
    error,
  };
};
