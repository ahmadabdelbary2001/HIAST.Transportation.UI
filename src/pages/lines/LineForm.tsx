// src/pages/lines/LineForm.tsx

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
import { lineApiService } from '@/services/lineApiService';
import { employeeApiService } from '@/services/employeeApiService';
import { driverApiService } from '@/services/driverApiService';
import { busApiService } from '@/services/busApiService';
import type { CreateLineDto, UpdateLineDto, EmployeeListDto, Driver, Bus } from '@/types';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';
import { ApiValidationError } from '@/services/apiHelper';

export default function LineForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);

  // State for dropdown options
  const [supervisors, setSupervisors] = useState<EmployeeListDto[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);

  const lineSchema = z.object({
    name: z.string().min(1, t('common.validation.required')),
    description: z.string().optional(),
    supervisorId: z.number().min(1, t('line.errors.supervisorRequired')),
    driverId: z.number().min(1, t('line.errors.driverRequired')),
    busId: z.number().min(1, t('line.errors.busRequired')),
  });

  type LineFormData = z.infer<typeof lineSchema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<LineFormData>({
    resolver: zodResolver(lineSchema),
    defaultValues: {
      name: '',
      description: '',
      supervisorId: 0,
      driverId: 0,
      busId: 0,
    },
  });

  // Watch values to use in filters if needed (optional)
  const currentSupervisorId = watch('supervisorId');
  const currentDriverId = watch('driverId');
  const currentBusId = watch('busId');

  const loadRelatedData = useCallback(async () => {
    try {
      const [supervisorData, driverData, busData] = await Promise.all([
        employeeApiService.getAll(),
        driverApiService.getAll(),
        busApiService.getAll(),
      ]);
      setSupervisors(supervisorData);
      setDrivers(driverData);
      setBuses(busData);
    } catch (err) {
      toast.error(t('common.messages.errorLoadingRelated'));
      console.error('Error loading related data:', err);
    }
  }, [t]);

  const loadLine = useCallback(async (lineId: number) => {
    try {
      const line = await lineApiService.getById(lineId);
      if (line) {
        setValue('name', line.name);
        setValue('description', line.description || '');
        setValue('supervisorId', line.supervisorId);
        setValue('driverId', line.driverId);
        setValue('busId', line.busId);
      }
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error loading line:', err);
    }
  }, [t, setValue]);

  useEffect(() => {
    const initializeForm = async () => {
      setFormLoading(true);
      await loadRelatedData();
      if (isEdit && id) {
        await loadLine(parseInt(id));
      }
      setFormLoading(false);
    };
    initializeForm();
  }, [id, isEdit, loadLine, loadRelatedData]);

  const onFormSubmit = async (data: LineFormData) => {
    setLoading(true);
    try {
      // Manual Validation
      // Note: Line API get all returns LineListDto, checking name is usually enough if it's there
      // LineListDto has 'name'.
      const allLines = await lineApiService.getAll(); // Ensure this returns list with names
      const duplicate = allLines.find(l => 
          l.name.toLowerCase() === data.name.toLowerCase() &&
          (!isEdit || l.id !== parseInt(id!))
      );
      
      if (duplicate) {
           setError("name", {
               type: "manual",
               message: t('common.validation.lineNameExists')
           });
           setLoading(false);
           return;
      }

      if (isEdit && id) {
        await lineApiService.update({ ...data, id: parseInt(id) } as UpdateLineDto);
        toast.success(t('common.messages.updateSuccess'));
      } else {
        await lineApiService.create(data as CreateLineDto);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.LINES);
    } catch (err: unknown) {
      if (err instanceof ApiValidationError) {
          Object.entries(err.errors).forEach(([key, messages]) => {
              const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
              if (['name', 'description', 'supervisorId', 'driverId', 'busId'].includes(fieldName)) {
                  setError(fieldName as keyof LineFormData, {
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
          console.error('Error saving line:', error);
      }
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
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.LINES)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageTitle>{isEdit ? t('line.edit') : t('line.create')}</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('line.information')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('line.name')} *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  error={errors.name?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('line.description')}</Label>
                <Input
                  id="description"
                  {...register('description')}
                  error={errors.description?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisor">{t('line.supervisor')} *</Label>
                <Controller
                  name="supervisorId"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select 
                        value={field.value.toString()} 
                        onValueChange={(v) => field.onChange(parseInt(v))}
                      >
                        <SelectTrigger error={errors.supervisorId?.message}>
                            <SelectValue placeholder={t('line.placeholders.selectSupervisor')} />
                        </SelectTrigger>
                        <SelectContent>
                          {supervisors
                            .filter(s => !s.isAssigned || s.id === currentSupervisorId || (isEdit && s.id === currentSupervisorId))
                            .map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.firstName} {s.lastName}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <ValidationError message={errors.supervisorId?.message || ''} />
                    </div>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver">{t('line.driver')} *</Label>
                <Controller
                  name="driverId"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select 
                        value={field.value.toString()} 
                        onValueChange={(v) => field.onChange(parseInt(v))}
                      >
                        <SelectTrigger error={errors.driverId?.message}>
                            <SelectValue placeholder={t('line.placeholders.selectDriver')} />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers
                            .filter(d => !d.isAssigned || d.id === currentDriverId || (isEdit && d.id === currentDriverId))
                            .map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <ValidationError message={errors.driverId?.message || ''} />
                    </div>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bus">{t('line.bus')} *</Label>
                <Controller
                  name="busId"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select 
                        value={field.value.toString()} 
                        onValueChange={(v) => field.onChange(parseInt(v))}
                      >
                        <SelectTrigger error={errors.busId?.message}>
                            <SelectValue placeholder={t('line.placeholders.selectBus')} />
                        </SelectTrigger>
                        <SelectContent>
                          {buses
                            .filter(b => b.status === 'Available' || b.id === currentBusId)
                            .map(b => <SelectItem key={b.id} value={b.id.toString()}>{b.licensePlate}</SelectItem>)}
                        </SelectContent>
                      </Select>
                       <ValidationError message={errors.busId?.message || ''} />
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? t('common.messages.saving') : t('common.actions.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(ROUTES.LINES)}>
                {t('common.actions.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
