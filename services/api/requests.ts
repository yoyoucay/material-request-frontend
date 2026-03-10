import apiClient from "./client";
import { MaterialRequest, CreateRequestPayload, UpdateRequestPayload } from "@/lib/types";

export async function getRequestsApi(): Promise<MaterialRequest[]> {
  const response = await apiClient.get<{ data: { requests: MaterialRequest[] } }>(
    "/requests"
  );
  return response.data.data.requests;
}

export async function getRequestByIdApi(id: string): Promise<MaterialRequest> {
  const response = await apiClient.get<{ data: { request: MaterialRequest } }>(
    `/requests/${id}`
  );
  return response.data.data.request;
}

export async function createRequestApi(payload: CreateRequestPayload): Promise<MaterialRequest> {
  const response = await apiClient.post<{ data: MaterialRequest }>(
    "/requests",
    payload
  );
  return response.data.data;
}

export async function updateRequestApi(
  id: string,
  payload: UpdateRequestPayload
): Promise<MaterialRequest> {
  const response = await apiClient.patch<{ data: MaterialRequest }>(
    `/requests/${id}`,
    payload
  );
  return response.data.data;
}

export async function deleteRequestApi(id: string): Promise<void> {
  await apiClient.delete(`/requests/${id}`);
}