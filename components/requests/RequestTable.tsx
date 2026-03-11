import React from "react";
import Link from "next/link";
import { MaterialRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { STATUS_LABELS, ROUTES } from "@/lib/constants";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";

interface RequestTableProps {
    requests: MaterialRequest[];
    onDelete: (request: MaterialRequest) => void;
    isLoading?: boolean;
}

function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-100">
                    {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                            <div className="h-4 rounded bg-slate-100 animate-pulse w-3/4" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

export default function RequestTable({
    requests,
    onDelete,
    isLoading,
}: RequestTableProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                                Request No.
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                                Department
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                                Status
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide hidden md:table-cell">
                                Created
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide hidden lg:table-cell">
                                Created By
                            </th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <TableSkeleton />
                        ) : requests.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    <EmptyState
                                        title="No requests found"
                                        description="Create your first material request to get started."
                                    />
                                </td>
                            </tr>
                        ) : (
                            requests.map((request) => (
                                <tr
                                    key={request.iRequestID}
                                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-slate-900">
                                            {request.sReqNumber}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{request.sDept}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={request.iStatus === 1 ? "success" : "neutral"}>
                                            {STATUS_LABELS[request.iStatus] || "Unknown"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                                        {formatDate(request.dtCreated)}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
                                        {request.iCreateBy || "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Link
                                                href={ROUTES.REQUESTS_EDIT(
                                                    request.iRequestID.toString()
                                                )}
                                            >
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:bg-red-50"
                                                onClick={() => onDelete(request)}
                                                aria-label={`Delete ${request.sReqNumber}`}
                                            >
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
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}