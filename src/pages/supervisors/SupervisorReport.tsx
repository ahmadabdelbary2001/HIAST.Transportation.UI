// src/pages/supervisors/SupervisorReport.tsx

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Search } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { EmptyState } from '@/components/atoms/EmptyState';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, type ColumnDefinition } from '@/components/organisms/DataTable';
import { supervisorApiService } from '@/services/supervisorApiService';
import type { SupervisorLineDto } from '@/types';

interface SupervisorLineWithId extends SupervisorLineDto {
  id: string;
}

export default function SupervisorReport() {
  const { t } = useTranslation();
  const [assignments, setAssignments] = useState<SupervisorLineDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supervisorApiService.getLineAssignments();
      setAssignments(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error('Error loading supervisor assignments:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const filteredAssignments = useMemo(() => {
    if (!searchTerm) return assignments;
    const lowercasedTerm = searchTerm.toLowerCase();
    return assignments.filter(assignment =>
      assignment.employeeName.toLowerCase().includes(lowercasedTerm) ||
      assignment.lineName.toLowerCase().includes(lowercasedTerm) ||
      assignment.employeeNumber.toLowerCase().includes(lowercasedTerm)
    );
  }, [assignments, searchTerm]);

  const tableData: SupervisorLineWithId[] = filteredAssignments.map(item => ({
    ...item,
    id: `${item.lineId}-${item.employeeId}`,
  }));

  const clearFilters = () => setSearchTerm('');

  const columns: ColumnDefinition<SupervisorLineWithId>[] = [
    { key: 'employeeNumber', header: t('supervisor.employeeNumber') },
    { key: 'employeeName', header: t('supervisor.supervisorName') },
    { key: 'lineName', header: t('supervisor.lineName') },
  ];

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-3">
        <PageTitle>{t('supervisor.reportTitle')}</PageTitle>
        <Badge variant="secondary" className="text-sm">
          {filteredAssignments.length} {t('supervisor.assignments')}
        </Badge>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t('common.search')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0 max-w-sm">
              <Input
                placeholder={t('supervisor.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                <X className="me-2 h-4 w-4" />
                {t('common.clearFilters')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          title={searchTerm ? t('common.messages.noResults') : t('common.messages.noData')}
          description={t('supervisor.noAssignments')}
        />
      ) : (
        <DataTable columns={columns} data={tableData} />
      )}
    </div>
  );
}