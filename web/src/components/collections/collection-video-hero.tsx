"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Locale } from "@/lib/i18n/config";

// Video mapping based on collection slug
// Uses user-provided collection-specific videos with fallback images
const COLLECTION_VIDEOS: Record<string, { webm?: string; mp4: string; poster: string }> = {
  // Individual collection videos (user-provided)
  "nuit-parisienne": {
    mp4: "/assets/media/Nuit-Parisienne.mp4",
    poster: "/assets/media/Nuit-Parisienne.jpg",
  },
  "cote-dazur": {
    mp4: "/assets/media/Côte-d'Azur.mp4",
    poster: "/assets/media/Côte-d'Azur.jpg",
  },
  "atelier-premiere": {
    mp4: "/assets/media/Atelier-Première.mp4",
    poster: "/assets/media/Atelier-Première.jpg",
  },
  "minuit-dore": {
    mp4: "/assets/media/Minuit-Doré.mp4",
    poster: "/assets/media/Minuit-Doré.jpg",
  },
  // Default for collections listing page and any unknown collections
  default: {
    webm: "/assets/media/collection-ss-terrace.webm",
    mp4: "/assets/media/collection-ss-terrace.mp4",
    poster: "/assets/media/collection-ss-terrace.mp4",
  },
};

type Props = {
  title: string;
  description?: string | null;
  manifesto?: string | null;
  slug: string;
  locale: Locale;
  heroImage?: string | null;
  featuredProductSlug?: string;
  dropWindow?: {
    title?: string | null;
    startsAt?: Date | string | null;
    endsAt?: Date | string | null;
  } | null;
};

export function CollectionVideoHero({
  title,
  description,
  manifesto,
  slug,
  locale,
  featuredProductSlug,
  dropWindow,
}: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Determine which video to use based on slug
  const videoSrc = COLLECTION_VIDEOS[slug] || COLLECTION_VIDEOS.default;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 0.9]);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Video background with parallax */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={videoSrc.poster}
          className={`h-full w-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? "opacity-100" : "opacity-0"
            }`}
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          {videoSrc.webm && <source src={videoSrc.webm} type="video/webm" />}
          <source src={videoSrc.mp4} type="video/mp4" />
        </video>
      </motion.div>

      {/* Gradient overlays */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/40 to-noir/30"
      />

      {/* Side gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-noir/50 via-transparent to-transparent" />

      {/* Film grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
        <svg className="h-full w-full">
          <filter id="collectionNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#collectionNoise)" />
        </svg>
      </div>

      {/* Content */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto flex min-h-screen max-w-screen-2xl flex-col justify-end gap-6 px-6 pb-20 pt-32 text-white md:px-12"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[0.55rem] uppercase tracking-[0.6em] text-[var(--gilded-rose)]"
        >
          {locale === "fr" ? "Collection" : "Collection"}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl sm:text-7xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl text-lg leading-relaxed text-white/80"
        >
          {manifesto ?? description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          {featuredProductSlug && (
            <Link
              href={`/${locale}/products/${featuredProductSlug}`}
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-xs uppercase tracking-[0.4em] text-ink transition hover:bg-white/90"
            >
              {locale === "fr" ? "Acheter ce chapitre" : "Shop this chapter"}
            </Link>
          )}
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-xs uppercase tracking-[0.4em] text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            {locale === "fr" ? "Voir tout" : "View all"}
          </Link>
        </motion.div>

        {dropWindow && dropWindow.startsAt && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[0.55rem] uppercase tracking-[0.4em] text-white/50"
          >
            {dropWindow.title} ·{" "}
            {formatDropWindow(dropWindow.startsAt, dropWindow.endsAt, locale)}
          </motion.p>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-10 w-px bg-gradient-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}

function formatDropWindow(
  start: Date | string,
  end: Date | string | null | undefined,
  locale: Locale
) {
  const startDate = typeof start === "string" ? new Date(start) : start;
  const endDate = typeof end === "string" ? new Date(end) : end ?? undefined;
  if (Number.isNaN(startDate.getTime())) {
    return "";
  }
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const fmt = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", opts);
  if (!endDate || Number.isNaN(endDate.getTime())) {
    return `${fmt.format(startDate)}`;
  }
  return `${fmt.format(startDate)} — ${fmt.format(endDate)}`;
}
