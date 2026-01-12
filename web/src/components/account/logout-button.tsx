"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";
import type { Locale } from "@/lib/i18n/config";

export function LogoutButton({ locale }: { locale: Locale }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await signOut({ callbackUrl: `/${locale}/account` });
        })
      }
      disabled={pending}
      className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white transition hover:bg-white hover:text-[var(--espresso)] disabled:opacity-60"
    >
      {locale === "fr" ? "Se déconnecter" : "Sign out"}
    </button>
  );
}
