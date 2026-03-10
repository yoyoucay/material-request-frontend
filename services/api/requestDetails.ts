import apiClient from "./client";
import { RequestDetail } from "@/lib/types";

export async function getRequestDetailsApi(requestId: string): Promise<RequestDetail[]> {
  const response = await apiClient.get<{ data: RequestDetail[] }>(
    `/requests/${requestId}/details`
  );
  return response.data.data;
}

export async function addRequestDetailApi(
  requestId: string,
  payload: { sMaterialCode: string; decQty: number; sDesc?: string }
): Promise<RequestDetail> {
  const response = await apiClient.post<{ data: RequestDetail }>(
    `/requests/${requestId}/details`,
    payload
  );
  return response.data.data;
}

export async function deleteRequestDetailApi(
  requestId: string,
  detailId: number
): Promise<void> {
  await apiClient.delete(`/requests/${requestId}/details/${detailId}`);
}