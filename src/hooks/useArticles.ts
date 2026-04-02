import { useEffect, useState } from 'react';
import type { Article } from '../types';
import { ARTICLE_DATA_UPDATED_EVENT, getBuiltInArticles } from '../lib/articleStore';
import { fetchAdminArticles, fetchPublishedArticles } from '../services/articleService';
import { useAuth } from './useAuth';

type UseArticlesOptions = {
  scope?: 'published' | 'admin';
};

type UseArticlesResult = {
  articles: Article[];
  loading: boolean;
  error: string | null;
  source: 'supabase' | 'fallback';
};

export const useArticles = (options?: UseArticlesOptions): UseArticlesResult => {
  const scope = options?.scope ?? 'published';
  const { isConfigured, isAdmin, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState<Article[]>(() => (
    scope === 'published' ? getBuiltInArticles() : []
  ));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'supabase' | 'fallback'>('fallback');

  useEffect(() => {
    let active = true;

    const loadArticles = async () => {
      if (scope === 'admin' && authLoading) {
        return;
      }

      if (scope === 'admin' && (!isConfigured || !isAdmin)) {
        if (active) {
          setArticles([]);
          setLoading(false);
          setError(null);
          setSource('fallback');
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (scope === 'admin') {
          const adminArticles = await fetchAdminArticles();
          if (!active) {
            return;
          }

          setArticles(adminArticles);
          setSource('supabase');
        } else {
          const result = await fetchPublishedArticles();
          if (!active) {
            return;
          }

          setArticles(result.articles);
          setSource(result.source);
        }
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : 'Gagal memuat artikel.');

        if (scope === 'published') {
          setArticles(getBuiltInArticles());
          setSource('fallback');
        } else {
          setArticles([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadArticles();

    const handleRefresh = () => {
      void loadArticles();
    };

    window.addEventListener(ARTICLE_DATA_UPDATED_EVENT, handleRefresh as EventListener);

    return () => {
      active = false;
      window.removeEventListener(ARTICLE_DATA_UPDATED_EVENT, handleRefresh as EventListener);
    };
  }, [authLoading, isAdmin, isConfigured, scope]);

  return {
    articles,
    loading,
    error,
    source,
  };
};
