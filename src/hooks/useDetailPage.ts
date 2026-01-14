// src/hooks/useDetailPage.ts

import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface UseDetailPageOptions<T> {
  fetchFn: (id: number | string) => Promise<T>;
  listRoute: string;
}

export function useDetailPage<T>({ fetchFn, listRoute }: UseDetailPageOptions<T>) {
  const { t } = useTranslation();
  const { id, userId } = useParams<{ id?: string; userId?: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (itemId: number | string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn(itemId);
        setData(result);
      } catch (err) {
        setError(t('common.messages.error'));
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, t]
  );

  useEffect(() => {
    if (userId) {
      loadData(userId);
    } else if (id) {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        loadData(numericId);
      }
    }
  }, [id, userId, loadData]);

  const formatDate = useCallback((dateString?: string | Date) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  }, []);

  return {
    data,
    loading,
    error,
    id: id ? parseInt(id, 10) : null,
    userId,
    navigate,
    listRoute,
    formatDate,
    t,
  };
}
