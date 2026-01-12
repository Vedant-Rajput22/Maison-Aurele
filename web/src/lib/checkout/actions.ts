"use server";

import type { Locale } from "@/lib/i18n/config";
import { getCartSnapshot } from "@/lib/cart/actions";
import { stripe, getAppBaseUrl } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

type CheckoutResult = {
  ok: boolean;
  checkoutUrl?: string;
  error?: string;
};

type StartCheckoutOptions = {
  locale: Locale;
  shippingAddressId?: string;
};

export async function startCheckoutAction(
  locale: Locale,
  options?: { shippingAddressId?: string }
): Promise<CheckoutResult> {
  const cart = await getCartSnapshot(locale);
  const currentUser = await getCurrentUser();
  if (cart.itemCount === 0) {
    return {
      ok: false,
      error: locale === "fr" ? "Panier vide" : "Your cart is empty",
    };
  }

  if (!cart.cartId) {
    return {
      ok: false,
      error: locale === "fr" ? "Impossible de récupérer votre panier." : "Unable to load your cart.",
    };
  }

  // Get shipping address if provided
  let shippingAddress = null;
  if (options?.shippingAddressId && currentUser) {
    shippingAddress = await prisma.address.findFirst({
      where: {
        id: options.shippingAddressId,
        userId: currentUser.id,
      },
    });
  }

  const baseUrl = getAppBaseUrl();
  const successUrl = `${baseUrl}/${locale}/cart?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/${locale}/cart?checkout=cancelled`;

  const lineItems = cart.items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: cart.currency.toLowerCase(),
      unit_amount: item.priceCents,
      product_data: {
        name: item.productName,
        metadata: {
          productSlug: item.productSlug,
          variantId: item.variantId,
        },
        ...(item.heroImage ? { images: [resolveImageUrl(item.heroImage, baseUrl) ?? undefined].filter(Boolean) as string[] } : {}),
      },
    },
  }));

  // Configure Stripe session
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    locale: locale === "fr" ? "fr" : "auto",
    allow_promotion_codes: true,
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: lineItems,
    metadata: {
      cartId: cart.cartId,
      locale,
      userId: currentUser?.id ?? "",
      shippingAddressId: options?.shippingAddressId ?? "",
    },
    customer_email: currentUser?.email ?? undefined,
    shipping_address_collection: shippingAddress
      ? undefined
      : {
          allowed_countries: [
            "FR", "US", "GB", "DE", "IT", "ES", "CH", "BE", "NL",
            "JP", "CN", "AE", "SG", "AU", "CA", "AT", "PT", "IE",
          ],
        },
  };

  // If we have a shipping address, pre-fill it in Stripe
  if (shippingAddress) {
    // For prefilled addresses, we use customer_update to allow editing
    sessionParams.shipping_options = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: cart.currency.toLowerCase() },
          display_name: locale === "fr" ? "Livraison White Glove" : "White Glove Delivery",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ];
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    return {
      ok: false,
      error: locale === "fr" ? "Session de paiement indisponible." : "Unable to start checkout.",
    };
  }

  return { ok: true, checkoutUrl: session.url };
}

function resolveImageUrl(url: string | null | undefined, baseUrl: string) {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
}
