import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RegisterRequest } from '@/services/authApiService';
import { authApiService } from '@/services/authApiService';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Loader2, UserCircle, Hash, Building2, Phone } from 'lucide-react';
import { toast } from 'sonner';

import { Header } from '@/components/organisms/Header';
import { Label } from '@/components/ui/label';
import PasswordStrengthMeter from '@/components/molecules/PasswordStrengthMeter';
import { Department } from '@/types/enums';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    employeeNumber: '',
    phoneNumber: '',
    department: undefined,
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (value: string) => {
    // Map string enum value to its integer index for the backend
    const deptKeys = Object.keys(Department);
    const index = deptKeys.indexOf(value) + 1; // Backend IT=1, AI=2...
    setFormData(prev => ({ ...prev, department: index }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Explicit checks matching backend Identity rules
    if (formData.password.length < 8) {
      toast.error(t('auth.errors.passwordTooShort'));
      return;
    }
    if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      toast.error(t('auth.errors.passwordTooWeak'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('auth.errors.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    try {
      await authApiService.register(formData);
      toast.success(t('registrationSuccess'));
      navigate(ROUTES.LOGIN);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('registrationFailed');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4 animate-in slide-in-from-bottom duration-500">
        <div className="w-full max-w-lg bg-theme-secondary p-8 rounded-2xl shadow-xl border border-border theme-card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('register')}</h1>
            <p className="text-muted-foreground">{t('registerSubtask')}</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('common.fields.firstName')}</Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder={t('common.fields.firstName')}
                  className="pl-10"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{t('common.fields.lastName')}</Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder={t('common.fields.lastName')}
                  className="pl-10"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="userName">{t('common.fields.userName')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="userName"
                  name="userName"
                  placeholder="first.last"
                  className="pl-10"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">{t('common.fields.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeNumber">{t('employee.employeeNumber')}</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="employeeNumber"
                  name="employeeNumber"
                  placeholder="123456"
                  className="pl-10"
                  value={formData.employeeNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">{t('employee.department')}</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select onValueChange={handleDepartmentChange}>
                  <SelectTrigger className="pl-10">
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
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phoneNumber">{t('employee.phoneNumber')}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+963 000 000 000"
                  className="pl-10"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('common.fields.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <PasswordStrengthMeter password={formData.password} />
            </div>

            <Button type="submit" className="w-full md:col-span-2 mt-4" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t('signUp')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t('alreadyHaveAccount')} </span>
            <button 
              onClick={() => navigate(ROUTES.LOGIN)}
              className="text-primary font-medium hover:underline"
            >
              {t('signIn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
