import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Locale, isLocale, locales } from "@/lib/i18n/config";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCartSnapshot } from "@/lib/cart/actions";
import { getWishlistSnapshot } from "@/lib/wishlist/actions";
import { CommerceProvider } from "@/components/commerce/commerce-provider";
import { getCurrentUser } from "@/lib/auth/session";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LayoutParams = { locale: string } | Promise<{ locale: string }>;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: LayoutParams;
}) {
  const resolvedParams = await params;

  if (!isLocale(resolvedParams.locale)) {
    notFound();
  }

  const locale = resolvedParams.locale as Locale;
  const [cartSnapshot, wishlistSnapshot, currentUser] = await Promise.all([
    getCartSnapshot(locale),
    getWishlistSnapshot(locale),
    getCurrentUser(),
  ]);

  return (
    <LenisProvider>
      <CommerceProvider
        locale={locale}
        initialCart={cartSnapshot}
        initialWishlist={wishlistSnapshot}
      >
        <div
          className="flex min-h-screen flex-col"
          style={{
            backgroundColor: "var(--parchment)",
            color: "var(--espresso)",
          }}
        >
          <SiteHeader locale={locale} user={currentUser} />
          <main className="flex-1">{children}</main>
          <SiteFooter locale={locale} />
        </div>
      </CommerceProvider>
    </LenisProvider>
  );
}
