"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/components/layout/sidebar";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto rounded-[28px] border border-[var(--border)] bg-white px-3 py-3 lg:hidden">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              isActive
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--panel-soft)] text-[var(--muted)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
