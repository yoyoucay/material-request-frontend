export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "Material Request System";

export const TOKEN_KEY = "mrs_token";

export const REQUEST_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
} as const;

export const STATUS_LABELS: Record<number, string> = {
  1: "Active",
  0: "Inactive",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REQUESTS: "/requests",
  REQUESTS_CREATE: "/requests/create",
  REQUESTS_EDIT: (id: string) => `/requests/${id}/edit`,
};

export const PAGE_SIZE = 10;