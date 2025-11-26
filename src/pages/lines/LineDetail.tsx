// src/pages/lines/LineDetail.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { lineApiService } from '@/services/lineApiService';
import type { Line } from '@/types';
import { ROUTES } from '@/lib/constants';

export default function LineDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [line, setLine] = useState<Line | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLine = useCallback(async (lineId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await lineApiService.getById(lineId);
      setLine(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error('Error loading line:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (id) {
      loadLine(parseInt(id));
    }
  }, [id, loadLine]);

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error || !line) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(ROUTES.LINES)}>
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
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.LINES)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <PageTitle>{t('line.detail')}</PageTitle>
        </div>
        <Button asChild>
          <Link to={`/lines/${line.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            {t('common.actions.edit')}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{line.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{line.description}</p>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t('line.supervisor')}</p>
            <p className="font-semibold">{line.supervisorName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t('line.driver')}</p>
            <p className="font-semibold">{line.driverName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t('line.bus')}</p>
            <p className="font-semibold">{line.busLicensePlate}</p>
          </div>
        </CardContent>
      </Card>

      {/* You can add sections for Stops and Subscriptions here later */}
    </div>
  );
}
