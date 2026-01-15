import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageTitle } from '@/components/atoms/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ListHeaderProps {
  title: string;
  count: number;
  countLabel?: string;
  createRoute?: string;
  createLabel?: string;
  children?: ReactNode;
}

export function ListHeader({
  title,
  count,
  countLabel,
  createRoute,
  createLabel,
  children,
}: ListHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <PageTitle>{title}</PageTitle>
        <Badge variant="secondary" className="text-sm">
          {count} {countLabel}
        </Badge>
        {children}
      </div>
      {createRoute && createLabel && (
        <Button asChild>
          <Link to={createRoute}>
            <Plus className="me-2 h-4 w-4" />
            {createLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
