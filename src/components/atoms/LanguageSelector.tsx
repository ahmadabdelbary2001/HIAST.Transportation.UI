// src/components/atoms/LanguageSelector.tsx

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Language {
  code: string;
  label: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  compact?: boolean;
}

const languages: Language[] = [
  { code: 'en', label: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

export function LanguageSelector({ 
  currentLanguage, 
  onLanguageChange, 
  compact = false 
}: LanguageSelectorProps) {
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  // Compact version for mobile
  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full"
            aria-label="Select language"
          >
            <span className="text-lg">{currentLang.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[120px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={cn(
                'cursor-pointer transition-colors flex items-center gap-2',
                currentLanguage === lang.code 
                  ? 'bg-[var(--theme-sidebar-active)] text-[var(--theme-sidebar-active-text)]' 
                  : 'hover:bg-[var(--theme-sidebar-hover)] hover:text-[var(--theme-sidebar-hover-text)]'
              )}
            >
              {/* For LTR: Flag on left, for RTL: Flag on right */}
              {lang.dir === 'ltr' ? (
                <>
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </>
              ) : (
                <>
                  <span>{lang.label}</span>
                  <span className="text-base">{lang.flag}</span>
                </>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Full version for desktop
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-9 px-3 flex items-center gap-2 hover:bg-[var(--theme-sidebar-hover)]"
          aria-label="Select language"
        >
          <span className="text-lg">{currentLang.flag}</span>
          <span className="text-sm font-medium hidden sm:block">{currentLang.label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={cn(
              'cursor-pointer transition-colors flex items-center gap-2',
              currentLanguage === lang.code 
                ? 'bg-[var(--theme-sidebar-active)] text-[var(--theme-sidebar-active-text)]' 
                : 'hover:bg-[var(--theme-sidebar-hover)] hover:text-[var(--theme-sidebar-hover-text)]'
            )}
          >
            {/* Dynamic order based on each language's direction */}
            {lang.dir === 'ltr' ? (
              // LTR: Flag -> Label -> Checkmark
              <>
                <span className="text-base">{lang.flag}</span>
                <span className="flex-1">{lang.label}</span>
                {currentLanguage === lang.code && (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </>
            ) : (
              // RTL: Checkmark -> Label -> Flag
              <>
                {currentLanguage === lang.code && (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
                <span className="flex-1 text-right">{lang.label}</span>
                <span className="text-base">{lang.flag}</span>
              </>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}