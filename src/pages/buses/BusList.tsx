// src/pages/buses/BusList.tsx

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListLayout } from '@/components/templates/ListLayout';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { useListPage } from '@/hooks/useListPage';
import { busApiService } from '@/services/busApiService';
import type { Bus } from '@/types';
import { BusStatus } from '@/types/enums';
import { ROUTES } from '@/lib/constants';
import { type ColumnDefinition } from '@/components/organisms/DataTable';
import { StatusBadge } from '@/components/atoms/StatusBadge';

export default function BusList() {
  const { t } = useTranslation();

  const {
    filteredItems: filteredBuses,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterValue: statusFilter,
    setFilterValue: setStatusFilter,
    deleteId,
    setDeleteId,
    loadItems,
    handleDelete,
    clearFilters,
    hasFilters,
  } = useListPage<Bus>({
    searchFields: ['licensePlate', 'capacity'],
    filterField: 'status',
    entityName: 'bus',
    getAll: busApiService.getAll,
    deleteItem: busApiService.delete,
  });

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const statusFilterOptions = Object.values(BusStatus).map((status) => ({
    value: status,
    label: t(`bus.statuses.${status}`),
  }));

  const columns: ColumnDefinition<Bus>[] = [
    { key: 'licensePlate', header: t('bus.licensePlate') },
    { key: 'capacity', header: t('bus.capacity') },
    {
      key: 'status',
      header: t('bus.status'),
      cell: (bus) => <StatusBadge status={bus.status} type="bus" />,
    },
    {
      key: 'actions',
      header: t('common.actions.actions'),
      isAction: true,
      cell: (bus) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/buses/${bus.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/buses/${bus.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(bus.id)}>
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
      title={t('bus.list')}
      createRoute={ROUTES.BUS_CREATE}
      searchPlaceholder={t('bus.searchPlaceholder')}
      noDataTitle={t('common.messages.noData')}
      noDataDescription={t('bus.noBuses')}
      noResultsTitle={t('common.messages.noResults')}
      deleteTitle={t('common.actions.delete')}
      deleteDescription={t('common.messages.confirmDeleteBus')}
      items={[]}
      filteredItems={filteredBuses}
      loading={loading}
      error={error}
      columns={columns}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterValue={statusFilter}
      onFilterChange={setStatusFilter}
      filterOptions={statusFilterOptions}
      onClearFilters={clearFilters}
      hasFilters={hasFilters}
      showFilter={true}
      filterPlaceholder={t('bus.filterByStatus')}
      deleteId={deleteId}
      onDeleteClose={() => setDeleteId(null)}
      onDeleteConfirm={() => deleteId && handleDelete(deleteId)}
      countLabel={t('bus.buses')}
    />
  );
}