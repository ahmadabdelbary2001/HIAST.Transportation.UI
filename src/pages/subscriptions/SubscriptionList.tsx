// src/pages/subscriptions/SubscriptionList.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListLayout } from '@/components/templates/ListLayout';
import { useListPage } from '@/hooks/useListPage';
import { type ColumnDefinition } from '@/components/organisms/DataTable';
import { lineSubscriptionApiService } from '@/services/lineSubscriptionApiService';
import { lineApiService } from '@/services/lineApiService';
import type { LineSubscriptionListDto } from '@/types';
import { ROUTES } from '@/lib/constants';
import { SupervisorHandoverDialog } from '@/components/organisms/SupervisorHandoverDialog';
import { toast } from 'sonner';

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

  // Handover state
  const [showHandover, setShowHandover] = useState(false);
  const [handoverCandidates, setHandoverCandidates] = useState<{ id: string; name: string }[]>([]);
  const [pendingLineId, setPendingLineId] = useState<number | null>(null);
  const [pendingSubscriptionId, setPendingSubscriptionId] = useState<number | null>(null);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleDeleteAttempt = async (subscriptionId: number) => {
    try {
      console.log('🔍 [Admin Delete] Attempting to delete subscription:', subscriptionId);

      // Find the subscription being deleted
      const subscription = filteredSubscriptions.find(s => s.id === subscriptionId);
      console.log('🔍 [Admin Delete] Found subscription:', subscription);

      if (!subscription || !subscription.lineId) {
        console.log('⚠️ [Admin Delete] No subscription or lineId found, showing normal delete dialog');
        setDeleteId(subscriptionId);
        return;
      }

      // Fetch line details to check if employee is supervisor
      console.log('🔍 [Admin Delete] Fetching line details for lineId:', subscription.lineId);
      const line = await lineApiService.getById(subscription.lineId);
      console.log('🔍 [Admin Delete] Line details:', line);
      console.log('🔍 [Admin Delete] Comparing supervisorId:', line.supervisorId, 'with employeeId:', subscription.employeeId);

      if (line.supervisorId === subscription.employeeId) {
        console.log('✅ [Admin Delete] Employee IS supervisor - preparing handover');
        // Employee is supervisor - need handover
        const candidates = line.subscriptions
          .filter(s => s.isActive && s.employeeId !== subscription.employeeId)
          .map(s => ({ id: s.employeeId, name: s.employeeName }));

        console.log('🔍 [Admin Delete] Handover candidates:', candidates);

        if (candidates.length === 0) {
          console.log('⚠️ [Admin Delete] No candidates available');
          toast.error(t('supervisor.noCandidates'));
          return;
        }

        // Show handover dialog
        console.log('✅ [Admin Delete] Showing handover dialog');
        setHandoverCandidates(candidates);
        setPendingLineId(subscription.lineId);
        setPendingSubscriptionId(subscriptionId);
        setShowHandover(true);
      } else {
        console.log('ℹ️ [Admin Delete] Employee is NOT supervisor - showing normal delete dialog');
        // Not a supervisor - normal delete
        setDeleteId(subscriptionId);
      }
    } catch (err) {
      console.error('❌ [Admin Delete] Error checking supervisor status:', err);
      // Fallback to normal delete on error
      setDeleteId(subscriptionId);
    }
  };

  const handleHandoverConfirm = async (newSupervisorId: string) => {
    if (!pendingLineId || !pendingSubscriptionId) return;

    try {
      setShowHandover(false);

      // First, handover supervision
      await lineApiService.handoverSupervisor(pendingLineId, newSupervisorId);
      toast.success(t('supervisor.handoverSuccess'));

      // Then delete the subscription
      await handleDelete(pendingSubscriptionId);

      // Clear pending state
      setPendingLineId(null);
      setPendingSubscriptionId(null);
      setHandoverCandidates([]);
    } catch (error) {
      console.error('Handover failed:', error);
      toast.error(t('supervisor.handoverError'));
    }
  };

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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isActive
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
          <Button variant="ghost" size="icon" onClick={() => handleDeleteAttempt(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ListLayout
        title={t('subscription.list')}
        createRoute={ROUTES.SUBSCRIPTION_CREATE}
        searchPlaceholder={t('subscription.searchPlaceholder')}
        noDataTitle={t('common.messages.noData')}
        noDataDescription={t('subscription.noSubscriptions')}
        noResultsTitle={t('common.messages.noResults')}
        deleteTitle={t('common.messages.confirmDeleteTitle')}
        deleteDescription={t('common.messages.confirmDeleteItem', { item: t('subscription.singular') })}
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

      {showHandover && (
        <SupervisorHandoverDialog
          open={showHandover}
          onOpenChange={(open) => {
            setShowHandover(open);
            if (!open) {
              setPendingLineId(null);
              setPendingSubscriptionId(null);
              setHandoverCandidates([]);
            }
          }}
          onConfirm={handleHandoverConfirm}
          candidates={handoverCandidates}
        />
      )}
    </>
  );
}