const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMsg = `Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMsg = errorData.message;
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }

  // Handle empty responses or HTTP 204
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
