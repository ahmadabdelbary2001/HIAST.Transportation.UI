import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation('common');

  const languages = [
    { code: 'en', label: t('language.en') },
    { code: 'ar', label: t('language.ar') },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Select language">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
<DropdownMenuContent align="end" className="min-w-[120px]">
  {languages.map((lang) => (
    <DropdownMenuItem
      key={lang.code}
      onClick={() => setLanguage(lang.code)}
      className={cn(
        'cursor-pointer transition-colors',
        language === lang.code 
          ? 'bg-[var(--theme-sidebar-active)] text-[var(--theme-sidebar-active-text)]' 
          : 'hover:bg-[var(--theme-sidebar-hover)] hover:text-[var(--theme-sidebar-hover-text)]'
      )}
    >
      {lang.label}
    </DropdownMenuItem>
  ))}
</DropdownMenuContent>
    </DropdownMenu>
  );
}