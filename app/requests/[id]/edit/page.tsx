"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MaterialRequest } from "@/lib/types";
import { getRequestByIdApi } from "@/services/api/requests";
import { extractApiError } from "@/services/api/client";
import RequestForm from "@/components/requests/RequestForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Button from "@/components/common/Button";

export default function EditRequestPage() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<MaterialRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getRequestByIdApi(Number(id));
        setRequest(data);
      } catch (err) {
        setError(extractApiError(err));
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-center">
          <p className="text-sm text-red-700 mb-4">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Link
            href="/requests"
            className="hover:text-slate-700 transition-colors"
          >
            Requests
          </Link>
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-slate-900 font-medium">Edit Request</span>
        </nav>
        <h1 className="text-xl font-bold text-slate-900">Edit Request</h1>
        {request && (
          <p className="text-sm text-slate-500 mt-0.5">
            Editing{" "}
            <span className="font-medium text-slate-700">
              {request.sReqNumber}
            </span>
          </p>
        )}
      </div>
      {request && <RequestForm mode="edit" initialData={request} />}
    </div>
  );
}