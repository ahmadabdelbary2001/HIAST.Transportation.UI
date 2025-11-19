import type { ReactNode } from 'react';
import { Header } from '@/components/organisms/Header';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}