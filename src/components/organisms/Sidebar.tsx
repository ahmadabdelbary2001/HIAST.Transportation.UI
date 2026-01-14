// src/components/organisms/Sidebar.tsx

import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Bus,
  Route,
  MapPin,
  ShieldCheck,
  ClipboardList,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  sidebarCollapsed?: boolean;
}

export function Sidebar({ isOpen = true, onClose, sidebarCollapsed }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();

  const allNavItems = [
    { icon: LayoutDashboard, label: t('nav.dashboard'), path: ROUTES.DASHBOARD, roles: ['Administrator', 'Employee'] },
    { icon: Users, label: t('nav.employees'), path: ROUTES.EMPLOYEES, roles: ['Administrator'] },
    { icon: UserCog, label: t('nav.drivers'), path: ROUTES.DRIVERS, roles: ['Administrator'] },
    { icon: ShieldCheck, label: t('nav.supervisors'), path: ROUTES.SUPERVISORS, roles: ['Administrator'] },
    { icon: Bus, label: t('nav.buses'), path: ROUTES.BUSES, roles: ['Administrator'] },
    { icon: Route, label: t('nav.lines'), path: ROUTES.LINES, roles: ['Administrator', 'Employee'] },
    { icon: MapPin, label: t('nav.stops'), path: ROUTES.STOPS, roles: ['Administrator', 'Employee'] },
    { icon: ClipboardList, label: t('nav.subscriptions'), path: ROUTES.SUBSCRIPTIONS, roles: ['Administrator'] },
  ];

  const userRoles = user?.roles || [];

  const navItems = allNavItems.filter(item => 
    item.roles.some(role => userRoles.some(ur => ur.toLowerCase() === role.toLowerCase()))
  );

  // Determine the actual display state
  const shouldShowSidebar = isOpen && !sidebarCollapsed;
  const isCollapsed = sidebarCollapsed && !isOpen;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed start-0 top-0 z-40 h-screen border-e transition-all duration-300 md:sticky md:shadow-xl',
          'bg-[var(--theme-sidebar-bg)] border-[var(--theme-sidebar-border)]',
          isOpen ? 'w-64' : 'md:w-20',
          // RTL-aware transforms
          isOpen 
            ? '[html[dir="ltr"]_&]:translate-x-0 [html[dir="rtl"]_&]:translate-x-0'
            : '[html[dir="ltr"]_&]:-translate-x-full [html[dir="rtl"]_&]:translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button only */}
          <div className={cn(
            "flex items-center justify-end border-b border-[var(--theme-sidebar-border)] p-4",
            shouldShowSidebar ? "md:hidden" : "hidden"
          )}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-[var(--theme-sidebar-hover)] hover:bg-[var(--theme-sidebar-active)]"
              title={t('sidebar.close', 'Close sidebar')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 space-y-2 transition-all duration-300",
            isCollapsed ? "p-2" : "p-4"
          )}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    'group flex items-center rounded-xl text-sm font-medium transition-all duration-300',
                    'border border-transparent hover:border-[var(--theme-sidebar-border)]',
                    // Consistent padding on all sides for both states
                    isCollapsed 
                      ? 'justify-center p-3'  // Equal padding on all sides when collapsed
                      : 'gap-3 p-2',         // Equal padding on all sides when expanded
                    isActive
                      ? 'bg-[var(--theme-sidebar-active)] text-[var(--theme-sidebar-active-text)] shadow-lg hover:shadow-xl border-[var(--theme-primary)]'
                      : 'bg-transparent text-[var(--theme-sidebar-text)] hover:bg-[var(--theme-sidebar-hover)] hover:text-[var(--theme-sidebar-hover-text)]'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Icon container with consistent sizing */}
                  <div className={cn(
                    "relative rounded-lg transition-all duration-300 flex items-center justify-center",
                    "p-2", // Consistent padding in both states
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "bg-[var(--theme-sidebar-icon-bg)] text-[var(--theme-sidebar-icon)] group-hover:bg-[var(--theme-sidebar-icon-hover-bg)] group-hover:text-[var(--theme-sidebar-icon-hover)]"
                  )}>
                    <Icon className={cn(
                      "transition-all duration-300",
                      isCollapsed ? "h-5 w-5" : "h-4 w-4" // Slightly larger when collapsed for better visibility
                    )} />
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="absolute -top-1 -end-1 h-2 w-2 rounded-full bg-green-400 ring-2 ring-[var(--theme-sidebar-active)]" />
                    )}
                  </div>
                  
                  {/* Label - only show when sidebar is expanded */}
                  {shouldShowSidebar && (
                    <span className="truncate font-medium transition-all duration-300 ms-2">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}