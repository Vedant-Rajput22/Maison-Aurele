"use server";

import { randomUUID } from "crypto";
import type { Locale } from "@/lib/i18n/config";
import { toDbLocale } from "@/lib/i18n/db-locale";
import { prisma } from "@/lib/prisma";
import { readWishlistSession, persistWishlistSession } from "./session";
import { getCurrentUserId } from "@/lib/auth/session";
import { unstable_cache, revalidateTag } from "next/cache";

export type WishlistItemInfo = {
  productId: string;
  slug: string;
  name: string;
  heroImage?: string | null;
  priceCents?: number | null;
  categoryTitle?: string | null;
};

export type WishlistSnapshot = {
  itemIds: string[];
  items: WishlistItemInfo[];
};

function emptyWishlistSnapshot(): WishlistSnapshot {
  return { itemIds: [], items: [] };
}

async function findExistingWishlist() {
  const userId = await getCurrentUserId();
  const sessionKey = await readWishlistSession();

  if (userId) {
    const userWishlist = await prisma.wishlist.findFirst({
      where: { userId },
    });
    if (userWishlist) {
      return { wishlist: userWishlist, sessionKey: userWishlist.sessionKey ?? sessionKey ?? null };
    }
  }

  if (!sessionKey) return null;

  const wishlist = await prisma.wishlist.findUnique({
    where: { sessionKey },
  });
  if (!wishlist) return null;

  if (userId && !wishlist.userId) {
    await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: { userId },
    });
    wishlist.userId = userId;
  }

  return { wishlist, sessionKey };
}

async function ensureWishlist() {
  const userId = await getCurrentUserId();
  const existing = await findExistingWishlist();
  if (existing) {
    if (userId && !existing.wishlist.userId) {
      await prisma.wishlist.update({
        where: { id: existing.wishlist.id },
        data: { userId },
      });
      existing.wishlist.userId = userId;
    }
    return existing;
  }
  const sessionKey = randomUUID();
  const wishlist = await prisma.wishlist.create({
    data: { sessionKey, userId: userId ?? undefined },
  });
  await persistWishlistSession(sessionKey);
  return { wishlist, sessionKey };
}

function mapWishlistToSnapshot(
  wishlist:
    | (Awaited<ReturnType<typeof loadWishlistWithItems>>)
    | null,
): WishlistSnapshot {
  if (!wishlist) return emptyWishlistSnapshot();

  const items =
    wishlist.items?.map((entry) => {
      const product = entry.product;
      const translation = product.translations[0];
      const hero =
        product.media.find((media) => media.placement === "hero") ??
        product.media[0];
      const variant = product.variants[0];
      const categoryTranslation = product.category?.translations[0];

      return {
        productId: product.id,
        slug: product.slug,
        name: translation?.name ?? product.slug,
        heroImage: hero?.asset?.url ?? null,
        priceCents: variant?.priceCents ?? null,
        categoryTitle: categoryTranslation?.title ?? product.category?.slug ?? null,
      };
    }) ?? [];

  return {
    itemIds: items.map((item) => item.productId),
    items,
  };
}

// Separate the DB fetch so we can cache it
async function fetchWishlistFromDb(
  userId: string | null,
  sessionKey: string | null,
  locale: Locale
) {
  const dbLocale = toDbLocale(locale);
  const includeShape = {
    items: {
      include: {
        product: {
          include: {
            translations: { where: { locale: dbLocale } },
            media: {
              include: { asset: true },
              orderBy: { sortOrder: "asc" },
            },
            variants: {
              orderBy: { priceCents: "asc" },
              take: 1,
            },
            category: {
              include: { translations: { where: { locale: dbLocale } } },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    },
  } as const;

  if (userId) {
    const wishlist = await prisma.wishlist.findFirst({
      where: { userId },
      include: includeShape,
    });
    if (wishlist) return wishlist;
  }

  if (!sessionKey) return null;

  const wishlist = await prisma.wishlist.findUnique({
    where: { sessionKey },
    include: includeShape,
  });

  return wishlist;
}

// Cached wrapper
async function loadWishlistWithItems(locale: Locale) {
  const userId = await getCurrentUserId();
  const sessionKey = await readWishlistSession();

  if (!userId && !sessionKey) return null;

  // Create a unique tag for this user/session
  const tag = userId ? `wishlist-user-${userId}` : `wishlist-session-${sessionKey}`;

  const getCached = unstable_cache(
    async () => fetchWishlistFromDb(userId, sessionKey, locale),
    [`wishlist-${userId ?? "anon"}-${sessionKey ?? "none"}-${locale}`],
    {
      revalidate: 3600, // 1 hour
      tags: [tag, "wishlist"],
    }
  );

  const wishlist = await getCached();

  // If we found a wishlist via sessionKey but now have a userId (and it's unlinked), update it.
  // Note: We do this AFTER fetch. This write operation isn't cached, obviously.
  // But if we just fetched from cache, we might miss this check?
  // Actually, this check handles "merging" or "claiming" logic.
  // If we fetched from cache, 'wishlist' is the object.
  // If 'wishlist' exists, and we have 'userId', and 'wishlist.userId' is null...
  if (wishlist && userId && !wishlist.userId) {
    await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: { userId },
    });
    // Invalidate cache because we changed the wishlist (userId)
    revalidateTag(tag, "page");
    // Also revalidate the user tag since it's now their wishlist
    revalidateTag(`wishlist-user-${userId}`, "page");

    wishlist.userId = userId;
  }

  return wishlist;
}

export async function getWishlistSnapshot(locale: Locale): Promise<WishlistSnapshot> {
  const wishlist = await loadWishlistWithItems(locale);
  return mapWishlistToSnapshot(wishlist);
}

export async function toggleWishlistAction(input: { productId: string; locale: Locale }) {
  const product = await prisma.product.findUnique({
    where: { id: input.productId },
    select: { id: true },
  });
  if (!product) {
    return getWishlistSnapshot(input.locale);
  }

  const { wishlist, sessionKey } = await ensureWishlist();

  const existing = await prisma.wishlistItem.findFirst({
    where: { wishlistId: wishlist.id, productId: product.id },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: product.id,
      },
    });
  }

  // Invalidate cache
  const userId = await getCurrentUserId();
  const tag = userId ? `wishlist-user-${userId}` : `wishlist-session-${sessionKey}`;
  revalidateTag(tag, "page");

  return getWishlistSnapshot(input.locale);
}

export async function removeWishlistItemAction(input: { productId: string; locale: Locale }) {
  const result = await findExistingWishlist();
  if (!result) {
    return getWishlistSnapshot(input.locale);
  }
  const { wishlist, sessionKey } = result;

  await prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id, productId: input.productId },
  });

  // Invalidate cache
  const userId = await getCurrentUserId();
  const tag = userId ? `wishlist-user-${userId}` : `wishlist-session-${sessionKey}`;
  revalidateTag(tag, "page");

  return getWishlistSnapshot(input.locale);
}
