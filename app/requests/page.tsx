"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { MaterialRequest } from "@/lib/types";
import { getRequestsApi, deleteRequestApi } from "@/services/api/requests";
import { extractApiError } from "@/services/api/client";
import { useToast } from "@/context/ToastContext";
import { ROUTES } from "@/lib/constants";
import RequestTable from "@/components/requests/RequestTable";
import RequestCard from "@/components/requests/RequestCard";
import DeleteConfirmModal from "@/components/requests/DeleteConfirmModal";
import Button from "@/components/common/Button";

export default function RequestsPage() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [filtered, setFiltered] = useState<MaterialRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MaterialRequest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getRequestsApi();
      setRequests(data);
      setFiltered(data);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(requests);
    } else {
      const term = searchTerm.toLowerCase();
      setFiltered(
        requests.filter(
          (r) =>
            r.sReqNumber.toLowerCase().includes(term) ||
            r.sDept.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, requests]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteRequestApi(deleteTarget.iRequestID);
      setRequests((prev) =>
        prev.filter((r) => r.iRequestID !== deleteTarget.iRequestID)
      );
      showToast("success", `Request ${deleteTarget.sReqNumber} deleted`);
      setDeleteTarget(null);
    } catch (err) {
      showToast("error", extractApiError(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Material Requests
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isLoading
              ? "Loading..."
              : `${filtered.length} request${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href={ROUTES.REQUESTS_CREATE}>
          <Button
            variant="primary"
            leftIcon={
              <svg
                className="w-4 h-4"
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
            New Request
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by number or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
          <p className="text-sm text-red-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchRequests}>
            Retry
          </Button>
        </div>
      )}

      <div className="hidden sm:block">
        <RequestTable
          requests={filtered}
          onDelete={setDeleteTarget}
          isLoading={isLoading}
        />
      </div>

      <div className="sm:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-slate-100 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 py-12 text-center">
            <p className="text-sm text-slate-500">No requests found</p>
          </div>
        ) : (
          filtered.map((request) => (
            <RequestCard
              key={request.iRequestID}
              request={request}
              onDelete={setDeleteTarget}
            />
          ))
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        description={`Are you sure you want to delete request ${deleteTarget?.sReqNumber}? This action cannot be undone.`}
      />
    </div>
  );
}