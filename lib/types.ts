export interface User {
  iUserID: number;
  sFullname: string;
  sEmail: string;
  sBadgeID: string;
  iRole: number;
  iStatus: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  sEmail: string;
  sPassword: string;
}

export interface RegisterPayload {
  sEmail: string;
  sPassword: string;
  sFullname: string;
  sBadgeID: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Material {
  iMaterialID: number;
  sMaterialCode: string;
  sMaterialName: string;
  decUnitPrice: string;
  sDesc?: string;
  iStatus: number;
}

export interface RequestDetail {
  iDetailID?: number;
  iRequestID?: number;
  sMaterialCode: string;
  sMaterialName?: string;
  decQty: number | string;
  decUnitPrice?: string;
  sDesc?: string;
  iStatus?: number;
  dtCreated?: string;
}

export interface MaterialRequest {
  iRequestID: number;
  sReqNumber: string;
  sDept: string;
  iStatus: number;
  iCreateBy?: number;
  dtCreated: string;
  dtUpdated?: string;
  requestDetails?: RequestDetail[];
}

export interface CreateRequestPayload {
  sReqNumber: string;
  sDept: string;
  requestDetails: {
    sMaterialCode: string;
    decQty: number;
    sDesc?: string;
  }[];
}

export interface UpdateRequestPayload {
  sReqNumber?: string;
  sDept?: string;
  iStatus?: number;
  requestDetails?: {
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