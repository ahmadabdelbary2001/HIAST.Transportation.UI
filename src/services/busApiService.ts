// src/services/busApiService.ts
import type { Bus, CreateBusDto, UpdateBusDto } from '@/types/index';
import type { BusStatus } from '@/types/enums';
import { handleResponse } from './apiHelper';

export const busApiService = {
  getAll: async (): Promise<Bus[]> => {
    const response = await handleResponse(await fetch('/api/Bus'));
    return response.json();
  },

  getById: async (id: number): Promise<Bus> => {
    const response = await handleResponse(await fetch(`/api/Bus/${id}`));
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await handleResponse(await fetch(`/api/Bus/${id}`, {
      method: 'DELETE',
    }));
  },

  create: async (bus: CreateBusDto): Promise<number> => {
    const response = await handleResponse(await fetch('/api/Bus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bus),
    }));
    
    if (response.status !== 201) {
      const errorBody = await response.text();
      throw new Error(`Failed to create bus: ${response.statusText}. Details: ${errorBody}`);
    }
    return response.json();
  },

  update: async (bus: UpdateBusDto & { id: number }): Promise<void> => {
    const response = await fetch(`/api/Bus/${bus.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bus),
    });
    
    if (response.status !== 204) {
      const errorBody = await response.text();
      throw new Error(`Failed to update bus ${bus.id}: ${response.statusText}. Details: ${errorBody}`);
    }
  },

  // Additional bus-specific methods
  getByStatus: async (status: BusStatus): Promise<Bus[]> => {
    const response = await handleResponse(await fetch(`/api/Bus/status/${status}`));
    return response.json();
  },

  getAvailable: async (): Promise<Bus[]> => {
    const response = await handleResponse(await fetch('/api/Bus/available'));
    return response.json();
  },

  updateStatus: async (id: number, status: BusStatus): Promise<void> => {
    const response = await fetch(`/api/Bus/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    
    if (response.status !== 204) {
      const errorBody = await response.text();
      throw new Error(`Failed to update bus status ${id}: ${response.statusText}. Details: ${errorBody}`);
    }
  },
};