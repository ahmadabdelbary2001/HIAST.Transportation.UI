// src/pages/subscriptions/SubscriptionList.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { EmptyState } from '@/components/atoms/EmptyState';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, type ColumnDefinition } from '@/components/organisms/DataTable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { lineSubscriptionApiService } from '@/services/lineSubscriptionApiService';
import type { LineSubscriptionListDto } from '@/types';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function SubscriptionList() {
  const { t } = useTranslation();
  const [subscriptions, setSubscriptions] = useState<LineSubscriptionListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await lineSubscriptionApiService.getAll();
      setSubscriptions(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error('Error loading subscriptions:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await lineSubscriptionApiService.delete(deleteId);
      toast.success(t('common.messages.deleteSuccess'));
      loadSubscriptions();
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error deleting subscription:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const columns: ColumnDefinition<LineSubscriptionListDto>[] = [
    { key: 'employeeName', header: t('subscription.employeeName') },
    { key: 'lineName', header: t('subscription.lineName') },
    {
      key: 'isActive',
      header: t('subscription.status'),
      cell: (sub) => (
        <Badge variant={sub.isActive ? 'default' : 'destructive'}>
          {sub.isActive ? t('subscription.active') : t('subscription.inactive')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: t('common.actions.actions'),
      isAction: true,
      cell: (sub) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/subscriptions/${sub.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/subscriptions/${sub.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(sub.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner text={t('common.messages.loadingData')} />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle>{t('subscription.list')}</PageTitle>
        <Button asChild>
          <Link to={ROUTES.SUBSCRIPTION_CREATE}>
            <Plus className="mr-2 h-4 w-4" />
            {t('subscription.create')}
          </Link>
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        <EmptyState title={t('common.messages.noData')} description={t('subscription.noSubscriptions')} />
      ) : (
        <DataTable
          columns={columns}
          data={subscriptions}
          rowClassName={(subscription) => 
            !subscription.isActive ? 'bg-muted/50 opacity-70' : ''
          }
        />
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.messages.confirmDeleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('common.messages.confirmDeleteSubscription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>{t('common.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('common.actions.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
