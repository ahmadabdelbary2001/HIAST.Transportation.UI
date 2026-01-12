// src/services/apiHelper.ts
export class ApiValidationError extends Error {
  errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>) {
    super(message);
    this.name = 'ApiValidationError';
    this.errors = errors;
  }
}

const handleResponse = async (response: Response) => {
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

export { handleResponse };