// src/pages/drivers/DriverList.tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListLayout } from '@/components/templates/ListLayout';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { useListPage } from '@/hooks/useListPage';
import { driverApiService } from '@/services/driverApiService';
import type { Driver } from '@/types/index';
import { ROUTES } from '@/lib/constants';
import { type ColumnDefinition } from '@/components/organisms/DataTable';

export default function DriverList() {
  const { t } = useTranslation();

  const {
    filteredItems: filteredDrivers,
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
  } = useListPage<Driver>({
    searchFields: ['name', 'licenseNumber'],
    entityName: 'driver',
    getAll: driverApiService.getAll,
    deleteItem: driverApiService.delete,
  });

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const columns: ColumnDefinition<Driver>[] = [
    { key: 'name', header: t('driver.name') },
    { key: 'licenseNumber', header: t('driver.licenseNumber') },
    {
      key: 'actions',
      header: t('common.actions.actions'),
      isAction: true, // Mark this as the actions column
      cell: (driver) => ( // Custom renderer for the action buttons
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/drivers/${driver.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/drivers/${driver.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(driver.id)}>
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
      title={t('driver.list')}
      createRoute={ROUTES.DRIVER_CREATE}
      searchPlaceholder={t('driver.searchPlaceholder')}
      noDataTitle={t('common.messages.noData')}
      noDataDescription={t('driver.noDrivers')}
      noResultsTitle={t('common.messages.noResults')}
      deleteTitle={t('common.actions.delete')}
      deleteDescription={t('common.messages.confirmDeleteDriver')}
      items={[]}
      filteredItems={filteredDrivers}
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
      countLabel={t('driver.drivers')}
    />
  );
}