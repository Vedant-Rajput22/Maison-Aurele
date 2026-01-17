"use client";

import { createContext, useContext, useTransition, useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { CartSnapshot } from "@/lib/cart/actions";
import { getCartSnapshot } from "@/lib/cart/actions";
import type { WishlistSnapshot } from "@/lib/wishlist/actions";
import {
  toggleWishlistAction,
  removeWishlistItemAction,
} from "@/lib/wishlist/actions";

type CommerceContextValue = {
  locale: Locale;
  cart: CartSnapshot;
  setCart: (snapshot: CartSnapshot) => void;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
  wishlist: WishlistSnapshot;
  setWishlist: (snapshot: WishlistSnapshot) => void;
  toggleWishlist: (productId: string) => void;
  removeWishlist: (productId: string) => void;
  wishlistPendingId: string | null;
  wishlistPending: boolean;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

export function CommerceProvider({
  locale,
  initialCart,
  initialWishlist,
  children,
}: {
  locale: Locale;
  initialCart: CartSnapshot;
  initialWishlist: WishlistSnapshot;
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartSnapshot>(initialCart);
  const [wishlist, setWishlist] =
    useState<WishlistSnapshot>(initialWishlist);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isClearing = useRef(false);

  // Sync cart state when initialCart changes (e.g., after router.refresh())
  // But skip if we just cleared the cart
  useEffect(() => {
    if (isClearing.current) {
      isClearing.current = false;
      return;
    }
    setCart(initialCart);
  }, [initialCart]);

  // Function to refresh cart from server
  const refreshCart = useCallback(async () => {
    const snapshot = await getCartSnapshot(locale);
    setCart(snapshot);
  }, [locale]);

  // Function to clear cart immediately (used after checkout)
  // Use initialCart.currency to keep function reference stable
  const clearCart = useCallback(() => {
    isClearing.current = true;
    setCart({
      cartId: null,
      currency: initialCart.currency,
      itemCount: 0,
      subtotalCents: 0,
      items: [],
    });
  }, [initialCart.currency]);

  const toggleWishlist = (productId: string) => {
    setPendingId(productId);
    startTransition(async () => {
      const snapshot = await toggleWishlistAction({ productId, locale });
      setWishlist(snapshot);
      setPendingId(null);
    });
  };

  const removeWishlist = (productId: string) => {
    setPendingId(productId);
    startTransition(async () => {
      const snapshot = await removeWishlistItemAction({
        productId,
        locale,
      });
      setWishlist(snapshot);
      setPendingId(null);
    });
  };

  return (
    <CommerceContext.Provider
      value={{
        locale,
        cart,
        setCart,
        refreshCart,
        clearCart,
        wishlist,
        setWishlist,
        toggleWishlist,
        removeWishlist,
        wishlistPendingId: pendingId,
        wishlistPending: isPending,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const ctx = useContext(CommerceContext);
  if (!ctx) {
    throw new Error("useCommerce must be used within CommerceProvider");
  }
  return ctx;
}

