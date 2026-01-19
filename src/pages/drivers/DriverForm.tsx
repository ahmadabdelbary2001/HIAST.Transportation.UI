// src/pages/drivers/DriverForm.tsx
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { driverApiService } from '@/services/driverApiService';
import type { CreateDriverDto, UpdateDriverDto } from '@/types/index';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';
import { ApiValidationError } from '@/services/apiHelper';

export default function DriverForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const driverSchema = z.object({
    name: z.string().min(1, t('common.validation.required')),
    licenseNumber: z.string().min(1, t('common.validation.required')),
    contactInfo: z.string().min(1, t('driver.form.contactInfoRequired')),
  });

  type DriverFormData = z.infer<typeof driverSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: '',
      licenseNumber: '',
      contactInfo: '',
    },
  });

  const loadDriver = useCallback(async (driverId: number) => {
    try {
      setFormLoading(true);
      const driver = await driverApiService.getById(driverId);
      if (driver) {
        setValue('name', driver.name);
        setValue('licenseNumber', driver.licenseNumber);
        setValue('contactInfo', driver.contactInfo || '');
      }
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error loading driver:', err);
    } finally {
      setFormLoading(false);
    }
  }, [t, setValue]);

  useEffect(() => {
    if (isEdit && id) {
      loadDriver(parseInt(id));
    }
  }, [id, isEdit, loadDriver]);

  const onFormSubmit = async (data: DriverFormData) => {
    setLoading(true);
    try {
      // Manual Validation
      const allDrivers = await driverApiService.getAll();
      const duplicate = allDrivers.find(d =>
        d.licenseNumber === data.licenseNumber &&
        (!isEdit || d.id !== parseInt(id!))
      );

      if (duplicate) {
        setError("licenseNumber", {
          type: "manual",
          message: t('common.validation.licenseNumberExists')
        });
        setLoading(false);
        return;
      }

      if (isEdit && id) {
        await driverApiService.update({
          ...data,
          id: parseInt(id),
        } as UpdateDriverDto & { id: number });
        toast.success(t('common.messages.updateSuccess'));
      } else {
        await driverApiService.create(data as CreateDriverDto);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.DRIVERS);
    } catch (err: unknown) {
      if (err instanceof ApiValidationError) {
        Object.entries(err.errors).forEach(([key, messages]) => {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          if (['name', 'licenseNumber', 'contactInfo'].includes(fieldName)) {
            setError(fieldName as keyof DriverFormData, {
              type: 'server',
              message: messages.join(', ')
            });
          } else {
            toast.error(messages.join(', '));
          }
        });
      } else {
        const error = err as Error;
        toast.error(error.message || t('common.messages.error'));
        console.error('Error saving driver:', error);
      }
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
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.DRIVERS)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageTitle>{isEdit ? t('driver.edit') : t('driver.create')}</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? t('driver.edit') : t('driver.create')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('driver.name')} *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  error={errors.name?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">{t('driver.licenseNumber')} *</Label>
                <Input
                  id="licenseNumber"
                  {...register('licenseNumber')}
                  error={errors.licenseNumber?.message}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="contactInfo">{t('driver.contactInfo')} *</Label>
                <Input
                  id="contactInfo"
                  {...register('contactInfo')}
                  error={errors.contactInfo?.message}
                  placeholder="+963 99 123 4567"
                  forceLtr
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? t('common.messages.saving') : t('common.actions.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(ROUTES.DRIVERS)}>
                {t('common.actions.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
