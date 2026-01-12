"use client";

import { useState, useTransition } from "react";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { CartSnapshot } from "@/lib/cart/actions";
import { addToCartAction } from "@/lib/cart/actions";

type Props = {
  locale: Locale;
  variantId: string;
  onCartChange?: (snapshot: CartSnapshot) => void;
  className?: string;
};

export function AddToCartButton({ locale, variantId, onCartChange, className }: Props) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleAdd = () => {
    startTransition(async () => {
      const result = await addToCartAction({ variantId, quantity: 1, locale });
      if (result.success) {
        if (result.cart) {
          onCartChange?.(result.cart);
        }
        setStatus("success");
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("error");
      }
    });
  };

  const label = locale === "fr" ? "Ajouter au panier" : "Add to cart";
  const statusLabel =
    status === "success"
      ? locale === "fr"
        ? "Ajouté"
        : "Added"
      : status === "error"
        ? locale === "fr"
          ? "Erreur"
          : "Error"
        : label;

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleAdd}
      className={cn(
        "flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-3 text-[0.7rem] uppercase tracking-[0.35em] text-white transition hover:bg-ink/80 disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {pending ? (
        locale === "fr" ? "..." : "..."
      ) : (
        <>
          <ShoppingBag size={18} />
          {statusLabel}
        </>
      )}
    </button>
  );
}
