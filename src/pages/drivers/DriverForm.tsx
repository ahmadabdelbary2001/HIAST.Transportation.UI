// src/pages/drivers/DriverForm.tsx
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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

export default function DriverForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDriverDto>({
    name: '',
    licenseNumber: '',
    contactInfo: '',
  });

  const loadDriver = useCallback(async (driverId: number) => {
    try {
      setFormLoading(true);
      const driver = await driverApiService.getById(driverId);
      if (driver) {
        setFormData({
          name: driver.name,
          licenseNumber: driver.licenseNumber,
          contactInfo: driver.contactInfo || '',
        });
      }
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error loading driver:', err);
    } finally {
      setFormLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isEdit && id) {
      loadDriver(parseInt(id));
    }
  }, [id, isEdit, loadDriver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        await driverApiService.update({ 
          ...formData, 
          id: parseInt(id),
        } as UpdateDriverDto & { id: number });
        toast.success(t('common.messages.updateSuccess'));
      } else {
        await driverApiService.create(formData);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.DRIVERS);
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error saving driver:', err);
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('driver.name')} *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">{t('driver.licenseNumber')} *</Label>
                <Input
                  id="licenseNumber"
                  required
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="contactInfo">{t('driver.contactInfo')}</Label>
                <Input
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="+963 99 123 4567"
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