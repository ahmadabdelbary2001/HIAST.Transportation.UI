// src/pages/subscriptions/SubscriptionForm.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { lineSubscriptionApiService } from '@/services/lineSubscriptionApiService';
import { lineApiService } from '@/services/lineApiService';
import { employeeApiService } from '@/services/employeeApiService'; // Assuming you have this service
import type { CreateLineSubscriptionDto, UpdateLineSubscriptionDto, LineListDto, Employee } from '@/types';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function SubscriptionForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [formData, setFormData] = useState<CreateLineSubscriptionDto>({
    employeeId: 0,
    lineId: 0,
    startDate: new Date().toISOString().split('T')[0], // Default to today
    endDate: '',
  });
  const [lines, setLines] = useState<LineListDto[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const loadRelatedData = useCallback(async () => {
    try {
      const [lineData, employeeData] = await Promise.all([
        lineApiService.getAll(),
        employeeApiService.getAll(), // You'll need to create this service if it doesn't exist
      ]);
      setLines(lineData);
      setEmployees(employeeData);
    } catch {
      toast.error(t('common.messages.errorLoadingRelated'));
    }
  }, [t]);

  const loadSubscription = useCallback(async (subId: number) => {
    try {
      const sub = await lineSubscriptionApiService.getById(subId);
      if (sub) {
        setFormData({
          ...sub,
          startDate: new Date(sub.startDate).toISOString().split('T')[0],
          endDate: sub.endDate ? new Date(sub.endDate).toISOString().split('T')[0] : '',
        });
      }
    } catch {
      toast.error(t('common.messages.error'));
    }
  }, [t]);

  useEffect(() => {
    const initializeForm = async () => {
      setFormLoading(true);
      await loadRelatedData();
      if (isEdit && id) {
        await loadSubscription(parseInt(id));
      }
      setFormLoading(false);
    };
    initializeForm();
  }, [id, isEdit, loadSubscription, loadRelatedData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.employeeId === 0 || formData.lineId === 0) {
      toast.error(t('subscription.errors.allFieldsRequired'));
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        endDate: formData.endDate || undefined, // Send undefined if empty string
      };
      if (isEdit && id) {
        await lineSubscriptionApiService.update({ ...payload, id: parseInt(id) } as UpdateLineSubscriptionDto);
        toast.success(t('common.messages.updateSuccess'));
      } else {
        await lineSubscriptionApiService.create(payload);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.SUBSCRIPTIONS);
    } catch {
      toast.error(t('common.messages.error'));
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) return <LoadingSpinner text={t('common.messages.loadingData')} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}><ArrowLeft className="h-5 w-5" /></Button>
        <PageTitle>{isEdit ? t('subscription.edit') : t('subscription.create')}</PageTitle>
      </div>
      <Card>
        <CardHeader><CardTitle>{t('subscription.information')}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employee">{t('subscription.employeeName')} *</Label>
                <Select value={formData.employeeId.toString()} onValueChange={(v) => setFormData({ ...formData, employeeId: parseInt(v) })}>
                  <SelectTrigger><SelectValue placeholder={t('subscription.placeholders.selectEmployee')} /></SelectTrigger>
                  <SelectContent>
                    {employees.map(e => <SelectItem key={e.id} value={e.id.toString()}>{`${e.firstName} ${e.lastName}`}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="line">{t('subscription.lineName')} *</Label>
                <Select value={formData.lineId.toString()} onValueChange={(v) => setFormData({ ...formData, lineId: parseInt(v) })}>
                  <SelectTrigger><SelectValue placeholder={t('subscription.placeholders.selectLine')} /></SelectTrigger>
                  <SelectContent>
                    {lines.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">{t('subscription.startDate')} *</Label>
                <Input id="startDate" type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">{t('subscription.endDate')}</Label>
                <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>{loading ? t('common.messages.saving') : t('common.actions.save')}</Button>
              <Button type="button" variant="outline" onClick={() => navigate(ROUTES.SUBSCRIPTIONS)}>{t('common.actions.cancel')}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
