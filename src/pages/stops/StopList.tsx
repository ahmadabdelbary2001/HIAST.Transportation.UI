// src/pages/stops/StopList.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { EmptyState } from '@/components/atoms/EmptyState';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { DataTable, type ColumnDefinition } from '@/components/organisms/DataTable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { stopApiService } from '@/services/stopApiService';
import type { StopListDto } from '@/types';
import { StopType } from '@/types/enums';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function StopList() {
  const { t } = useTranslation();
  const [stops, setStops] = useState<StopListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadStops = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stopApiService.getAll();
      setStops(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error('Error loading stops:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadStops();
  }, [loadStops]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await stopApiService.delete(deleteId);
      toast.success(t('common.messages.deleteSuccess'));
      loadStops();
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error deleting stop:', err);
    } finally {
      setDeleteId(null);
    }
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle>{t('stop.list')}</PageTitle>
        <Button asChild>
          <Link to={ROUTES.STOP_CREATE}>
            <Plus className="me-2 h-4 w-4" />
            {t('stop.create')}
          </Link>
        </Button>
      </div>

      {stops.length === 0 ? (
        <EmptyState title={t('common.messages.noData')} description={t('stop.noStops')} />
      ) : (
        <DataTable columns={columns} data={stops} />
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.messages.confirmDeleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('common.messages.confirmDeleteStop')}</AlertDialogDescription>
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
