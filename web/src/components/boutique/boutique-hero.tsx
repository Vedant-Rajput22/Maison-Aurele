"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  locale: Locale;
};

const COPY = {
  en: {
    kicker: "Paris flagship",
    title: "Where couture comes alive",
    subtitle: "31 Rue du Faubourg Saint-Honoré, Paris 8th",
    hours: "Open Tuesday to Saturday · 11:00 — 19:30",
    bookVisit: "Book a private visit",
    virtualTour: "Virtual tour",
    scroll: "Explore",
  },
  fr: {
    kicker: "Boutique Paris",
    title: "Là où la couture prend vie",
    subtitle: "31 Rue du Faubourg Saint-Honoré, Paris 8ᵉ",
    hours: "Ouvert du mardi au samedi · 11h00 — 19h30",
    bookVisit: "Réserver une visite privée",
    virtualTour: "Visite virtuelle",
    scroll: "Explorer",
  },
} as const;

// Video sources for boutique hero
const BOUTIQUE_VIDEO = {
  webm: "/assets/media/boutique-interior-glide.webm",
  mp4: "/assets/media/boutique-interior-glide.mp4",
};

export function BoutiqueHero({ locale }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 0.8]);

  return (
    <section ref={containerRef} className="relative min-h-screen">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Video background */}
        <motion.div style={{ scale: videoScale }} className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          >
            <source src={BOUTIQUE_VIDEO.webm} type="video/webm" />
            <source src={BOUTIQUE_VIDEO.mp4} type="video/mp4" />
          </video>
        </motion.div>

        {/* Gradient overlays */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80"
        />

        {/* Side gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        {/* Film grain */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full">
            <filter id="boutiqueNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#boutiqueNoise)" />
          </svg>
        </div>

        {/* Content */}
        <motion.div style={{ y: contentY }} className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
          <div className="mx-auto w-full max-w-screen-2xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl space-y-8"
            >
              {/* Kicker */}
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-white/40" />
                <span className="text-[0.65rem] uppercase tracking-[0.5em] text-white/60">
                  {copy.kicker}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-5xl leading-[1.1] text-white md:text-7xl">
                {copy.title}
              </h1>

              {/* Location info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/80">
                  <MapPin size={18} className="text-[var(--gilded-rose)]" />
                  <span className="text-lg">{copy.subtitle}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Clock size={18} />
                  <span className="text-sm">{copy.hours}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <motion.a
                  href={`/${locale}/appointments`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-xs uppercase tracking-[0.3em] text-ink transition hover:bg-white/90"
                >
                  {copy.bookVisit}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 rounded-full border border-white/30 px-8 py-4 text-xs uppercase tracking-[0.3em] text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  {copy.virtualTour}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 right-8"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[0.55rem] uppercase tracking-[0.4em] text-white/50">{copy.scroll}</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-12 w-px bg-gradient-to-b from-white/50 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
