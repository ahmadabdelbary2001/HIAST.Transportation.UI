// src/services/lineApiService.ts

import type { 
  Line, 
  LineListDto, 
  CreateLineDto, 
  UpdateLineDto 
} from '@/types/index';
import { handleResponse } from './apiHelper';

export const lineApiService = {
  /**
   * Fetches a list of all lines.
   * Consistent with: driverApiService.getAll
   */
  getAll: async (): Promise<LineListDto[]> => {
    const response = await handleResponse(await fetch('/api/Line'));
    return response.json();
  },

  /**
   * Fetches a single line by its ID.
   * Consistent with: driverApiService.getById
   */
  getById: async (id: number): Promise<Line> => {
    const response = await handleResponse(await fetch(`/api/Line/${id}`));
    return response.json();
  },

  /**
   * Deletes a line by its ID.
   * Consistent with: driverApiService.delete
   */
  delete: async (id: number): Promise<void> => {
    await handleResponse(await fetch(`/api/Line/${id}`, {
      method: 'DELETE',
    }));
  },

  /**
   * Creates a new line.
   * Consistent with: driverApiService.create
   */
  create: async (line: CreateLineDto): Promise<number> => {
    const response = await handleResponse(await fetch('/api/Line', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(line),
    }));
    
    // Explicit check for 201 Created status, matching the driver service
    if (response.status !== 201) {
      const errorBody = await response.text();
      throw new Error(`Failed to create line: ${response.statusText}. Details: ${errorBody}`);
    }
    return response.json();
  },

  /**
   * Updates an existing line.
   * Consistent with: driverApiService.update
   */
  update: async (line: UpdateLineDto): Promise<void> => {
    // Does not use handleResponse, matching the driver service's update method
    const response = await fetch(`/api/Line/${line.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(line),
    });
    
    // Explicit check for 204 No Content status, matching the driver service
    if (response.status !== 204) {
      const errorBody = await response.text();
      throw new Error(`Failed to update line ${line.id}: ${response.statusText}. Details: ${errorBody}`);
    }
  },
};
