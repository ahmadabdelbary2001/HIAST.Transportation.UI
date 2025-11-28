// src/components/organisms/DataTable.tsx

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'; // Your existing table components
import { cn } from '@/lib/utils';

// Define the shape of a column
export interface ColumnDefinition<T> {
  key: keyof T | 'actions'; // The key from the data object, or a special 'actions' key
  header: string; // The translated header text
  isAction?: boolean; // Flag to identify the actions column
  cell?: (item: T) => React.ReactNode; // Optional custom cell renderer
}

interface DataTableProps<T> {
  columns: ColumnDefinition<T>[];
  data: T[];
}

export function DataTable<T extends { id: React.Key }>({ columns, data }: DataTableProps<T>) {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  // This function determines the correct alignment class based on language and column type
  const getHeaderAlignment = (isActionColumn?: boolean) => {
    if (isActionColumn) {
      return isRtl ? 'text-left' : 'text-right'; // Actions are opposite to text direction
    }
    return isRtl ? 'text-right' : 'text-left'; // Data columns follow text direction
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)} className={getHeaderAlignment(col.isAction)}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((col) => (
                <TableCell
                  key={`${item.id}-${String(col.key)}`}
                  className={cn('font-medium', getHeaderAlignment(col.isAction))}
                >
                  {col.cell
                    ? col.cell(item)
                    : col.key !== 'actions'
                    ? (item[col.key as keyof T] as React.ReactNode)
                    : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
