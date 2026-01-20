"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { WishlistDrawer } from "@/components/shop/wishlist-drawer";
import { useCommerce } from "@/components/commerce/commerce-provider";

const NAV_LINKS = [
  { href: "", label: { fr: "Accueil", en: "Home" } },
  { href: "/collections", label: { fr: "Collections", en: "Collections" } },
  { href: "/journal", label: { fr: "Journal", en: "Journal" } },
  { href: "/shop", label: { fr: "Shop", en: "Shop" } },
  { href: "/maison", label: { fr: "La Maison", en: "The Maison" } },
  { href: "/boutique", label: { fr: "Boutique", en: "Boutique" } },
] as const;

type Props = {
  locale: Locale;
  isAuthenticated: boolean;
  forceDark?: boolean;
};

export function ShopNavbar({ locale, isAuthenticated, forceDark = false }: Props) {
  const { cart, setCart, wishlist, removeWishlist, wishlistPending, wishlistPendingId } = useCommerce();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <>
      <ShopNavigation
        locale={locale}
        forceDark={forceDark}
        onOpen={() => setMenuOpen(true)}
        cartCount={cart.itemCount}
        wishlistCount={wishlist.itemIds.length}
        onCartClick={() => setCartOpen(true)}
        onWishlistClick={() => setWishlistOpen(true)}
      />
      <MenuDrawer locale={locale} open={menuOpen} onClose={() => setMenuOpen(false)} isAuthenticated={isAuthenticated} />
      <CartDrawer locale={locale} open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onCartChange={setCart} />
      <WishlistDrawer
        locale={locale}
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlist={wishlist}
        onRemove={(id) => removeWishlist(id)}
        pendingId={wishlistPendingId}
        pending={wishlistPending}
      />
    </>
  );
}

function MenuDrawer({
  locale,
  open,
  onClose,
  isAuthenticated,
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
}) {
  return (
    <div className={`fixed inset-0 z-40 transition ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur" onClick={onClose} />
      <div className={`absolute left-1/2 top-12 w-[90vw] max-w-2xl -translate-x-1/2 rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-10 text-white shadow-2xl transition-all ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="flex items-center justify-between">
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/60">{locale === "fr" ? "Navigation" : "Navigation"}</p>
          <button onClick={onClose} className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/70 hover:text-white">
            {locale === "fr" ? "Fermer" : "Close"}
          </button>
        </div>
        <div className="mt-8 grid gap-4 text-2xl font-display">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              onClick={onClose}
              className="flex justify-between border-b border-white/10 py-3 text-white/80 hover:text-white"
            >
              <span>{link.label[locale]}</span>
              <span>&gt;</span>
            </Link>
          ))}
          <Link
            href={`/${locale}/account`}
            onClick={onClose}
            className="flex justify-between border-b border-white/10 py-3 text-white/80 hover:text-white"
          >
            <span>
              {locale === "fr"
                ? isAuthenticated
                  ? "Espace client"
                  : "Se connecter"
                : isAuthenticated
                  ? "Client suite"
                  : "Sign in"}
            </span>
            <span>&gt;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ShopNavigation({
  locale,
  onOpen,
  cartCount,
  wishlistCount,
  onCartClick,
  onWishlistClick,
  forceDark,
}: {
  locale: Locale;
  onOpen: () => void;
  cartCount: number;
  onCartClick: () => void;
  wishlistCount: number;
  onWishlistClick: () => void;
  forceDark: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handler = () => {
      const current = window.scrollY;
      setScrolled(current > 40);
      if (current <= 80) {
        setHidden(false);
      } else if (current > lastScrollY.current + 12) {
        setHidden(true);
      } else if (current < lastScrollY.current - 12) {
        setHidden(false);
      }
      lastScrollY.current = current;
    };
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const styles = scrolled
    ? {
      wrapper: "bg-white/95 border-b border-white/40 text-ink shadow-[0_10px_40px_rgba(5,5,5,0.08)]",
      text: "text-ink",
      border: "border-ink/30",
      badge: "bg-ink text-white",
      blur: "backdrop-blur",
    }
    : forceDark
      ? {
        wrapper: "bg-transparent border-b border-transparent text-ink",
        text: "text-ink",
        border: "border-ink/40",
        badge: "bg-ink text-white",
        blur: "",
      }
      : {
        wrapper: "bg-transparent border-b border-transparent text-white",
        text: "text-white",
        border: "border-white/50",
        badge: "bg-white text-ink",
        blur: "",
      };

  const iconButtonBase =
    "relative flex h-10 w-10 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  return (
    <header
      className={`fixed top-0 z-30 w-full px-4 py-3 transition duration-500 ${hidden ? "-translate-y-full" : "translate-y-0"} ${styles.wrapper} ${styles.blur}`}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 text-xs uppercase tracking-[0.45em]">
        <div className="flex flex-1 basis-0 items-center gap-2">
          <button
            onClick={onOpen}
            aria-label={locale === "fr" ? "Menu boutique" : "Shop menu"}
            className={`${iconButtonBase} ${styles.border} ${styles.text}`}
          >
            <Menu size={18} />
            <span className="sr-only">{locale === "fr" ? "Menu" : "Menu"}</span>
          </button>
          <button
            aria-label={locale === "fr" ? "Rechercher dans la boutique" : "Search the shop"}
            className={`${iconButtonBase} ${styles.border} ${styles.text}`}
          >
            <Search size={18} />
            <span className="sr-only">{locale === "fr" ? "Recherche" : "Search"}</span>
          </button>
        </div>
        <div className="flex flex-1 basis-0 justify-center">
          <Link href={`/${locale}/shop`} className={`font-display text-sm tracking-[0.7em] text-center ${styles.text}`}>
            Maison Aurele
          </Link>
        </div>
        <div className="flex flex-1 basis-0 items-center justify-end gap-2">
          <button
            onClick={onWishlistClick}
            aria-label={locale === "fr" ? "Voir la liste de souhaits" : "Open wishlist"}
            className={`${iconButtonBase} ${styles.border} ${styles.text}`}
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className={`absolute -right-1 -top-1 min-w-[1.5rem] rounded-full px-1.5 py-0.5 text-[0.55rem] tracking-[0.2em] ${styles.badge}`}>
                {wishlistCount}
              </span>
            )}
            <span className="sr-only">
              {locale === "fr" ? "Souhaits" : "Wishlist"} {wishlistCount}
            </span>
          </button>
          <button
            onClick={onCartClick}
            aria-label={locale === "fr" ? "Voir le panier" : "Open cart"}
            className={`${iconButtonBase} ${styles.border} ${styles.text}`}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className={`absolute -right-1 -top-1 min-w-[1.5rem] rounded-full px-1.5 py-0.5 text-[0.55rem] tracking-[0.2em] ${styles.badge}`}>
                {cartCount}
              </span>
            )}
            <span className="sr-only">
              {locale === "fr" ? "Panier" : "Cart"} {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
