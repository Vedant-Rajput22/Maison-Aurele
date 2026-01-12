"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { gsap, ScrollTrigger, MOTION_DEFAULTS, prefersReducedMotion, cleanupScrollTriggers } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { JournalCard } from "@/lib/data/journal";
import { ArrowLeft, ArrowRight, Clock, ArrowUpRight } from "lucide-react";

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type JournalEditorialCarouselProps = {
  locale: Locale;
  entries: JournalCard[];
  title?: string;
};

const COPY = {
  en: {
    section: "Editorial Carousel",
    subtitle: "Stories in motion",
    readMore: "Discover",
    readTime: "min read",
    dragHint: "Drag to explore",
    of: "of",
  },
  fr: {
    section: "Carrousel éditorial",
    subtitle: "Histoires en mouvement",
    readMore: "Découvrir",
    readTime: "min de lecture",
    dragHint: "Glisser pour explorer",
    of: "sur",
  },
  ar: {
    section: "العرض التحريري",
    subtitle: "قصص متحركة",
    readMore: "اكتشف",
    readTime: "دقيقة للقراءة",
    dragHint: "اسحب للاستكشاف",
    of: "من",
  },
};

export function JournalEditorialCarousel({ locale, entries, title }: JournalEditorialCarouselProps) {
  const copy = COPY[locale];
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Smooth horizontal scroll
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!containerRef.current || !trackRef.current) return;

    const container = containerRef.current;
    const track = trackRef.current;
    const scrollWidth = track.scrollWidth - container.offsetWidth;

    const tween = gsap.to(track, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top 20%",
        end: () => `+=${scrollWidth * 1.5}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const newIndex = Math.round(self.progress * (entries.length - 1));
          setActiveIndex(newIndex);
        },
      },
    });

    tweenRef.current = tween;

    return () => {
      // Kill the tween and its scrolltrigger, reverting pinned elements
      if (tweenRef.current) {
        const st = ScrollTrigger.getById(tweenRef.current.scrollTrigger?.vars?.id as string) || tweenRef.current.scrollTrigger;
        if (st) {
          (st as ScrollTrigger).kill(true); // true reverts pinned element
        }
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, [entries.length]);

  // Additional cleanup on unmount using layout effect
  useIsomorphicLayoutEffect(() => {
    return () => {
      if (tweenRef.current) {
        const st = tweenRef.current.scrollTrigger;
        if (st) {
          (st as ScrollTrigger).kill(true);
        }
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, []);

  if (entries.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--onyx)] py-24 md:py-32">
      {/* Section Header */}
      <div className="mx-auto max-w-screen-2xl px-6 md:px-12">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.5em] text-white/40"
            >
              {title || copy.section}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 font-display text-4xl text-white md:text-5xl"
            >
              {copy.subtitle}
            </motion.h2>
          </div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden items-center gap-4 md:flex"
          >
            <span className="font-display text-3xl text-white">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <div className="h-px w-16 bg-white/20">
              <motion.div
                className="h-full bg-[var(--gilded-rose)]"
                style={{ width: `${((activeIndex + 1) / entries.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-white/40">
              {copy.of} {String(entries.length).padStart(2, "0")}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div ref={containerRef} className="relative h-[80vh] overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full gap-8 px-6 will-change-transform md:px-12"
          style={{ width: `${entries.length * 85}vw` }}
        >
          {entries.map((entry, index) => (
            <CarouselCard
              key={entry.id}
              entry={entry}
              locale={locale}
              index={index}
              isActive={index === activeIndex}
              copy={copy}
            />
          ))}
        </div>
      </div>

      {/* Drag Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center md:hidden"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.4em] text-white/30">
          {copy.dragHint}
        </span>
      </motion.div>
    </section>
  );
}

function CarouselCard({
  entry,
  locale,
  index,
  isActive,
  copy,
}: {
  entry: JournalCard;
  locale: Locale;
  index: number;
  isActive: boolean;
  copy: typeof COPY.en;
}) {
  return (
    <motion.article
      className={cn(
        "relative h-full w-[75vw] flex-shrink-0 overflow-hidden rounded-[2.5rem] transition-all duration-700 md:w-[60vw] lg:w-[50vw]",
        isActive ? "scale-100 opacity-100" : "scale-95 opacity-60"
      )}
    >
      <Link
        href={`/${locale}/journal/${entry.slug}`}
        className="group relative block h-full"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          {entry.heroImage && (
            <Image
              src={entry.heroImage}
              alt={entry.title}
              fill
              sizes="(min-width: 1024px) 50vw, (min-width: 768px) 60vw, 75vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>

        {/* Card Number */}
        <div className="absolute left-8 top-8 font-display text-6xl text-white/10 md:text-8xl">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Category Badge */}
        <span className="absolute right-8 top-8 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.4em] text-white backdrop-blur-sm">
          {entry.category}
        </span>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="flex items-center gap-4 text-[0.6rem] uppercase tracking-[0.4em] text-white/50">
            {entry.publishedAt && (
              <span>{formatDate(entry.publishedAt, locale)}</span>
            )}
            <span className="h-px w-8 bg-white/30" />
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              ~5 {copy.readTime}
            </span>
          </div>

          <h3 className="mt-4 max-w-xl font-display text-3xl leading-tight text-white md:text-4xl lg:text-5xl">
            {entry.title}
          </h3>

          {entry.standfirst && (
            <p className="mt-4 max-w-lg line-clamp-2 text-sm leading-relaxed text-white/60 md:text-base">
              {entry.standfirst}
            </p>
          )}

          <motion.span
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.4em] text-white backdrop-blur-sm transition-all duration-500 group-hover:border-white/50 group-hover:bg-white/10"
          >
            {copy.readMore}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
      </Link>
    </motion.article>
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
