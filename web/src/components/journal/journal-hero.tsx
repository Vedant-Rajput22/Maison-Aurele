"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, ScrollTrigger, MOTION_DEFAULTS, prefersReducedMotion, cleanupScrollTriggers } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { JournalCard } from "@/lib/data/journal";
import { ArrowRight, Clock, Calendar } from "lucide-react";

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type JournalHeroProps = {
  locale: Locale;
  featuredEntry: JournalCard | null;
  supportingEntries: JournalCard[];
};

const COPY = {
  en: {
    kicker: "Journal",
    subtitle: "Editorial maps & correspondences",
    manifesto: "Films, essays, and immersive maps that extend our collections between Paris, the Riviera, and partner ateliers.",
    cta: "Read the story",
    featured: "Featured Chronicle",
    latest: "Latest Entries",
    explore: "Explore all stories",
    readTime: "min read",
  },
  fr: {
    kicker: "Journal",
    subtitle: "Cartes éditoriales et correspondances",
    manifesto: "Films, essais et cartes immersives qui prolongent nos collections entre Paris, la Riviera et nos ateliers.",
    cta: "Lire l'histoire",
    featured: "Chronique à la une",
    latest: "Dernières entrées",
    explore: "Explorer toutes les histoires",
    readTime: "min de lecture",
  },
  ar: {
    kicker: "المجلة",
    subtitle: "خرائط تحريرية ومراسلات",
    manifesto: "أفلام ومقالات وخرائط غامرة تمتد بمجموعاتنا بين باريس والريفييرا وورش الحرفيين الشريكة.",
    cta: "اقرأ القصة",
    featured: "الموضوع المميز",
    latest: "أحدث المقالات",
    explore: "استكشف جميع القصص",
    readTime: "دقيقة للقراءة",
  },
};

export function JournalHero({ locale, featuredEntry, supportingEntries }: JournalHeroProps) {
  const copy = COPY[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Pinned hero with parallax effect
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current || !heroImageRef.current) return;

    const section = sectionRef.current;
    const heroImage = heroImageRef.current;
    const content = contentRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=100%",
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      },
    });

    tlRef.current = tl;

    // Scale and fade hero image
    tl.to(heroImage, {
      scale: 1.15,
      opacity: 0.4,
      ease: "none",
    }, 0);

    // Fade content
    if (content) {
      tl.to(content, {
        opacity: 0,
        y: -80,
        ease: "none",
      }, 0);
    }

    return () => {
      // Kill the timeline and its scrolltrigger, reverting pinned elements
      if (tlRef.current) {
        const st = tlRef.current.scrollTrigger;
        if (st) {
          st.kill(true); // true reverts pinned element to original position
        }
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, []);

  // Additional cleanup on unmount using layout effect for synchronous execution
  useIsomorphicLayoutEffect(() => {
    return () => {
      if (tlRef.current) {
        const st = tlRef.current.scrollTrigger;
        if (st) {
          st.kill(true);
        }
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, []);

  if (!featuredEntry) {
    return (
      <section className="relative min-h-[60vh] bg-[var(--onyx)] px-6 py-24 md:px-12">
        <div className="mx-auto max-w-screen-xl text-center text-white">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block text-xs uppercase tracking-[0.6em] text-white/50"
          >
            {copy.kicker}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-8 font-display text-5xl leading-tight md:text-6xl lg:text-7xl"
          >
            {copy.subtitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/60"
          >
            {copy.manifesto}
          </motion.p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative isolate h-screen w-full overflow-hidden bg-[var(--onyx)]"
    >
      {/* Background Image with Parallax */}
      <div
        ref={heroImageRef}
        className="absolute inset-0 will-change-transform"
      >
        {featuredEntry.heroImage && (
          <Image
            src={featuredEntry.heroImage}
            alt={featuredEntry.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--onyx)] via-[var(--onyx)]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--onyx)]/60 via-transparent to-[var(--onyx)]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,var(--onyx)_100%)]" />
      </div>

      {/* Film Grain Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative mx-auto flex h-full max-w-screen-2xl flex-col justify-end px-6 pb-24 pt-32 text-white will-change-transform md:px-12 lg:pb-32"
      >
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4"
        >
          <span className="text-xs uppercase tracking-[0.6em] text-[var(--gilded-rose)]">
            {copy.featured}
          </span>
          <span className="h-px w-16 bg-gradient-to-r from-[var(--gilded-rose)] to-transparent" />
        </motion.div>

        {/* Category Badge */}
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.4em] text-white/70 backdrop-blur-sm"
        >
          {featuredEntry.category}
        </motion.span>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl font-display text-4xl leading-[1.1] md:text-5xl lg:text-6xl xl:text-7xl"
        >
          {featuredEntry.title}
        </motion.h1>

        {/* Standfirst */}
        {featuredEntry.standfirst && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
          >
            {featuredEntry.standfirst}
          </motion.p>
        )}

        {/* Metadata & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center gap-8"
        >
          <div className="flex items-center gap-6 text-xs uppercase tracking-[0.4em] text-white/50">
            {featuredEntry.publishedAt && (
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(featuredEntry.publishedAt, locale)}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              ~6 {copy.readTime}
            </span>
          </div>

          <Link
            href={`/${locale}/journal/${featuredEntry.slug}`}
            className="group inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-xs uppercase tracking-[0.4em] text-white backdrop-blur-sm transition-all duration-500 hover:border-white/50 hover:bg-white/10"
          >
            <span>{copy.cta}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Supporting Entries Preview */}
        {supportingEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12 hidden border-t border-white/10 pt-8 lg:block"
          >
            <span className="text-xs uppercase tracking-[0.4em] text-white/40">
              {copy.latest}
            </span>
            <div className="mt-4 flex gap-8">
              {supportingEntries.slice(0, 2).map((entry, index) => (
                <Link
                  key={entry.id}
                  href={`/${locale}/journal/${entry.slug}`}
                  className="group max-w-xs"
                >
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  >
                    <span className="text-[0.6rem] uppercase tracking-[0.35em] text-white/40">
                      {entry.category}
                    </span>
                    <h3 className="mt-1 text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                      {entry.title}
                    </h3>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress > 0.1 ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
            {locale === "fr" ? "Défiler" : "Scroll"}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-[1px] bg-gradient-to-b from-white/40 to-transparent"
          />
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--gilded-rose)] to-white/60"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </section>
  );
}

function formatDate(date: Date | string | null, locale: Locale): string {
  if (!date) return "";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
}
