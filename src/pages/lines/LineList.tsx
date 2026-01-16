// src/pages/lines/LineList.tsx

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListLayout } from '@/components/templates/ListLayout';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { useListPage } from '@/hooks/useListPage';
import { useSubscription } from '@/hooks/useSubscription';
import { lineApiService } from '@/services/lineApiService';
import type { LineListDto } from '@/types';
import { ROUTES } from '@/lib/constants';
import { type ColumnDefinition } from '@/components/organisms/DataTable';

import { useAuth } from '@/hooks/useAuth';

export default function LineList() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('Administrator');
  const { subscribeToLine, unsubscribe, activeLineId, SubscriptionDialog } = useSubscription();

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
    deleteItem: (id) => lineApiService.delete(Number(id)),
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
    // Only show actions column for Administrators
    ...(isAdmin ? [{
      key: 'actions' as const,
      header: t('common.actions.actions'),
      isAction: true,
      cell: (line: LineListDto) => (
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
    }] : [{
      key: 'actions' as const,
      header: t('common.actions.actions'),
      isAction: true,
      cell: (line: LineListDto) => (
        <div className="flex justify-end gap-2">
          {activeLineId === line.id ? (
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => unsubscribe(loadItems)}
                title={t('common.actions.cancelSubscription')}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => subscribeToLine(line.id, line.name, loadItems)}
                title={t('common.actions.subscribe')}
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/lines/${line.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    }]),
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
      createRoute={isAdmin ? ROUTES.LINE_CREATE : undefined}
      searchPlaceholder={t('line.searchPlaceholder')}
      noDataTitle={t('common.messages.noData')}
      noDataDescription={t('line.noLines')}
      noResultsTitle={t('common.messages.noResults')}
      deleteTitle={t('common.messages.confirmDeleteTitle')}
      deleteDescription={t('common.messages.confirmDeleteItem', { item: t('line.singular') })}
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
    >
        <SubscriptionDialog />
    </ListLayout>
  );
}
