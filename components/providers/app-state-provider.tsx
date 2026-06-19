"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getSeedThreads } from "@/lib/data";
import { MatchRun, MessageThread, ToastMessage } from "@/lib/types";

type AppStateContextValue = {
  favoriteIds: string[];
  lastMatchRun: MatchRun | null;
  threads: MessageThread[];
  toasts: ToastMessage[];
  theme: "dark" | "light";
  toggleTheme: () => void;
  toggleFavorite: (creatorId: string) => void;
  setLastMatchRun: (matchRun: MatchRun) => void;
  addOutreachThread: (thread: MessageThread) => void;
  showToast: (label: string) => void;
  dismissToast: (toastId: string) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [lastMatchRun, setLastMatchRunState] = useState<MatchRun | null>(null);
  const [threads, setThreads] = useState<MessageThread[]>(() => getSeedThreads());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("workspace-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      favoriteIds,
      lastMatchRun,
      threads,
      toasts,
      theme,
      toggleTheme: () => {
        setTheme((current) => {
          const next = current === "dark" ? "light" : "dark";
          localStorage.setItem("workspace-theme", next);
          return next;
        });
      },
      toggleFavorite: (creatorId) => {
        setFavoriteIds((current) =>
          current.includes(creatorId)
            ? current.filter((id) => id !== creatorId)
            : [...current, creatorId]
        );
      },
      setLastMatchRun: (matchRun) => {
        setLastMatchRunState(matchRun);
      },
      addOutreachThread: (thread) => {
        setThreads((current) => [thread, ...current]);
      },
      showToast: (label) => {
        const id = crypto.randomUUID();

        setToasts((current) => [...current, { id, label }]);

        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 2800);
      },
      dismissToast: (toastId) => {
        setToasts((current) => current.filter((toast) => toast.id !== toastId));
      },
    }),
    [favoriteIds, lastMatchRun, threads, toasts, theme]
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}
