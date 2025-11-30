// src/pages/subscriptions/SubscriptionForm.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch'; // For the IsActive toggle
import { lineSubscriptionApiService } from '@/services/lineSubscriptionApiService';
import { employeeApiService } from '@/services/employeeApiService';
import { lineApiService } from '@/services/lineApiService';
import type {
  CreateLineSubscriptionDto,
  UpdateLineSubscriptionDto,
  EmployeeListDto,
  LineListDto,
} from '@/types';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

// Helper to format date for the input type="date"
const toInputDate = (date: string | Date) => new Date(date).toISOString().split('T')[0];

export default function SubscriptionForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = !!id;

  // State for form data
  const [formData, setFormData] = useState({
    employeeId: 0,
    lineId: 0,
    startDate: toInputDate(new Date()),
    endDate: '',
    isActive: true,
  });

  // State for dropdown options
  const [employees, setEmployees] = useState<EmployeeListDto[]>([]);
  const [lines, setLines] = useState<LineListDto[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Pre-fill employeeId from query params on create
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const employeeId = params.get('employeeId');
    if (employeeId && !isEdit) {
      setFormData((prev) => ({ ...prev, employeeId: parseInt(employeeId, 10) }));
    }
  }, [location.search, isEdit]);

  // Load existing subscription data in edit mode
  const loadSubscription = useCallback(
    async (subscriptionId: number) => {
      try {
        setFormLoading(true);
        const sub = await lineSubscriptionApiService.getById(subscriptionId);
        if (sub) {
          setFormData({
            employeeId: sub.employeeId,
            lineId: sub.lineId,
            startDate: toInputDate(sub.startDate),
            endDate: sub.endDate ? toInputDate(sub.endDate) : '',
            // If sub.isActive is undefined for any reason, default to false.
            isActive: sub.isActive ?? false,
          });
        }
      } catch (err) {
        toast.error(t('common.messages.error'));
        console.error("Failed to load subscription:", err); // Log the actual error
      } finally {
        setFormLoading(false);
      }
    },
    [t]
  );

  // Load employees and lines for dropdowns
  const loadDependencies = useCallback(async () => {
    try {
      const [employeeData, lineData] = await Promise.all([
        employeeApiService.getAll(),
        lineApiService.getAll(),
      ]);
      setEmployees(employeeData);
      setLines(lineData);
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error("Failed to load dependencies:", err);
    }
  }, [t]);

  useEffect(() => {
    loadDependencies();
    if (isEdit && id) {
      loadSubscription(parseInt(id, 10));
    }
  }, [id, isEdit, loadSubscription, loadDependencies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        const updateDto: UpdateLineSubscriptionDto = {
          id: parseInt(id, 10),
          employeeId: formData.employeeId,
          lineId: formData.lineId,
          startDate: formData.startDate,
          isActive: formData.isActive,
        };
        await lineSubscriptionApiService.update(updateDto);
        toast.success(t('common.messages.updateSuccess'));
      } else {
        const createDto: CreateLineSubscriptionDto = {
          employeeId: formData.employeeId,
          lineId: formData.lineId,
          startDate: formData.startDate,
          isActive: formData.isActive,
        };
        await lineSubscriptionApiService.create(createDto);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.SUBSCRIPTIONS);
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error saving subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return <LoadingSpinner text={t('common.messages.loadingData')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageTitle>{isEdit ? t('subscription.edit') : t('subscription.create')}</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? t('subscription.edit') : t('subscription.create')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Employee Select */}
              <div className="space-y-2">
                <Label htmlFor="employeeId">{t('subscription.employee')} *</Label>
                <Select
                  required
                  value={formData.employeeId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, employeeId: parseInt(value) })}
                  disabled={isEdit} // Usually can't change the employee on an existing sub
                >
                  <SelectTrigger><SelectValue placeholder={t('subscription.selectEmployee')} /></SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.firstName} {emp.lastName} ({emp.employeeNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Line Select */}
              <div className="space-y-2">
                <Label htmlFor="lineId">{t('subscription.line')} *</Label>
                <Select
                  required
                  value={formData.lineId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, lineId: parseInt(value) })}
                >
                  <SelectTrigger><SelectValue placeholder={t('subscription.selectLine')} /></SelectTrigger>
                  <SelectContent>
                    {lines.map((line) => (
                      <SelectItem key={line.id} value={line.id.toString()}>{line.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">{t('subscription.startDate')} *</Label>
                <Input
                  id="startDate"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              {/* End Date (Only in Edit Mode) */}
              {isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="endDate">{t('subscription.endDate')}</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              )}

              {/* IsActive Switch */}
              <div className="flex items-center space-x-4 rounded-md border p-4 col-span-full md:col-span-1">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{t('subscription.status')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.isActive ? t('subscription.active') : t('subscription.inactive')}
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? t('common.messages.saving') : t('common.actions.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}>
                {t('common.actions.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
