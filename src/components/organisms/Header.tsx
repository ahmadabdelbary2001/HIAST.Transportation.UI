// src/components/organisms/Header.tsx

import { Menu, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/atoms/Logo';
import { LanguageSelector } from '@/components/atoms/LanguageSelector';
import { ModeToggler } from '@/components/atoms/ModeToggler';
import { ThemeSelector } from '@/components/atoms/ThemeSelector';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({ onMenuClick, sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[var(--theme-header-bg)] backdrop-blur supports-[backdrop-filter]:bg-[var(--theme-header-bg)]/95">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          {onMenuClick && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuClick} 
              className="md:hidden h-9 w-9 rounded-lg bg-[var(--theme-sidebar-hover)] hover:bg-[var(--theme-sidebar-active)]"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}

          {/* Desktop sidebar toggle - positioned to the left of logo */}
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className={cn(
                "hidden md:flex h-8 w-8 rounded-lg transition-all duration-300 hover:scale-105",
                "bg-[var(--theme-sidebar-hover)] hover:bg-[var(--theme-sidebar-active)]",
                "text-[var(--theme-sidebar-text)] hover:text-white",
                "shadow-sm hover:shadow-md"
              )}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </Button>
          )}

          <Logo />
        </div>

        <div className="flex items-center gap-2">
          <ThemeSelector />
          <ModeToggler />
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}