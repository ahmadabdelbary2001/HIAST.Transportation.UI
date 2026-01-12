// src/pages/drivers/DriverDetail.tsx

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Phone, Bus as BusIcon, Route } from 'lucide-react';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { DetailHeader } from '@/components/atoms/DetailHeader';
import { DetailField } from '@/components/atoms/DetailField';
import { AuditInfoCard } from '@/components/atoms/AuditInfoCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { driverApiService } from '@/services/driverApiService';
import { useDetailPage } from '@/hooks/useDetailPage';
import type { Driver } from '@/types/index';
import { ROUTES } from '@/lib/constants';

export default function DriverDetail() {
  const { t } = useTranslation();
  const { data: driver, loading, error, navigate } = useDetailPage<Driver>({
    fetchFn: driverApiService.getById,
    listRoute: ROUTES.DRIVERS,
  });

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error || !driver) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(ROUTES.DRIVERS)}>
          {t('common.actions.back')}
        </Button>
        <ErrorMessage message={error || t('common.messages.noData')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        title={t('driver.detail')}
        backRoute={ROUTES.DRIVERS}
        editRoute={`/drivers/${driver.id}/edit`}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('driver.personalInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailField
            label={t('driver.name')}
            value={<span className="text-lg font-semibold">{driver.name}</span>}
          />
          <DetailField
            label={t('driver.licenseNumber')}
            value={<span className="text-lg">{driver.licenseNumber}</span>}
          />
          {driver.contactInfo && (
            <DetailField
              label={t('driver.contactInfo')}
              value={
                <a href={`tel:${driver.contactInfo}`} className="text-primary hover:underline">
                  {driver.contactInfo}
                </a>
              }
              icon={Phone}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('driver.assignmentDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
          {driver.lineId && driver.lineName ? (
            <div className="space-y-6">
              <div>
                <DetailField
                  label={t('driver.assignedLine')}
                  value={
                    <Link
                      to={`/lines/${driver.lineId}`}
                      className="text-lg font-semibold text-primary hover:underline"
                    >
                      {driver.lineName}
                    </Link>
                  }
                  icon={Route}
                />
              </div>

              {driver.busId && driver.busLicensePlate && (
                <div>
                  <DetailField
                    label={t('driver.assignedBus')}
                    value={
                      <Link
                        to={`/buses/${driver.busId}`}
                        className="text-lg font-semibold text-primary hover:underline"
                      >
                        {driver.busLicensePlate}
                      </Link>
                    }
                    icon={BusIcon}
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">{t('driver.noLineAssigned')}</p>
          )}
        </CardContent>
      </Card>

      <AuditInfoCard createdAt={driver.createdAt} updatedAt={driver.updatedAt} />
    </div>
  );
}