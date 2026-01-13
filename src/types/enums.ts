// src/types/enums.ts

export const BusStatus = {
  Available: 'Available',
  InService: 'InService',
  OutOfService: 'OutOfService',
} as const;

export type BusStatus = typeof BusStatus[keyof typeof BusStatus];

export const busStatusInfo = [
  { value: BusStatus.Available, key: 'bus.statuses.Available' },
  { value: BusStatus.InService, key: 'bus.statuses.InService' },
  { value: BusStatus.OutOfService, key: 'bus.statuses.OutOfService' },
] as const;

export const StopType = {
  Intermediate: 1,
  Terminus: 2,
} as const;

export type StopType = typeof StopType[keyof typeof StopType];

// دالة مساعدة للتحقق من النوع
export const isStopType = (value: unknown): value is StopType => {
  if (typeof value === 'number') {
    return value === StopType.Intermediate || value === StopType.Terminus;
  }
  
  if (typeof value === 'string') {
    const num = parseInt(value, 10);
    return !isNaN(num) && (num === StopType.Intermediate || num === StopType.Terminus);
  }
  
  return false;
};

// دالة للتحويل من أي قيمة إلى StopType
export const toStopType = (value: unknown): StopType => {
  if (isStopType(value)) {
    return value;
  }
  
  if (typeof value === 'string') {
    const num = parseInt(value.trim(), 10);
    if (!isNaN(num)) {
      return num === StopType.Terminus ? StopType.Terminus : StopType.Intermediate;
    }
  }
  
  if (typeof value === 'number') {
    return value === StopType.Terminus ? StopType.Terminus : StopType.Intermediate;
  }
  
  // القيمة الافتراضية
  return StopType.Intermediate;
};

// دالة للحصول على نص النوع
export const getStopTypeLabel = (stopType: StopType, t: (key: string) => string): string => {
  return stopType === StopType.Terminus 
    ? t('stop.types.terminus') 
    : t('stop.types.intermediate');
};

export const Department = {
  IT: 'IT',
  AI: 'AI',
  Network: 'Network',
  Finance: 'Finance',
  Mechatronics: 'Mechatronics',
  Mathematics: 'Mathematics',
  Communications: 'Communications',
  Environment: 'Environment',
  Administration: 'Administration',
  Languages: 'Languages',
} as const;

export type Department = typeof Department[keyof typeof Department];