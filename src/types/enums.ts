// src/types/enums.ts

export const BusStatus = {
  Available: 'Available',
  InService: 'InService',
  UnderMaintenance: 'UnderMaintenance',
  OutOfService: 'OutOfService',
} as const;

export type BusStatus = typeof BusStatus[keyof typeof BusStatus];

export const busStatusInfo = [
  { value: BusStatus.Available, en: 'Available', ar: 'متاح' },
  { value: BusStatus.InService, en: 'In Service', ar: 'قيد الخدمة' },
  { value: BusStatus.UnderMaintenance, en: 'Under Maintenance', ar: 'تحت الصيانة' },
  { value: BusStatus.OutOfService, en: 'Out of Service', ar: 'خارج الخدمة' },
] as const;

// A lookup map for fast access (used by StatusBadge).
const busStatusLabelMap = Object.fromEntries(
  busStatusInfo.map(info => [info.value, { en: info.en, ar: info.ar }])
) as Record<BusStatus, { en: string; ar: string }>;

// The getter function remains the same, but now uses the efficient map.
export const getBusStatusLabel = (
  status: BusStatus | undefined | null,
  language: 'en' | 'ar'
): string => {
  if (status === null || status === undefined || !busStatusLabelMap[status]) {
    return 'Unknown';
  }
  return busStatusLabelMap[status][language];
};

export const StopType = {
  Intermediate: 1,
  Terminus: 2,
} as const;

export type StopType = typeof StopType[keyof typeof StopType];

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