// src/pages/employees/EmployeeList.tsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { EmptyState } from '@/components/atoms/EmptyState';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { employeeApiService } from '@/services/employeeApiService';
import type { Employee } from '@/types/index';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function EmployeeList() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm] = useState('');
  
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeApiService.getAll();
      setEmployees(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await employeeApiService.delete(deleteId);
      toast.success(t('common.messages.deleteSuccess'));
      loadEmployees();
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error deleting employee:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter(
      (employee) =>
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // --- DEFINE COLUMNS FOR THE DATATABLE ---
  const columns: ColumnDefinition<Employee>[] = [
    { key: 'employeeNumber', header: t('employee.employeeNumber') },
    {
      key: 'firstName', // Key can be anything for custom cells, but firstName is descriptive
      header: t('employee.fullName'),
      cell: (employee) => `${employee.firstName} ${employee.lastName}`,
    },
    { key: 'email', header: t('employee.email') },
    { key: 'department', header: t('employee.department') },
    {
      key: 'isActive',
      header: t('employee.isActive'),
      cell: (employee) => (
        <Badge variant={employee.isActive ? 'default' : 'secondary'}>
          {employee.isActive ? t('common.status.active') : t('common.status.inactive')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: t('common.actions.actions'),
      isAction: true,
      cell: (employee) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/employees/${employee.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/employees/${employee.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(employee.id)}>
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
        <PageTitle>{t('employee.list')}</PageTitle>
        <Button asChild>
          <Link to={ROUTES.EMPLOYEE_CREATE}>
            <Plus className="mr-2 h-4 w-4" />
            {t('employee.create')}
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('common.actions.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <EmptyState
          title={t('common.messages.noResults')}
          actionLabel={t('employee.create')}
          onAction={() => (window.location.href = ROUTES.EMPLOYEE_CREATE)}
        />
      ) : (
        <DataTable columns={columns} data={filteredEmployees} />
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