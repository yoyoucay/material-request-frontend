import apiClient from "./client";
import { LoginPayload, RegisterPayload, ChangePasswordPayload, User } from "@/lib/types";

interface AuthResponse {
  accessToken: string;
  user: User;
}

export async function loginApi(
  payload: LoginPayload
): Promise<{ token: string; user: User }> {
  const response = await apiClient.post<AuthResponse>("/auth/login", payload);
  return {
    token: response.data.accessToken,
    user: response.data.user,
  };
}

export async function registerApi(
  payload: RegisterPayload
): Promise<{ token: string; user: User }> {
  const response = await apiClient.post<AuthResponse>("/auth/register", payload);
  return {
    token: response.data.accessToken,
    user: response.data.user,
  };
}

export async function changePasswordApi(
  payload: ChangePasswordPayload
): Promise<void> {
  await apiClient.post("/auth/change-password", payload);
}