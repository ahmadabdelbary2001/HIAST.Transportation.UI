import type { SupervisorLineDto } from '@/types/index';
import { fetchWithAuth } from './apiHelper';

export const supervisorApiService = {
  /**
   * Fetches a report of all lines and their assigned supervisors.
   * Corresponds to: GET /api/Supervisor/LineAssignments
   */
  getLineAssignments: async (): Promise<SupervisorLineDto[]> => {
    const response = await fetchWithAuth('/api/Supervisor/LineAssignments');
    return response.json();
  },
};




