"use client";

import { X } from "@phosphor-icons/react";

import { useAppState } from "@/components/providers/app-state-provider";

export function ToastRegion() {
  const { dismissToast, toasts } = useAppState();

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto rounded-3xl border border-[var(--border)] bg-white/95 px-4 py-3 shadow-[0_20px_50px_rgba(100,62,160,0.18)] backdrop-blur"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-[var(--ink)]">{toast.label}</p>
            <button
              type="button"
              className="rounded-full p-1 text-[var(--muted)] transition hover:bg-[var(--panel-soft)] hover:text-[var(--ink)]"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
