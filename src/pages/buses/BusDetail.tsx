// src/pages/buses/BusDetail.tsx

import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { DetailHeader } from '@/components/atoms/DetailHeader';
import { DetailField } from '@/components/atoms/DetailField';
import { AuditInfoCard } from '@/components/atoms/AuditInfoCard';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { busApiService } from '@/services/busApiService';
import { useDetailPage } from '@/hooks/useDetailPage';
import type { Bus } from '@/types';
import { ROUTES } from '@/lib/constants';

export default function BusDetail() {
  const { t } = useTranslation();
  const { data: bus, loading, error, navigate } = useDetailPage<Bus>({
    fetchFn: busApiService.getById,
    listRoute: ROUTES.BUSES,
  });

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error || !bus) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(ROUTES.BUSES)}>
          {t('common.actions.back')}
        </Button>
        <ErrorMessage message={error || t('common.messages.noData')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        title={t('bus.detail')}
        backRoute={ROUTES.BUSES}
        editRoute={`/buses/${bus.id}/edit`}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('bus.information')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailField
            label={t('bus.licensePlate')}
            value={<span className="text-lg font-semibold">{bus.licensePlate}</span>}
          />
          <DetailField
            label={t('bus.capacity')}
            value={
              <span className="text-lg">
                {bus.capacity} {t('common.passengers')}
              </span>
            }
          />
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">{t('bus.status')}</p>
            <StatusBadge status={bus.status} type="bus" />
          </div>
        </CardContent>
      </Card>

      <AuditInfoCard createdAt={bus.createdAt} updatedAt={bus.updatedAt} />
    </div>
  );
}