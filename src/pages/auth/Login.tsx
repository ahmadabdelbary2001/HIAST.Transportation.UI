import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authApiService } from '@/services/authApiService';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Header } from '@/components/organisms/Header';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [emailOrUserName, setEmailOrUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.DASHBOARD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApiService.login({ emailOrUserName, password, rememberMe });
      login(response.token, {
          id: response.id,
          userName: response.userName,
          email: response.email,
          roles: response.roles
      }, rememberMe);
      toast.success(t('loginSuccess'));
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('loginFailed');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4 animate-in fade-in duration-500">
        <div className="w-full max-w-md bg-theme-secondary p-8 rounded-2xl shadow-xl border border-border theme-card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('login')}</h1>
            <p className="text-muted-foreground">{t('loginSubtask')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="identifier">{t('common.fields.emailOrUserName')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="email@example.com / first.last"
                  className="pl-10"
                  value={emailOrUserName}
                  onChange={(e) => setEmailOrUserName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('common.fields.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Switch 
                  id="remember-me" 
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                />
                <Label htmlFor="remember-me" className="cursor-pointer font-normal text-sm">
                  {t('rememberMe')}
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t('signIn')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t('noAccount')} </span>
            <button 
              onClick={() => navigate(ROUTES.REGISTER)}
              className="text-primary font-medium hover:underline"
            >
              {t('registerNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
