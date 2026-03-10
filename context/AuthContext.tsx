"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { User, LoginPayload, RegisterPayload } from "@/lib/types";
import { getToken, setToken, removeToken } from "@/services/storage";
import { loginApi, registerApi } from "@/services/api/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getInitialUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("mrs_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

function getInitialToken(): string | null {
  if (typeof window === "undefined") return null;
  return getToken();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [token, setTokenState] = useState<string | null>(getInitialToken);

  const login = useCallback(async (payload: LoginPayload) => {
    const data = await loginApi(payload);
    setToken(data.token);
    localStorage.setItem("mrs_user", JSON.stringify(data.user));
    setTokenState(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const data = await registerApi(payload);
    setToken(data.token);
    localStorage.setItem("mrs_user", JSON.stringify(data.user));
    setTokenState(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    localStorage.removeItem("mrs_user");
    setTokenState(null);
    setUser(null);
    window.location.href = "/auth/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading: false,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}