// src/pages/employees/EmployeeList.tsx

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, X } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { EmptyState } from '@/components/atoms/EmptyState';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { DataTable, type ColumnDefinition } from '@/components/organisms/DataTable';
import { employeeApiService } from '@/services/employeeApiService';
import type { EmployeeListDto } from '@/types/index';
import { Department } from '@/types/enums';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function EmployeeList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<EmployeeListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

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
    return employees.filter((emp) => {
      const matchesSearchTerm =
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        departmentFilter === 'all' || emp.department === departmentFilter;

      return matchesSearchTerm && matchesDepartment;
    });
  }, [employees, searchTerm, departmentFilter]);

  const columns: ColumnDefinition<EmployeeListDto>[] = [
    {
      key: 'employeeNumber',
      header: t('employee.employeeNumber'),
      cell: (item) => <span className="font-medium">{item.employeeNumber}</span>,
    },
    {
      key: 'firstName', // Key can be anything for custom cells, but firstName is descriptive
      header: t('employee.fullName'),
      cell: (employee) => `${employee.firstName} ${employee.lastName}`,
    },
    {
      key: 'department',
      header: t('employee.department'),
      cell: (item) => item.department ? t(`employee.departments.${item.department}`) : '-',
    },
    {
      key: 'actions',
      header: t('common.actions.actions'),
      isAction: true,
      cell: (item) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/employees/${item.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/employees/${item.id}/edit`}>
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

      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder={t('employee.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder={t('employee.filterByDepartment')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            {Object.values(Department).map((dept) => (
              <SelectItem key={dept} value={dept}>
                {t(`employee.departments.${dept}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {(searchTerm || departmentFilter !== 'all') && (
            <Button variant="ghost" onClick={() => { setSearchTerm(''); setDepartmentFilter('all'); }}>
                <X className="mr-2 h-4 w-4" />
                {t('common.clearFilters')}
            </Button>
        )}
      </div>

      {filteredEmployees.length === 0 ? (
        <EmptyState
          title={t('common.messages.noResults')}
          description={t('employee.noEmployees')}
          actionLabel={t('employee.create')}
          onAction={() => navigate(ROUTES.EMPLOYEE_CREATE)}
        />
      ) : (
        <DataTable columns={columns} data={filteredEmployees} />
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.messages.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('employee.confirmDelete')}</AlertDialogDescription>
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
