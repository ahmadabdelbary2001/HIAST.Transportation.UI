// src/services/apiHelper.ts
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorBody = await response.text();
      if (errorBody) {
        errorMessage = errorBody;
      }
    } catch {
      // Ignore if we can't parse error body
    }
    throw new Error(errorMessage);
  }
  return response;
};

export { handleResponse };