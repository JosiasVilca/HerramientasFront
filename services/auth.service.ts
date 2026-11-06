import { fetchFromAPI, getApiUrl, getAuthHeaders } from "@/lib/api-client";
import { LoginRequest, RegisterRequest, AuthResponse, User } from "@/types/auth";

export const authService = {
  login: (request: LoginRequest) =>
    fetchFromAPI<AuthResponse>("/api/v1/auth/login", { method: "POST", body: JSON.stringify(request) }),

  register: (request: RegisterRequest) =>
    fetchFromAPI<AuthResponse>("/api/v1/auth/register", { method: "POST", body: JSON.stringify(request) }),

  loginWithGoogle: (credential: string) =>
    fetchFromAPI<AuthResponse>("/api/v1/auth/google", { method: "POST", body: JSON.stringify({ credential }) }),

  loginWithFacebook: (accessToken: string) =>
    fetchFromAPI<AuthResponse>("/api/v1/auth/facebook", { method: "POST", body: JSON.stringify({ accessToken }) }),

  getCurrentUser: (token: string) =>
    fetchFromAPI<User>("/api/v1/auth/me", { headers: { Authorization: `Bearer ${token}` } }),

  logout: (token?: string) =>
    fetchFromAPI<void>("/api/v1/auth/logout", { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {} }),

  sendForgotPasswordEmail: (email: string) =>
    fetchFromAPI<void>("/api/v1/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),

  resetPassword: (token: string, newPassword: string) =>
    fetchFromAPI<{ message: string }>("/api/v1/auth/reset-password", { method: "POST", body: JSON.stringify({ token, newPassword }) }),

  updateProfile: (data: { fullName?: string; phone?: string; avatarUrl?: string }) =>
    fetchFromAPI<User>("/api/v1/auth/profile", { method: "PUT", body: JSON.stringify(data) }),

  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(getApiUrl("/api/v1/auth/profile/avatar"), {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error("No se pudo subir la imagen de perfil.");
    return response.json() as Promise<User>;
  },
};