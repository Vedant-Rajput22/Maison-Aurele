import { cookies } from "next/headers";

export const CART_COOKIE_NAME = "maison_aurele_cart";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 60; // 60 days

export async function readCartSession() {
  const store = await cookies();
  return store.get(CART_COOKIE_NAME)?.value ?? null;
}

export async function persistCartSession(sessionKey: string) {
  const store = await cookies();
  store.set(CART_COOKIE_NAME, sessionKey, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

export async function clearCartSession() {
  const store = await cookies();
  store.delete(CART_COOKIE_NAME);
}
