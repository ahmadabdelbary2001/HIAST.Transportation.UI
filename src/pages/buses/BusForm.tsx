import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ValidationError } from '@/components/atoms/ValidationError';
import { busApiService } from '@/services/busApiService';
import type { CreateBusDto, UpdateBusDto } from '@/types';
import { BusStatus, busStatusInfo } from '@/types/enums'; 
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function BusForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const busSchema = z.object({
    licensePlate: z.string().min(3, t('common.validation.minLength', { count: 3 })),
    capacity: z.number().min(1, t('common.validation.required')).max(100, t('common.validation.maxLength', { count: 100 })),
    status: z.nativeEnum(BusStatus)
  });

  type BusFormData = z.infer<typeof busSchema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BusFormData>({
    resolver: zodResolver(busSchema),
    defaultValues: {
      licensePlate: '',
      capacity: 50,
      status: BusStatus.Available,
    },
  });

  const loadBus = useCallback(async (busId: number) => {
    try {
      setFormLoading(true);
      const bus = await busApiService.getById(busId);
      if (bus) {
        setValue('licensePlate', bus.licensePlate);
        setValue('capacity', bus.capacity);
        setValue('status', bus.status);
      }
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error loading bus:', err);
    } finally {
      setFormLoading(false);
    }
  }, [t, setValue]);

  useEffect(() => {
    if (isEdit && id) {
      loadBus(parseInt(id));
    }
  }, [id, isEdit, loadBus]);

  const onFormSubmit = async (data: BusFormData) => {
    setLoading(true);
    try {
      if (isEdit && id) {
        await busApiService.update({ 
          ...data, 
          id: parseInt(id),
        } as UpdateBusDto);
        toast.success(t('common.messages.updateSuccess'));
      } else {
        await busApiService.create(data as CreateBusDto);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.BUSES);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || t('common.messages.error'));
      console.error('Error saving bus:', error);
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
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.BUSES)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageTitle>{isEdit ? t('bus.edit') : t('bus.create')}</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? t('bus.editBus') : t('bus.createNew')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">{t('bus.licensePlate')} *</Label>
                <Input
                  id="licensePlate"
                  {...register('licensePlate')}
                  error={errors.licensePlate?.message}
                  placeholder="SYR-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">{t('bus.capacity')} *</Label>
                <Input
                  id="capacity"
                  type="number"
                  {...register('capacity', { valueAsNumber: true })}
                  error={errors.capacity?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">{t('bus.status')}</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger error={errors.status?.message}>
                          <SelectValue placeholder={t('bus.selectStatus')} />
                        </SelectTrigger>
                        <SelectContent>
                          {busStatusInfo.map((statusInfo) => (
                            <SelectItem key={statusInfo.value} value={statusInfo.value}>
                              {t(statusInfo.key)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ValidationError message={errors.status?.message || ''} />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? t('common.messages.saving') : t('common.actions.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(ROUTES.BUSES)}>
                {t('common.actions.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
