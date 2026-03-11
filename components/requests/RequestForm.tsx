"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  createRequestSchema,
  editRequestSchema,
  CreateRequestFormData,
  EditRequestFormData,
} from "@/lib/validation";
import { MaterialRequest, Material } from "@/lib/types";
import { updateRequestApi, createRequestApi } from "@/services/api/requests";
import { getMaterialsApi } from "@/services/api/materials";
import { extractApiError } from "@/services/api/client";
import { generateRequestNumber, formatDate } from "@/lib/utils";
import { REQUEST_STATUS } from "@/lib/constants";
import { useToast } from "@/context/ToastContext";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import MaterialDetailRow from "./MaterialDetailRow";

interface RequestFormProps {
  mode: "create" | "edit";
  initialData?: MaterialRequest;
}

const statusOptions = [
  { value: REQUEST_STATUS.ACTIVE, label: "Active" },
  { value: REQUEST_STATUS.INACTIVE, label: "Inactive" },
];

const emptyDetail = {
  sMaterialCode: "",
  sMaterialName: "",
  decQty: 0,
  decUnitPrice: 0,
  sDesc: "",
};

export default function RequestForm({ mode, initialData }: RequestFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const createForm = useForm<CreateRequestFormData>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      sReqNumber: generateRequestNumber(),
      sDept: "",
      iStatus: REQUEST_STATUS.ACTIVE,
      details: [emptyDetail],
    },
  });

  const editForm = useForm<EditRequestFormData>({
    resolver: zodResolver(editRequestSchema),
    defaultValues: {
      sReqNumber: "",
      sDept: "",
      iStatus: REQUEST_STATUS.ACTIVE,
    },
  });

  const activeForm = mode === "create" ? createForm : editForm;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = activeForm;

  const { fields, append, remove } = useFieldArray({
    control: createForm.control,
    name: "details",
  });

  useEffect(() => {
    if (mode === "create") {
      const fetchMaterials = async () => {
        setLoadingMaterials(true);
        try {
          const data = await getMaterialsApi();
          setMaterials(data);
        } catch {
          showToast("error", "Failed to load materials list");
        } finally {
          setLoadingMaterials(false);
        }
      };
      fetchMaterials();
    }
  }, [mode, showToast]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      editForm.reset({
        sReqNumber: initialData.sReqNumber,
        sDept: initialData.sDept,
        iStatus: initialData.iStatus,
      });
    }
  }, [mode, initialData, editForm]);

  const onCreateSubmit = async (data: CreateRequestFormData) => {
    try {
      setSubmitError("");
      await createRequestApi({
        sReqNumber: data.sReqNumber,
        sDept: data.sDept,
        requestDetails: data.details.map((d) => ({
          sMaterialCode: d.sMaterialCode,
          decQty: d.decQty,
          sDesc: d.sDesc || "",
        })),
      });
      showToast("success", "Request created successfully");
      router.push("/requests");
    } catch (err) {
      setSubmitError(extractApiError(err));
    }
  };

  const onEditSubmit = async (data: EditRequestFormData) => {
    try {
      setSubmitError("");
      if (!initialData) return;
      await updateRequestApi(initialData.iRequestID, {
        sDept: data.sDept,
        iStatus: data.iStatus,
      });
      showToast("success", "Request updated successfully");
      router.push("/requests");
    } catch (err) {
      setSubmitError(extractApiError(err));
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (
        !window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
        return;
      }
    }
    router.push("/requests");
  };

  return (
    <form
      onSubmit={
        mode === "create"
          ? createForm.handleSubmit(onCreateSubmit)
          : editForm.handleSubmit(onEditSubmit)
      }
      noValidate
      className="space-y-6"
    >
      {submitError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">
          Request Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Request Number"
            required
            disabled={mode === "edit"}
            className={mode === "edit" ? "bg-slate-100 cursor-not-allowed" : ""}
            error={errors.sReqNumber?.message}
            {...register("sReqNumber")}
          />
          <Input
            label="Department"
            placeholder="e.g. Engineering"
            required
            error={errors.sDept?.message}
            {...register("sDept")}
          />
          <Select
            label="Status"
            required
            options={statusOptions}
            error={errors.iStatus?.message}
            {...register("iStatus", { valueAsNumber: true })}
          />
        </div>

        {mode === "edit" && initialData && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Created At
              </label>
              <p className="text-sm text-slate-700">
                {formatDate(initialData.dtCreated)}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Last Updated
              </label>
              <p className="text-sm text-slate-700">
                {initialData.dtUpdated
                  ? formatDate(initialData.dtUpdated)
                  : "-"}
              </p>
            </div>
          </div>
        )}
      </div>

      {mode === "create" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Material Details
              </h2>
              {createForm.formState.errors.details?.root?.message && (
                <p className="text-xs text-red-500 mt-0.5">
                  {createForm.formState.errors.details.root.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loadingMaterials}
              onClick={() => append(emptyDetail)}
              leftIcon={
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
            >
              Add Material
            </Button>
          </div>

          {loadingMaterials ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <MaterialDetailRow
                  key={field.id}
                  index={index}
                  materials={materials}
                  register={createForm.register}
                  errors={createForm.formState.errors}
                  setValue={createForm.setValue}
                  watch={createForm.watch}
                  onRemove={() => remove(index)}
                  canRemove={fields.length > 1}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {mode === "edit" && initialData?.requestDetails && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">
            Material Details
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Material details are read-only in edit mode.
          </p>
          <div className="space-y-3">
            {initialData.requestDetails.map((detail) => (
              <div
                key={detail.iDetailID}
                className="bg-slate-50 rounded-xl border border-slate-200 p-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Material Code
                    </label>
                    <p className="text-sm text-slate-900 font-medium">
                      {detail.sMaterialCode}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Quantity
                    </label>
                    <p className="text-sm text-slate-900">
                      {parseFloat(detail.decQty as string).toLocaleString()}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Description
                    </label>
                    <p className="text-sm text-slate-600">
                      {detail.sDesc || "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pb-4">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
        >
          {mode === "create" ? "Create Request" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}