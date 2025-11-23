// src/pages/drivers/DriverDetail.tsx
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Phone } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { driverApiService } from '@/services/driverApiService';
import type { Driver } from '@/types/index';
import { ROUTES } from '@/lib/constants';

export default function DriverDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDriver = useCallback(async (driverId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await driverApiService.getById(driverId);
      setDriver(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error('Error loading driver:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (id) {
      loadDriver(parseInt(id));
    }
  }, [id, loadDriver]);

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error || !driver) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(ROUTES.DRIVERS)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.actions.back')}
        </Button>
        <ErrorMessage message={error || t('common.messages.noData')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.DRIVERS)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <PageTitle>{t('driver.detail')}</PageTitle>
        </div>
        <Button asChild>
          <Link to={`/drivers/${driver.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            {t('common.actions.edit')}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('driver.personalInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('driver.name')}</p>
            <p className="text-lg font-semibold">{driver.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('driver.licenseNumber')}</p>
            <p className="text-lg">{driver.licenseNumber}</p>
          </div>
          {driver.contactInfo && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${driver.contactInfo}`} className="text-primary hover:underline">
                {driver.contactInfo}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}