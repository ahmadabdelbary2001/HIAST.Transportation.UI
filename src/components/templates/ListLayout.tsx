import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ListHeader } from '@/components/organisms/ListHeader';
import { SearchAndFilter } from '@/components/organisms/SearchAndFilter';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { EmptyState } from '@/components/atoms/EmptyState';
import { DeleteConfirmationDialog } from '@/components/organisms/DeleteConfirmationDialog';
import { DataTable, type ColumnDefinition } from '@/components/organisms/DataTable';

interface FilterOption {
  value: string;
  label: string;
}

interface ListLayoutProps<T> {
  // Configuration
  title: string;
  createRoute?: string;
  searchPlaceholder: string;
  noDataTitle: string;
  noDataDescription: string;
  noResultsTitle: string;
  deleteTitle: string;
  deleteDescription: string;

  // Data
  items: T[];
  filteredItems: T[];
  loading: boolean;
  error: string | null;
  columns: ColumnDefinition<T>[];

  // Search & Filter
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions?: FilterOption[];
  onClearFilters: () => void;
  hasFilters: boolean;
  showFilter?: boolean;
  filterPlaceholder?: string;

  // Delete
  deleteId: number | string | null;
  onDeleteClose: () => void;
  onDeleteConfirm: () => void;

  // Optional
  countLabel: string;
  children?: ReactNode;
}

export function ListLayout<T extends { id: number | string }>({
  title,
  createRoute,
  searchPlaceholder,
  noDataTitle,
  noDataDescription,
  noResultsTitle,
  deleteTitle,
  deleteDescription,
  filteredItems,
  loading,
  error,
  columns,
  searchTerm,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions = [],
  onClearFilters,
  hasFilters,
  showFilter = false,
  filterPlaceholder,
  deleteId,
  onDeleteClose,
  onDeleteConfirm,
  countLabel,
  children,
}: ListLayoutProps<T>) {
  const { t } = useTranslation();

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const showSearchAndFilter = showFilter || searchPlaceholder;

  return (
    <div className="space-y-6">
      <ListHeader
        title={title}
        count={filteredItems.length}
        countLabel={countLabel}
        createRoute={createRoute}
        createLabel={createRoute ? t('common.actions.create') : undefined}
      >
        {children}
      </ListHeader>

      {showSearchAndFilter && (
        <SearchAndFilter
          searchPlaceholder={searchPlaceholder}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filterPlaceholder={filterPlaceholder}
          filterValue={filterValue}
          onFilterChange={onFilterChange}
          filterOptions={filterOptions}
          onClearFilters={onClearFilters}
          hasFilters={hasFilters}
          showFilter={showFilter}
          title={showFilter ? t('common.searchAndFilter') : t('common.search')}
        />
      )}

      {filteredItems.length === 0 ? (
        <EmptyState
          title={hasFilters ? noResultsTitle : noDataTitle}
          description={noDataDescription}
          actionLabel={createRoute ? t('common.actions.create') : undefined}
          onAction={createRoute ? () => window.location.href = createRoute! : undefined}
        />
      ) : (
        <DataTable columns={columns} data={filteredItems} />
      )}

      <DeleteConfirmationDialog
        isOpen={deleteId !== null}
        onClose={onDeleteClose}
        onConfirm={onDeleteConfirm}
        title={deleteTitle}
        description={deleteDescription}
      />
    </div>
  );
}
