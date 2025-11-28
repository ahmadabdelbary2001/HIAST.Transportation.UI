// src/pages/lines/LineForm.tsx

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
import { lineApiService } from '@/services/lineApiService';
import { employeeApiService } from '@/services/employeeApiService'; // Assuming you have this
import { driverApiService } from '@/services/driverApiService';
import { busApiService } from '@/services/busApiService';
import type { CreateLineDto, UpdateLineDto, EmployeeListDto, Driver, Bus } from '@/types';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function LineForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true); // Start true to load dropdowns
  const [formData, setFormData] = useState<CreateLineDto>({
    name: '',
    description: '',
    supervisorId: 0,
    driverId: 0,
    busId: 0,
  });

  // State for dropdown options
  const [supervisors, setSupervisors] = useState<EmployeeListDto[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);

  const loadRelatedData = useCallback(async () => {
    try {
      // Fetch all data needed for dropdowns in parallel
      const [supervisorData, driverData, busData] = await Promise.all([
        employeeApiService.getAll(), // You'll need to create this service
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
        setFormData({
          name: line.name,
          description: line.description,
          supervisorId: line.supervisorId,
          driverId: line.driverId,
          busId: line.busId,
        });
      }
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error loading line:', err);
    }
  }, [t]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.supervisorId === 0 || formData.driverId === 0 || formData.busId === 0) {
      toast.error(t('line.errors.allFieldsRequired'));
      return;
    }
    setLoading(true);

    try {
      if (isEdit && id) {
        await lineApiService.update({ ...formData, id: parseInt(id) } as UpdateLineDto);
        toast.success(t('common.messages.updateSuccess'));
      } else {
        await lineApiService.create(formData);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.LINES);
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error saving line:', err);
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('line.name')} *</Label>
                <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('line.description')}</Label>
                <Input id="description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisor">{t('line.supervisor')} *</Label>
                <Select value={formData.supervisorId.toString()} onValueChange={(v) => setFormData({ ...formData, supervisorId: parseInt(v) })}>
                  <SelectTrigger><SelectValue placeholder={t('line.placeholders.selectSupervisor')} /></SelectTrigger>
                  <SelectContent>
                    {supervisors.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.firstName} {s.lastName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver">{t('line.driver')} *</Label>
                <Select value={formData.driverId.toString()} onValueChange={(v) => setFormData({ ...formData, driverId: parseInt(v) })}>
                  <SelectTrigger><SelectValue placeholder={t('line.placeholders.selectDriver')} /></SelectTrigger>
                  <SelectContent>
                    {drivers.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bus">{t('line.bus')} *</Label>
                <Select value={formData.busId.toString()} onValueChange={(v) => setFormData({ ...formData, busId: parseInt(v) })}>
                  <SelectTrigger><SelectValue placeholder={t('line.placeholders.selectBus')} /></SelectTrigger>
                  <SelectContent>
                    {buses.map(b => <SelectItem key={b.id} value={b.id.toString()}>{b.licensePlate}</SelectItem>)}
                  </SelectContent>
                </Select>
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
