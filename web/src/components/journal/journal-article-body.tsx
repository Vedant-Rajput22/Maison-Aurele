"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { JournalBlock } from "@/lib/data/journal";
import { Quote } from "lucide-react";

type JournalArticleBodyProps = {
  locale: Locale;
  paragraphs: string[];
  blocks: JournalBlock[];
};

const COPY = {
  en: {
    correspondences: "Correspondences",
    correspondencesText: "These paragraphs are paired with sound maps and projection slides in our galleries.",
    locations: ["Paris Dawn", "Riviera 7am", "Faubourg Salon"],
    visualFragments: "Visual Fragments",
    visualFragmentsSubtitle: "Atelier & light",
    excerpt: "Excerpt",
  },
  fr: {
    correspondences: "Correspondances",
    correspondencesText: "Ces paragraphes s'accompagnent de cartes sonores et de diapositives dans nos galeries.",
    locations: ["Paris Aube", "Riviera 07h", "Salon Faubourg"],
    visualFragments: "Fragments visuels",
    visualFragmentsSubtitle: "Atelier & lumière",
    excerpt: "Extrait",
  },
  ar: {
    correspondences: "المراسلات",
    correspondencesText: "هذه الفقرات مقترنة بخرائط صوتية وشرائح عرض في معارضنا.",
    locations: ["فجر باريس", "الريفييرا ٧ صباحاً", "صالون فوبورغ"],
    visualFragments: "شظايا بصرية",
    visualFragmentsSubtitle: "الأتيليه والضوء",
    excerpt: "مقتطف",
  },
};

export function JournalArticleBody({ locale, paragraphs, blocks }: JournalArticleBodyProps) {
  const copy = COPY[locale];
  const bodyRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(bodyRef, { once: true, margin: "-10%" });

  return (
    <article ref={bodyRef} className="bg-[var(--parchment)]">
      {/* Main Content */}
      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-screen-xl gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          {/* Article Body */}
          <div className="space-y-8">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="text-lg leading-[1.9] text-[var(--espresso)]/80 md:text-xl md:leading-[1.9]"
              >
                {/* Drop cap for first paragraph */}
                {index === 0 && paragraph.length > 0 ? (
                  <>
                    <span className="float-left mr-3 mt-1 font-display text-6xl leading-none text-[var(--espresso)]">
                      {paragraph[0]}
                    </span>
                    {paragraph.slice(1)}
                  </>
                ) : (
                  paragraph
                )}
              </motion.p>
            ))}

            {/* Pull Quote (if we have enough content) */}
            {paragraphs.length > 3 && (
              <motion.blockquote
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="my-12 border-l-2 border-[var(--gilded-rose)] pl-8"
              >
                <Quote className="mb-4 h-8 w-8 text-[var(--gilded-rose)]/30" />
                <p className="font-display text-2xl leading-relaxed text-[var(--espresso)] md:text-3xl">
                  {locale === "fr"
                    ? "Chaque silhouette raconte une histoire, chaque tissu porte une mémoire."
                    : "Every silhouette tells a story, every fabric carries a memory."}
                </p>
                <cite className="mt-4 block text-sm uppercase tracking-[0.35em] text-[var(--espresso)]/40 not-italic">
                  — Maison Aurèle
                </cite>
              </motion.blockquote>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="rounded-[2rem] border border-[var(--espresso)]/8 bg-white/80 p-6 shadow-[0_20px_60px_rgba(20,15,10,0.06)] backdrop-blur"
            >
              <span className="text-xs uppercase tracking-[0.5em] text-[var(--espresso)]/40">
                {copy.correspondences}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-[var(--espresso)]/60">
                {copy.correspondencesText}
              </p>
              <ul className="mt-6 space-y-2">
                {copy.locations.map((location, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-[var(--espresso)]/50"
                  >
                    <span className="h-1 w-1 rounded-full bg-[var(--gilded-rose)]" />
                    {location}
                  </li>
                ))}
              </ul>
            </motion.div>
          </aside>
        </div>
      </section>

      {/* Visual Blocks Section */}
      {blocks.length > 0 && (
        <JournalBlocksSection locale={locale} blocks={blocks} copy={copy} />
      )}
    </article>
  );
}

function JournalBlocksSection({
  locale,
  blocks,
  copy,
}: {
  locale: Locale;
  blocks: JournalBlock[];
  copy: typeof COPY.en;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section ref={sectionRef} className="border-t border-[var(--espresso)]/10 px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-screen-xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12"
        >
          <span className="text-xs uppercase tracking-[0.5em] text-[var(--espresso)]/40">
            {copy.visualFragments}
          </span>
          <h2 className="mt-3 font-display text-3xl text-[var(--espresso)] md:text-4xl">
            {copy.visualFragmentsSubtitle}
          </h2>
        </motion.div>

        {/* Blocks Grid - Masonry-like layout */}
        <div className="grid gap-8 md:grid-cols-2">
          {blocks.map((block, index) => (
            <JournalBlockCard
              key={block.id}
              block={block}
              index={index}
              locale={locale}
              isInView={isInView}
              copy={copy}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function JournalBlockCard({
  block,
  index,
  locale,
  isInView,
  copy,
}: {
  block: JournalBlock;
  index: number;
  locale: Locale;
  isInView: boolean;
  copy: typeof COPY.en;
}) {
  // Image block
  if (block.image) {
    return (
      <motion.figure
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.15 }}
        className={cn(
          "group overflow-hidden rounded-[2rem] border border-[var(--espresso)]/8 bg-white shadow-[0_30px_80px_rgba(20,15,10,0.08)]",
          // Make some cards span full width for visual variety
          index % 3 === 0 && "md:col-span-2"
        )}
      >
        <div className={cn(
          "relative overflow-hidden",
          index % 3 === 0 ? "h-[400px] md:h-[500px]" : "h-80"
        )}>
          <Image
            src={block.image}
            alt={block.caption || block.headline || ""}
            fill
            sizes={index % 3 === 0 ? "(min-width: 768px) 100vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        
        <figcaption className="space-y-2 p-6">
          {block.headline && (
            <h3 className="font-display text-xl text-[var(--espresso)]">
              {block.headline}
            </h3>
          )}
          {(block.body || block.caption) && (
            <p className="text-sm leading-relaxed text-[var(--espresso)]/60">
              {block.body || block.caption}
            </p>
          )}
        </figcaption>
      </motion.figure>
    );
  }

  // Quote block
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="flex flex-col justify-center rounded-[2rem] bg-[var(--onyx)] p-8 text-white shadow-[0_30px_80px_rgba(20,15,10,0.12)] md:p-10"
    >
      <Quote className="mb-4 h-8 w-8 text-[var(--gilded-rose)]/50" />
      <p className="font-display text-xl leading-relaxed md:text-2xl">
        {block.body || block.headline}
      </p>
      <span className="mt-6 text-xs uppercase tracking-[0.35em] text-white/40">
        {copy.excerpt} — {String(index + 1).padStart(2, "0")}
      </span>
    </motion.blockquote>
  );
}

/**
 * Inline image component for rich content
 */
export function JournalInlineImage({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={cn("my-12", className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 800px, 100vw"
          className="object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-[var(--espresso)]/50">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
