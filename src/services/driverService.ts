// src/services/driverService.ts
import type { Driver, UpdateDriverDto } from '@/types/index';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

// Seed data
const seedDrivers: Driver[] = [
  {
    id: 1,
    name: 'Khaled Al-Mahmoud',
    licenseNumber: 'DRV-2024-001',
    licenseExpiryDate: new Date('2025-12-31'),
    contactInfo: '+963 99 9876543',
    createdAt: new Date('2024-01-10'),
    createdBy: 'system',
  },
  {
    id: 2,
    name: 'Youssef Al-Ahmad',
    licenseNumber: 'DRV-2024-002',
    licenseExpiryDate: new Date('2025-06-30'),
    contactInfo: '+963 99 8765432',
    createdAt: new Date('2024-01-15'),
    createdBy: 'system',
  },
  {
    id: 3,
    name: 'Hassan Al-Deeb',
    licenseNumber: 'DRV-2024-003',
    licenseExpiryDate: new Date('2025-03-15'),
    contactInfo: '+963 99 7654321',
    createdAt: new Date('2024-02-01'),
    createdBy: 'system',
  },
  {
    id: 4,
    name: 'Bilal Al-Khoury',
    licenseNumber: 'DRV-2024-004',
    licenseExpiryDate: new Date('2026-01-20'),
    contactInfo: '+963 93 6543210',
    createdAt: new Date('2024-02-10'),
    createdBy: 'system',
  },
];

// Mock API Service Base Class
class MockApiService<T extends { id: number }> {
  private storageKey: string;
  private initialData: T[];

  constructor(storageKey: string, initialData: T[]) {
    this.storageKey = storageKey;
    this.initialData = initialData;
  }

  private getStoredData(): T[] {
    if (typeof window === 'undefined') return this.initialData;
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.initialData;
    } catch {
      return this.initialData;
    }
  }

  private setStoredData(data: T[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }

  async getAll(): Promise<T[]> {
    return this.getStoredData();
  }

  async getById(id: number): Promise<T | null> {
    const data = this.getStoredData();
    return data.find(item => item.id === id) || null;
  }
  async update(id: number, updates: Partial<T>): Promise<T | null> {
    const data = this.getStoredData();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates };
    this.setStoredData(data);
    return data[index];
  }

  async delete(id: number): Promise<boolean> {
    const data = this.getStoredData();
    const filteredData = data.filter(item => item.id !== id);
    
    if (filteredData.length === data.length) return false;
    
    this.setStoredData(filteredData);
    return true;
  }

  async search(predicate: (item: T) => boolean): Promise<T[]> {
    const data = this.getStoredData();
    return data.filter(predicate);
  }
}

class DriverService extends MockApiService<Driver> {
  constructor() {
    super(LOCAL_STORAGE_KEYS.DRIVERS, seedDrivers);
  }

  async updateDriver(id: number, dto: UpdateDriverDto): Promise<Driver | null> {
    return this.update(id, dto);
  }

  async getDriversWithExpiringLicense(daysThreshold: number = 30): Promise<Driver[]> {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);

    return this.search((driver: Driver) => {
      const expiryDate = new Date(driver.licenseExpiryDate);
      return expiryDate >= today && expiryDate <= thresholdDate;
    });
  }

  async getDriversWithExpiredLicense(): Promise<Driver[]> {
    const today = new Date();
    return this.search((driver: Driver) => new Date(driver.licenseExpiryDate) < today);
  }
}

export const driverService = new DriverService();