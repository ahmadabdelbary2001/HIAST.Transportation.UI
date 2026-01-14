import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { t } = useTranslation();

  const checks = [
    { label: t('passwordStrength.requirements.length'), met: password.length >= 8 },
    { label: t('passwordStrength.requirements.uppercase'), met: /[A-Z]/.test(password) },
    { label: t('passwordStrength.requirements.lowercase'), met: /[a-z]/.test(password) },
    { label: t('passwordStrength.requirements.number'), met: /[0-9]/.test(password) },
    { label: t('passwordStrength.requirements.special'), met: /[^A-Za-z0-9]/.test(password) },
  ];

  const strength = checks.filter(c => c.met).length;

  const getStrengthConfig = () => {
    if (password.length === 0) return { label: '', color: 'bg-muted', width: 'w-0' };
    if (strength <= 2) return { label: t('passwordStrength.weak'), color: 'bg-destructive', width: 'w-1/4' };
    if (strength === 3) return { label: t('passwordStrength.fair'), color: 'bg-yellow-500', width: 'w-2/4' };
    if (strength === 4) return { label: t('passwordStrength.good'), color: 'bg-blue-500', width: 'w-3/4' };
    return { label: t('passwordStrength.strong'), color: 'bg-green-500', width: 'w-full' };
  };

  const config = getStrengthConfig();

  return (
    <div className="space-y-3 mt-2 animate-in fade-in duration-300">
      <div className="flex justify-between items-center text-xs font-medium">
        <span className="text-muted-foreground">{t('passwordStrength.label')}</span>
        <span className={cn(
          config.color.replace('bg-', 'text-'),
          "transition-colors duration-300 font-bold"
        )}>
          {config.label}
        </span>
      </div>
      
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-500 ease-out",
            config.color,
            config.width
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-[10px] md:text-[11px]">
            {check.met ? (
              <Check className="h-3 w-3 text-green-500 shrink-0" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground/40 shrink-0" />
            )}
            <span className={cn(
              check.met ? "text-foreground font-medium" : "text-muted-foreground"
            )}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
