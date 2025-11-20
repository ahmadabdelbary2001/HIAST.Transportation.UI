// src/components/organisms/Header.tsx

import { Logo } from '@/components/atoms/Logo';
import { ModeToggler } from '@/components/atoms/ModeToggler';
import { ThemeSelector } from '@/components/atoms/ThemeSelector';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="flex items-center gap-2">
            <ThemeSelector />
            <ModeToggler />
          </div>
        </div>
      </div>
    </header>
  );
}
