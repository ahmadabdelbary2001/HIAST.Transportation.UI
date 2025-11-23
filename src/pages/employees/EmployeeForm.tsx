// src/pages/employees/EmployeeForm.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { employeeApiService } from '@/services/employeeApiService';
import type { CreateEmployeeDto, UpdateEmployeeDto } from '@/types/index';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function EmployeeForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState<CreateEmployeeDto>({
    employeeNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    isActive: true,
  });

  const loadEmployee = useCallback(async (employeeId: number) => {
    try {
      setFormLoading(true);
      const employee = await employeeApiService.getById(employeeId);
      if (employee) {
        setFormData({
          employeeNumber: employee.employeeNumber,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phoneNumber: employee.phoneNumber || '',
          department: employee.department || '',
          isActive: employee.isActive,
        });
      }
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error loading employee:', err);
    } finally {
      setFormLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isEdit && id) {
      loadEmployee(parseInt(id));
    }
  }, [id, isEdit, loadEmployee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        await employeeApiService.update({ ...formData, id: parseInt(id) } as UpdateEmployeeDto & { id: number });
        toast.success(t('common.messages.updateSuccess'));
      } else {
        await employeeApiService.create(formData);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.EMPLOYEES);
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error saving employee:', err);
    } finally {
      setLoading(false);
    }
  };

  if (formLoading && isEdit) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.EMPLOYEES)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageTitle>{isEdit ? t('employee.edit') : t('employee.create')}</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? t('employee.edit') : t('employee.create')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeNumber">{t('employee.employeeNumber')} *</Label>
                <Input
                  id="employeeNumber"
                  required
                  value={formData.employeeNumber}
                  onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('employee.email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">{t('employee.firstName')} *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">{t('employee.lastName')} *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t('employee.phoneNumber')}</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">{t('employee.department')}</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">{t('employee.isActive')}</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? t('common.messages.saving') : t('common.actions.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(ROUTES.EMPLOYEES)}>
                {t('common.actions.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}