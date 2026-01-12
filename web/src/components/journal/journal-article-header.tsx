"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap, ScrollTrigger, MOTION_DEFAULTS, prefersReducedMotion, cleanupScrollTriggers } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { JournalEntry } from "@/lib/data/journal";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark } from "lucide-react";

type JournalArticleHeaderProps = {
  locale: Locale;
  entry: JournalEntry;
  readingTime?: number;
};

const COPY = {
  en: {
    kicker: "Editorial Chronicle",
    back: "Back to journal",
    readTime: "min read",
    share: "Share",
    save: "Save",
  },
  fr: {
    kicker: "Chronique éditoriale",
    back: "Retour au journal",
    readTime: "min de lecture",
    share: "Partager",
    save: "Sauvegarder",
  },
  ar: {
    kicker: "سجل تحريري",
    back: "العودة إلى المجلة",
    readTime: "دقيقة للقراءة",
    share: "مشاركة",
    save: "حفظ",
  },
};

export function JournalArticleHeader({ locale, entry, readingTime = 5 }: JournalArticleHeaderProps) {
  const copy = COPY[locale];
  const headerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Parallax effect on hero image
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  // GSAP entrance animations
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!headerRef.current || !contentRef.current) return;

    const content = contentRef.current;
    const elements = content.querySelectorAll("[data-animate]");

    gsap.fromTo(
      elements,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: MOTION_DEFAULTS.duration.slow,
        stagger: MOTION_DEFAULTS.stagger.normal,
        ease: MOTION_DEFAULTS.ease.luxury,
        delay: 0.3,
      }
    );

    return () => {
      cleanupScrollTriggers(headerRef.current);
    };
  }, []);

  return (
    <header ref={headerRef} className="relative h-[100vh] min-h-[700px] overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
        style={{ y: imageY, scale: imageScale }}
      >
        {entry.heroImage ? (
          <Image
            src={entry.heroImage}
            alt={entry.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--espresso)]/20 to-[var(--onyx)]" />
        )}

        {/* Cinematic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--onyx)] via-[var(--onyx)]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--onyx)]/60 via-transparent to-[var(--onyx)]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--onyx)_100%)] opacity-40" />
      </motion.div>

      {/* Film Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Back Navigation */}
      <div className="absolute left-6 top-24 z-20 md:left-12 md:top-28">
        <Link
          href={`/${locale}/journal`}
          className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs uppercase tracking-[0.35em] text-white/70 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {copy.back}
        </Link>
      </div>

      {/* Share & Save Actions */}
      <div className="absolute right-6 top-24 z-20 flex gap-3 md:right-12 md:top-28">
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:text-white">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">{copy.share}</span>
        </button>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:text-white">
          <Bookmark className="h-4 w-4" />
          <span className="sr-only">{copy.save}</span>
        </button>
      </div>

      {/* Content */}
      <motion.div
        ref={contentRef}
        className="relative mx-auto flex h-full max-w-screen-xl flex-col justify-end px-6 pb-20 text-white will-change-transform md:px-12 md:pb-28"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Kicker */}
        <div data-animate className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-[0.5em] text-[var(--gilded-rose)]">
            {copy.kicker}
          </span>
          <span className="h-px w-12 bg-gradient-to-r from-[var(--gilded-rose)] to-transparent" />
        </div>

        {/* Category Badge */}
        <span
          data-animate
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.4em] text-white/80 backdrop-blur-sm"
        >
          {entry.category}
        </span>

        {/* Title */}
        <h1
          data-animate
          className="mt-6 max-w-4xl font-display text-4xl leading-[1.1] md:text-5xl lg:text-6xl xl:text-7xl"
        >
          {entry.title}
        </h1>

        {/* Standfirst */}
        {entry.standfirst && (
          <p
            data-animate
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
          >
            {entry.standfirst}
          </p>
        )}

        {/* Metadata */}
        <div
          data-animate
          className="mt-8 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.35em] text-white/50"
        >
          {entry.publishedAt && (
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(entry.publishedAt, locale)}
            </span>
          )}
          <span className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            ~{readingTime} {copy.readTime}
          </span>
        </div>

        {/* Decorative Line */}
        <motion.div
          className="mt-8 h-px w-24 bg-gradient-to-r from-[var(--gilded-rose)] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[0.6rem] uppercase tracking-[0.4em] text-white/30">
            {locale === "fr" ? "Défiler pour lire" : "Scroll to read"}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-[1px] bg-gradient-to-b from-white/30 to-transparent"
          />
        </div>
      </motion.div>
    </header>
  );
}

/**
 * Compact article header for shorter articles
 */
export function JournalArticleHeaderCompact({
  locale,
  entry,
  readingTime = 5,
}: JournalArticleHeaderProps) {
  const copy = COPY[locale];

  return (
    <header className="bg-[var(--parchment)] px-6 pb-12 pt-32 md:px-12 md:pt-40">
      <div className="mx-auto max-w-screen-lg">
        {/* Back Link */}
        <Link
          href={`/${locale}/journal`}
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[var(--espresso)]/50 transition-colors hover:text-[var(--espresso)]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {copy.back}
        </Link>

        {/* Category */}
        <span className="mt-8 block text-xs uppercase tracking-[0.5em] text-[var(--gilded-rose)]">
          {entry.category}
        </span>

        {/* Title */}
        <h1 className="mt-4 font-display text-4xl leading-tight text-[var(--espresso)] md:text-5xl lg:text-6xl">
          {entry.title}
        </h1>

        {/* Standfirst */}
        {entry.standfirst && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--espresso)]/60">
            {entry.standfirst}
          </p>
        )}

        {/* Metadata */}
        <div className="mt-8 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.35em] text-[var(--espresso)]/40">
          {entry.publishedAt && (
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(entry.publishedAt, locale)}
            </span>
          )}
          <span className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            ~{readingTime} {copy.readTime}
          </span>
        </div>

        {/* Hero Image */}
        {entry.heroImage && (
          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[2rem]">
            <Image
              src={entry.heroImage}
              alt={entry.title}
              fill
              priority
              sizes="(min-width: 1024px) 800px, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </header>
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
