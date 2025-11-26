import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [formLoading, setFormLoading] = useState(true);
  const [formData, setFormData] = useState<CreateStopDto>({
    address: '',
    lineId: 0,
    sequenceOrder: 1,
    stopType: StopType.Intermediate,
  });
  const [lines, setLines] = useState<LineListDto[]>([]);

  const loadRelatedData = useCallback(async () => {
    try {
      const lineData = await lineApiService.getAll();
      setLines(lineData);
    } catch (err) {
      console.error("Error loading related data:", err);
      toast.error(t('common.messages.errorLoadingRelated'));
    }
  }, [t]);

  const loadStop = useCallback(async (stopId: number) => {
    try {
      const stop = await stopApiService.getById(stopId);
      if (stop) {
        setFormData(stop);
      }
    } catch (err) {
      console.error("Error loading stop:", err);
      toast.error(t('common.messages.error'));
    }
  }, [t]);

  useEffect(() => {
    const initializeForm = async () => {
      setFormLoading(true);
      await loadRelatedData();
      if (isEdit && id) {
        await loadStop(parseInt(id));
      }
      setFormLoading(false);
    };
    initializeForm();
  }, [id, isEdit, loadStop, loadRelatedData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.lineId === 0) {
      toast.error(t('stop.errors.lineRequired'));
      return;
    }
    setLoading(true);
    try {
      if (isEdit && id) {
        await stopApiService.update({ ...formData, id: parseInt(id) } as UpdateStopDto);
        toast.success(t('common.messages.updateSuccess'));
      } else {
        await stopApiService.create(formData);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.STOPS);
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(t('common.messages.error'));
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) return <LoadingSpinner text={t('common.messages.loadingData')} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.STOPS)}><ArrowLeft className="h-5 w-5" /></Button>
        <PageTitle>{isEdit ? t('stop.edit') : t('stop.create')}</PageTitle>
      </div>
      <Card>
        <CardHeader><CardTitle>{t('stop.information')}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address">{t('stop.address')} *</Label>
                <Input id="address" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="line">{t('stop.lineName')} *</Label>
                <Select value={formData.lineId.toString()} onValueChange={(v) => setFormData({ ...formData, lineId: parseInt(v) })}>
                  <SelectTrigger><SelectValue placeholder={t('stop.placeholders.selectLine')} /></SelectTrigger>
                  <SelectContent>
                    {lines.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sequenceOrder">{t('stop.sequence')} *</Label>
                <Input id="sequenceOrder" type="number" required min="1" value={formData.sequenceOrder} onChange={(e) => setFormData({ ...formData, sequenceOrder: parseInt(e.target.value) || 1 })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stopType">{t('stop.type')}</Label>
                <Select value={formData.stopType.toString()} onValueChange={(v) => setFormData({ ...formData, stopType: parseInt(v) as StopType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={StopType.Intermediate.toString()}>{t('stop.types.intermediate')}</SelectItem>
                    <SelectItem value={StopType.Terminus.toString()}>{t('stop.types.terminus')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>{loading ? t('common.messages.saving') : t('common.actions.save')}</Button>
              <Button type="button" variant="outline" onClick={() => navigate(ROUTES.STOPS)}>{t('common.actions.cancel')}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
