// src/pages/lines/LineList.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { EmptyState } from '@/components/atoms/EmptyState';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { DataTable, type ColumnDefinition } from '@/components/organisms/DataTable';
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
import { lineApiService } from '@/services/lineApiService';
import type { LineListDto } from '@/types';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function LineList() {
  const { t } = useTranslation();
  const [lines, setLines] = useState<LineListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadLines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await lineApiService.getAll();
      setLines(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error('Error loading lines:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadLines();
  }, [loadLines]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await lineApiService.delete(deleteId);
      toast.success(t('common.messages.deleteSuccess'));
      loadLines(); // Refresh the list
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error deleting line:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const columns: ColumnDefinition<LineListDto>[] = [
    { key: 'name', header: t('line.name') },
    {
      key: 'description',
      header: t('line.description'),
      cell: (line) => line.description || '-',
    },
    { key: 'supervisorName', header: t('line.supervisor') },
    {
      key: 'actions',
      header: t('common.actions.actions'),
      isAction: true,
      cell: (line) => (
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
        <PageTitle>{t('line.list')}</PageTitle>
        <Button asChild>
          <Link to={ROUTES.LINE_CREATE}>
            <Plus className="mr-2 h-4 w-4" />
            {t('line.create')}
          </Link>
        </Button>
      </div>

      {lines.length === 0 ? (
        <EmptyState
          title={t('common.messages.noData')}
          description={t('line.noLines')}
          actionLabel={t('line.create')}
          onAction={() => (window.location.href = ROUTES.LINE_CREATE)}
        />
      ) : (
        <DataTable columns={columns} data={lines} />
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.messages.confirmDeleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('common.messages.confirmDeleteLine')}
            </AlertDialogDescription>
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
