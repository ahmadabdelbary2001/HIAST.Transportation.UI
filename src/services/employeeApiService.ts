import type { EmployeeDto, EmployeeListDto, CreateEmployeeDto, UpdateEmployeeDto } from '@/types';
import { fetchWithAuth } from './apiHelper';

export const employeeApiService = {
  getAll: async (): Promise<EmployeeListDto[]> => {
    const response = await fetchWithAuth('/api/Employee');
    return response.json();
  },

  getById: async (id: number | string): Promise<EmployeeDto> => {
    const url = typeof id === 'string' ? `/api/Employee/detail?userId=${id}` : `/api/Employee/${id}`;
    const response = await fetchWithAuth(url);
    return response.json();
  },

  delete: async (id: number | string): Promise<void> => {
    const url = typeof id === 'string' ? `/api/Employee/detail?userId=${id}` : `/api/Employee/${id}`;
    await fetchWithAuth(url, {
      method: 'DELETE',
    });
  },

  create: async (employee: CreateEmployeeDto): Promise<number> => {
    const response = await fetchWithAuth('/api/Employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    
    if (response.status !== 201) {
      const errorBody = await response.text();
      throw new Error(`Failed to create employee: ${response.statusText}. Details: ${errorBody}`);
    }
    return response.json();
  },

  update: async (employee: UpdateEmployeeDto): Promise<void> => {
    const response = await fetchWithAuth(`/api/Employee/${employee.id}`, {
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




