import type { Locale } from "@/lib/i18n/config";
import { getCartSnapshot } from "@/lib/cart/actions";
import { CartPageClient } from "@/components/cart/cart-page-client";
import { getUserAddresses } from "@/lib/address/actions";
import { getCurrentUser } from "@/lib/auth/session";

type LocaleParams = { locale: Locale } | Promise<{ locale: Locale }>;
type SearchParams = { checkout?: string; session_id?: string } | Promise<{ checkout?: string; session_id?: string }>;

export const revalidate = 0;

export default async function CartPage({
  params,
  searchParams,
}: {
  params: LocaleParams;
  searchParams?: SearchParams;
}) {
  const resolved = await params;
  const locale = resolved.locale;
  const resolvedSearch = searchParams ? await searchParams : {};

  const [cart, user, addresses] = await Promise.all([
    getCartSnapshot(locale),
    getCurrentUser(),
    getUserAddresses(),
  ]);

  return (
    <CartPageClient
      locale={locale}
      initialCart={cart}
      isLoggedIn={!!user}
      addresses={addresses}
      checkoutSuccess={resolvedSearch.checkout === "success"}
    />
  );
}
