// src/pages/subscriptions/SubscriptionList.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { EmptyState } from '@/components/atoms/EmptyState';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('subscription.noEndDate');
    return new Date(dateString).toLocaleDateString();
  };

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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('subscription.employeeName')}</TableHead>
                <TableHead>{t('subscription.lineName')}</TableHead>
                <TableHead>{t('subscription.startDate')}</TableHead>
                <TableHead>{t('subscription.endDate')}</TableHead>
                <TableHead className="text-right">{t('common.actions.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.employeeName}</TableCell>
                  <TableCell>{sub.lineName}</TableCell>
                  <TableCell>{formatDate(sub.startDate)}</TableCell>
                  <TableCell>{formatDate(sub.endDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/subscriptions/${sub.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(sub.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
