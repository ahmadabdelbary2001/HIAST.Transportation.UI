// src/pages/employees/EmployeeDetail.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    ArrowLeft, Edit, Eye, Phone, Mail, Building, 
    Route
} from 'lucide-react';import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/ui/button';
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
                <span>{employee.department}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- REPLACEMENT FOR Subscription Info Card --- */}
        <Card>
        <CardHeader>
            <CardTitle>{t('employee.subscriptionDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
            {employee.subscribedLineId && employee.subscribedLineName ? (
            // STATE 1: Employee IS subscribed
            <div className="space-y-4">
                <div>
                <p className="text-sm font-medium text-muted-foreground">{t('employee.subscribedLine')}</p>
                <div className="flex items-center gap-3 mt-1">
                    <Route className="h-5 w-5 text-primary" />
                    <p className="text-lg font-semibold">{employee.subscribedLineName}</p>
                </div>
                </div>
                <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                    <Link to={`/lines/${employee.subscribedLineId}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t('employee.actions.viewLine')}
                    </Link>
                </Button>
                </div>
            </div>
            ) : (
            // STATE 2: Employee is NOT subscribed
            <div className="text-center">
                <p className="text-muted-foreground mb-4">{t('employee.noSubscription')}</p>
            </div>
            )}
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
