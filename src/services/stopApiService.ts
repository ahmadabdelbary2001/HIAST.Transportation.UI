import type { Stop, StopListDto, CreateStopDto, UpdateStopDto } from '@/types/index';
import { fetchWithAuth } from './apiHelper';

export const stopApiService = {
  /**
   * Fetches a list of all stops.
   */
  getAll: async (): Promise<StopListDto[]> => {
    const response = await fetchWithAuth('/api/Stop');
    return response.json();
  },

  /**
   * Fetches the detailed information for a single stop.
   */
  getById: async (id: number): Promise<Stop> => {
    const response = await fetchWithAuth(`/api/Stop/${id}`);
    return response.json();
  },

  /**
   * Deletes a stop by its ID.
   */
  delete: async (id: number): Promise<void> => {
    await fetchWithAuth(`/api/Stop/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Creates a new stop.
   */
  create: async (stop: CreateStopDto): Promise<number> => {
    // تحويل stopType من number إلى string للإرسال إلى الـ API
    const payload = {
      ...stop,
      stopType: stop.stopType === 2 ? 'Terminus' : 'Intermediate'
    };
    
    const response = await fetchWithAuth('/api/Stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  /**
   * Updates an existing stop.
   */
  update: async (stop: UpdateStopDto): Promise<void> => {
    // تحويل stopType من number إلى string للإرسال إلى الـ API
    const payload = {
      ...stop,
      stopType: stop.stopType === 2 ? 'Terminus' : 'Intermediate'
    };
    
    const response = await fetchWithAuth(`/api/Stop/${stop.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (response.status !== 204) {
      const errorBody = await response.text();
      throw new Error(`Failed to update stop ${stop.id}: ${response.statusText}. Details: ${errorBody}`);
    }
  },

  /**
   * Reorders stops for a line.
   */
  reorderStops: async (lineId: number, stops: Array<{id: number, sequenceOrder: number, stopType: number}>): Promise<void> => {
    // تحويل stopType من number إلى string للإرسال إلى الـ API
    const payload = {
      lineId,
      stops: stops.map(stop => ({
        id: stop.id,
        sequenceOrder: stop.sequenceOrder,
        stopType: stop.stopType === 2 ? 'Terminus' : 'Intermediate'
      }))
    };
    
    const response = await fetchWithAuth('/api/Stop/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (response.status !== 204) {
      const errorBody = await response.text();
      throw new Error(`Failed to reorder stops: ${response.statusText}. Details: ${errorBody}`);
    }
  },
};




