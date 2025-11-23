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