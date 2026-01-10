// src/pages/drivers/DriverList.tsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { EmptyState } from '@/components/atoms/EmptyState';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { DataTable, type ColumnDefinition } from '@/components/organisms/DataTable';

export default function DriverList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredDrivers = useMemo(() => {
    let driversToFilter = [...drivers];
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      driversToFilter = driversToFilter.filter(driver =>
        `${driver.name}`.toLowerCase().includes(lowercasedSearchTerm) ||
        driver.licenseNumber.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    return driversToFilter;
  }, [drivers, searchTerm]);

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

      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder={t('driver.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredDrivers.length === 0 ? (
        <EmptyState
          title={t('common.messages.noResults')}
          description={t('driver.noDrivers')}
          actionLabel={t('driver.create')}
          onAction={() => navigate(ROUTES.DRIVER_CREATE)}
        />
      ) : (
        <DataTable columns={columns} data={filteredDrivers} />
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.actions.delete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('common.messages.confirmDeleteDriver')}</AlertDialogDescription>
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