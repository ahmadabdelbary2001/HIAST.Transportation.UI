// src/components/atoms/AuditInfoCard.tsx

import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface AuditInfoCardProps {
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export function AuditInfoCard({ createdAt, updatedAt }: AuditInfoCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('common.auditInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {createdAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{t('common.createdAt')}:</span>
            <span className="font-medium text-foreground">{formatDate(createdAt)}</span>
          </div>
        )}
        {updatedAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{t('common.updatedAt')}:</span>
            <span className="font-medium text-foreground">{formatDate(updatedAt)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
