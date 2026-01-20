// src/types/index.ts

import { BusStatus, StopType, Department } from "./enums";

// Base Entity Types
export interface BaseEntity {
  id: number;
  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

// Employee
// Identity-based employee does not strictly follow BaseEntity (id is string)
export interface EmployeeDto {
  id: string; // Identity User Id
  userId?: string; // Alias for id
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  userName?: string;
  email: string;
  phoneNumber?: string;
  department?: Department;

  // Subscription fields (flatted)
  lineSubscriptionId?: number;
  subscribedLineId?: number;
  subscribedLineName?: string;
  isSubscriptionActive: boolean;

  createdAt?: Date; // Optional now
  updatedAt?: Date;
}

export interface EmployeeListDto {
  id: string; // Identity User Id
  userId?: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  department?: Department;
  userName?: string;
  phoneNumber?: string;

  isAssigned?: boolean;
  isSubscriptionActive?: boolean;
}

export interface CreateEmployeeDto {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  department?: Department;
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {
  id: string; // User Id (string)
  userId?: string;
}

// Driver
export interface Driver extends BaseEntity {
  name: string;
  licenseNumber: string;
  contactInfo?: string;
  lineId?: number;
  lineName?: string;
  busId?: number;
  busLicensePlate?: string;
  isAssigned?: boolean;
}

export interface CreateDriverDto {
  name: string;
  licenseNumber: string;
  contactInfo?: string;
}

export interface UpdateDriverDto extends CreateDriverDto {
  id: number;
}

// Bus
export interface Bus extends BaseEntity {
  licensePlate: string;
  capacity: number;
  status: BusStatus;
  lineId?: number;
  lineName?: string;
}

export interface CreateBusDto {
  licensePlate: string;
  capacity: number;
  status?: BusStatus;
}

export interface UpdateBusDto extends CreateBusDto {
  id: number;
}

// Line
// This represents the detailed Line object returned from GET /api/Line/{id}
// Line
// This represents the detailed Line object returned from GET /api/Line/{id}
export interface Line extends BaseEntity {
  supervisorId: string; // Identity string ID
  supervisorName: string;
  busId: number;
  busLicensePlate: string;
  busCapacity: number;
  driverId: number;
  driverName: string;
  name: string;
  description?: string;
  // Assuming StopDto and LineSubscriptionDto will be defined for detail views
  stops: Stop[];
  subscriptions: LineSubscription[];
  isActive?: boolean;
}

// This represents the lighter Line object for list views from GET /api/Line
export interface LineListDto {
  id: number;
  name: string;
  description?: string;
  supervisorName: string;
}

// DTO for creating a new line (POST /api/Line)
export interface CreateLineDto {
  supervisorId: string;
  busId: number;
  driverId: number;
  name: string;
  description?: string;
}

// DTO for updating an existing line (PUT /api/Line/{id})
export interface UpdateLineDto extends CreateLineDto {
  id: number;
}

export interface LineSubscriptionDto {
  id: number;
  employeeId: string;
  employeeName: string; // Example property
  startDate: Date;
  endDate?: Date;
}

// Represents the read-only report data from GET /api/Supervisor/LineAssignments
export interface SupervisorLineDto {
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  lineId: number;
  lineName: string;
}

// Represents the detailed Stop object from GET /api/Stop/{id}
export interface Stop extends BaseEntity {
  lineId: number;
  lineName: string;
  address: string;
  sequenceOrder: number;
  stopType: StopType;
}

// Represents the lighter Stop object for list views from GET /api/Stop
export interface StopListDto {
  id: number;
  lineId: number;
  lineName: string;
  address: string;
  sequenceOrder: number;
  stopType: StopType;
}

// DTO for creating a new stop (POST /api/Stop)
export interface CreateStopDto {
  lineId: number;
  address: string;
  sequenceOrder: number;
  stopType: StopType;
}

// DTO for updating an existing stop (PUT /api/Stop/{id})
export interface UpdateStopDto extends CreateStopDto {
  id: number;
}

// =================================
// Line Subscription
// =================================

// Represents the detailed object from GET /api/LineSubscription/{id}
export interface LineSubscription extends BaseEntity {
  employeeId: string;
  lineId: number;
  startDate: string; // Use string for dates from API
  endDate?: string;
  employeeName: string;
  lineName: string;
  isActive?: boolean;
}

// Represents the lighter object for list views from GET /api/LineSubscription
export interface LineSubscriptionListDto {
  id: number;
  employeeId: string;
  lineId: number;
  employeeName: string;
  lineName: string;
  isActive?: boolean;
}

// DTO for creating a new subscription (POST /api/LineSubscription)
export interface CreateLineSubscriptionDto {
  employeeId: string;
  lineId: number;
  startDate: string;
  isActive: boolean;
}

// DTO for updating an existing subscription (PUT /api/LineSubscription/{id})
export interface UpdateLineSubscriptionDto extends CreateLineSubscriptionDto {
  id: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  titleKey?: string;
  messageKey?: string;
  data?: string;
  userId: string;
  isRead: boolean;
  relatedEntityId?: string;
  type?: string;
  createdAt: string;
}