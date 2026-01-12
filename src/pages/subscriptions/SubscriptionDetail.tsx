// src/pages/subscriptions/SubscriptionDetail.tsx

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { User, Route, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { DetailHeader } from '@/components/atoms/DetailHeader';
import { DetailField } from '@/components/atoms/DetailField';
import { AuditInfoCard } from '@/components/atoms/AuditInfoCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { lineSubscriptionApiService } from '@/services/lineSubscriptionApiService';
import { useDetailPage } from '@/hooks/useDetailPage';
import type { LineSubscription } from '@/types';
import { ROUTES } from '@/lib/constants';

export default function SubscriptionDetail() {
  const { t } = useTranslation();
  const { data: subscription, loading, error, navigate, formatDate } = useDetailPage<LineSubscription>({
    fetchFn: lineSubscriptionApiService.getById,
    listRoute: ROUTES.SUBSCRIPTIONS,
  });

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error || !subscription) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}>
          {t('common.actions.back')}
        </Button>
        <ErrorMessage message={error || t('common.messages.noData')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        title={t('subscription.detail')}
        backRoute={ROUTES.SUBSCRIPTIONS}
        editRoute={`/subscriptions/${subscription.id}/edit`}
      />

      <Card>
        <CardHeader>
          <CardTitle>{subscription.employeeName}</CardTitle>
          <p className="text-sm text-muted-foreground pt-1">
            {t('subscription.line')}: {subscription.lineName}
          </p>
        </CardHeader>
        <CardContent className="grid gap-y-6 gap-x-4 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">{t('subscription.status')}</p>
            <Badge
              variant={subscription.isActive ? 'default' : 'destructive'}
              className="text-base"
            >
              {subscription.isActive ? (
                <CheckCircle className="me-2 h-4 w-4" />
              ) : (
                <XCircle className="me-2 h-4 w-4" />
              )}
              {subscription.isActive ? t('subscription.active') : t('subscription.inactive')}
            </Badge>
          </div>

          <DetailField
            label={t('subscription.employee')}
            value={
              <Link
                to={`/employees/${subscription.employeeId}`}
                className="text-primary hover:underline"
              >
                {subscription.employeeName}
              </Link>
            }
            icon={User}
            className="items-start"
          />

          <DetailField
            label={t('subscription.line')}
            value={
              <Link
                to={`/lines/${subscription.lineId}`}
                className="text-primary hover:underline"
              >
                {subscription.lineName}
              </Link>
            }
            icon={Route}
            className="items-start"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('subscription.dates')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-y-6 gap-x-4 md:grid-cols-2">
          <DetailField
            label={t('subscription.startDate')}
            value={<span>{formatDate(subscription.startDate)}</span>}
            icon={Calendar}
            className="items-start"
          />

          <DetailField
            label={t('subscription.endDate')}
            value={
              <span>
                {subscription.endDate ? formatDate(subscription.endDate) : t('subscription.noEndDate')}
              </span>
            }
            icon={Calendar}
            className="items-start"
          />
        </CardContent>
      </Card>

      <AuditInfoCard createdAt={subscription.createdAt} updatedAt={subscription.updatedAt} />
    </div>
  );
}
