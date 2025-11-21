// src/pages/employees/EmployeeList.tsx
import { useEffect, useState, useCallback } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { employeeService } from '@/services/employeeService';
import type { Employee } from '@/types/index';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function EmployeeList() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  const filterEmployees = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = employees.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.employeeNumber.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.department?.toLowerCase().includes(query)
    );
    setFilteredEmployees(filtered);
  }, [searchQuery, employees]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    filterEmployees();
  }, [filterEmployees]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await employeeService.delete(deleteId);
      toast.success(t('common.messages.deleteSuccess'));
      loadEmployees();
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error deleting employee:', err);
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('employee.employeeNumber')}</TableHead>
                <TableHead>{t('employee.fullName')}</TableHead>
                <TableHead>{t('employee.email')}</TableHead>
                <TableHead>{t('employee.department')}</TableHead>
                <TableHead>{t('employee.isActive')}</TableHead>
                <TableHead className="text-right">{t('common.actions.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.employeeNumber}</TableCell>
                  <TableCell>
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={employee.isActive ? 'default' : 'secondary'}>
                      {employee.isActive ? t('common.status.active') : t('common.status.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(employee.id)}
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