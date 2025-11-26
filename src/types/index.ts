// src/types/index.ts

import { BusStatus } from "./enums";

// Base Entity Types
export interface BaseEntity {
  id: number;
  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

// Employee
export interface Employee extends BaseEntity {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  department?: string;
  isActive: boolean;
}

export interface CreateEmployeeDto {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  department?: string;
  isActive?: boolean;
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {
  id: number;
}

// Driver
export interface Driver extends BaseEntity {
  name: string;
  licenseNumber: string;
  contactInfo?: string;
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
// This represents the detailed Line object returned from GET /api/Lines/{id}
export interface Line extends BaseEntity {
  supervisorId: number;
  supervisorName: string;
  busId: number;
  busLicensePlate: string;
  driverId: number;
  driverName: string;
  name: string;
  description?: string;
  // Assuming StopDto and LineSubscriptionDto will be defined for detail views
  stops: StopDto[]; 
  subscriptions: LineSubscriptionDto[];
}

// This represents the lighter Line object for list views from GET /api/Lines
export interface LineListDto {
  id: number;
  name: string;
  description?: string;
  supervisorName: string;
}

// DTO for creating a new line (POST /api/Lines)
export interface CreateLineDto {
  supervisorId: number;
  busId: number;
  driverId: number;
  name: string;
  description?: string;
}

// DTO for updating an existing line (PUT /api/Lines/{id})
export interface UpdateLineDto extends CreateLineDto {
  id: number;
}

export interface StopDto {
  id: number;
  address: string;
  sequenceOrder: number;
  // You might want a StopType enum here as well
}

export interface LineSubscriptionDto {
  id: number;
  employeeId: number;
  employeeName: string; // Example property
  startDate: Date;
  endDate?: Date;
}

// Represents the read-only report data from GET /api/Supervisor/LineAssignments
export interface SupervisorLineDto {
  employeeId: number;
  employeeNumber: string;
  employeeName: string;
  lineId: number;
  lineName: string;
}