import { fetchFromAPI } from "@/lib/api-client";
import { LoginRequest, RegisterRequest, AuthResponse, User } from "@/types/auth";

export const authService = {
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    return await fetchFromAPI<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    return await fetchFromAPI<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  getCurrentUser: async (token: string): Promise<User> => {
    return await fetchFromAPI<User>("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  logout: async (token?: string): Promise<void> => {
    try {
      await fetchFromAPI<void>("/api/auth/logout", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (_) {
      // Clean local session even if server request errors
    }
  },

  sendForgotPasswordEmail: async (email: string): Promise<void> => {
    await fetchFromAPI<void>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};