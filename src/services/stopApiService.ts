import type { Stop, StopListDto, CreateStopDto, UpdateStopDto } from '@/types/index';
import { handleResponse } from './apiHelper';

export const stopApiService = {
  /**
   * Fetches a list of all stops.
   */
  getAll: async (): Promise<StopListDto[]> => {
    const response = await handleResponse(await fetch('/api/Stop'));
    return response.json();
  },

  /**
   * Fetches the detailed information for a single stop.
   */
  getById: async (id: number): Promise<Stop> => {
    const response = await handleResponse(await fetch(`/api/Stop/${id}`));
    return response.json();
  },

  /**
   * Deletes a stop by its ID.
   */
  delete: async (id: number): Promise<void> => {
    await handleResponse(await fetch(`/api/Stop/${id}`, {
      method: 'DELETE',
    }));
  },

  /**
   * Creates a new stop.
   */
  create: async (stop: CreateStopDto): Promise<number> => {
    const response = await handleResponse(await fetch('/api/Stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stop),
    }));
    return response.json();
  },

  /**
   * Updates an existing stop.
   */
  update: async (stop: UpdateStopDto): Promise<void> => {
    const response = await fetch(`/api/Stop/${stop.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stop),
    });
    
    if (response.status !== 204) {
      const errorBody = await response.text();
      throw new Error(`Failed to update stop ${stop.id}: ${response.statusText}. Details: ${errorBody}`);
    }
  },
};
