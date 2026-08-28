"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginRequest, RegisterRequest } from "@/types/auth";
import { authService } from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = () => {
      try {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to restore auth session:", err);
      } finally {
        setLoading(false);
      }
    };
    
    restoreSession();
  }, []);

  const login = async (request: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authService.login(request);
      setToken(response.token);
      setUser(response.user);
      
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (request: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await authService.register(request);
      setToken(response.token);
      setUser(response.user);
      
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (token) {
        await authService.logout(token);
      }
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
