// src/pages/stops/StopList.tsx

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListLayout } from '@/components/templates/ListLayout';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { useListPage } from '@/hooks/useListPage';
import { stopApiService } from '@/services/stopApiService';
import type { StopListDto } from '@/types';
import { StopType } from '@/types/enums';
import { ROUTES } from '@/lib/constants';
import { type ColumnDefinition } from '@/components/organisms/DataTable';

export default function StopList() {
  const { t } = useTranslation();

  const {
    filteredItems: filteredStops,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterValue: typeFilter,
    setFilterValue: setTypeFilter,
    deleteId,
    setDeleteId,
    loadItems,
    handleDelete,
    clearFilters,
    hasFilters,
  } = useListPage<StopListDto>({
    searchFields: ['address', 'lineName', 'sequenceOrder'],
    filterField: 'stopType',
    entityName: 'stop',
    getAll: stopApiService.getAll,
    deleteItem: stopApiService.delete,
  });

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const typeFilterOptions = [
    { value: StopType.Intermediate.toString(), label: t('stop.types.intermediate') },
    { value: StopType.Terminus.toString(), label: t('stop.types.terminus') },
  ];

  const columns: ColumnDefinition<StopListDto>[] = [
    { key: 'address', header: t('stop.address') },
    { key: 'lineName', header: t('stop.lineName') },
    { key: 'sequenceOrder', header: t('stop.sequence') },
    {
      key: 'stopType',
      header: t('stop.type'),
      cell: (stop) => (stop.stopType === StopType.Terminus ? t('stop.types.terminus') : t('stop.types.intermediate')),
    },
    {
      key: 'actions',
      header: t('common.actions.actions'),
      isAction: true,
      cell: (stop) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/stops/${stop.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(stop.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner text={t('common.messages.loadingData')} />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ListLayout
      title={t('stop.list')}
      createRoute={ROUTES.STOP_CREATE}
      searchPlaceholder={t('stop.searchPlaceholder')}
      noDataTitle={t('common.messages.noData')}
      noDataDescription={t('stop.noStops')}
      noResultsTitle={t('common.messages.noResults')}
      deleteTitle={t('common.messages.confirmDeleteTitle')}
      deleteDescription={t('common.messages.confirmDeleteItem', { item: t('stop.singular') })}
      items={[]}
      filteredItems={filteredStops}
      loading={loading}
      error={error}
      columns={columns}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterValue={typeFilter}
      onFilterChange={setTypeFilter}
      filterOptions={typeFilterOptions}
      onClearFilters={clearFilters}
      hasFilters={hasFilters}
      showFilter={true}
      filterPlaceholder={t('stop.filterByType')}
      deleteId={deleteId}
      onDeleteClose={() => setDeleteId(null)}
      onDeleteConfirm={() => deleteId && handleDelete(deleteId)}
      countLabel={t('stop.stops')}
    />
  );
}
