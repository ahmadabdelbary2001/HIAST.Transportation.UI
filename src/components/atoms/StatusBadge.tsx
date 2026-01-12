// src/components/atoms/StatusBadge.tsx

import { Badge } from '@/components/ui/badge';
import { BusStatus, busStatusInfo } from '@/types/enums';
import { useTranslation } from 'react-i18next';

interface StatusBadgeProps {
  status: BusStatus | undefined | null;
  type: 'bus';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const { t } = useTranslation();

  const getVariant = () => {
    if (type === 'bus') {
      switch (status as BusStatus) {
        case BusStatus.Available:
          return 'default';
        case BusStatus.InService:
          return 'secondary';
        case BusStatus.OutOfService:
          return 'destructive';
        default:
          return 'default';
      }
    }
  };

  const getLabel = () => {
    if (type === 'bus') {
      const info = busStatusInfo.find(i => i.value === status);
      return info ? t(info.key) : t('common.messages.noData');
    }
    return '';
  };

  return <Badge variant={getVariant()}>{getLabel()}</Badge>;
}