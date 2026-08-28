export type UserRole = "CLIENTE" | "REPARTIDOR" | "ADMIN";

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}
