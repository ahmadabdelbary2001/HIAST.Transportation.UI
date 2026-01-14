// src/services/apiHelper.ts
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";

export class ApiValidationError extends Error {
  errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>) {
    super(message);
    this.name = 'ApiValidationError';
    this.errors = errors;
  }
}

const getAuthToken = () => {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
};

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
    window.location.href = '/login'; // Force redirect to login on 401
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    let errorMessage = response.statusText;
    let validationErrors: Record<string, string[]> | null = null;

    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorBody = await response.json();
        // Check for standard ASP.NET Core validation format or custom format
        if (errorBody.errors) {
            validationErrors = errorBody.errors;
            errorMessage = errorBody.title || "Validation Failed";
        } else if (errorBody.message) {
             errorMessage = errorBody.message;
        } else {
             errorMessage = JSON.stringify(errorBody);
        }
      } else {
        const textBody = await response.text();
        if (textBody) {
             errorMessage = textBody;
        }
      }
    } catch {
      // Ignore if parsing fails
    }

    if (validationErrors) {
        throw new ApiValidationError(errorMessage, validationErrors);
    }

    throw new Error(errorMessage);
  }
  return response;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });
  return handleResponse(response);
};

export { handleResponse, fetchWithAuth };