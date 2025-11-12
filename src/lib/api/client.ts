const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>; //test
}

export class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  // Handle both 200 (OK) and 201 (Created) as success
  const isSuccess = response.ok || response.status === 201;
  
  // Check content type
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  
  // Handle empty responses
  const text = await response.text();
  
  if (!text && isSuccess) {
    // Empty successful response
    return {} as T;
  }
  
  if (!isJson && text) {
    // Non-JSON response - provide more context
    const statusText = response.statusText || "Unknown error";
    throw new ApiClientError(
      `Invalid response format: Expected JSON but received ${contentType || "unknown"}. Status: ${response.status} ${statusText}. Response: ${text.substring(0, 200)}`,
      response.status
    );
  }
  
  let data: T;
  try {
    data = text ? JSON.parse(text) : ({} as T);
  } catch (parseError) {
    // JSON parse error
    throw new ApiClientError(
      `Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : "Unknown error"}. Response: ${text.substring(0, 200)}`,
      response.status
    );
  }

  if (!isSuccess) {
    const errorData = data as { message?: string; errors?: Record<string, string[]> };
    throw new ApiClientError(
      errorData.message || `Request failed with status ${response.status}`,
      response.status,
      errorData.errors
    );
  }

  return data;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  // Check if API URL is configured
  if (!API_URL) {
    throw new ApiClientError(
      "API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.",
      0
    );
  }

  // Get token from localStorage if available
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    // Network or other fetch errors
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new ApiClientError(
      `Network error: ${errorMessage}. Please check your connection and API URL: ${url}`,
      0
    );
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
