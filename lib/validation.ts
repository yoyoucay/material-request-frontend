import { z } from "zod";

export const loginSchema = z.object({
  sEmail: z.string().email("Please enter a valid email address"),
  sPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    sEmail: z.string().email("Please enter a valid email address"),
    sFullname: z.string().min(2, "Full name must be at least 2 characters"),
    sBadgeID: z.string().min(1, "Badge ID is required"),
    sPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.sPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const materialDetailSchema = z.object({
  iDetailID: z.number().optional(),
  sMaterialCode: z.string().min(1, "Material is required"),
  sMaterialName: z.string().optional(),
  decQty: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ message: "Quantity must be a number" })
      .positive("Quantity must be greater than 0")
  ),
  decUnitPrice: z.number().optional(),
  sDesc: z.string().optional(),
});

export const requestFormSchema = z.object({
  sReqNumber: z.string().min(1, "Request number is required"),
  sDept: z.string().min(1, "Department is required"),
  iStatus: z.number(),
  details: z
    .array(materialDetailSchema)
    .min(1, "At least one material detail is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type RequestFormData = z.infer<typeof requestFormSchema>;
export type MaterialDetailFormData = z.infer<typeof materialDetailSchema>;