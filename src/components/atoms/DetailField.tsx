// src/components/atoms/DetailField.tsx

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface DetailFieldProps {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  link?: string;
  className?: string;
}

export function DetailField({ label, value, icon: Icon, link, className }: DetailFieldProps) {
  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      {Icon && <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />}
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="block hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}
