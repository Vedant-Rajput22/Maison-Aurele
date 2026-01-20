"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { useCommerce } from "@/components/commerce/commerce-provider";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { WishlistDrawer } from "@/components/shop/wishlist-drawer";
import type { SearchResult } from "@/lib/data/search";

const navItems = [
  { slug: "collections", labels: { fr: "Collections", en: "Collections" } },
  { slug: "journal", labels: { fr: "Journal", en: "Journal" } },
  { slug: "shop", labels: { fr: "Shop", en: "Shop" } },
  { slug: "maison", labels: { fr: "La Maison", en: "The Maison" } },
  { slug: "boutique", labels: { fr: "Boutique", en: "Boutique" } },
];

type HeaderUser = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

type MenuPopoverProps = {
  open: boolean;
  locale: Locale;
  scrolled: boolean;
  cartCount: number;
  wishlistCount: number;
  isAuthenticated: boolean;
  userName?: string | null;
  onClose: () => void;
  onWishlist: () => void;
  onCart: () => void;
  onSignOut?: () => void;
};

export function SiteHeader({ locale, user }: { locale: Locale; user: HeaderUser | null }) {
  const pathname = usePathname();
  const hideHeader = pathname?.includes("/shop") || pathname?.includes("/products/");
  // Detect auth pages to apply dark text styling (light backgrounds)
  const isAuthPage = pathname?.includes("/login") || pathname?.includes("/register");
  const router = useRouter();
  const { cart, setCart, wishlist, removeWishlist, wishlistPending, wishlistPendingId } = useCommerce();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (hideHeader) return;
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 40);
      if (current <= 120) {
        setHidden(false);
      } else if (current > lastScrollY.current + 12) {
        setHidden(true);
      } else if (current < lastScrollY.current - 12) {
        setHidden(false);
      }
      lastScrollY.current = current;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideHeader]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const isAuthenticated = Boolean(user?.id);

  if (hideHeader) {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: `/${locale}/account` });
    setMenuOpen(false);
  };

  // Use dark text ONLY on scrolled pages that are NOT auth pages
  const useDarkText = scrolled && !isAuthPage;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-700",
        hidden ? "-translate-y-full" : "translate-y-0",
        isAuthPage
          ? "border-b border-transparent bg-[var(--espresso)] text-white shadow-md"
          : useDarkText
            ? "border-b border-[var(--espresso)]/5 bg-white/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
            : "border-b border-transparent bg-transparent backdrop-blur-0",
      )}
    >
      {/* Top accent line */}
      <div className={cn(
        "absolute inset-x-0 top-0 h-[1px] transition-opacity duration-500",
        scrolled && !isAuthPage ? "opacity-0" : "opacity-100",
        "bg-gradient-to-r from-transparent via-white/20 to-transparent"
      )} />

      <div className="relative mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-4 text-xs uppercase tracking-[0.5em] md:px-12">
        {/* Left actions */}
        <div className="flex flex-1 basis-0 items-center gap-2 md:gap-3">
          <motion.button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border text-sm transition-all duration-300 min-w-[44px] min-h-[44px]",
              useDarkText
                ? "border-[var(--espresso)]/10 text-[var(--espresso)] hover:border-[var(--espresso)]/30 hover:bg-[var(--espresso)]/5"
                : "border-white/20 text-white hover:border-white/40 hover:bg-white/5",
            )}
          >
            <Menu size={15} className="transition-transform duration-300 group-hover:scale-110" />
          </motion.button>
          <motion.button
            onClick={() => setSearchOpen(true)}
            aria-label={locale === "fr" ? "Recherche" : "Search"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border text-sm transition-all duration-300 min-w-[44px] min-h-[44px]",
              useDarkText
                ? "border-[var(--espresso)]/10 text-[var(--espresso)] hover:border-[var(--espresso)]/30 hover:bg-[var(--espresso)]/5"
                : "border-white/20 text-white hover:border-white/40 hover:bg-white/5",
            )}
          >
            <Search size={15} className="transition-transform duration-300 group-hover:scale-110" />
          </motion.button>
        </div>

        {/* Logo */}
        <div className="flex flex-1 basis-0 justify-center">
          <Link
            href={`/${locale}`}
            className={cn(
              "group relative font-display text-sm tracking-[0.9em] transition-colors duration-500 md:text-base text-center",
              scrolled ? "text-[var(--espresso)]" : "text-white",
            )}
          >
            <span className="relative">
              Maison Aurèle
              <span className={cn(
                "absolute -bottom-1 left-0 h-[1px] w-0 transition-all duration-500 group-hover:w-full",
                scrolled ? "bg-[var(--gilded-rose)]" : "bg-white/50"
              )} />
            </span>
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex flex-1 basis-0 items-center justify-end gap-2 md:gap-4">
          <LocaleSwitcher
            currentLocale={locale}
            className={cn(
              "text-[0.6rem] tracking-[0.5em] transition-colors duration-500 hover:opacity-70",
              scrolled ? "text-[var(--espresso)]" : "text-white",
            )}
          />
          {/* Cart indicator - only show when items */}
          {cart.itemCount > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setCartOpen(true)}
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 min-w-[44px] min-h-[44px]",
                scrolled
                  ? "border-[var(--gilded-rose)]/30 bg-[var(--gilded-rose)]/10 text-[var(--gilded-rose)]"
                  : "border-white/30 bg-white/10 text-white",
              )}
            >
              <ShoppingBag size={15} />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gilded-rose)] text-[0.5rem] font-medium text-white">
                {cart.itemCount}
              </span>
            </motion.button>
          )}
        </div>

        <MenuPopover
          ref={menuRef}
          open={menuOpen}
          locale={locale}
          scrolled={scrolled}
          cartCount={cart.itemCount}
          wishlistCount={wishlist.itemIds.length}
          isAuthenticated={isAuthenticated}
          userName={user?.firstName ?? user?.email ?? null}
          onClose={() => setMenuOpen(false)}
          onWishlist={() => {
            setMenuOpen(false);
            setWishlistOpen(true);
          }}
          onCart={() => {
            setMenuOpen(false);
            setCartOpen(true);
          }}
          onSignOut={isAuthenticated ? handleSignOut : undefined}
        />
      </div>
      <CartDrawer locale={locale} open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onCartChange={setCart} />
      <WishlistDrawer
        locale={locale}
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlist={wishlist}
        onRemove={(id) => removeWishlist(id)}
        pending={wishlistPending}
        pendingId={wishlistPendingId}
      />
      <MobileNavDrawer locale={locale} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <SearchDrawer
        locale={locale}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSubmit={(query) => {
          if (!query.trim()) return;
          setSearchOpen(false);
          router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
        }}
      />
    </header>
  );
}

