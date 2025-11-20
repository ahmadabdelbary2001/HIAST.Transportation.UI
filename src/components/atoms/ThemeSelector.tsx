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
import { useLanguage } from '@/hooks/useLanguage';

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();

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
      <DropdownMenuContent align="end" className="bg-popover text-popover-foreground">
        {THEME_OPTIONS.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
            className={cn(
              'cursor-pointer focus:bg-accent focus:text-accent-foreground',
              theme === themeOption.id && 'bg-accent text-accent-foreground'
            )}
          >
            {themeOption.name[language as 'en' | 'ar']}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}