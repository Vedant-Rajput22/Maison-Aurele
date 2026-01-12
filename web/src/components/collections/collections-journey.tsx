"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BookOpen, ShoppingBag, Film } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Props = {
  locale: Locale;
  collectionCount: number;
};

const COPY = {
  en: {
    kicker: "Digital path",
    title: "Editorial itinerary into purchase",
    body: "Film, journal, then purchase: each chapter connects emotion to commerce without leaving Maison Aurèle's universe.",
    journey: [
      {
        icon: "film",
        title: "Watch",
        description: "Each collection begins with a film—immersive, cinematic, telling the story of the season.",
      },
      {
        icon: "book",
        title: "Read",
        description: "The journal unveils the craft, the inspiration, the hands behind each silhouette.",
      },
      {
        icon: "shop",
        title: "Acquire",
        description: "From editorial to purchase, each piece arrives with its certificate of authenticity.",
      },
    ],
    stats: [
      { label: "Active chapters", key: "chapters" },
      { label: "Delivery", value: "4-7 days" },
      { label: "Partner ateliers", value: "12 houses" },
    ],
    shopCta: "Enter the shop",
    journalCta: "Read the journal",
  },
  fr: {
    kicker: "Parcours digital",
    title: "Itinéraire éditorial vers l'achat",
    body: "Film, journal puis achat : chaque chapitre relie l'émotion à l'acte d'achat sans quitter l'univers Maison Aurèle.",
    journey: [
      {
        icon: "film",
        title: "Regarder",
        description: "Chaque collection commence par un film—immersif, cinématique, racontant l'histoire de la saison.",
      },
      {
        icon: "book",
        title: "Lire",
        description: "Le journal dévoile l'artisanat, l'inspiration, les mains derrière chaque silhouette.",
      },
      {
        icon: "shop",
        title: "Acquérir",
        description: "De l'éditorial à l'achat, chaque pièce arrive avec son certificat d'authenticité.",
      },
    ],
    stats: [
      { label: "Chapitres actifs", key: "chapters" },
      { label: "Livraison", value: "4-7 jours" },
      { label: "Ateliers partenaires", value: "12 maisons" },
    ],
    shopCta: "Accéder à la boutique",
    journalCta: "Lire le journal",
  },
} as const;

const iconMap = {
  film: Film,
  book: BookOpen,
  shop: ShoppingBag,
};

export function CollectionsJourney({ locale, collectionCount }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "100%"]);

  return (
    <ScrollReveal>
      <section ref={containerRef} className="relative overflow-hidden bg-[var(--parchment)] py-32">
        <div className="relative mx-auto max-w-screen-2xl px-6 md:px-12">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[0.6rem] uppercase tracking-[0.5em] text-ink/40">
                {copy.kicker}
              </span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">{copy.title}</h2>
              <p className="mt-6 text-ink/60">{copy.body}</p>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/shop`}
                  className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs uppercase tracking-[0.3em] text-white transition-all hover:bg-ink/90"
                >
                  <ShoppingBag size={14} />
                  {copy.shopCta}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href={`/${locale}/journal`}
                  className="group inline-flex items-center gap-3 rounded-full border border-ink/20 px-8 py-4 text-xs uppercase tracking-[0.3em] text-ink transition-all hover:bg-ink/5"
                >
                  <BookOpen size={14} />
                  {copy.journalCta}
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                {copy.stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl border border-ink/10 bg-white px-5 py-5"
                  >
                    <p className="text-[0.55rem] uppercase tracking-[0.4em] text-ink/40">
                      {stat.label}
                    </p>
                    <p className="mt-2 font-display text-2xl">
                      {"key" in stat && stat.key === "chapters"
                        ? String(collectionCount).padStart(2, "0")
                        : "value" in stat ? stat.value : ""}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right column - Journey steps */}
            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-8 top-0 h-full w-px bg-ink/10 lg:left-10">
                <motion.div
                  style={{ height: lineHeight }}
                  className="w-full bg-gradient-to-b from-[var(--gilded-rose)] to-[var(--gilded-rose)]/30"
                />
              </div>

              <div className="space-y-12">
                {copy.journey.map((step, index) => {
                  const IconComponent = iconMap[step.icon as keyof typeof iconMap];
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 }}
                      className="relative pl-20 lg:pl-24"
                    >
                      {/* Icon circle */}
                      <div className="absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-full border border-ink/10 bg-white shadow-[0_10px_40px_rgba(16,10,8,0.06)] lg:h-20 lg:w-20">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gilded-rose)]/10 lg:h-12 lg:w-12">
                          <IconComponent size={20} className="text-[var(--gilded-rose)]" />
                        </div>
                      </div>

                      {/* Step number */}
                      <span className="text-[0.5rem] uppercase tracking-[0.5em] text-ink/30">
                        Step {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3 className="mt-2 font-display text-2xl">{step.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink/60">
                        {step.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
