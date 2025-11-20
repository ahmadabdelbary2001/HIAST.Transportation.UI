// src/components/atoms/ModeToggler.tsx

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useTheme from '@/hooks/useTheme';

export function ModeToggler() {
  const { mode, toggleMode } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={toggleMode} aria-label="Toggle theme mode">
      {mode === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}