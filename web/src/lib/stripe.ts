import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not defined. Add it to your environment.");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-12-15.clover",
  appInfo: {
    name: "Maison Aurele",
  },
});

export function getAppBaseUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  const fallback = "http://localhost:3000";
  const origin = fromEnv ?? fallback;
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}
