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
  // Return raw response for compatibility with services using fetchWithAuth directly
  return response;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });
  return handleResponse(response);
};

// Helper to safely parse JSON or text
const parseResponse = async (response: Response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return response.text();
};

export const apiHelper = {
  get: <T>(url: string): Promise<T> => fetchWithAuth(url, { method: 'GET' }).then(parseResponse) as Promise<T>,
  post: <T>(url: string, body: unknown): Promise<T> => fetchWithAuth(url, { method: 'POST', body: JSON.stringify(body) }).then(parseResponse) as Promise<T>,
  put: <T>(url: string, body: unknown): Promise<T> => fetchWithAuth(url, { method: 'PUT', body: JSON.stringify(body) }).then(parseResponse) as Promise<T>,
  delete: <T>(url: string): Promise<T> => fetchWithAuth(url, { method: 'DELETE' }).then(parseResponse) as Promise<T>,
};

export { handleResponse, fetchWithAuth };