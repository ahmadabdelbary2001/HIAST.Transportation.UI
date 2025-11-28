// src/types/enums.ts

export const BusStatus = {
  Available: 1,
  InService: 2,
  UnderMaintenance: 3,
  OutOfService: 4,
} as const;

// Create a type for the values of BusStatus
export type BusStatus = typeof BusStatus[keyof typeof BusStatus];

// Use a function to get labels instead of computed property syntax
export const getBusStatusLabel = (status: BusStatus, language: 'en' | 'ar'): string => {
  const labels = {
    [BusStatus.Available]: { en: 'Available', ar: 'متاح' },
    [BusStatus.InService]: { en: 'In Service', ar: 'قيد الخدمة' },
    [BusStatus.UnderMaintenance]: { en: 'Under Maintenance', ar: 'تحت الصيانة' },
    [BusStatus.OutOfService]: { en: 'Out of Service', ar: 'خارج الخدمة' },
  };
  return labels[status]?.[language] || '';
};

// Alternative: Use a simple object without computed properties
export const BusStatusLabels = {
  1: { en: 'Available', ar: 'متاح' },
  2: { en: 'In Service', ar: 'قيد الخدمة' },
  3: { en: 'Under Maintenance', ar: 'تحت الصيانة' },
  4: { en: 'Out of Service', ar: 'خارج الخدمة' },
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