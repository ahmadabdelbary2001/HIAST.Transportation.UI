import { apiHelper } from './apiHelper';
import { API_ENDPOINTS } from '@/lib/constants';

export interface DashboardStats {
  activeBuses: number;
  totalEmployees: number;
  totalLines: number;
  totalSubscriptions: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    return apiHelper.get<DashboardStats>(API_ENDPOINTS.DASHBOARD);
  },
};
