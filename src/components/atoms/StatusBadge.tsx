// src/components/atoms/StatusBadge.tsx

import { Badge } from '@/components/ui/badge';
import { BusStatus, BusStatusLabels } from '@/types/enums';
import { useLanguage } from '@/hooks/useLanguage';

interface StatusBadgeProps {
  status: BusStatus;
  type: 'bus';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const { language } = useLanguage();
  const lang = language as 'en' | 'ar';

  const getVariant = () => {
    if (type === 'bus') {
      switch (status as BusStatus) {
        case BusStatus.Available:
          return 'default';
        case BusStatus.InService:
          return 'secondary';
        case BusStatus.UnderMaintenance:
          return 'outline';
        case BusStatus.OutOfService:
          return 'destructive';
        default:
          return 'default';
      }
    }
  };

  const getLabel = () => {
    if (type === 'bus') {
      return BusStatusLabels[status as BusStatus][lang];
    } else {
      return;
    }
  };

  return <Badge variant={getVariant()}>{getLabel()}</Badge>;
}