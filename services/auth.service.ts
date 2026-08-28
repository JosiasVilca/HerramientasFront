import { fetchFromAPI } from "@/lib/api-client";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";

const MOCK_USERS: Record<string, { id: number; fullName: string; role: "CLIENTE" | "REPARTIDOR" | "ADMIN" }> = {
  "cliente@swiftlogix.com": { id: 1, fullName: "Juan Pérez", role: "CLIENTE" },
  "repartidor@swiftlogix.com": { id: 2, fullName: "Pedro Gómez", role: "REPARTIDOR" },
  "admin@swiftlogix.com": { id: 3, fullName: "Administrador SwiftLogix", role: "ADMIN" },
};

export const authService = {
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    try {
      return await fetchFromAPI<AuthResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.warn("Backend Auth API offline. Using mock authorization.", error);
      
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const emailLower = request.email.trim().toLowerCase();
      const mockUser = MOCK_USERS[emailLower];
      
      if (mockUser) {
        return {
          token: `mock-jwt-token-${mockUser.role.toLowerCase()}`,
          refreshToken: `mock-refresh-token-${mockUser.role.toLowerCase()}`,
          user: {
            id: mockUser.id,
            fullName: mockUser.fullName,
            email: emailLower,
            role: mockUser.role,
          },
        };
      }
      
      return {
        token: "mock-jwt-token-guest",
        refreshToken: "mock-refresh-token-guest",
        user: {
          id: 999,
          fullName: "Usuario de Prueba",
          email: request.email,
          role: "CLIENTE",
        },
      };
    }
  },

  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    try {
      return await fetchFromAPI<AuthResponse>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.warn("Backend Auth API offline. Using mock registration.", error);
      
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      return {
        token: "mock-jwt-token-new",
        refreshToken: "mock-refresh-token-new",
        user: {
          id: Math.floor(Math.random() * 1000) + 10,
          fullName: request.fullName,
          email: request.email,
          role: request.role,
          phone: request.phone,
        },
      };
    }
  },

  logout: async (token?: string): Promise<void> => {
    try {
      await fetchFromAPI<void>("/api/v1/auth/logout", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (error) {
      console.warn("Backend Auth API offline. Session cleaned locally.", error);
    }
  },

  sendForgotPasswordEmail: async (email: string): Promise<void> => {
    try {
      await fetchFromAPI<void>("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.warn("Backend Auth API offline. Email mock sent.", error);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  },
};
