// src/components/atoms/DetailHeader.tsx

import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageTitle } from './PageTitle';

interface DetailHeaderProps {
  title: string;
  backRoute: string;
  editRoute?: string;
}

export function DetailHeader({ title, backRoute, editRoute }: DetailHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(backRoute)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageTitle>{title}</PageTitle>
      </div>
      {editRoute && (
        <Button asChild>
          <Link to={editRoute}>
            <Edit className="me-2 h-4 w-4" />
            {t('common.actions.edit')}
          </Link>
        </Button>
      )}
    </div>
  );
}
