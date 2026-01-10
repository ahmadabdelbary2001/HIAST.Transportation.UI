// src/pages/buses/BusList.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { EmptyState } from '@/components/atoms/EmptyState';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Button } from '@/components/ui/button';
import { DataTable, type ColumnDefinition } from '@/components/organisms/DataTable'; // Import the new component
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { busApiService } from '@/services/busApiService';
import type { Bus } from '@/types';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function BusList() {
  const { t } = useTranslation();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadBuses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await busApiService.getAll();
      setBuses(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error('Error loading buses:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadBuses();
  }, [loadBuses]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await busApiService.delete(deleteId);
      toast.success(t('common.messages.deleteSuccess'));
      loadBuses();
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error deleting bus:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const columns: ColumnDefinition<Bus>[] = [
    { key: 'licensePlate', header: t('bus.licensePlate') },
    { key: 'capacity', header: t('bus.capacity') },
    {
      key: 'status',
      header: t('bus.status'),
      cell: (bus) => <StatusBadge status={bus.status} type="bus" />,
    },
    {
      key: 'createdAt',
      header: t('common.createdAt'),
      cell: (bus) => (bus.createdAt ? new Date(bus.createdAt).toLocaleDateString() : '-'),
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle>{t('bus.list')}</PageTitle>
        <Button asChild>
          <Link to={ROUTES.BUS_CREATE}>
            <Plus className="me-2 h-4 w-4" />
            {t('bus.create')}
          </Link>
        </Button>
      </div>

      {buses.length === 0 ? (
        <EmptyState
          title={t('common.messages.noData')}
          description={t('bus.noBuses')}
          actionLabel={t('bus.create')}
          onAction={() => (window.location.href = ROUTES.BUS_CREATE)}
        />
      ) : (
        <DataTable columns={columns} data={buses} />
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.actions.delete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('common.messages.confirmDeleteBus')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('common.actions.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}