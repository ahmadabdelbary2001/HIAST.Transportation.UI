import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ValidationError } from '@/components/atoms/ValidationError';
import { stopApiService } from '@/services/stopApiService';
import { lineApiService } from '@/services/lineApiService';
import type { CreateStopDto, UpdateStopDto, LineListDto } from '@/types';
import { StopType } from '@/types/enums';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function StopForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [lines, setLines] = useState<LineListDto[]>([]);

  const stopSchema = z.object({
    address: z.string().min(1, t('common.validation.required')),
    lineId: z.number().min(1, t('stop.errors.lineRequired')),
    sequenceOrder: z.number().min(1, t('common.validation.required')),
    stopType: z.nativeEnum(StopType)
  });

  type StopFormData = z.infer<typeof stopSchema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<StopFormData>({
    resolver: zodResolver(stopSchema),
    defaultValues: {
      address: '',
      lineId: 0,
      sequenceOrder: 1,
      stopType: StopType.Intermediate,
    },
  });

  const loadLines = useCallback(async () => {
    try {
      const data = await lineApiService.getAll();
      setLines(data);
    } catch (err) {
      console.error("Error loading lines:", err);
    }
  }, []);

  const loadStop = useCallback(async (stopId: number) => {
    try {
      setFormLoading(true);
      const stop = await stopApiService.getById(stopId);
      if (stop) {
        setValue('address', stop.address);
        setValue('lineId', stop.lineId);
        setValue('sequenceOrder', stop.sequenceOrder);
        setValue('stopType', stop.stopType);
      }
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error loading stop:', err);
    } finally {
      setFormLoading(false);
    }
  }, [t, setValue]);

  useEffect(() => {
    loadLines();
    if (isEdit && id) {
      loadStop(parseInt(id));
    }
  }, [id, isEdit, loadLines, loadStop]);

  const onFormSubmit = async (data: StopFormData) => {
    setLoading(true);
    try {
      // Logic check for Terminus stop (only one per line)
      if (data.stopType === StopType.Terminus) {
        const existingStops = await stopApiService.getAll();
        const lineTerminus = existingStops.find(
          (s) => s.lineId === data.lineId && s.stopType === StopType.Terminus && s.id !== (isEdit ? parseInt(id!) : undefined)
        );
        if (lineTerminus) {
          toast.error(t('stop.errors.terminusAlreadyExists', { line: lineTerminus.lineName }));
          setLoading(false);
          return;
        }
      }

      if (isEdit && id) {
        await stopApiService.update({ ...data, id: parseInt(id) } as UpdateStopDto);
        toast.success(t('common.messages.updateSuccess'));
      } else {
        await stopApiService.create(data as CreateStopDto);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.STOPS);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error submitting form:", error);
      toast.error(error.message || t('common.messages.error'));
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
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.STOPS)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageTitle>{isEdit ? t('stop.edit') : t('stop.create')}</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('stop.information')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lineId">{t('stop.lineName')} *</Label>
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
                          <SelectValue placeholder={t('stop.placeholders.selectLine')} />
                        </SelectTrigger>
                        <SelectContent>
                          {lines.map((line) => (
                            <SelectItem key={line.id} value={line.id.toString()}>
                              {line.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ValidationError message={errors.lineId?.message || ''} />
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t('stop.address')} *</Label>
                <Input
                  id="address"
                  {...register('address')}
                  error={errors.address?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sequenceOrder">{t('stop.sequence')} *</Label>
                <Input
                  id="sequenceOrder"
                  type="number"
                  {...register('sequenceOrder', { valueAsNumber: true })}
                  error={errors.sequenceOrder?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stopType">{t('stop.type')}</Label>
                <Controller
                  name="stopType"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select
                        onValueChange={(val) => field.onChange(parseInt(val))}
                        value={field.value.toString()}
                      >
                        <SelectTrigger error={errors.stopType?.message}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={StopType.Intermediate.toString()}>{t('stop.types.intermediate')}</SelectItem>
                          <SelectItem value={StopType.Terminus.toString()}>{t('stop.types.terminus')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <ValidationError message={errors.stopType?.message || ''} />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? t('common.messages.saving') : t('common.actions.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(ROUTES.STOPS)}>
                {t('common.actions.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
