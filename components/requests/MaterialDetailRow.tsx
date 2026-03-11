"use client";

import React, { useEffect } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Material } from "@/lib/types";
import { RequestFormData } from "@/lib/validation";
import { formatCurrency } from "@/lib/utils";

interface MaterialDetailRowProps {
  index: number;
  materials: Material[];
  register: UseFormRegister<RequestFormData>;
  errors: FieldErrors<RequestFormData>;
  setValue: UseFormSetValue<RequestFormData>;
  watch: UseFormWatch<RequestFormData>;
  onRemove: () => void;
  canRemove: boolean;
}

export default function MaterialDetailRow({
  index,
  materials,
  register,
  errors,
  setValue,
  watch,
  onRemove,
  canRemove,
}: MaterialDetailRowProps) {
  const selectedCode = watch(`details.${index}.sMaterialCode`);
  const detailErrors = errors.details?.[index];
  const selectedMaterial = materials.find(
    (m) => m.sMaterialCode === selectedCode
  );

  useEffect(() => {
    if (selectedMaterial) {
      setValue(`details.${index}.sMaterialName`, selectedMaterial.sMaterialName);
      setValue(
        `details.${index}.decUnitPrice`,
        parseFloat(selectedMaterial.decUnitPrice)
      );
    }
  }, [selectedCode, selectedMaterial, setValue, index]);

  return (
    <div className="relative bg-slate-50 rounded-xl border border-slate-200 p-4">
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Remove row"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pr-8">
        <div className="lg:col-span-1">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Material <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              detailErrors?.sMaterialCode
                ? "border-red-400 bg-red-50"
                : "border-slate-300"
            }`}
            {...register(`details.${index}.sMaterialCode`)}
          >
            <option value="">Select material...</option>
            {materials.map((m) => (
              <option key={m.sMaterialCode} value={m.sMaterialCode}>
                {m.sMaterialCode} — {m.sMaterialName}
              </option>
            ))}
          </select>
          {detailErrors?.sMaterialCode && (
            <p className="text-xs text-red-500 mt-1">
              {detailErrors.sMaterialCode.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Material Name
          </label>
          <input
            type="text"
            readOnly
            value={selectedMaterial?.sMaterialName || ""}
            placeholder="Auto-filled"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 bg-slate-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              detailErrors?.decQty
                ? "border-red-400 bg-red-50"
                : "border-slate-300 bg-white"
            }`}
            {...register(`details.${index}.decQty`, { valueAsNumber: true })}
          />
          {detailErrors?.decQty && (
            <p className="text-xs text-red-500 mt-1">
              {detailErrors.decQty.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Unit Price
          </label>
          <input
            type="text"
            readOnly
            value={
              selectedMaterial
                ? formatCurrency(parseFloat(selectedMaterial.decUnitPrice))
                : ""
            }
            placeholder="Auto-filled"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 bg-slate-100 cursor-not-allowed"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-4">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            rows={2}
            placeholder="Optional notes about this material..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            {...register(`details.${index}.sDesc`)}
          />
        </div>
      </div>
    </div>
  );
}