import { API_ENDPOINTS } from '@/lib/constants';
import { fetchWithAuth } from './apiHelper';

export interface LoginRequest {
  emailOrUserName: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  employeeNumber: string;
  phoneNumber?: string;
  department?: number;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  id: string;
  userName: string;
  email: string;
  token: string;
  employeeNumber?: string;
  roles: string[];
}

export const authApiService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await fetchWithAuth(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  register: async (userData: RegisterRequest) => {
    const response = await fetchWithAuth(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  }
};


