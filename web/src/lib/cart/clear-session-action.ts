"use server";

import { cookies } from "next/headers";
import { CART_COOKIE_NAME } from "@/lib/cart/session";

/**
 * Server action to clear the cart session cookie.
 * Must be called as an action, not during page rendering.
 */
export async function clearCartSessionAction(): Promise<{ ok: boolean }> {
    const store = await cookies();
    store.delete(CART_COOKIE_NAME);
    return { ok: true };
}
