import apiClient from "./client";
import {
  MaterialRequest,
  CreateRequestPayload,
  UpdateRequestPayload,
} from "@/lib/types";

export async function getRequestsApi(): Promise<MaterialRequest[]> {
  const response = await apiClient.get<MaterialRequest[]>("/requests");
  return response.data;
}

export async function getRequestByIdApi(id: number): Promise<MaterialRequest> {
  const response = await apiClient.get<MaterialRequest>(`/requests/${id}`);
  return response.data;
}

export async function createRequestApi(
  payload: CreateRequestPayload
): Promise<MaterialRequest> {
  const response = await apiClient.post<MaterialRequest>("/requests", payload);
  return response.data;
}

export async function updateRequestApi(
  id: number,
  payload: UpdateRequestPayload
): Promise<MaterialRequest> {
  const response = await apiClient.put<MaterialRequest>(
    `/requests/${id}`,
    payload
  );
  return response.data;
}

export async function deleteRequestApi(id: number): Promise<void> {
  await apiClient.delete(`/requests/${id}`);
}