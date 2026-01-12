// src/pages/lines/LineList.tsx

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListLayout } from '@/components/templates/ListLayout';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { useListPage } from '@/hooks/useListPage';
import { lineApiService } from '@/services/lineApiService';
import type { LineListDto } from '@/types';
import { ROUTES } from '@/lib/constants';
import { type ColumnDefinition } from '@/components/organisms/DataTable';

export default function LineList() {
  const { t } = useTranslation();

  const {
    filteredItems: filteredLines,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    deleteId,
    setDeleteId,
    loadItems,
    handleDelete,
    clearFilters,
    hasFilters,
  } = useListPage<LineListDto>({
    searchFields: ['name', 'description', 'supervisorName'],
    entityName: 'line',
    getAll: lineApiService.getAll,
    deleteItem: lineApiService.delete,
  });

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const columns: ColumnDefinition<LineListDto>[] = [
    { key: 'name', header: t('line.name') },
    {
      key: 'description',
      header: t('line.description'),
      cell: (line) => line.description || '-',
    },
    { key: 'supervisorName', header: t('line.supervisor') },
    {
      key: 'actions',
      header: t('common.actions.actions'),
      isAction: true,
      cell: (line) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/lines/${line.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/lines/${line.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(line.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <ListLayout
      title={t('line.list')}
      createRoute={ROUTES.LINE_CREATE}
      searchPlaceholder={t('line.searchPlaceholder')}
      noDataTitle={t('common.messages.noData')}
      noDataDescription={t('line.noLines')}
      noResultsTitle={t('common.messages.noResults')}
      deleteTitle={t('common.messages.confirmDeleteTitle')}
      deleteDescription={t('common.messages.confirmDeleteLine')}
      items={[]}
      filteredItems={filteredLines}
      loading={loading}
      error={error}
      columns={columns}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterValue=""
      onFilterChange={() => {}}
      filterOptions={[]}
      onClearFilters={clearFilters}
      hasFilters={hasFilters}
      showFilter={false}
      deleteId={deleteId}
      onDeleteClose={() => setDeleteId(null)}
      onDeleteConfirm={() => deleteId && handleDelete(deleteId)}
      countLabel={t('line.lines')}
    />
  );
}
