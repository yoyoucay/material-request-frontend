export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullname: string;
  badgeId: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Material {
  sMaterialCode: string;
  sMaterialName: string;
  decUnitPrice: number;
}

export interface RequestDetail {
  iDetailID?: number;
  sMaterialCode: string;
  sMaterialName?: string;
  decQty: number;
  decUnitPrice?: number;
  sDesc?: string;
  iStatus?: number;
}

export interface MaterialRequest {
  id: string;
  sReqNumber: string;
  sDept: string;
  iStatus: number;
  createdAt: string;
  createdBy?: string;
  details?: RequestDetail[];
}

export interface CreateRequestPayload {
  sReqNumber: string;
  sDept: string;
  iStatus?: number;
  details: {
    sMaterialCode: string;
    decQty: number;
    sDesc?: string;
  }[];
}

export interface UpdateRequestPayload {
  sReqNumber?: string;
  sDept?: string;
  iStatus?: number;
  details?: {
    sMaterialCode: string;
    decQty: number;
    sDesc?: string;
  }[];
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}