"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  BadgeCheck,
  Home,
  LayoutDashboard,
  PanelsTopLeft,
  PenSquare,
  Settings,
  ShoppingBag,
  Sparkles,
  TicketPercent,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultLocale } from "@/lib/i18n/config";
import { signOut } from "next-auth/react";

type AdminUser = {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/collections", label: "Collections", icon: PanelsTopLeft },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/editorial", label: "Editorial", icon: PenSquare },
  { href: "/admin/orders", label: "Orders", icon: BadgeCheck },
  { href: "/admin/drops", label: "Drops", icon: Sparkles },
  { href: "/admin/appointments", label: "Appointments", icon: Users },
  { href: "/admin/promotions", label: "Promotions", icon: TicketPercent },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children, user }: { children: React.ReactNode; user?: AdminUser | null }) {
  const pathname = usePathname();
  const displayName = user?.firstName || user?.email || "Admin";
  const initials = displayName
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const handleSignOut = () => {
    signOut({ callbackUrl: `/${defaultLocale}/account` });
  };
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(209,169,130,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(84,60,46,0.18),transparent_35%),linear-gradient(135deg,#0c0907,#16100e,#1c1411)] text-white">
      <div className="grid min-h-screen grid-cols-[260px_1fr] gap-0">
        <aside className="border-r border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="flex h-full flex-col px-6 py-8 gap-10">
            <div className="space-y-2">
              <p className="text-[0.55rem] uppercase tracking-[0.5em] text-white/60">Maison Aurèle</p>
              <h1 className="font-display text-2xl">Admin Atelier</h1>
            </div>
            <nav className="space-y-2 text-sm">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                      active
                        ? "bg-white/10 text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
                        : "text-white/70 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon size={18} className="text-white/60" />
                    <span className="tracking-[0.2em] uppercase text-[0.7rem]">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs uppercase tracking-[0.35em] text-white/70">
              <p className="text-white">Concierge access</p>
              <p className="text-white/60">White-glove changes are audited.</p>
            </div>
          </div>
        </aside>
        <main className="relative flex min-h-screen flex-col">
          <div className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur-xl">
            <div className="flex items-center justify-between px-8 py-5">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1">Live</span>
                <span className="text-white/60">Paris · Atelier Control</span>
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/70">
                <Link
                  href={`/${defaultLocale}`}
                  className="rounded-full border border-white/20 px-3 py-1 text-white/80 transition hover:bg-white/10"
                >
                  View site
                </Link>
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
                  <span className="rounded-full bg-white/15 px-2 py-1 text-[0.75rem] font-semibold tracking-[0.2em] text-white">
                    {initials || "A"}
                  </span>
                  <span className="text-[0.7rem] text-white/80">{displayName}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="rounded-full bg-white/15 px-3 py-1 text-[0.7rem] tracking-[0.3em] text-white transition hover:bg-white/25"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 px-8 py-10">
            <div className="mx-auto max-w-6xl space-y-10">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
