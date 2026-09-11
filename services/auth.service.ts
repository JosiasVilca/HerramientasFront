import { fetchFromAPI } from "@/lib/api-client";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";

export const authService = {
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    return await fetchFromAPI<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    return await fetchFromAPI<AuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  logout: async (token?: string): Promise<void> => {
    try {
      await fetchFromAPI<void>("/api/v1/auth/logout", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (error) {
      console.warn("Session cleaned locally.", error);
    }
  },

  sendForgotPasswordEmail: async (email: string): Promise<void> => {
    await fetchFromAPI<void>("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};
