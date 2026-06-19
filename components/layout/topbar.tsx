"use client";

import { useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, Bell, Plus, CaretDown, Check, Sparkle, ChatCircleDots } from "@phosphor-icons/react";
import { useAppState } from "@/components/providers/app-state-provider";

export function Topbar() {
  const { showToast } = useAppState();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Ishika Sharma accepted your campaign invite", time: "2m ago", unread: true },
    { id: 2, text: "Neha Verma sent you a new message", time: "1h ago", unread: true },
    { id: 3, text: "AI Matchmaker run complete for 'GlowUp Skincare'", time: "3h ago", unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    showToast("All notifications marked as read");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--panel)] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center gap-4">
        {/* Global Search */}
        <div className="relative w-full max-w-md hidden sm:block">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
          <input
            type="text"
            placeholder="Search creators, campaigns, or messages..."
            className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--canvas)] pl-9 pr-4 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-[var(--border)] bg-[var(--panel)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted)] shadow-sm">
            ⌘K
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 relative">
        {/* New Campaign Button */}
        <Link 
          href="/matchmaker"
          className="hidden h-10 items-center gap-2 rounded-xl bg-[var(--ink)] px-4 text-xs font-bold uppercase tracking-wider text-[var(--background)] shadow-sm transition hover:bg-black/80 md:flex"
        >
          <Plus size={14} weight="bold" />
          New Campaign
        </Link>
        
        <div className="mx-1 h-6 w-px bg-[var(--border)] hidden md:block" />
        
        {/* Notifications Button */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowAccountDropdown(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[var(--muted)] transition hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
          >
            <Bell size={20} weight="fill" />
            {unreadCount > 0 && (
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[var(--panel)] animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-2 shadow-lg ring-1 ring-black/5 z-50">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
                <span className="text-xs font-bold text-[var(--ink)]">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-semibold text-[var(--accent)] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="mt-1 divide-y divide-[var(--border)] max-h-60 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`flex items-start gap-2.5 p-3 text-xs transition hover:bg-[var(--canvas)] ${notif.unread ? "bg-indigo-50/30" : ""}`}>
                    <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${notif.unread ? "bg-[var(--accent)]" : "bg-transparent"}`} />
                    <div className="flex-1">
                      <p className="font-medium text-[var(--ink)]">{notif.text}</p>
                      <p className="mt-1 text-[10px] text-[var(--muted)]">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Account Dropdown Block */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowAccountDropdown(!showAccountDropdown);
              setShowNotifications(false);
            }}
            className="flex h-10 items-center gap-2 rounded-xl border border-transparent px-2 transition hover:border-[var(--border)] hover:bg-[var(--canvas)]"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[var(--accent)] to-blue-400 shadow-sm" />
            <CaretDown size={14} weight="bold" className="text-[var(--muted)]" />
          </button>

          {/* Account Dropdown Menu */}
          {showAccountDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-1.5 shadow-lg ring-1 ring-black/5 z-50">
              <div className="border-b border-[var(--border)] px-3 py-2">
                <p className="text-xs font-bold text-[var(--ink)]">GlowUp Skincare</p>
                <p className="text-[10px] text-[var(--muted)]">brand@glowupskin.com</p>
              </div>
              <div className="mt-1 flex flex-col gap-0.5">
                <Link href="/settings" className="rounded-lg px-3 py-2 text-xs font-medium text-[var(--ink)] hover:bg-[var(--canvas)]">
                  Brand Profile
                </Link>
                <Link href="/payments" className="rounded-lg px-3 py-2 text-xs font-medium text-[var(--ink)] hover:bg-[var(--canvas)]">
                  Billing & Plans
                </Link>
                <button 
                  onClick={() => showToast("Account signed out (Demo mode)")}
                  className="rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
