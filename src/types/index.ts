// Base Entity Types
export interface BaseEntity {
  id: number;
  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

// Driver
export interface Driver extends BaseEntity {
  name: string;
  licenseNumber: string;
  licenseExpiryDate: Date;
  contactInfo?: string;
}

export interface CreateDriverDto {
  name: string;
  licenseNumber: string;
  licenseExpiryDate: Date;
  contactInfo?: string;
}

export interface UpdateDriverDto extends CreateDriverDto {
  id: number;
}