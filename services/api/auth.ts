import apiClient from "./client";
import { LoginPayload, RegisterPayload, ChangePasswordPayload, User } from "@/lib/types";

interface AuthResponse {
  token: string;
  user: User;
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<{ data: AuthResponse }>(
    "/auth/login",
    payload
  );
  return response.data.data;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiClient.post<{ data: AuthResponse }>(
    "/auth/register",
    payload
  );
  return response.data.data;
}

export async function changePasswordApi(payload: ChangePasswordPayload): Promise<void> {
  await apiClient.post("/auth/change-password", payload);
}