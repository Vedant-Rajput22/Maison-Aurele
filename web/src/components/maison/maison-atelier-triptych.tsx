"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type AtelierChapter = {
  id: string;
  image: string;
  videoUrl?: string;
  titleFr: string;
  titleEn: string;
  bodyFr: string;
  bodyEn: string;
  detailsFr: string[];
  detailsEn: string[];
};

type Props = {
  locale: Locale;
  chapters: AtelierChapter[];
};

const COPY = {
  en: {
    kicker: "Atelier triptych",
    title: "Three scenes, one maison",
    chapter: "Chapter",
    explore: "Explore",
    craftsmanship: "Craftsmanship details",
  },
  fr: {
    kicker: "Triptyque d'ateliers",
    title: "Trois scènes pour une même maison",
    chapter: "Chapitre",
    explore: "Explorer",
    craftsmanship: "Détails artisanaux",
  },
} as const;

export function MaisonAtelierTriptych({ locale, chapters }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLElement>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <ScrollReveal>
      <section ref={containerRef} className="relative overflow-hidden bg-[var(--parchment)] py-32">
        {/* Decorative background */}
        <motion.div
          style={{ y: backgroundY }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(218,200,182,0.4),transparent_60%)]" />
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(218,200,182,0.3),transparent_60%)]" />
        </motion.div>

        <div className="relative mx-auto max-w-screen-2xl px-6 md:px-12">
          {/* Header */}
          <div className="mb-16 flex items-end justify-between">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-ink/30" />
                <span className="text-[0.6rem] uppercase tracking-[0.5em] text-ink/50">
                  {copy.kicker}
                </span>
              </div>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">{copy.title}</h2>
            </motion.div>

            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="hidden text-[0.6rem] uppercase tracking-[0.5em] text-ink/40 md:block"
            >
              01 — 0{chapters.length}
            </motion.span>
          </div>

          {/* Chapters grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {chapters.map((chapter, index) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                locale={locale}
                index={index}
                copy={copy}
                isExpanded={expandedChapter === chapter.id}
                onToggle={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function ChapterCard({
  chapter,
  locale,
  index,
  copy,
  isExpanded,
  onToggle,
}: {
  chapter: AtelierChapter;
  locale: Locale;
  index: number;
  copy: { kicker: string; title: string; chapter: string; explore: string; craftsmanship: string };
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  const title = locale === "fr" ? chapter.titleFr : chapter.titleEn;
  const body = locale === "fr" ? chapter.bodyFr : chapter.bodyEn;
  const details = locale === "fr" ? chapter.detailsFr : chapter.detailsEn;

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      style={{ y }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-[2.5rem] border border-ink/8 bg-white shadow-[0_30px_100px_rgba(16,10,8,0.1)] transition-all duration-500 group-hover:shadow-[0_50px_130px_rgba(16,10,8,0.18)]">
        {/* Image */}
        <div className="relative h-80 overflow-hidden">
          <motion.div style={{ scale: imageScale }} className="absolute inset-0">
            <Image
              src={chapter.image}
              alt={title}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-700"
              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Chapter number */}
          <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            <span className="font-display text-lg text-white">0{index + 1}</span>
          </div>

          {/* Hover overlay with video preview */}
          <AnimatePresence>
            {isHovered && chapter.videoUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/30"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-sm"
                >
                  <ArrowRight className="text-white" size={24} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Title on image */}
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-[0.55rem] uppercase tracking-[0.5em] text-white/60">
              {copy.chapter} — {chapter.id.toUpperCase()}
            </p>
            <h3 className="mt-2 font-display text-2xl text-white">{title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm leading-relaxed text-ink/70">{body}</p>

          {/* Expand button */}
          <button
            onClick={onToggle}
            className="mt-4 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-ink/50 transition hover:text-ink"
          >
            <Plus
              size={14}
              className={`transition-transform duration-300 ${isExpanded ? "rotate-45" : ""}`}
            />
            {copy.craftsmanship}
          </button>

          {/* Expandable details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                  {details.map((detail, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--gilded-rose)]" />
                      <p className="text-sm text-ink/60">{detail}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}
