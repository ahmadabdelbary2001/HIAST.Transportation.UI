// src/services/employeeApiService.ts
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '@/types/index';
import { handleResponse } from './apiHelper';

export const employeeApiService = {
  getAll: async (): Promise<Employee[]> => {
    const response = await handleResponse(await fetch('/api/Employee'));
    return response.json();
  },

  getById: async (id: number): Promise<Employee> => {
    const response = await handleResponse(await fetch(`/api/Employee/${id}`));
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await handleResponse(await fetch(`/api/Employee/${id}`, {
      method: 'DELETE',
    }));
  },

  create: async (employee: CreateEmployeeDto): Promise<number> => {
    const response = await handleResponse(await fetch('/api/Employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    }));
    
    if (response.status !== 201) {
      const errorBody = await response.text();
      throw new Error(`Failed to create employee: ${response.statusText}. Details: ${errorBody}`);
    }
    return response.json();
  },

  update: async (employee: UpdateEmployeeDto & { id: number }): Promise<void> => {
    const response = await fetch(`/api/Employee/${employee.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    
    if (response.status !== 204) {
      const errorBody = await response.text();
      throw new Error(`Failed to update employee ${employee.id}: ${response.statusText}. Details: ${errorBody}`);
    }
  },
};