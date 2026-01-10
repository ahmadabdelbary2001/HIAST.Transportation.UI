// src/components/atoms/ThemeSelector.tsx

import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTheme from '@/hooks/useTheme';
import { THEME_OPTIONS } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Select theme"
          className={cn('hover:bg-accent hover:text-accent-foreground', className)}
        >
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px]">
          {THEME_OPTIONS.map((themeOption) => (
            <DropdownMenuItem
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={cn(
                'cursor-pointer transition-colors',
                theme === themeOption.id
                  ? 'bg-[var(--theme-sidebar-active)] text-[var(--theme-sidebar-active-text)]'
                  : 'hover:bg-[var(--theme-sidebar-hover)] hover:text-[var(--theme-sidebar-hover-text)]'
              )}
            >
              {t(`theme.${themeOption.id}`)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
    </DropdownMenu>
  );
}