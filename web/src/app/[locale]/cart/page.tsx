import type { Locale } from "@/lib/i18n/config";
import { getCartSnapshot } from "@/lib/cart/actions";
import { CartPageClient } from "@/components/cart/cart-page-client";
import { getUserAddresses } from "@/lib/address/actions";
import { getCurrentUser } from "@/lib/auth/session";

type LocaleParams = { locale: Locale } | Promise<{ locale: Locale }>;

export const revalidate = 0;

export default async function CartPage({
  params,
}: {
  params: LocaleParams;
}) {
  const resolved = await params;
  const locale = resolved.locale;
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
    />
  );
}
