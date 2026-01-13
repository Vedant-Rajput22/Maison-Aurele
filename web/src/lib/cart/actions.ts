"use server";

import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { Currency } from "@prisma/client";
import type { Locale } from "@/lib/i18n/config";
import { toDbLocale } from "@/lib/i18n/db-locale";
import { readCartSession, persistCartSession } from "./session";
import { getCurrentUserId } from "@/lib/auth/session";

type CartSummary = {
  cartId: string | null;
  itemCount: number;
};

export type CartLineItem = {
  id: string;
  variantId: string;
  productSlug: string;
  productName: string;
  heroImage?: string | null;
  priceCents: number;
  quantity: number;
  size?: string | null;
  color?: string | null;
};

export type CartSnapshot = {
  cartId: string | null;
  currency: Currency;
  itemCount: number;
  subtotalCents: number;
  items: CartLineItem[];
};

function emptyCartSnapshot(): CartSnapshot {
  return {
    cartId: null,
    currency: Currency.EUR,
    itemCount: 0,
    subtotalCents: 0,
    items: [],
  };
}

async function ensureCart() {
  const userId = await getCurrentUserId();
  const existing = await findExistingCart();
  if (existing) {
    if (userId && !existing.cart.userId) {
      await prisma.cart.update({
        where: { id: existing.cart.id },
        data: { userId },
      });
      existing.cart.userId = userId;
    }
    return existing;
  }

  const sessionKey = randomUUID();
  const cart = await prisma.cart.create({
    data: {
      sessionKey,
      currency: Currency.EUR,
      userId: userId ?? undefined,
    },
    include: {
      items: {
        select: { quantity: true },
      },
    },
  });
  await persistCartSession(sessionKey);
  return { cart, sessionKey };
}

async function findExistingCart() {
  const userId = await getCurrentUserId();
  const sessionKey = await readCartSession();

  if (userId) {
    const userCart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: { select: { quantity: true } },
      },
    });
    if (userCart) {
      return { cart: userCart, sessionKey: userCart.sessionKey ?? sessionKey ?? null };
    }
  }

  if (!sessionKey) {
    return null;
  }

  const cart = await prisma.cart.findUnique({
    where: { sessionKey },
    include: {
      items: {
        select: { quantity: true },
      },
    },
  });

  if (!cart) {
    return null;
  }

  if (userId && !cart.userId) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: { userId },
    });
    cart.userId = userId;
  }

  return { cart, sessionKey };
}

function computeCount(cart: { items: Array<{ quantity: number }> }) {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function getCartSummary(): Promise<CartSummary> {
  const existing = await findExistingCart();
  if (!existing) {
    return { cartId: null, itemCount: 0 };
  }
  return { cartId: existing.cart.id, itemCount: computeCount(existing.cart) };
}

export async function getCartSnapshot(locale: Locale): Promise<CartSnapshot> {
  const cart = await loadCartWithLocale(locale);
  if (!cart) {
    return emptyCartSnapshot();
  }
  return mapCartToSnapshot(cart);
}

export async function addToCartAction(input: { variantId: string; quantity?: number; locale: Locale }) {
  const quantity = Math.max(1, input.quantity ?? 1);
  const variant = await prisma.productVariant.findUnique({
    where: { id: input.variantId },
    select: { id: true },
  });

  if (!variant) {
    return { success: false, error: "Variant not found", itemCount: 0 };
  }

  const { cart } = await ensureCart();

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, variantId: variant.id },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId: variant.id,
        quantity,
      },
    });
  }

  const updated = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { select: { quantity: true } } },
  });

  const snapshot = await getCartSnapshot(input.locale);

  return {
    success: true,
    itemCount: updated ? computeCount(updated) : quantity,
    cart: snapshot,
  };
}

export async function updateCartItemQuantityAction(input: { itemId: string; quantity: number; locale: Locale }) {
  const cart = await ensureCart();

  const target = await prisma.cartItem.findFirst({
    where: { id: input.itemId, cartId: cart.cart.id },
  });

  if (!target) {
    return { success: false, error: "Item not found", cart: await getCartSnapshot(input.locale) };
  }

  if (input.quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: target.id } });
  } else {
    await prisma.cartItem.update({
      where: { id: target.id },
      data: { quantity: input.quantity },
    });
  }

  return { success: true, cart: await getCartSnapshot(input.locale) };
}

export async function removeCartItemAction(input: { itemId: string; locale: Locale }) {
  return updateCartItemQuantityAction({ ...input, quantity: 0 });
}

async function loadCartWithLocale(locale: Locale) {
  const userId = await getCurrentUserId();
  const sessionKey = await readCartSession();
  const dbLocale = toDbLocale(locale);

  const includeShape = {
    items: {
      include: {
        variant: {
          include: {
            product: {
              include: {
                translations: { where: { locale: dbLocale } },
                media: {
                  include: { asset: true },
                  orderBy: { sortOrder: "asc" },
                },
              },
            },
          },
        },
      },
    },
  } as const;

  if (userId) {
    const userCart = await prisma.cart.findFirst({
      where: { userId },
      include: includeShape,
    });
    if (userCart) {
      return userCart;
    }
  }

  if (!sessionKey) {
    return null;
  }

  const cart = await prisma.cart.findUnique({
    where: { sessionKey },
    include: includeShape,
  });

  if (cart && userId && !cart.userId) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: { userId },
    });
    cart.userId = userId;
  }

  return cart;
}

function mapCartToSnapshot(cart: Awaited<ReturnType<typeof loadCartWithLocale>>): CartSnapshot {
  if (!cart) return emptyCartSnapshot();

  const items: CartLineItem[] = cart.items.map((item) => {
    const product = item.variant.product;
    const translation = product.translations[0];
    const hero =
      product.media.find((media) => media.placement === "hero") ??
      product.media[0];
    return {
      id: item.id,
      variantId: item.variantId,
      productSlug: product.slug,
      productName: translation?.name ?? product.slug,
      heroImage: hero?.asset?.url ?? null,
      priceCents: item.variant.priceCents,
      quantity: item.quantity,
      size: item.variant.size ?? undefined,
      color: item.variant.color ?? undefined,
    };
  });

  const subtotalCents = items.reduce(
    (sum, line) => sum + line.priceCents * line.quantity,
    0,
  );

  return {
    cartId: cart.id,
    currency: cart.currency,
    itemCount: computeCount(cart),
    subtotalCents,
    items,
  };
}

/**
 * Clears the cart session cookie. Should be called after successful checkout
 * to ensure old cart data doesn't reappear.
 */
export async function clearCartAction(): Promise<void> {
  const { clearCartSession } = await import("./session");
  await clearCartSession();
}

