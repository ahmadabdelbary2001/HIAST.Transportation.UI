// src/pages/subscriptions/SubscriptionList.tsx

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListLayout } from '@/components/templates/ListLayout';
import { useListPage } from '@/hooks/useListPage';
import { type ColumnDefinition } from '@/components/organisms/DataTable';
import { lineSubscriptionApiService } from '@/services/lineSubscriptionApiService';
import type { LineSubscriptionListDto } from '@/types';
import { ROUTES } from '@/lib/constants';

export default function SubscriptionList() {
  const { t } = useTranslation();

  const {
    filteredItems: filteredSubscriptions,
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
  } = useListPage<LineSubscriptionListDto>({
    searchFields: ['employeeName', 'lineName'],
    filterField: 'isActive',
    entityName: 'subscription',
    getAll: lineSubscriptionApiService.getAll,
    deleteItem: lineSubscriptionApiService.delete,
  });

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const statusFilterOptions = [
    { value: 'true', label: t('subscription.active') },
    { value: 'false', label: t('subscription.inactive') },
  ];

  const columns: ColumnDefinition<LineSubscriptionListDto>[] = [
    {
      key: 'employeeName',
      header: t('subscription.employee'),
      cell: (item) => <span className="font-medium">{item.employeeName}</span>,
    },
    {
      key: 'lineName',
      header: t('subscription.line'),
      cell: (item) => item.lineName,
    },
    {
      key: 'isActive',
      header: t('subscription.status'),
      cell: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.isActive
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {item.isActive ? t('subscription.active') : t('subscription.inactive')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: t('common.actions.actions'),
      isAction: true,
      cell: (item) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/subscriptions/${item.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/subscriptions/${item.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ListLayout
      title={t('subscription.list')}
      createRoute={ROUTES.SUBSCRIPTION_CREATE}
      searchPlaceholder={t('subscription.searchPlaceholder')}
      noDataTitle={t('common.messages.noData')}
      noDataDescription={t('subscription.noSubscriptions')}
      noResultsTitle={t('common.messages.noResults')}
      deleteTitle={t('common.messages.confirmDelete')}
      deleteDescription={t('subscription.confirmDelete')}
      items={[]}
      filteredItems={filteredSubscriptions}
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
      filterPlaceholder={t('subscription.filterByStatus')}
      deleteId={deleteId}
      onDeleteClose={() => setDeleteId(null)}
      onDeleteConfirm={() => deleteId && handleDelete(deleteId)}
      countLabel={t('subscription.subscriptions')}
    />
  );
}