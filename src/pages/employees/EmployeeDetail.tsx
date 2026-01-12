// src/pages/employees/EmployeeDetail.tsx

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Phone, Mail, Building, Route, Pencil, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { DetailHeader } from '@/components/atoms/DetailHeader';
import { DetailField } from '@/components/atoms/DetailField';
import { AuditInfoCard } from '@/components/atoms/AuditInfoCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { employeeApiService } from '@/services/employeeApiService';
import { useDetailPage } from '@/hooks/useDetailPage';
import type { EmployeeDto } from '@/types';
import { ROUTES } from '@/lib/constants';

export default function EmployeeDetail() {
  const { t } = useTranslation();
  const { data: employee, loading, error, navigate } = useDetailPage<EmployeeDto>({
    fetchFn: employeeApiService.getById,
    listRoute: ROUTES.EMPLOYEES,
  });

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error || !employee) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(ROUTES.EMPLOYEES)}>
          {t('common.actions.back')}
        </Button>
        <ErrorMessage message={error || t('common.messages.noData')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        title={t('employee.detail')}
        backRoute={ROUTES.EMPLOYEES}
        editRoute={`/employees/${employee.id}/edit`}
      />

      <Card>
        <CardHeader>
          <CardTitle>{employee.firstName} {employee.lastName}</CardTitle>
          <p className="text-sm text-muted-foreground pt-1">
            {t('employee.employeeNumber')}: {employee.employeeNumber}
          </p>
        </CardHeader>
        <CardContent className="grid gap-y-6 gap-x-4 md:grid-cols-3">
          <DetailField
            label={t('employee.email')}
            value={
              <a href={`mailto:${employee.email}`} className="text-primary hover:underline">
                {employee.email}
              </a>
            }
            icon={Mail}
            className="items-start"
          />

          {employee.phoneNumber && (
            <DetailField
              label={t('employee.phoneNumber')}
              value={
                <a href={`tel:${employee.phoneNumber}`} className="text-primary hover:underline">
                  {employee.phoneNumber}
                </a>
              }
              icon={Phone}
              className="items-start"
            />
          )}

          {employee.department && (
            <DetailField
              label={t('employee.department')}
              value={<span>{t(`employee.departments.${employee.department}`)}</span>}
              icon={Building}
              className="items-start"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('employee.subscriptionDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
          {employee.lineSubscriptionId && employee.subscribedLineName ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('subscription.status')}</p>
                <Badge
                  variant={employee.isSubscriptionActive ? 'default' : 'destructive'}
                  className="mt-1 text-base"
                >
                  {employee.isSubscriptionActive ? (
                    <CheckCircle className="me-2 h-4 w-4" />
                  ) : (
                    <XCircle className="me-2 h-4 w-4" />
                  )}
                  {employee.isSubscriptionActive ? t('subscription.active') : t('subscription.inactive')}
                </Badge>
              </div>

              <DetailField
                label={t('employee.subscribedLine')}
                value={
                  <Link to={`/lines/${employee.subscribedLineId}`} className="text-lg font-semibold text-primary hover:underline">
                    {employee.subscribedLineName}
                  </Link>
                }
                icon={Route}
              />

              <div className="flex flex-wrap items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/subscriptions/${employee.lineSubscriptionId}/edit`}>
                    <Pencil className="me-2 h-4 w-4" />
                    {t('employee.actions.editSubscription')}
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">{t('employee.noSubscription')}</p>
              <Button asChild>
                <Link to={`/subscriptions/create?employeeId=${employee.id}`}>
                  <PlusCircle className="me-2 h-4 w-4" />
                  {t('employee.actions.createSubscription')}
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AuditInfoCard createdAt={employee.createdAt} updatedAt={employee.updatedAt} />
    </div>
  );
}
