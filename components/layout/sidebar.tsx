"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBar,
  ChatCircleDots,
  CreditCard,
  Heart,
  House,
  MagicWand,
  Notebook,
  Sparkle,
  UserSound,
  Users,
  Plus
} from "@phosphor-icons/react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: House },
  { href: "/matchmaker", label: "AI Matchmaker", icon: MagicWand },
  { href: "/creators", label: "Creators", icon: Users },
  { href: "/campaigns", label: "Campaigns", icon: Notebook },
  { href: "/messages", label: "Messages", icon: ChatCircleDots },
  { href: "/analytics", label: "Analytics", icon: ChartBar },
  { href: "/favorites", label: "My Favorites", icon: Heart },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: UserSound },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--panel)] px-4 py-5 lg:flex">
      <Link href="/dashboard" className="mb-5 flex items-center gap-2.5 px-2">
        <img
          src="/vibely_logo.png"
          className="h-9 w-9 rounded-xl object-cover border border-[var(--border)] shadow-sm"
          alt="Vibely logo"
        />
        <div>
          <p className="text-lg font-bold tracking-tight text-[var(--ink)]">
            Vibely
          </p>
        </div>
      </Link>

      <Link
        href="/matchmaker"
        className="mb-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-xs font-bold uppercase tracking-wider text-[var(--accent-contrast)] shadow-sm transition hover:bg-[var(--accent-strong)]"
      >
        <Plus size={16} weight="bold" />
        New Campaign
      </Link>

      <div className="mb-2 px-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Menu</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--panel-soft)] text-[var(--ink)] font-semibold"
                  : "text-[var(--muted)] hover:bg-[var(--panel-soft)] hover:text-[var(--ink)]"
              }`}
            >
              <Icon size={18} weight={isActive ? "fill" : "regular"} className={isActive ? "text-[var(--accent)]" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] p-3.5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[var(--accent)] to-blue-400" />
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none text-[var(--ink)]">GlowUp Skincare</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Brand Account</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
