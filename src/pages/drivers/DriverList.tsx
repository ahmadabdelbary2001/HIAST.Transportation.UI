// src/pages/drivers/DriverList.tsx
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { EmptyState } from '@/components/atoms/EmptyState';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { driverApiService } from '@/services/driverApiService';
import type { Driver } from '@/types/index';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function DriverList() {
  const { t } = useTranslation();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await driverApiService.getAll();
      setDrivers(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error('Error loading drivers:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await driverApiService.delete(deleteId);
      toast.success(t('common.messages.deleteSuccess'));
      loadDrivers();
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error deleting driver:', err);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle>{t('driver.list')}</PageTitle>
        <Button asChild>
          <Link to={ROUTES.DRIVER_CREATE}>
            <Plus className="mr-2 h-4 w-4" />
            {t('driver.create')}
          </Link>
        </Button>
      </div>

      {drivers.length === 0 ? (
        <EmptyState
          title={t('common.messages.noData')}
          actionLabel={t('driver.create')}
          onAction={() => (window.location.href = ROUTES.DRIVER_CREATE)}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('driver.name')}</TableHead>
                <TableHead>{t('driver.licenseNumber')}</TableHead>
                <TableHead>{t('driver.contactInfo')}</TableHead>
                <TableHead className="text-right">{t('common.actions.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.licenseNumber}</TableCell>
                  <TableCell>{driver.contactInfo || '-'}</TableCell>
                  <TableCell className="text-right">
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(driver.id)}
                      >
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
            <AlertDialogTitle>{t('common.actions.delete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('common.messages.confirmDelete')}</AlertDialogDescription>
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