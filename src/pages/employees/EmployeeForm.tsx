// src/pages/employees/EmployeeForm.tsx

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
import { employeeApiService } from '@/services/employeeApiService';
import type { CreateEmployeeDto, UpdateEmployeeDto } from '@/types';
import { Department } from '@/types/enums';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';
import { ApiValidationError } from '@/services/apiHelper';

export default function EmployeeForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Define Validation Schema
  const employeeSchema = z.object({
    employeeNumber: z.string().min(1, t('common.validation.required')),
    firstName: z.string().min(1, t('common.validation.required')),
    lastName: z.string().min(1, t('common.validation.required')),
    email: z.string().email(t('common.validation.email')),
    phoneNumber: z.string().optional(),
    department: z.nativeEnum(Department).optional(),
  });

  type EmployeeFormData = z.infer<typeof employeeSchema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
  });

  const loadEmployee = useCallback(async (employeeId: number) => {
    try {
      setFormLoading(true);
      const employee = await employeeApiService.getById(employeeId);
      if (employee) {
        setValue('employeeNumber', employee.employeeNumber);
        setValue('firstName', employee.firstName);
        setValue('lastName', employee.lastName);
        setValue('email', employee.email);
        setValue('phoneNumber', employee.phoneNumber || '');
        if (employee.department) {
            setValue('department', employee.department);
        }
      }
    } catch (err) {
      toast.error(t('common.messages.error'));
      console.error('Error loading employee:', err);
    } finally {
      setFormLoading(false);
    }
  }, [t, setValue]);

  useEffect(() => {
    if (isEdit && id) {
      loadEmployee(parseInt(id));
    }
  }, [id, isEdit, loadEmployee]);

  const onFormSubmit = async (data: EmployeeFormData) => {
    setLoading(true);
    try {
        // Validation Check
        const allEmployees = await employeeApiService.getAll();
        const duplicate = allEmployees.find(e => 
            e.employeeNumber === data.employeeNumber &&
            (!isEdit || e.id !== parseInt(id!))
        );

        if (duplicate) {
            setError("employeeNumber", {
                type: "manual",
                message: t('common.validation.employeeNumberExists')
            });
            setLoading(false);
            return;
        }

      if (isEdit && id) {
        await employeeApiService.update({
          ...data,
          id: parseInt(id),
        } as UpdateEmployeeDto);
        toast.success(t('common.messages.updateSuccess'));
      } else {
        await employeeApiService.create(data as CreateEmployeeDto);
        toast.success(t('common.messages.createSuccess'));
      }
      navigate(ROUTES.EMPLOYEES);
    } catch (err: unknown) {
        if (err instanceof ApiValidationError) {
            Object.entries(err.errors).forEach(([key, messages]) => {
                // Map backend field names (TitleCase) to frontend (camelCase)
                const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
                 // Check if field exists in form
                if (['employeeNumber', 'firstName', 'lastName', 'email', 'phoneNumber', 'department'].includes(fieldName)) {
                    setError(fieldName as keyof EmployeeFormData, {
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
            console.error('Error saving employee:', error);
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
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.EMPLOYEES)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageTitle>{isEdit ? t('employee.editEmployee') : t('employee.createNew')}</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? t('employee.editEmployee') : t('employee.createNew')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeNumber">{t('employee.employeeNumber')} *</Label>
                <Input
                  id="employeeNumber"
                  {...register('employeeNumber')}
                  error={errors.employeeNumber?.message}
                  placeholder="00000"
                  forceLtr
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('employee.firstName')} *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('employee.lastName')} *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('employee.email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  placeholder="name@example.com"
                  forceLtr
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t('employee.phoneNumber')}</Label>
                <Input
                  id="phoneNumber"
                  {...register('phoneNumber')}
                  error={errors.phoneNumber?.message}
                  placeholder="+963 99 123 4567"
                  forceLtr
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">{t('employee.department')}</Label>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <div>
                        <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        >
                        <SelectTrigger error={errors.department?.message}>
                            <SelectValue placeholder={t('employee.selectDepartment')} />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(Department).map((dept) => (
                            <SelectItem key={dept} value={dept}>
                                {t(`employee.departments.${dept}`)}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <ValidationError message={errors.department?.message || ''} />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? t('common.messages.saving') : t('common.actions.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(ROUTES.EMPLOYEES)}>
                {t('common.actions.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
