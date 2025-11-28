// src/pages/supervisors/SupervisorReport.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { EmptyState } from '@/components/atoms/EmptyState';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { DataTable, type ColumnDefinition } from '@/components/organisms/DataTable';
import { supervisorApiService } from '@/services/supervisorApiService';
import type { SupervisorLineDto } from '@/types';

export default function SupervisorReport() {
  const { t } = useTranslation();
  const [assignments, setAssignments] = useState<SupervisorLineDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const tableData = assignments.map(item => ({
    ...item,
    id: `${item.lineId}-${item.employeeId}`,
  }));

  const columns: ColumnDefinition<SupervisorLineDto>[] = [
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
      <div className="flex items-center justify-between">
        <PageTitle>{t('supervisor.reportTitle')}</PageTitle>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          title={t('common.messages.noData')}
          description={t('supervisor.noAssignments')}
        />
      ) : (
        <DataTable columns={columns} data={tableData} />
      )}
    </div>
  );
}
