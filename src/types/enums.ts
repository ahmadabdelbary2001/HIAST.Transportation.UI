// src/types/enums.ts

export const BusStatus = {
  Available: 'Available',
  InService: 'InService',
  UnderMaintenance: 'UnderMaintenance',
  OutOfService: 'OutOfService',
} as const;

export type BusStatus = typeof BusStatus[keyof typeof BusStatus];

export const busStatusInfo = [
  { value: BusStatus.Available, key: 'bus.statuses.Available' },
  { value: BusStatus.InService, key: 'bus.statuses.InService' },
  { value: BusStatus.UnderMaintenance, key: 'bus.statuses.UnderMaintenance' },
  { value: BusStatus.OutOfService, key: 'bus.statuses.OutOfService' },
] as const;

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