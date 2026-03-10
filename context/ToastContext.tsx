"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { ToastMessage } from "@/lib/types";

interface ToastContextValue {
  toasts: ToastMessage[];
  showToast: (type: ToastMessage["type"], message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastMessage["type"], message: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      const toast: ToastMessage = { id, type, message };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((curr) => curr.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}