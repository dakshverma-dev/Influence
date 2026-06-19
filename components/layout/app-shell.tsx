"use client";

import { PropsWithChildren } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ToastRegion } from "@/components/ui/toast-region";
import { useAppState } from "@/components/providers/app-state-provider";

export function AppShell({ children }: PropsWithChildren) {
  const { theme } = useAppState();

  return (
    <div className={`min-h-[100dvh] bg-[var(--canvas)] transition-colors duration-300 ${theme === "light" ? "theme-light" : ""}`}>
      <div className="mx-auto flex min-h-[100dvh] max-w-[1600px]">
        <Sidebar />
        <div className="flex min-h-[100dvh] flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            <MobileNav />
            {children}
          </main>
        </div>
      </div>
      <ToastRegion />
    </div>
  );
}
