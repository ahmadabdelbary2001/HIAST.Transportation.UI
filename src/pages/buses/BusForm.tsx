// src/pages/buses/BusForm.tsx

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { busApiService } from '@/services/busApiService';
import type { CreateBusDto, UpdateBusDto } from '@/types';
import { BusStatus, busStatusInfo } from '@/types/enums'; import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function BusForm() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = language as 'en' | 'ar';
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState<CreateBusDto>({
    licensePlate: '',
    capacity: 50,
    status: BusStatus.Available,
  });

  const loadBus = useCallback(async (busId: number) => {
    try {
      setFormLoading(true);
      const bus = await busApiService.getById(busId);
      if (bus) {
        setFormData({
          licensePlate: bus.licensePlate,
          capacity: bus.capacity,
          status: bus.status,
        });
      }
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error loading bus:', err);
    } finally {
      setFormLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isEdit && id) {
      loadBus(parseInt(id));
    }
  }, [id, isEdit, loadBus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        await busApiService.update({ 
          ...formData, 
          id: parseInt(id),
        } as UpdateBusDto);
        toast.success(t('common.messages.updateSuccess'));
      } else {
        await busApiService.create(formData);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.BUSES);
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error saving bus:', err);
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">{t('bus.licensePlate')} *</Label>
                <Input
                  id="licensePlate"
                  required
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  placeholder="SYR-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">{t('bus.capacity')} *</Label>
                <Input
                  id="capacity"
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">{t('bus.status')}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: string) => setFormData({ ...formData, status: value as BusStatus })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('bus.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Loop over the centralized busStatusInfo array */}
                    {busStatusInfo.map((statusInfo) => (
                      <SelectItem key={statusInfo.value} value={statusInfo.value}>
                        {/* Display the label for the current language */}
                        {statusInfo[lang]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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