// src/pages/employees/EmployeeList.tsx

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListLayout } from '@/components/templates/ListLayout';
import { useListPage } from '@/hooks/useListPage';
import { employeeApiService } from '@/services/employeeApiService';
import type { EmployeeListDto } from '@/types/index';
import { Department } from '@/types/enums';
import { ROUTES } from '@/lib/constants';
import { type ColumnDefinition } from '@/components/organisms/DataTable';

export default function EmployeeList() {
  const { t } = useTranslation();

  const {
    filteredItems: filteredEmployees,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterValue: departmentFilter,
    setFilterValue: setDepartmentFilter,
    deleteId,
    setDeleteId,
    loadItems,
    handleDelete,
    clearFilters,
    hasFilters,
  } = useListPage<EmployeeListDto>({
    searchFields: ['firstName', 'lastName', 'employeeNumber'],
    filterField: 'department',
    entityName: 'employee',
    getAll: employeeApiService.getAll,
    deleteItem: employeeApiService.delete,
  });

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const departmentFilterOptions = Object.values(Department).map((dept) => ({
    value: dept,
    label: t(`employee.departments.${dept}`),
  }));

  const columns: ColumnDefinition<EmployeeListDto>[] = [
    {
      key: 'employeeNumber',
      header: t('employee.employeeNumber'),
      cell: (item) => <span className="font-medium">{item.employeeNumber}</span>,
    },
    {
      key: 'firstName',
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

  return (
    <ListLayout
      title={t('employee.list')}
      createRoute={ROUTES.EMPLOYEE_CREATE}
      searchPlaceholder={t('employee.searchPlaceholder')}
      noDataTitle={t('common.messages.noData')}
      noDataDescription={t('employee.noEmployees')}
      noResultsTitle={t('common.messages.noResults')}
      deleteTitle={t('common.messages.confirmDeleteTitle')}
      deleteDescription={t('common.messages.confirmDeleteItem', { item: t('employee.singular') })}
      items={[]}
      filteredItems={filteredEmployees}
      loading={loading}
      error={error}
      columns={columns}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filterValue={departmentFilter}
      onFilterChange={setDepartmentFilter}
      filterOptions={departmentFilterOptions}
      onClearFilters={clearFilters}
      hasFilters={hasFilters}
      showFilter={true}
      filterPlaceholder={t('employee.filterByDepartment')}
      deleteId={deleteId}
      onDeleteClose={() => setDeleteId(null)}
      onDeleteConfirm={() => deleteId && handleDelete(deleteId)}
      countLabel={t('employee.employees')}
    />
  );
}
