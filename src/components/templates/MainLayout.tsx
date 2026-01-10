// src/components/templates/MainLayout.tsx

import { type ReactNode, useState, useEffect } from 'react';
import { Header } from '@/components/organisms/Header';
import { Sidebar } from '@/components/organisms/Sidebar';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SIDEBAR_COLLAPSED);
    return saved ? JSON.parse(saved) : false;
  });

    const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Close mobile sidebar when collapsing on desktop
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleMobileMenuClick = () => {
    setSidebarOpen(true);
    // Ensure sidebar is not collapsed when opening on mobile
    setSidebarCollapsed(false);
  };

  // Determine sidebar props based on device
  const sidebarProps = isMobile 
    ? {
        isOpen: sidebarOpen,
        onClose: () => setSidebarOpen(false),
        sidebarCollapsed: false // Always expanded on mobile
      }
    : {
        isOpen: sidebarOpen || !sidebarCollapsed,
        onClose: () => setSidebarOpen(false)      };

  return (
    <div className="min-h-screen flex flex-col bg-theme-primary">
      <Header 
        onMenuClick={handleMobileMenuClick}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />
      
      <div className="flex flex-1">
        <Sidebar {...sidebarProps} />
        
        <main 
          className={cn(
            "flex-1 overflow-auto transition-all duration-300 bg-theme-primary",
            // Only apply margin when sidebar is actually visible and expanded
            !sidebarCollapsed && (sidebarOpen ? "md:ms-64" : "md:ms-0")
          )}
        >
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}