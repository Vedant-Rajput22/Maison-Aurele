"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Props = {
  locale: Locale;
  collectionCount: number;
};

const COPY = {
  en: {
    kicker: "Online Boutique · Collections",
    title: "The Nuit Chapters",
    subtitle: "Where each silhouette tells a story",
    body: "Each collection unfolds like a film—numbered silhouettes, white-glove delivery, personalization on request. Discover the chapters that define Maison Aurèle.",
    scroll: "Explore chapters",
    activeChapters: "Active chapters",
    whiteGlove: "White-glove",
    ateliers: "Partner ateliers",
  },
  fr: {
    kicker: "Boutique en ligne · Collections",
    title: "Les Chapitres Nuit",
    subtitle: "Où chaque silhouette raconte une histoire",
    body: "Chaque collection se dévoile comme un film—silhouettes numérotées, livraison gants blancs, personnalisation sur demande. Découvrez les chapitres qui définissent Maison Aurèle.",
    scroll: "Explorer les chapitres",
    activeChapters: "Chapitres actifs",
    whiteGlove: "Gants blancs",
    ateliers: "Ateliers partenaires",
  },
} as const;

export function CollectionsHero({ locale, collectionCount }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-[var(--onyx)]">
      {/* Video background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/assets/media/collection-ss-terrace.webm" type="video/webm" />
          <source src="/assets/media/collection-ss-terrace.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--onyx)]/80 via-[var(--onyx)]/40 to-[var(--onyx)]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--onyx)] via-transparent to-transparent" />

        {/* Decorative circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -left-1/4 top-1/4 h-[800px] w-[800px] rounded-full bg-[var(--gilded-rose)]/10 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -right-1/4 bottom-1/4 h-[600px] w-[600px] rounded-full bg-[var(--gilded-rose)]/10 blur-[100px]"
        />
      </motion.div>

      {/* Film grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <svg className="h-full w-full">
          <filter id="collectionsNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#collectionsNoise)" />
        </svg>
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex min-h-screen flex-col justify-center px-6 md:px-12"
      >
        <div className="mx-auto w-full max-w-screen-2xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            {/* Kicker */}
            <div className="flex items-center gap-4">
              <Sparkles size={14} className="text-[var(--gilded-rose)]" />
              <span className="text-[0.65rem] uppercase tracking-[0.5em] text-[var(--gilded-rose)]">
                {copy.kicker}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-6 font-display text-6xl leading-[1.05] text-white md:text-8xl lg:text-9xl">
              {copy.title}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-6 font-display text-2xl text-white/60 md:text-3xl"
            >
              {copy.subtitle}
            </motion.p>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 max-w-2xl text-base leading-relaxed text-white/50"
            >
              {copy.body}
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-8"
            >
              <div>
                <p className="font-display text-5xl text-white">
                  {String(collectionCount).padStart(2, "0")}
                </p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                  {copy.activeChapters}
                </p>
              </div>
              <div>
                <p className="font-display text-5xl text-white">4-7</p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                  {copy.whiteGlove}
                </p>
              </div>
              <div>
                <p className="font-display text-5xl text-white">12</p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                  {copy.ateliers}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[0.55rem] uppercase tracking-[0.4em] text-white/40">
            {copy.scroll}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown size={16} className="text-white/40" />
          </motion.div>
        </div>
      </motion.div>

      {/* Side decorative text */}
      <div className="absolute bottom-1/4 right-8 hidden rotate-90 transform text-[0.5rem] uppercase tracking-[0.6em] text-white/20 lg:block">
        Maison Aurèle · {new Date().getFullYear()}
      </div>
    </section>
  );
}
