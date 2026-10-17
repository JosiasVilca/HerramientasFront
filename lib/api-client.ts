import { TrackingSummaryDTO } from "@/types/tracking";

export function getApiUrl(endpoint: string): string {
  const base = (process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api").replace(/\/+$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return base.endsWith("/api") && path.startsWith("/api/") ? `${base}${path.slice(4)}` : `${base}${path}`;
}

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
  return token ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {};
}

export async function fetchFromAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  Object.entries(getAuthHeaders()).forEach(([key, value]) => {
    if (!headers.has(key)) headers.set(key, value);
  });

  const response = await fetch(getApiUrl(endpoint), { ...options, headers });
  if (!response.ok) {
    let message = `Error ${response.status}: ${response.statusText}`;
    try {
      const body = await response.json() as { message?: string; error?: string };
      message = body.message || body.error || message;
    } catch {
      // Some proxy errors do not return JSON.
    }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function trackPackage(trackingCode: string): Promise<TrackingSummaryDTO> {
  return fetchFromAPI<TrackingSummaryDTO>(`/api/v1/packages/track/${encodeURIComponent(trackingCode.trim())}`);
}
