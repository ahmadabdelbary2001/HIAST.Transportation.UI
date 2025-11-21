import { type ReactNode } from 'react';

interface PageTitleProps {
  children: ReactNode;
  description?: string;
}

export function PageTitle({ children, description }: PageTitleProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight">{children}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}