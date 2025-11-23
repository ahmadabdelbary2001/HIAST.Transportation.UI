// src/services/driverApiService.ts
import type { Driver, CreateDriverDto, UpdateDriverDto } from '@/types/index';
import { handleResponse } from './apiHelper';

export const driverApiService = {
  getAll: async (): Promise<Driver[]> => {
    const response = await handleResponse(await fetch('/api/Driver'));
    return response.json();
  },

  getById: async (id: number): Promise<Driver> => {
    const response = await handleResponse(await fetch(`/api/Driver/${id}`));
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await handleResponse(await fetch(`/api/Driver/${id}`, {
      method: 'DELETE',
    }));
  },

  create: async (driver: CreateDriverDto): Promise<number> => {
    const response = await handleResponse(await fetch('/api/Driver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driver),
    }));
    
    if (response.status !== 201) {
      const errorBody = await response.text();
      throw new Error(`Failed to create driver: ${response.statusText}. Details: ${errorBody}`);
    }
    return response.json();
  },

  update: async (driver: UpdateDriverDto & { id: number }): Promise<void> => {
    const response = await fetch(`/api/Driver/${driver.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driver),
    });
    
    if (response.status !== 204) {
      const errorBody = await response.text();
      throw new Error(`Failed to update driver ${driver.id}: ${response.statusText}. Details: ${errorBody}`);
    }
  },

  // Additional driver-specific methods
  getDriversWithExpiringLicense: async (daysThreshold: number = 30): Promise<Driver[]> => {
    const response = await handleResponse(await fetch(`/api/Driver/expiring?days=${daysThreshold}`));
    return response.json();
  },

  getDriversWithExpiredLicense: async (): Promise<Driver[]> => {
    const response = await handleResponse(await fetch('/api/Driver/expired'));
    return response.json();
  },
};