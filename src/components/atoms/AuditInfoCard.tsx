// src/components/atoms/AuditInfoCard.tsx

import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface AuditInfoCardProps {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: string;
  updatedBy?: string;
}

export function AuditInfoCard({ createdAt, updatedAt, createdBy, updatedBy }: AuditInfoCardProps) {
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
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {createdAt && (
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{t('common.createdAt')}</span>
            <div className="flex items-center gap-2">
               <Clock className="h-4 w-4 text-muted-foreground" />
               <span className="font-medium">{formatDate(createdAt)}</span>
                {createdBy && <span className="text-sm text-muted-foreground">({createdBy})</span>}
            </div>
          </div>
        )}
        {updatedAt && (
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{t('common.updatedAt')}</span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatDate(updatedAt)}</span>
              {updatedBy && <span className="text-sm text-muted-foreground">({updatedBy})</span>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
