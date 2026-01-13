"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type { Locale } from "@/lib/i18n/config";
import { gsap, prefersReducedMotion, MOTION_DEFAULTS } from "@/lib/motion";

const footerLinks = {
  maison: {
    title: { fr: "La Maison", en: "The Maison" },
    links: [
      { label: { fr: "Notre Histoire", en: "Our Story" }, href: "/maison" },
      { label: { fr: "L'Atelier", en: "The Atelier" }, href: "/maison#atelier" },
      { label: { fr: "Savoir-Faire", en: "Craftsmanship" }, href: "/maison#savoirfaire" },
      { label: { fr: "Journal", en: "Journal" }, href: "/journal" },
    ],
  },
  collections: {
    title: { fr: "Collections", en: "Collections" },
    links: [
      { label: { fr: "Haute Couture", en: "Haute Couture" }, href: "/collections/haute-couture" },
      { label: { fr: "Prêt-à-Porter", en: "Ready-to-Wear" }, href: "/collections/pret-a-porter" },
      { label: { fr: "Accessoires", en: "Accessories" }, href: "/collections/accessories" },
      { label: { fr: "Boutique", en: "Shop" }, href: "/shop" },
    ],
  },
  account: {
    title: { fr: "Compte", en: "Account" },
    links: [
      { label: { fr: "Se connecter", en: "Sign in" }, href: "/login" },
      { label: { fr: "Créer un compte", en: "Create account" }, href: "/register" },
      { label: { fr: "Mon compte", en: "My account" }, href: "/account" },
      { label: { fr: "Prendre rendez-vous", en: "Book appointment" }, href: "/appointments" },
    ],
  },
  help: {
    title: { fr: "Aide", en: "Help" },
    links: [
      { label: { fr: "Contact", en: "Contact" }, href: "/contact" },
      { label: { fr: "FAQ", en: "FAQ" }, href: "/faq" },
      { label: { fr: "Livraison", en: "Shipping" }, href: "/shipping" },
      { label: { fr: "Retours", en: "Returns" }, href: "/returns" },
    ],
  },
};

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

const atelierLocations = [
  { city: "Paris", address: "8 Rue du Faubourg Saint-Honoré" },
  { city: "London", address: "23 Mount Street, Mayfair" },
  { city: "New York", address: "721 Fifth Avenue" },
];

export function SiteFooter({ locale }: { locale: Locale }) {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!footerRef.current || !isInView) return;

    const footer = footerRef.current;
    const columns = footer.querySelectorAll("[data-footer-column]");

    gsap.fromTo(
      columns,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: MOTION_DEFAULTS.ease.luxury,
      }
    );
  }, [isInView]);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-white/5"
      style={{
        backgroundColor: "#0a0807",
        color: "var(--parchment)",
      }}
    >
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(209,169,130,0.04),transparent_50%)]" />

      {/* Top newsletter section */}
      <div className="relative border-b border-white/5">
        <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-16 md:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[0.55rem] uppercase tracking-[0.7em] text-[var(--gilded-rose)]">
                {locale === "fr" ? "Restez informé" : "Stay informed"}
              </p>
              <h3 className="mt-3 font-display text-2xl leading-tight text-white sm:text-3xl md:text-4xl">
                {locale === "fr"
                  ? "Rejoignez le cercle Aurèle"
                  : "Join the Aurèle circle"}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50">
                {locale === "fr"
                  ? "Recevez en avant-première nos nouvelles collections, invitations aux événements exclusifs et les dernières actualités de la Maison."
                  : "Be the first to discover new collections, exclusive event invitations, and the latest news from the Maison."}
              </p>
            </motion.div>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex flex-col gap-4 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder={locale === "fr" ? "Votre email" : "Your email"}
                className="flex-1 border-b border-white/20 bg-transparent py-4 text-sm tracking-[0.1em] text-white outline-none placeholder:text-white/30 focus:border-[var(--gilded-rose)]"
              />
              <button
                type="submit"
                className="group relative overflow-hidden rounded-full border border-white/20 bg-white/5 px-6 py-4 text-[0.6rem] uppercase tracking-[0.4em] text-white transition-all duration-500 hover:border-[var(--gilded-rose)] hover:bg-[var(--gilded-rose)]/10 min-h-[44px] sm:px-8"
              >
                {locale === "fr" ? "S'inscrire" : "Subscribe"}
              </button>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="relative mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-16 md:px-12">
        <div className="grid gap-8 sm:gap-12 grid-cols-2 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div data-footer-column className="col-span-2 lg:col-span-2">
            <Link href={`/${locale}`} className="font-display text-lg sm:text-xl tracking-[0.5em] text-white">
              Maison Aurèle
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/40">
              {locale === "fr"
                ? "Haute couture française depuis 1924. L'excellence artisanale au service de l'élégance intemporelle."
                : "French haute couture since 1924. Artisanal excellence in service of timeless elegance."}
            </p>

            {/* Social links */}
            <div className="mt-8 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:border-[var(--gilded-rose)]/50 hover:text-[var(--gilded-rose)] min-w-[44px] min-h-[44px]"
                >
                  <span className="text-[0.5rem] uppercase tracking-wider">
                    {social.label.slice(0, 2)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} data-footer-column>
              <h4 className="text-[0.55rem] uppercase tracking-[0.5em] text-white/30">
                {section.title[locale]}
              </h4>
              <ul className="mt-6 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="group flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                    >
                      <span className="h-[1px] w-0 bg-[var(--gilded-rose)] transition-all duration-300 group-hover:w-3" />
                      <span>{link.label[locale]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Ateliers */}
        <div className="mt-16 border-t border-white/5 pt-12">
          <h4 className="text-[0.55rem] uppercase tracking-[0.6em] text-white/30">
            {locale === "fr" ? "Nos Ateliers" : "Our Ateliers"}
          </h4>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {atelierLocations.map((location, index) => (
              <motion.div
                key={location.city}
                data-footer-column
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                className="group"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--gilded-rose)]/20 text-[0.5rem] text-[var(--gilded-rose)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-lg text-white">{location.city}</span>
                </div>
                <p className="mt-3 pl-11 text-sm text-white/40">{location.address}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-8 md:flex-row md:justify-between md:px-12">
          {/* Copyright */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[0.5rem] uppercase tracking-[0.4em] text-white/30 md:justify-start">
            <span>© {new Date().getFullYear()} Maison Aurèle</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/20 md:block" />
            <span>{locale === "fr" ? "Tous droits réservés" : "All rights reserved"}</span>
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[0.5rem] uppercase tracking-[0.4em] text-white/30">
            <Link href={`/${locale}/privacy`} className="transition-colors hover:text-white/60">
              {locale === "fr" ? "Confidentialité" : "Privacy"}
            </Link>
            <Link href={`/${locale}/terms`} className="transition-colors hover:text-white/60">
              {locale === "fr" ? "Conditions" : "Terms"}
            </Link>
            <Link href={`/${locale}/cookies`} className="transition-colors hover:text-white/60">
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Large decorative text */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 select-none">
        <span className="font-display text-[20vw] uppercase leading-none text-white/[0.02]">
          Aurèle
        </span>
      </div>
    </footer>
  );
}
