import { fetchFromAPI } from "@/lib/api-client";
import { LoginRequest, RegisterRequest, AuthResponse, User } from "@/types/auth";

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

  loginWithGoogle: async (credential: string): Promise<AuthResponse> => {
    return await fetchFromAPI<AuthResponse>("/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    });
  },

  getCurrentUser: async (token: string): Promise<User> => {
    return await fetchFromAPI<User>("/api/v1/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  logout: async (token?: string): Promise<void> => {
    try {
      await fetchFromAPI<void>("/api/v1/auth/logout", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (_) {
      // Clean local session even if server request errors
    }
  },

  sendForgotPasswordEmail: async (email: string): Promise<void> => {
    await fetchFromAPI<void>("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    return await fetchFromAPI<{ message: string }>("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  },

  updateProfile: async (data: { fullName?: string; phone?: string; avatarUrl?: string }): Promise<User> => {
    return await fetchFromAPI<User>("/api/v1/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("file", file);

    const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";
    const baseUrlClean = envUrl.replace(/\/+$/, "");
    const targetUrl = baseUrlClean.endsWith("/api")
      ? `${baseUrlClean}/v1/auth/profile/avatar`
      : `${baseUrlClean}/api/v1/auth/profile/avatar`;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("auth_token") || localStorage.getItem("token")
        : null;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errorMsg = "Error al subir la imagen";
      try {
        const errData = await response.json();
        if (errData && errData.message) errorMsg = errData.message;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    return (await response.json()) as User;
  },
};