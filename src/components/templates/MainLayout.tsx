// src/components/templates/MainLayout.tsx

import type { ReactNode } from 'react';
import { Header } from '@/components/organisms/Header';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
  
      <div className="py-0">
        {children}
      </div>
    </div>
  );
}
