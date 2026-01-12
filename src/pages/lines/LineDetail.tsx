// src/pages/lines/LineDetail.tsx

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Users, CheckCircle, XCircle,
  UserCog, UserSquare, Bus, MapPin, Pencil, PlusCircle 
} from 'lucide-react';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { DetailHeader } from '@/components/atoms/DetailHeader';
import { DetailField } from '@/components/atoms/DetailField';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { lineApiService } from '@/services/lineApiService';
import { useDetailPage } from '@/hooks/useDetailPage';
import type { Line } from '@/types';
import { ROUTES } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';

export default function LineDetail() {
  const { t } = useTranslation();
  const { data: line, loading, error, navigate } = useDetailPage<Line>({
    fetchFn: lineApiService.getById,
    listRoute: ROUTES.LINES,
  });

  const { activeSubscribers, inactiveSubscribers } = useMemo(() => {
    if (!line?.subscriptions) {
      return { activeSubscribers: [], inactiveSubscribers: [] };
    }
    const subscriptions = line.subscriptions;
    const active: Line['subscriptions'] = [];
    const inactive: Line['subscriptions'] = [];
    subscriptions.forEach(sub => {
      if (sub.isActive) {
        active.push(sub);
      } else {
        inactive.push(sub);
      }
    });
    return { activeSubscribers: active, inactiveSubscribers: inactive };
  }, [line?.subscriptions]);

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error || !line) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(ROUTES.LINES)}>
          {t('common.actions.back')}
        </Button>
        <ErrorMessage message={error || t('common.messages.noData')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        title={t('line.detail')}
        backRoute={ROUTES.LINES}
        editRoute={`/lines/${line.id}/edit`}
      />

      <Card>
        <CardHeader>
          <CardTitle>{line.name}</CardTitle>
          {line.description && (
            <p className="text-sm text-muted-foreground pt-1">{line.description}</p>
          )}
        </CardHeader>
        <CardContent className="grid gap-y-6 gap-x-4 md:grid-cols-3">
          <DetailField
            label={t('line.supervisor')}
            value={
              <Link to={`/employees/${line.supervisorId}`} className="font-semibold text-primary hover:underline">
                {line.supervisorName}
              </Link>
            }
            icon={UserCog}
            className="items-start"
          />

          <DetailField
            label={t('line.driver')}
            value={
              <Link to={`/drivers/${line.driverId}`} className="font-semibold text-primary hover:underline">
                {line.driverName}
              </Link>
            }
            icon={UserSquare}
            className="items-start"
          />

          <DetailField
            label={t('line.bus')}
            value={
              <Link to={`/buses/${line.busId}`} className="font-semibold text-primary hover:underline">
                {line.busLicensePlate}
              </Link>
            }
            icon={Bus}
            className="items-start"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('line.stops')}</CardTitle>
        </CardHeader>
        <CardContent>
          {line.stops.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('line.noStops')}</p>
          ) : (
            <div className="relative ps-6">
              <div className="absolute start-3 top-0 h-full w-0.5 bg-muted" />
              
              <ol className="space-y-8">
                {line.stops.map((stop) => (
                  <li key={stop.id} className="relative flex items-center gap-4">
                    <div className="absolute -start-3.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                      <MapPin className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="ms-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t('line.stop')} #{stop.sequenceOrder}
                      </p>
                      <Link
                        to={`/stops/${stop.id}`}
                        className="font-semibold text-primary hover:underline"
                        title={t('line.viewStopDetails')}
                      >
                        {stop.address}
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* --- Group for Title and Button on the left --- */}
            <div className="flex items-center gap-4">
              <CardTitle>{t('line.subscribers')}</CardTitle>
              <Button asChild size="sm">
                <Link to={`/subscriptions/create?lineId=${line.id}`}>
                  <PlusCircle className="me-2 h-4 w-4" />
                  {/* --- Use the new, more specific translation key --- */}
                  {t('line.addSubscriber')}
                </Link>
              </Button>
            </div>
            
            {/* --- Badge remains on the right --- */}
            <Badge variant="secondary" className="text-base">
              {activeSubscribers.length} {t('line.activeSubscribers')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {line.subscriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('line.noSubscribers')}</p>
          ) : (
            <ul className="space-y-3">
              {/* Render Active Subscribers */}
              {activeSubscribers.map((sub) => (
                <li key={sub.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Link to={`/employees/${sub.employeeId}`} className="font-medium text-primary hover:underline">
                      {sub.employeeName}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="hidden sm:flex">
                      <CheckCircle className="me-2 h-4 w-4" />
                      {t('subscription.active')}
                    </Badge>
                    <Button asChild variant="ghost" size="icon">
                      <Link to={`/subscriptions/${sub.id}/edit`} title={t('employee.actions.editSubscription')}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}

              {activeSubscribers.length > 0 && inactiveSubscribers.length > 0 && (
                <li className="py-2">
                  <Separator />
                </li>
              )}

              {/* Render Inactive Subscribers */}
              {inactiveSubscribers.map((sub) => (
                <li
                  key={sub.id}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50 opacity-70 hover:opacity-100"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Link to={`/employees/${sub.employeeId}`} className="font-medium text-primary hover:underline">
                      {sub.employeeName}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="hidden sm:flex">
                      <XCircle className="me-2 h-4 w-4" />
                      {t('subscription.inactive')}
                    </Badge>
                    <Button asChild variant="ghost" size="icon">
                      <Link to={`/subscriptions/${sub.id}/edit`} title={t('employee.actions.editSubscription')}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
