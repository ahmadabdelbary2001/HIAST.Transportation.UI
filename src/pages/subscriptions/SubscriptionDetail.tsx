// src/pages/subscriptions/SubscriptionDetail.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  User,
  Route,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { lineSubscriptionApiService } from '@/services/lineSubscriptionApiService';
import type { LineSubscription } from '@/types';
import { ROUTES } from '@/lib/constants';

export default function SubscriptionDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<LineSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubscription = useCallback(
    async (subscriptionId: number) => {
      try {
        setLoading(true);
        setError(null);
        const data = await lineSubscriptionApiService.getById(subscriptionId);
        setSubscription(data);
      } catch (err) {
        setError(t('common.messages.error'));
        console.error('Error loading subscription:', err);
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    if (id) {
      loadSubscription(parseInt(id, 10));
    }
  }, [id, loadSubscription]);

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error || !subscription) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}>
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
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <PageTitle>{t('subscription.detail')}</PageTitle>
        </div>
        <Button asChild>
          <Link to={`/subscriptions/${subscription.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            {t('common.actions.edit')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Subscription Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('subscription.details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('subscription.status')}</p>
              <Badge
                variant={subscription.isActive ? 'default' : 'destructive'}
                className="mt-1 text-base"
              >
                {subscription.isActive ? (
                  <CheckCircle className="mr-2 h-4 w-4" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                {subscription.isActive ? t('subscription.active') : t('subscription.inactive')}
              </Badge>
            </div>

            {/* Employee */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('subscription.employee')}</p>
              <div className="flex items-center gap-3 mt-1">
                <User className="h-5 w-5 text-primary" />
                <Link
                  to={`/employees/${subscription.employeeId}`}
                  className="text-lg font-semibold text-primary hover:underline"
                >
                  {subscription.employeeName}
                </Link>
              </div>
            </div>

            {/* Line */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('subscription.line')}</p>
              <div className="flex items-center gap-3 mt-1">
                <Route className="h-5 w-5 text-primary" />
                <Link
                  to={`/lines/${subscription.lineId}`}
                  className="text-lg font-semibold text-primary hover:underline"
                >
                  {subscription.lineName}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('subscription.dates')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Start Date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('subscription.startDate')}</p>
                <p className="text-lg font-semibold">{formatDate(subscription.startDate)}</p>
              </div>
            </div>

            {/* End Date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('subscription.endDate')}</p>
                <p className="text-lg font-semibold">
                  {subscription.endDate ? formatDate(subscription.endDate) : t('subscription.noEndDate')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('common.auditInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{t('common.createdAt')}:</span>
            <span className="font-medium text-foreground">{formatDate(subscription.createdAt)}</span>
          </div>
          {subscription.updatedAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{t('common.updatedAt')}:</span>
              <span className="font-medium text-foreground">{formatDate(subscription.updatedAt)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
