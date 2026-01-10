// src/pages/buses/BusDetail.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { busApiService } from '@/services/busApiService';
import type { Bus } from '@/types';
import { ROUTES } from '@/lib/constants';

export default function BusDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBus = useCallback(async (busId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await busApiService.getById(busId);
      setBus(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error('Error loading bus:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (id) {
      loadBus(parseInt(id));
    }
  }, [id, loadBus]);

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error || !bus) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(ROUTES.BUSES)}>
          <ArrowLeft className="me-2 h-4 w-4" />
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
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.BUSES)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <PageTitle>{t('bus.detail')}</PageTitle>
        </div>
        <Button asChild>
          <Link to={`/buses/${bus.id}/edit`}>
            <Edit className="me-2 h-4 w-4" />
            {t('common.actions.edit')}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('bus.information')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('bus.licensePlate')}</p>
            <p className="text-lg font-semibold">{bus.licensePlate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('bus.capacity')}</p>
            <p className="text-lg">{bus.capacity} {t('common.passengers')}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">{t('bus.status')}</p>
            <StatusBadge status={bus.status} type="bus" />
          </div>
          {bus.createdAt && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('common.createdAt')}</p>
              <p className="text-lg">{new Date(bus.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}