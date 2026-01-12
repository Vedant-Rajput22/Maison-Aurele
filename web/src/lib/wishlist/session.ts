import { cookies } from "next/headers";

export const WISHLIST_COOKIE_NAME = "maison_aurele_wishlist";
const WISHLIST_COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export async function readWishlistSession() {
  const store = await cookies();
  return store.get(WISHLIST_COOKIE_NAME)?.value ?? null;
}

export async function persistWishlistSession(sessionKey: string) {
  const store = await cookies();
  store.set(WISHLIST_COOKIE_NAME, sessionKey, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: WISHLIST_COOKIE_MAX_AGE,
  });
}
