import Link from "next/link";
import RequestForm from "@/components/requests/RequestForm";

export default function CreateRequestPage() {
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
          <span className="text-slate-900 font-medium">New Request</span>
        </nav>
        <h1 className="text-xl font-bold text-slate-900">
          Create Material Request
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Fill in the details to submit a new material request
        </p>
      </div>
      <RequestForm mode="create" />
    </div>
  );
}