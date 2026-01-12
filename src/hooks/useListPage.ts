import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface UseListPageOptions<T> {
  searchFields?: (keyof T)[];
  filterField?: keyof T;
  entityName: string;
  getAll: () => Promise<T[]>;
  deleteItem?: (id: number) => Promise<void>;
}

export interface UseListPageReturn<T> {
  // Data
  items: T[];
  filteredItems: T[];
  loading: boolean;
  error: string | null;

  // Search & Filter
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;

  // Delete
  deleteId: number | null;
  setDeleteId: (id: number | null) => void;

  // Actions
  loadItems: () => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  clearFilters: () => void;

  // Computed
  hasFilters: boolean;
}

export function useListPage<T extends { id: number }>({
  searchFields = [],
  filterField,
  entityName,
  getAll,
  deleteItem,
}: UseListPageOptions<T>): UseListPageReturn<T> {
  const { t } = useTranslation();

  // State
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');

  // Load items
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAll();
      setItems(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error(`Error loading ${entityName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [getAll, entityName, t]);

  // Handle delete
  const handleDelete = useCallback(async (id: number) => {
    if (!deleteItem) return;

    try {
      await deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      setDeleteId(null);
      toast.success(t('common.messages.deleteSuccess'));
    } catch (err) {
      console.error(`Error deleting ${entityName}:`, err);
      toast.error(t('common.messages.deleteError'));
    }
  }, [deleteItem, entityName, t]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilterValue('all');
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        return searchFields.some(field => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(lowerSearchTerm);
          }
          if (typeof value === 'number') {
            return value.toString().includes(searchTerm);
          }
          return false;
        });
      });
    }

    // Field filter
    if (filterField && filterValue !== 'all') {
      filtered = filtered.filter(item => {
        const value = item[filterField];
        if (typeof value === 'string') {
          return value === filterValue || value === String(filterValue);
        }
        if (typeof value === 'number') {
          return value === parseInt(filterValue) || value === Number(filterValue) || String(value) === filterValue;
        }
        if (typeof value === 'boolean') {
          // Handle boolean filtering
          if (filterValue === 'true') return value === true;
          if (filterValue === 'false') return value === false;
          return value === Boolean(filterValue);
        }
        return false;
      });
    }

    return filtered;
  }, [items, searchTerm, filterValue, searchFields, filterField]);

  const hasFilters = searchTerm !== '' || filterValue !== 'all';

  return {
    // Data
    items,
    filteredItems,
    loading,
    error,

    // Search & Filter
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,

    // Delete
    deleteId,
    setDeleteId,

    // Actions
    loadItems,
    handleDelete,
    clearFilters,

    // Computed
    hasFilters,
  };
}