function SearchDrawer({
  locale,
  open,
  onClose,
  onSubmit,
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  onSubmit: (query: string) => void;
}) {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setValue("");
      setResults([]);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const trimmed = value.trim();
    if (!trimmed) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/${locale}/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("search_failed");
        }
        const payload = (await response.json()) as { results?: SearchResult[] };
        setResults(payload.results ?? []);
        setError(null);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Search preview failed", err);
          setError(locale === "fr" ? "Erreur lors de la recherche" : "Search error");
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [value, locale, open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          {/* Search panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-1/2 top-8 z-50 w-[92vw] max-w-2xl -translate-x-1/2 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0c0c] text-white shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-8 py-5">
              <div className="flex items-center gap-3">
                <Search size={16} className="text-white/40" />
                <p className="text-[0.55rem] uppercase tracking-[0.6em] text-white/40">
                  {locale === "fr" ? "Recherche" : "Search"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            {/* Search form */}
            <form
              className="p-8"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit(value);
              }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  placeholder={locale === "fr" ? "Que recherchez-vous ?" : "What are you looking for?"}
                  autoFocus
                  className="w-full border-b border-white/10 bg-transparent pb-4 font-display text-2xl tracking-[0.1em] text-white outline-none placeholder:text-white/25 focus:border-white/30"
                />
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[var(--gilded-rose)] transition-all duration-500" style={{ width: value ? "100%" : "0%" }} />
              </div>

              <div className="mt-8 flex items-center gap-4">
                <button
                  type="submit"
                  className="group flex flex-1 items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-[0.6rem] uppercase tracking-[0.4em] text-[var(--espresso)] transition-all duration-300 hover:bg-[var(--gilded-rose)] hover:text-white"
                >
                  <Search size={14} />
                  <span>{locale === "fr" ? "Rechercher" : "Search"}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/10 px-6 py-4 text-[0.6rem] uppercase tracking-[0.4em] text-white/60 transition-colors hover:border-white/30 hover:text-white"
                >
                  {locale === "fr" ? "Annuler" : "Cancel"}
                </button>
              </div>
            </form>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto border-t border-white/5">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-[0.55rem] uppercase tracking-[0.5em] text-white/40">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 rounded-full border border-white/20 border-t-[var(--gilded-rose)]"
                    />
                    <span>{locale === "fr" ? "Recherche..." : "Searching..."}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="px-8 py-6">
                  <p className="text-xs text-red-400/80">{error}</p>
                </div>
              )}

              {!loading && !error && results.length > 0 && (
                <div className="p-4">
                  <p className="px-4 pb-3 text-[0.5rem] uppercase tracking-[0.5em] text-white/30">
                    {results.length} {locale === "fr" ? "résultats" : "results"}
                  </p>
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={`/${locale}/products/${result.slug}`}
                          onClick={onClose}
                          className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/[0.03]"
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white/5">
                            {result.heroImage && (
                              <Image
                                src={result.heroImage}
                                alt={result.name}
                                fill
                                sizes="64px"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-[0.5rem] uppercase tracking-[0.5em] text-[var(--gilded-rose)]/70">
                              {result.category ?? "Maison Aurèle"}
                            </p>
                            <p className="font-display text-lg text-white group-hover:text-[var(--gilded-rose)] transition-colors">
                              {result.name}
                            </p>
                            <p className="text-[0.55rem] uppercase tracking-[0.35em] text-white/40">
                              {formatPriceLabel(result.priceCents, locale)}
                            </p>
                          </div>
                          <svg
                            className="h-4 w-4 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <Link
                      href={`/${locale}/search?q=${encodeURIComponent(value)}`}
                      onClick={onClose}
                      className="group flex items-center justify-center gap-2 py-3 text-[0.55rem] uppercase tracking-[0.5em] text-white/50 transition-colors hover:text-white"
                    >
                      <span>{locale === "fr" ? "Voir tous les résultats" : "View all results"}</span>
                      <svg
                        className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}

              {!loading && !error && value.trim() && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-[0.55rem] uppercase tracking-[0.5em] text-white/40">
                    {locale === "fr" ? "Aucun résultat pour" : "No results for"}
                  </p>
                  <p className="mt-2 font-display text-lg text-white/60">"{value}"</p>
                  <p className="mt-4 text-xs text-white/30">
                    {locale === "fr" ? "Essayez un autre terme de recherche" : "Try a different search term"}
                  </p>
                </div>
              )}

              {!value.trim() && !loading && (
                <div className="px-8 py-8">
                  <p className="mb-4 text-[0.5rem] uppercase tracking-[0.5em] text-white/30">
                    {locale === "fr" ? "Recherches populaires" : "Popular searches"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Silk", "Cashmere", "Evening", "Couture", "Tailored"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setValue(term)}
                        className="rounded-full border border-white/10 px-4 py-2 text-[0.55rem] uppercase tracking-[0.4em] text-white/50 transition-colors hover:border-white/30 hover:text-white"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const MenuPopover = forwardRef<HTMLDivElement, MenuPopoverProps>(
  ({ open, locale, scrolled, cartCount, wishlistCount, isAuthenticated, userName, onClose, onWishlist, onCart, onSignOut }, ref) => {
    const profileLabel = isAuthenticated
      ? locale === "fr"
        ? "Espace client"
        : "Client suite"
      : locale === "fr"
        ? "Se connecter"
        : "Sign in";

    return (
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={onClose}
            />
            {/* Menu panel */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                "absolute left-4 top-[calc(100%+0.75rem)] z-50 w-[min(24rem,90vw)] overflow-hidden rounded-[2rem] border text-xs uppercase tracking-[0.35em]",
                scrolled
                  ? "border-[var(--espresso)]/5 bg-white shadow-[0_30px_80px_rgba(9,9,29,0.15)]"
                  : "border-white/10 bg-[#080808]/98 text-white shadow-[0_40px_100px_rgba(0,0,0,0.6)]",
              )}
            >
              {/* Header */}
              <div className={cn(
                "flex items-center justify-between border-b px-6 py-4",
                scrolled ? "border-[var(--espresso)]/5" : "border-white/5"
              )}>
                <p className={cn("text-[0.5rem] tracking-[0.6em]", scrolled ? "text-[var(--espresso)]/40" : "text-white/40")}>
                  {locale === "fr" ? "Navigation" : "Navigation"}
                </p>
                <button
                  onClick={onClose}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
                    scrolled
                      ? "border-[var(--espresso)]/10 text-[var(--espresso)] hover:bg-[var(--espresso)]/5"
                      : "border-white/10 text-white hover:bg-white/5"
                  )}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Navigation links */}
              <div className="p-4">
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/${locale}/${item.slug}`}
                        onClick={onClose}
                        className={cn(
                          "group flex items-center justify-between rounded-xl px-4 py-3 font-display text-[0.8rem] tracking-[0.3em] transition-all duration-300",
                          scrolled
                            ? "text-[var(--espresso)] hover:bg-[var(--espresso)]/5"
                            : "text-white/90 hover:bg-white/5",
                        )}
                      >
                        <span>{item.labels[locale]}</span>
                        <svg
                          className={cn(
                            "h-3 w-3 transition-transform duration-300 group-hover:translate-x-1",
                            scrolled ? "text-[var(--gilded-rose)]" : "text-white/50"
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className={cn("my-4 h-[1px]", scrolled ? "bg-[var(--espresso)]/5" : "bg-white/5")} />

                {/* Secondary actions */}
                <div className="space-y-1">
                  <Link
                    href={`/${locale}/appointments`}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-4 py-3 text-[0.65rem] transition-all duration-300",
                      scrolled
                        ? "text-[var(--espresso)] hover:bg-[var(--espresso)]/5"
                        : "text-white/80 hover:bg-white/5",
                    )}
                  >
                    <span className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border",
                      scrolled ? "border-[var(--gilded-rose)]/20 bg-[var(--gilded-rose)]/5" : "border-white/10 bg-white/5"
                    )}>
                      ✦
                    </span>
                    <span>{locale === "fr" ? "Prendre rendez-vous" : "Book appointment"}</span>
                  </Link>

                  <Link
                    href={isAuthenticated ? `/${locale}/account` : `/${locale}/login`}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-4 py-3 text-[0.65rem] transition-all duration-300",
                      scrolled
                        ? "text-[var(--espresso)] hover:bg-[var(--espresso)]/5"
                        : "text-white/80 hover:bg-white/5",
                    )}
                  >
                    <span className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border",
                      scrolled ? "border-[var(--espresso)]/10" : "border-white/10"
                    )}>
                      <UserRound size={14} />
                    </span>
                    <div className="flex flex-col">
                      <span>{profileLabel}</span>
                      {isAuthenticated && userName && (
                        <span className={cn(
                          "text-[0.5rem] tracking-[0.3em]",
                          scrolled ? "text-[var(--espresso)]/40" : "text-white/40"
                        )}>
                          {userName}
                        </span>
                      )}
                    </div>
                  </Link>

                  <button
                    onClick={onWishlist}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[0.65rem] transition-all duration-300",
                      scrolled
                        ? "text-[var(--espresso)] hover:bg-[var(--espresso)]/5"
                        : "text-white/80 hover:bg-white/5",
                    )}
                  >
                    <span className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border",
                      scrolled ? "border-[var(--espresso)]/10" : "border-white/10"
                    )}>
                      <Heart size={14} />
                    </span>
                    <span className="flex-1 text-left">{locale === "fr" ? "Wishlist" : "Wishlist"}</span>
                    {wishlistCount > 0 && (
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[0.5rem]",
                        scrolled ? "bg-[var(--espresso)]/10 text-[var(--espresso)]" : "bg-white/10 text-white"
                      )}>
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={onCart}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[0.65rem] transition-all duration-300",
                      scrolled
                        ? "text-[var(--espresso)] hover:bg-[var(--espresso)]/5"
                        : "text-white/80 hover:bg-white/5",
                    )}
                  >
                    <span className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border",
                      scrolled ? "border-[var(--espresso)]/10" : "border-white/10"
                    )}>
                      <ShoppingBag size={14} />
                    </span>
                    <span className="flex-1 text-left">{locale === "fr" ? "Panier" : "Cart"}</span>
                    {cartCount > 0 && (
                      <span className="rounded-full bg-[var(--gilded-rose)] px-2 py-0.5 text-[0.5rem] text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        onClose();
                        onSignOut?.();
                      }}
                      className={cn(
                        "mt-2 w-full rounded-xl border px-4 py-3 text-center text-[0.6rem] transition-all duration-300",
                        scrolled
                          ? "border-[var(--espresso)]/10 text-[var(--espresso)]/60 hover:bg-[var(--espresso)]/5"
                          : "border-white/10 text-white/50 hover:bg-white/5",
                      )}
                    >
                      {locale === "fr" ? "Se déconnecter" : "Sign out"}
                    </button>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className={cn(
                "border-t px-6 py-4",
                scrolled ? "border-[var(--espresso)]/5 bg-[var(--parchment)]/50" : "border-white/5 bg-white/[0.02]"
              )}>
                <p className={cn(
                  "text-center text-[0.45rem] tracking-[0.5em]",
                  scrolled ? "text-[var(--espresso)]/30" : "text-white/20"
                )}>
                  {locale === "fr" ? "Paris · London · New York" : "Paris · London · New York"}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  },
);

MenuPopover.displayName = "MenuPopover";

function MobileNavDrawer({ locale, open, onClose }: { locale: Locale; open: boolean; onClose: () => void }) {
  return (
    <div className={`fixed inset-0 z-30 transition ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`absolute left-1/2 top-16 w-[94vw] max-w-sm -translate-x-1/2 rounded-2xl sm:rounded-3xl border border-white/15 bg-[#050505] p-6 sm:p-8 text-white shadow-2xl transition-all ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/60">{locale === "fr" ? "Navigation" : "Navigation"}</p>
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/70 hover:text-white min-h-[44px]"
          >
            {locale === "fr" ? "Fermer" : "Close"}
          </button>
        </div>
        <div className="mt-6 space-y-4 text-lg font-display">
          {navItems.map((item) => (
            <Link
              key={item.slug}
              href={`/${locale}/${item.slug}`}
              onClick={onClose}
              className="flex items-center justify-between border-b border-white/10 py-4 text-white/80 hover:text-white min-h-[48px]"
            >
              <span>{item.labels[locale]}</span>
              <span>&gt;</span>
            </Link>
          ))}
          <Link
            href={`/${locale}/appointments`}
            onClick={onClose}
            className="flex items-center justify-between border-b border-white/10 py-3 text-white/80 hover:text-white"
          >
            <span>{locale === "fr" ? "Rendez-vous" : "Appointments"}</span>
            <span>&gt;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatPriceLabel(priceCents: number | null | undefined, locale: Locale) {
  if (!priceCents) return locale === "fr" ? "Sur demande" : "Upon request";
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}
