"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { changePasswordSchema, ChangePasswordFormData } from "@/lib/validation";
import { changePasswordApi } from "@/services/api/auth";
import { extractApiError } from "@/services/api/client";
import { useToast } from "@/context/ToastContext";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface ToggleButtonProps {
  show: boolean;
  onToggle: () => void;
}

function ToggleButton({ show, onToggle }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-slate-400 hover:text-slate-600 transition-colors"
    >
      {show ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      )}
    </button>
  );
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [apiError, setApiError] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setApiError("");
      await changePasswordApi(data);
      showToast("success", "Password changed successfully");
      reset();
      router.push("/requests");
    } catch (err) {
      setApiError(extractApiError(err));
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-lg mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">
              Change Password
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Update your account password
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {apiError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              )}

              <Input
                label="Current password"
                type={showOld ? "text" : "password"}
                required
                error={errors.oldPassword?.message}
                rightElement={
                  <ToggleButton
                    show={showOld}
                    onToggle={() => setShowOld((v) => !v)}
                  />
                }
                {...register("oldPassword")}
              />

              <Input
                label="New password"
                type={showNew ? "text" : "password"}
                required
                error={errors.newPassword?.message}
                rightElement={
                  <ToggleButton
                    show={showNew}
                    onToggle={() => setShowNew((v) => !v)}
                  />
                }
                {...register("newPassword")}
              />

              <Input
                label="Confirm new password"
                type={showNew ? "text" : "password"}
                required
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Update password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}