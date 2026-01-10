// src/pages/employees/EmployeeDetail.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    ArrowLeft, Edit, Eye, Phone, Mail, Building, 
    Route, Pencil, PlusCircle, Clock, CheckCircle, XCircle 
} from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { employeeApiService } from '@/services/employeeApiService';
import type { EmployeeDto } from '@/types';
import { ROUTES } from '@/lib/constants';

export default function EmployeeDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployee = useCallback(async (employeeId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeApiService.getById(employeeId);
      setEmployee(data);
    } catch (err) {
      setError(t('common.messages.error'));
      console.error('Error loading employee:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (id) {
      loadEmployee(parseInt(id));
    }
  }, [id, loadEmployee]);

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  if (error || !employee) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(ROUTES.EMPLOYEES)}>
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
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.EMPLOYEES)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <PageTitle>{t('employee.detail')}</PageTitle>
        </div>
        <Button asChild>
          <Link to={`/employees/${employee.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            {t('common.actions.edit')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('employee.personalInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('employee.fullName')}</p>
              <p className="text-lg font-semibold">
                {employee.firstName} {employee.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('employee.employeeNumber')}</p>
              <p className="text-lg">{employee.employeeNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${employee.email}`} className="text-primary hover:underline">
                {employee.email}
              </a>
            </div>
            {employee.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${employee.phoneNumber}`} className="text-primary hover:underline">
                  {employee.phoneNumber}
                </a>
              </div>
            )}
            {employee.department && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{t(`employee.departments.${employee.department}`)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('employee.subscriptionDetails')}</CardTitle>
          </CardHeader>
          <CardContent>
            {employee.lineSubscriptionId && employee.subscribedLineName ? (
              // STATE 1: Employee IS subscribed
              <div className="space-y-6">
                {/* Subscription Status */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('subscription.status')}</p>
                  <Badge
                    variant={employee.isSubscriptionActive ? 'default' : 'destructive'}
                    className="mt-1 text-base"
                  >
                    {employee.isSubscriptionActive ? (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    {employee.isSubscriptionActive ? t('subscription.active') : t('subscription.inactive')}
                  </Badge>
                </div>

                {/* Line Info */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('employee.subscribedLine')}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <Route className="h-5 w-5 text-primary" />
                    <p className="text-lg font-semibold">{employee.subscribedLineName}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/lines/${employee.subscribedLineId}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t('employee.actions.viewLine')}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/subscriptions/${employee.lineSubscriptionId}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      {t('employee.actions.editSubscription')}
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              // STATE 2: Employee is NOT subscribed
              <div className="text-center">
                <p className="text-muted-foreground mb-4">{t('employee.noSubscription')}</p>
                <Button asChild>
                  <Link to={`/subscriptions/create?employeeId=${employee.id}`}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('employee.actions.createSubscription')}
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- Audit Info Card --- */}
        <Card>
            <CardHeader>
            <CardTitle>{t('common.auditInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{t('common.createdAt')}:</span>
                <span className="font-medium text-foreground">{formatDate(employee.createdAt)}</span>
            </div>
            {employee.updatedAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{t('common.updatedAt')}:</span>
                <span className="font-medium text-foreground">{formatDate(employee.updatedAt)}</span>
                </div>
            )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
