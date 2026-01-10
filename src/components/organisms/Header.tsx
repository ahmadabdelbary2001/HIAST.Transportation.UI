// src/components/organisms/Header.tsx

import { useTranslation } from 'react-i18next';
import { Menu, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/atoms/Logo';
import { LanguageSelector } from '@/components/atoms/LanguageSelector';
import { ModeToggler } from '@/components/atoms/ModeToggler';
import { ThemeSelector } from '@/components/atoms/ThemeSelector';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  showLanguage?: boolean;
}

export function Header({ 
  onMenuClick, 
  sidebarCollapsed, 
  onToggleSidebar,
  showLanguage = true 
}: HeaderProps) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const isRTL = language === 'ar';

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    // Update document direction for RTL/LTR
    document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
  };

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-[var(--theme-header-bg)] backdrop-blur supports-[backdrop-filter]:bg-[var(--theme-header-bg)]/95"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Logo and menu buttons */}
        <div className={cn(
          "flex items-center gap-3",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}>
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

          {/* Desktop sidebar toggle */}
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
              title={sidebarCollapsed ? t('common.actions.expandSidebar') : t('common.actions.collapseSidebar')}
            >
              {sidebarCollapsed ? (
                <ChevronLeft className={cn(
                  "h-3.5 w-3.5",
                  isRTL ? "rotate-0" : "rotate-180"
                )} />
              ) : (
                <ChevronLeft className={cn(
                  "h-3.5 w-3.5", 
                  isRTL ? "rotate-180" : "rotate-0"
                )} />
              )}
            </Button>
          )}

          <Logo />
        </div>

        {/* Right-side Actions */}
        <div className={cn(
          "flex items-center gap-3",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}>
          {showLanguage && (
            <>
              <div className="hidden sm:block">
                <LanguageSelector 
                  currentLanguage={language} 
                  onLanguageChange={handleLanguageChange} 
                />
              </div>
              <div className="sm:hidden">
                <LanguageSelector 
                  currentLanguage={language} 
                  onLanguageChange={handleLanguageChange} 
                  compact 
                />
              </div>
            </>
          )}
          <ThemeSelector />
          <ModeToggler />
        </div>
      </div>
    </header>
  );
}