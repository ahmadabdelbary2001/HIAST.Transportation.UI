import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, ArrowUp, ArrowDown, MapPin, CheckCircle } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ValidationError } from '@/components/atoms/ValidationError';
import { Badge } from '@/components/ui/badge';
import { stopApiService } from '@/services/stopApiService';
import { lineApiService } from '@/services/lineApiService';
import type { CreateStopDto, UpdateStopDto, LineListDto, StopListDto } from '@/types';
import { StopType } from '@/types/enums';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

interface StopInList {
  id?: number;
  address: string;
  sequenceOrder: number;
  stopType: number;
  isNew?: boolean;
  isMoving?: boolean;
}

export default function StopForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [lines, setLines] = useState<LineListDto[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<number>(0);
  const [stopsList, setStopsList] = useState<StopInList[]>([]);
  const [existingStops, setExistingStops] = useState<StopListDto[]>([]);
  const [newStopAddress, setNewStopAddress] = useState('');
  const [movingStopId, setMovingStopId] = useState<number | null>(null);

  const stopSchema = z.object({
    address: z.string().optional(),
    lineId: z.number().min(1, t('stop.errors.lineRequired')),
  });

  type StopFormData = z.infer<typeof stopSchema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StopFormData>({
    resolver: zodResolver(stopSchema),
    defaultValues: {
      address: '',
      lineId: 0,
    },
  });

  const watchedLineId = watch('lineId');

  const loadLines = useCallback(async () => {
    try {
      const data = await lineApiService.getAll();
      setLines(data);
    } catch (err) {
      console.error("Error loading lines:", err);
      toast.error(t('common.messages.error'));
    }
  }, [t]);

  const loadStopsForLine = useCallback(async (lineId: number) => {
    try {
      const allStops = await stopApiService.getAll();
      const lineStops = allStops
        .filter(s => s.lineId === lineId)
        .sort((a, b) => a.sequenceOrder - b.sequenceOrder);

      // حفظ المحطات الموجودة
      setExistingStops(lineStops);

      const mappedStops = lineStops.map(s => {
        let stopTypeValue: number;

        if (typeof s.stopType === 'string') {
          stopTypeValue = s.stopType === 'Terminus' ? StopType.Terminus : StopType.Intermediate;
        } else {
          stopTypeValue = s.stopType;
        }

        return {
          id: s.id,
          address: s.address,
          sequenceOrder: s.sequenceOrder,
          stopType: stopTypeValue,
          isNew: false,
          isMoving: false,
        };
      });

      setStopsList(mappedStops);
    } catch (err) {
      console.error("Error loading stops:", err);
      toast.error(t('common.messages.error'));
    }
  }, [t]);

  const loadStop = useCallback(async (stopId: number) => {
    try {
      setFormLoading(true);
      const stop = await stopApiService.getById(stopId);
      if (stop) {
        setValue('address', stop.address);
        setValue('lineId', stop.lineId);
        setSelectedLineId(stop.lineId);
        await loadStopsForLine(stop.lineId);
      }
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error loading stop:', err);
    } finally {
      setFormLoading(false);
    }
  }, [t, setValue, loadStopsForLine]);

  useEffect(() => {
    loadLines();
    if (isEdit && id) {
      loadStop(parseInt(id));
    }
  }, [id, isEdit, loadLines, loadStop]);

  useEffect(() => {
    if (watchedLineId && watchedLineId > 0 && !isEdit) {
      setSelectedLineId(watchedLineId);
      loadStopsForLine(watchedLineId);
    }
  }, [watchedLineId, isEdit, loadStopsForLine]);

  // حساب أعلى ترتيب تسلسلي للمحطات الموجودة
  const getNextSequenceOrder = useCallback(() => {
    if (existingStops.length === 0) return 1;
    const maxOrder = Math.max(...existingStops.map(s => s.sequenceOrder));
    return maxOrder + 1;
  }, [existingStops]);

  const recalculateStops = (stops: StopInList[]): StopInList[] => {
    if (stops.length === 0) return [];

    return stops.map((stop, index) => ({
      ...stop,
      sequenceOrder: index + 1,
      stopType: index === stops.length - 1 ? StopType.Terminus : StopType.Intermediate,
    }));
  };

  const addNewStop = () => {
    if (!newStopAddress.trim()) {
      toast.error(t('common.validation.required'));
      return;
    }

    // حساب الترتيب التسلسلي التالي بناءً على المحطات الموجودة
    const nextOrder = stopsList.length > 0
      ? Math.max(...stopsList.map(s => s.sequenceOrder)) + 1
      : getNextSequenceOrder();

    const newStop: StopInList = {
      address: newStopAddress,
      sequenceOrder: nextOrder,
      stopType: StopType.Intermediate,
      isNew: true,
      isMoving: false,
    };

    // إضافة المحطة الجديدة دون إعادة حساب المحطات الموجودة
    const updatedList = [...stopsList, newStop];

    // فقط إعادة حساب الأنواع (جعل الأخير فقط هو النهائي)
    const finalList = updatedList.map((stop, index) => ({
      ...stop,
      stopType: index === updatedList.length - 1 ? StopType.Terminus : StopType.Intermediate,
    }));

    setStopsList(finalList);
    setNewStopAddress('');
    toast.success(t('stop.messages.stopAdded'));
  };

  const moveStop = async (index: number, direction: 'up' | 'down') => {
    if (movingStopId) return;

    const newList = [...stopsList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newList.length) return;

    const movingStop = newList[index];
    setMovingStopId(movingStop.id || -1);

    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];

    const recalculatedList = recalculateStops(newList);

    setStopsList(recalculatedList);

    setTimeout(() => {
      setMovingStopId(null);
    }, 300);
  };

  const validateStopsBeforeSave = (stops: StopInList[]): boolean => {
    const terminusCount = stops.filter(s => s.stopType === StopType.Terminus).length;

    if (terminusCount === 0) {
      toast.error(t('stop.errors.noTerminus'));
      return false;
    }

    if (terminusCount > 1) {
      toast.error(t('stop.errors.multipleTerminus'));
      return false;
    }

    const lastStop = stops[stops.length - 1];
    if (lastStop.stopType !== StopType.Terminus) {
      toast.error(t('stop.errors.lastMustBeTerminus'));
      return false;
    }

    return true;
  };

  const onFormSubmit = async (data: StopFormData) => {
    setLoading(true);
    try {
      if (stopsList.length === 0) {
        toast.error(t('stop.errors.noStops'));
        setLoading(false);
        return;
      }

      if (!validateStopsBeforeSave(stopsList)) {
        setLoading(false);
        return;
      }

      if (isEdit && id) {
        // حالة التعديل: استخدام reorderStops فقط مع جميع المحطات

        // تحضير البيانات لإعادة الترتيب - فقط المحطات الموجودة (لها id)
        const reorderPayload = stopsList
          .filter(stop => stop.id) // فقط المحطات الموجودة في قاعدة البيانات
          .map(stop => ({
            id: stop.id!,
            sequenceOrder: stop.sequenceOrder,
            stopType: stop.stopType,
          }));

        if (reorderPayload.length === 0) {
          toast.error(t('stop.errors.noValidStops'));
          setLoading(false);
          return;
        }

        // استخدام reorderStops لإعادة ترتيب جميع المحطات مرة واحدة
        await stopApiService.reorderStops(data.lineId, reorderPayload);

        // إذا كان هناك عنوان جديد للمحطة الحالية، نقوم بتحديث العنوان فقط
        if (data.address && data.address.trim() !== '') {
          const currentStop = stopsList.find(s => s.id === parseInt(id));
          if (currentStop && currentStop.address !== data.address) {
            // تحديث العنوان فقط مع الحفاظ على التسلسل الحالي
            await stopApiService.update({
              id: parseInt(id),
              address: data.address,
              lineId: data.lineId,
              sequenceOrder: currentStop.sequenceOrder, // استخدام التسلسل الحالي
              stopType: currentStop.stopType,
            } as UpdateStopDto);
          }
        }
      } else {
        // حالة الإنشاء: إنشاء جميع المحطات الجديدة
        // حساب الترتيب التسلسلي الصحيح بدءًا من المحطات الموجودة
        let nextOrder = getNextSequenceOrder();

        for (const stop of stopsList) {
          await stopApiService.create({
            address: stop.address,
            lineId: data.lineId,
            sequenceOrder: nextOrder,
            stopType: stop.stopType,
          } as CreateStopDto);
          nextOrder++;
        }
      }

      toast.success(isEdit ? t('common.messages.updateSuccess') : t('common.messages.createSuccess'));
      navigate(ROUTES.STOPS);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error submitting form:", error);

      if (error.message.includes('duplicate key')) {
        toast.error(t('stop.errors.duplicateSequenceOrder'));
      } else if (error.message.includes('Terminus')) {
        toast.error(t('stop.errors.oneTerminusRequired'));
      } else {
        toast.error(error.message || t('common.messages.error'));
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
                        disabled={isEdit}
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

              {isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="address">{t('stop.address')} *</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    error={errors.address?.message}
                  />
                </div>
              )}
            </div>

            {selectedLineId > 0 && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label>{t('stop.stopsOrder')}</Label>
                      <Badge variant="outline" className="ml-2">
                        {stopsList.length} {t('stop.stops')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span>{t('stop.types.intermediate')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>{t('stop.types.terminus')}</span>
                      </div>
                    </div>
                  </div>

                  {stopsList.length > 0 ? (
                    <div className="space-y-2">
                      {stopsList.map((stop, index) => {
                        const isTerminus = stop.stopType === StopType.Terminus;
                        const isMoving = movingStopId === stop.id;

                        return (
                          <div
                            key={stop.id || `new-${index}`}
                            className={`
                              flex items-center gap-3 p-4 border rounded-lg bg-card
                              transition-all duration-300 ease-in-out
                              ${isMoving ? 'scale-105 shadow-lg border-primary' : 'hover:shadow-md hover:border-primary/50'}
                              ${isTerminus ? 'border-green-200 bg-green-50/50' : 'border-blue-200'}
                              ${stop.isNew ? 'border-dashed border-yellow-300 bg-yellow-50/30' : ''}
                              animate-in fade-in slide-in-from-left-2
                            `}
                            style={{
                              animationDelay: `${index * 50}ms`,
                              transitionProperty: 'all'
                            }}
                          >
                            <div className={`
                              flex items-center justify-center w-8 h-8 rounded-full
                              ${isTerminus ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                              ${stop.isNew ? 'border-2 border-dashed border-yellow-400' : ''}
                              ${isMoving ? 'animate-pulse' : ''}
                            `}>
                              {stop.sequenceOrder}
                            </div>
                            <MapPin className={`h-4 w-4 ${isTerminus ? 'text-green-600' : 'text-blue-600'}`} />
                            <div className="flex-1">
                              <div className="font-medium">{stop.address}</div>
                              <div className="text-sm text-muted-foreground">
                                {t('stop.sequence')}: {stop.sequenceOrder}
                                {stop.isNew && (
                                  <span className="ml-2 text-yellow-600 font-medium">
                                    • {t('stop.new')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge
                              variant={isTerminus ? "default" : "secondary"}
                              className={`
                                transition-all duration-200
                                ${isTerminus ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                                ${isMoving ? 'animate-pulse' : ''}
                              `}
                            >
                              {isTerminus ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  {t('stop.types.terminus')}
                                </div>
                              ) : (
                                t('stop.types.intermediate')
                              )}
                            </Badge>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => moveStop(index, 'up')}
                                disabled={index === 0 || !!movingStopId}
                                className="transition-all duration-200 hover:scale-110 disabled:opacity-50"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => moveStop(index, 'down')}
                                disabled={index === stopsList.length - 1 || !!movingStopId}
                                className="transition-all duration-200 hover:scale-110 disabled:opacity-50"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                      <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">{t('stop.noStopsYet')}</p>
                    </div>
                  )}
                </div>

                {!isEdit && (
                  <div className="space-y-2">
                    <Label htmlFor="newStopAddress">{t('stop.addNewStop')}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="newStopAddress"
                        value={newStopAddress}
                        onChange={(e) => setNewStopAddress(e.target.value)}
                        placeholder={t('stop.address')}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addNewStop();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addNewStop}
                        disabled={!newStopAddress.trim()}
                      >
                        {t('common.actions.add')}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || stopsList.length === 0 || !!movingStopId}
                className="min-w-[100px]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner />
                    <span className="ml-2">{t('common.messages.saving')}</span>
                  </div>
                ) : t('common.actions.save')}
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