import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ValidationError } from '@/components/atoms/ValidationError';
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

const toInputDate = (date: string | Date) => new Date(date).toISOString().split('T')[0];

export default function SubscriptionForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = !!id;

  const [employees, setEmployees] = useState<EmployeeListDto[]>([]);
  const [lines, setLines] = useState<LineListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const subscriptionSchema = z.object({
    employeeId: z.number().min(1, t('subscription.errors.allFieldsRequired')),
    lineId: z.number().min(1, t('subscription.errors.allFieldsRequired')),
    startDate: z.string().min(1, t('common.validation.required')),
    endDate: z.string().optional(),
    isActive: z.boolean()
  });

  type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      employeeId: 0,
      lineId: 0,
      startDate: toInputDate(new Date()),
      endDate: '',
      isActive: true,
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const employeeId = params.get('employeeId');
    if (employeeId && !isEdit) {
      setValue('employeeId', parseInt(employeeId, 10));
    }
  }, [location.search, isEdit, setValue]);

  const loadSubscription = useCallback(
    async (subscriptionId: number) => {
      try {
        setFormLoading(true);
        const sub = await lineSubscriptionApiService.getById(subscriptionId);
        if (sub) {
          setValue('employeeId', sub.employeeId);
          setValue('lineId', sub.lineId);
          setValue('startDate', toInputDate(sub.startDate));
          setValue('endDate', sub.endDate ? toInputDate(sub.endDate) : '');
          setValue('isActive', sub.isActive ?? false);
        }
      } catch (err) {
        toast.error(t('common.messages.error'));
        console.error("Failed to load subscription:", err);
      } finally {
        setFormLoading(false);
      }
    },
    [t, setValue]
  );

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

  const onFormSubmit = async (data: SubscriptionFormData) => {
    setLoading(true);
    try {
      // Capacity check (Only for new active subscriptions)
      if (!isEdit && data.isActive && data.lineId > 0) {
        const line = await lineApiService.getById(data.lineId);
        const activeCount = line.subscriptions?.filter(s => s.isActive).length ?? 0;
        
        const busResponse = await fetch(`/api/Bus/${line.busId}`);
        const bus = await busResponse.json();
        
        if (activeCount >= bus.capacity) {
          toast.error(t('subscription.errors.capacityFull', { capacity: bus.capacity }));
          setLoading(false);
          return;
        }
      }

      if (isEdit && id) {
        const updateDto: UpdateLineSubscriptionDto = {
          ...data,
          id: parseInt(id, 10),
        } as UpdateLineSubscriptionDto;
        await lineSubscriptionApiService.update(updateDto);
        toast.success(t('common.messages.updateSuccess'));
      } else {
        const createDto: CreateLineSubscriptionDto = {
          ...data,
        } as CreateLineSubscriptionDto;
        await lineSubscriptionApiService.create(createDto);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.SUBSCRIPTIONS);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || t('common.messages.error'));
      console.error('Error saving subscription:', error);
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
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeId">{t('subscription.employee')} *</Label>
                <Controller
                  name="employeeId"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select
                        disabled={isEdit}
                        onValueChange={(val) => field.onChange(parseInt(val))}
                        value={field.value ? field.value.toString() : ''}
                      >
                        <SelectTrigger error={errors.employeeId?.message}>
                          <SelectValue placeholder={t('subscription.selectEmployee')} />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id.toString()}>
                              {emp.firstName} {emp.lastName} ({emp.employeeNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ValidationError message={errors.employeeId?.message || ''} />
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lineId">{t('subscription.line')} *</Label>
                <Controller
                  name="lineId"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select
                        onValueChange={(val) => field.onChange(parseInt(val))}
                        value={field.value ? field.value.toString() : ''}
                      >
                        <SelectTrigger error={errors.lineId?.message}>
                          <SelectValue placeholder={t('subscription.selectLine')} />
                        </SelectTrigger>
                        <SelectContent>
                          {lines.map((line) => (
                            <SelectItem key={line.id} value={line.id.toString()}>{line.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ValidationError message={errors.lineId?.message || ''} />
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">{t('subscription.startDate')} *</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  error={errors.startDate?.message}
                />
              </div>

              {isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="endDate">{t('subscription.endDate')}</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register('endDate')}
                    error={errors.endDate?.message}
                  />
                </div>
              )}

              <div className="flex items-center gap-4 rounded-md border p-4 col-span-full md:col-span-1">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{t('subscription.status')}</p>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <p className="text-sm text-muted-foreground">
                        {field.value ? t('subscription.active') : t('subscription.inactive')}
                      </p>
                    )}
                  />
                </div>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
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
