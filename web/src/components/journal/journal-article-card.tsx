"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { JournalCard } from "@/lib/data/journal";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";

type JournalArticleCardProps = {
  locale: Locale;
  entry: JournalCard;
  variant?: "default" | "featured" | "compact" | "horizontal";
  index?: number;
};

const COPY = {
  en: {
    readMore: "Read article",
    readTime: "min read",
    unreleased: "Coming soon",
  },
  fr: {
    readMore: "Lire l'article",
    readTime: "min de lecture",
    unreleased: "Bientôt",
  },
  ar: {
    readMore: "اقرأ المقال",
    readTime: "دقيقة للقراءة",
    unreleased: "قريباً",
  },
};

export function JournalArticleCard({
  locale,
  entry,
  variant = "default",
  index = 0,
}: JournalArticleCardProps) {
  const copy = COPY[locale];
  const cardRef = useRef<HTMLElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10%" });

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (variant === "compact") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((event.clientX - centerX) / rect.width);
    y.set((event.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (variant === "horizontal") {
    return (
      <HorizontalCard
        entry={entry}
        locale={locale}
        index={index}
        copy={copy}
        isInView={isInView}
        cardRef={cardRef}
      />
    );
  }

  if (variant === "compact") {
    return (
      <CompactCard
        entry={entry}
        locale={locale}
        index={index}
        copy={copy}
        isInView={isInView}
        cardRef={cardRef}
      />
    );
  }

  if (variant === "featured") {
    return (
      <FeaturedCard
        entry={entry}
        locale={locale}
        index={index}
        copy={copy}
        isInView={isInView}
        cardRef={cardRef}
        rotateX={rotateX}
        rotateY={rotateY}
        handleMouseMove={handleMouseMove}
        handleMouseLeave={handleMouseLeave}
      />
    );
  }

  // Default variant
  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="group"
    >
      <Link
        href={`/${locale}/journal/${entry.slug}`}
        className="relative flex flex-col overflow-hidden rounded-[1.8rem] border border-[var(--espresso)]/8 bg-white shadow-[0_20px_60px_rgba(20,15,10,0.06)] transition-all duration-500 hover:border-[var(--espresso)]/15 hover:shadow-[0_30px_80px_rgba(20,15,10,0.12)]"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {entry.heroImage ? (
            <Image
              src={entry.heroImage}
              alt={entry.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--espresso)]/10 to-[var(--espresso)]/5" />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
          
          {/* Category Badge */}
          <span className="absolute left-4 top-4 rounded-full border border-[var(--espresso)]/10 bg-white/90 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.35em] text-[var(--espresso)]/70 backdrop-blur-sm">
            {entry.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-[0.55rem] uppercase tracking-[0.35em] text-[var(--espresso)]/40">
            {entry.publishedAt ? (
              <>
                <Calendar className="h-3 w-3" />
                <span>{formatDate(entry.publishedAt, locale)}</span>
              </>
            ) : (
              <span>{copy.unreleased}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="mt-3 font-display text-xl leading-snug text-[var(--espresso)] transition-colors group-hover:text-[var(--espresso)]/80">
            {entry.title}
          </h3>

          {/* Standfirst */}
          {entry.standfirst && (
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--espresso)]/60">
              {entry.standfirst}
            </p>
          )}

          {/* CTA */}
          <span className="mt-4 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--espresso)]/50 transition-all group-hover:gap-3 group-hover:text-[var(--espresso)]">
            {copy.readMore}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

// Featured card variant with enhanced visuals
function FeaturedCard({
  entry,
  locale,
  index,
  copy,
  isInView,
  cardRef,
  rotateX,
  rotateY,
  handleMouseMove,
  handleMouseLeave,
}: {
  entry: JournalCard;
  locale: Locale;
  index: number;
  copy: typeof COPY.en;
  isInView: boolean;
  cardRef: React.RefObject<HTMLElement | null>;
  rotateX: ReturnType<typeof useSpring>;
  rotateY: ReturnType<typeof useSpring>;
  handleMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseLeave: () => void;
}) {
  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="group"
    >
      <Link
        href={`/${locale}/journal/${entry.slug}`}
        className="relative flex min-h-[32rem] flex-col overflow-hidden rounded-[2.5rem] border border-[var(--espresso)]/5 bg-[var(--onyx)] shadow-[0_40px_100px_rgba(20,15,10,0.2)] transition-all duration-700 hover:shadow-[0_50px_120px_rgba(20,15,10,0.3)]"
      >
        {/* Full Background Image */}
        <div className="absolute inset-0">
          {entry.heroImage && (
            <Image
              src={entry.heroImage}
              alt={entry.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover opacity-70 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--onyx)] via-[var(--onyx)]/50 to-transparent" />
        </div>

        {/* Card Number */}
        <div className="absolute right-8 top-8 font-display text-7xl text-white/5">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Category */}
        <span className="absolute left-8 top-8 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.4em] text-white backdrop-blur-sm">
          {entry.category}
        </span>

        {/* Content */}
        <div className="relative mt-auto p-8">
          <div className="flex items-center gap-4 text-[0.6rem] uppercase tracking-[0.4em] text-white/50">
            {entry.publishedAt && (
              <span>{formatDate(entry.publishedAt, locale)}</span>
            )}
            <span className="h-px w-6 bg-white/30" />
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              ~5 {copy.readTime}
            </span>
          </div>

          <h3 className="mt-4 font-display text-3xl leading-tight text-white md:text-4xl">
            {entry.title}
          </h3>

          {entry.standfirst && (
            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-white/60">
              {entry.standfirst}
            </p>
          )}

          <span className="mt-6 inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[var(--gilded-rose)] transition-all group-hover:gap-4">
            {copy.readMore}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

// Compact card variant for sidebar or lists
function CompactCard({
  entry,
  locale,
  index,
  copy,
  isInView,
  cardRef,
}: {
  entry: JournalCard;
  locale: Locale;
  index: number;
  copy: typeof COPY.en;
  isInView: boolean;
  cardRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, x: 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link
        href={`/${locale}/journal/${entry.slug}`}
        className="flex gap-4 rounded-xl p-3 transition-colors hover:bg-[var(--espresso)]/5"
      >
        {/* Thumbnail */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
          {entry.heroImage ? (
            <Image
              src={entry.heroImage}
              alt={entry.title}
              fill
              sizes="64px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--espresso)]/15 to-[var(--espresso)]/5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <span className="text-[0.5rem] uppercase tracking-[0.3em] text-[var(--espresso)]/40">
            {entry.category}
          </span>
          <h4 className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-[var(--espresso)] transition-colors group-hover:text-[var(--espresso)]/80">
            {entry.title}
          </h4>
        </div>
      </Link>
    </motion.article>
  );
}

// Horizontal card variant for featured sections
function HorizontalCard({
  entry,
  locale,
  index,
  copy,
  isInView,
  cardRef,
}: {
  entry: JournalCard;
  locale: Locale;
  index: number;
  copy: typeof COPY.en;
  isInView: boolean;
  cardRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group"
    >
      <Link
        href={`/${locale}/journal/${entry.slug}`}
        className="flex flex-col gap-6 overflow-hidden rounded-[2rem] border border-[var(--espresso)]/8 bg-white p-4 shadow-[0_20px_60px_rgba(20,15,10,0.06)] transition-all duration-500 hover:border-[var(--espresso)]/15 hover:shadow-[0_30px_80px_rgba(20,15,10,0.1)] md:flex-row md:p-0"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] md:aspect-auto md:w-2/5 md:rounded-none md:rounded-l-[2rem]">
          {entry.heroImage ? (
            <Image
              src={entry.heroImage}
              alt={entry.title}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--espresso)]/10 to-[var(--espresso)]/5" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center p-4 md:p-8">
          <span className="text-[0.55rem] uppercase tracking-[0.35em] text-[var(--espresso)]/40">
            {entry.category}
          </span>

          <h3 className="mt-2 font-display text-2xl leading-snug text-[var(--espresso)] md:text-3xl">
            {entry.title}
          </h3>

          {entry.standfirst && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--espresso)]/60">
              {entry.standfirst}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[0.55rem] uppercase tracking-[0.35em] text-[var(--espresso)]/40">
              {entry.publishedAt && (
                <span>{formatDate(entry.publishedAt, locale)}</span>
              )}
            </div>

            <span className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--espresso)]/50 transition-all group-hover:gap-3 group-hover:text-[var(--espresso)]">
              {copy.readMore}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function formatDate(date: Date | string | null, locale: Locale): string {
  if (!date) return "";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}
