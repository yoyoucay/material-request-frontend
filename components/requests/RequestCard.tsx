import React from "react";
import Link from "next/link";
import { MaterialRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { STATUS_LABELS, ROUTES } from "@/lib/constants";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";

interface RequestCardProps {
  request: MaterialRequest;
  onDelete: (request: MaterialRequest) => void;
}

export default function RequestCard({ request, onDelete }: RequestCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {request.sReqNumber}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{request.sDept}</p>
        </div>
        <Badge variant={request.iStatus === 1 ? "success" : "neutral"}>
          {STATUS_LABELS[request.iStatus] || "Unknown"}
        </Badge>
      </div>

      <div className="text-xs text-slate-500 flex items-center gap-1">
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {formatDate(request.dtCreated)}
      </div>

      <div className="flex gap-2 pt-1 border-t border-slate-100">
        <Link
          href={ROUTES.REQUESTS_EDIT(request.iRequestID.toString())}
          className="flex-1"
        >
          <Button variant="outline" size="sm" className="w-full">
            Edit
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-50"
          onClick={() => onDelete(request)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}