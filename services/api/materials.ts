import apiClient from "./client";
import { Material } from "@/lib/types";

export async function getMaterialsApi(): Promise<Material[]> {
  const response = await apiClient.get<Material[]>("/materials");
  return response.data;
}