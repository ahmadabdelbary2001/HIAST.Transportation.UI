// src/pages/employees/EmployeeList.tsx

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListLayout } from '@/components/templates/ListLayout';
import { useListPage } from '@/hooks/useListPage';
import { employeeApiService } from '@/services/employeeApiService';
import type { EmployeeListDto } from '@/types/index';
import { Department } from '@/types/enums';
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
    loadItems,
    clearFilters,
    hasFilters,
  } = useListPage<EmployeeListDto>({
    searchFields: ['firstName', 'lastName', 'employeeNumber'],
    filterField: 'department',
    entityName: 'employee',
    getAll: employeeApiService.getAll,
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
      key: 'userName',
      header: t('auth.username'), // Ensure translation key exists or use hardcoded string if needed 'Username'
      cell: (item) => item.userName || '-',
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
            <Link to={`/employees/detail/${item.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ListLayout
      title={t('employee.list')}
      searchPlaceholder={t('employee.searchPlaceholder')}
      noDataTitle={t('common.messages.noData')}
      noDataDescription={t('employee.noEmployees')}
      noResultsTitle={t('common.messages.noResults')}
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
      countLabel={t('employee.employees')}
    />
  );
}
