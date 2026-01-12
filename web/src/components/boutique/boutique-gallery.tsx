"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Props = {
  locale: Locale;
};

const COPY = {
  en: {
    kicker: "The experience",
    title: "Step inside",
    description: "A curated space where heritage meets contemporary design. Each corner tells a story of craftsmanship and elegance.",
    spaces: [
      { name: "Grand Salon", description: "The heart of our boutique, featuring seasonal collections" },
      { name: "Private Fitting", description: "An intimate space for personal consultations" },
      { name: "Archive Room", description: "Heritage pieces and limited editions" },
      { name: "Atelier View", description: "A glimpse into our craftsmanship process" },
    ],
    viewFullscreen: "View fullscreen",
    close: "Close",
  },
  fr: {
    kicker: "L'expérience",
    title: "Entrez dans l'univers",
    description: "Un espace curé où l'héritage rencontre le design contemporain. Chaque coin raconte une histoire d'artisanat et d'élégance.",
    spaces: [
      { name: "Grand Salon", description: "Le cœur de notre boutique, présentant les collections saisonnières" },
      { name: "Cabine Privée", description: "Un espace intime pour les consultations personnelles" },
      { name: "Salle des Archives", description: "Pièces patrimoniales et éditions limitées" },
      { name: "Vue Atelier", description: "Un aperçu de notre processus artisanal" },
    ],
    viewFullscreen: "Plein écran",
    close: "Fermer",
  },
} as const;

const GALLERY = [
  {
    id: "salon",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "fitting",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "archive",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "atelier",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80",
  },
];

export function BoutiqueGallery({ locale }: Props) {
  const copy = COPY[locale] || COPY.en;
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  const goToNext = () => setActiveIndex((prev) => (prev + 1) % GALLERY.length);
  const goToPrev = () => setActiveIndex((prev) => (prev - 1 + GALLERY.length) % GALLERY.length);

  return (
    <>
      <ScrollReveal>
        <section ref={containerRef} className="relative overflow-hidden bg-[var(--parchment)] py-32">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.8),transparent_60%)]" />

          <div className="relative mx-auto max-w-screen-2xl px-6 md:px-12">
            {/* Header */}
            <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-end">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[0.6rem] uppercase tracking-[0.6em] text-ink/40">
                  {copy.kicker}
                </span>
                <h2 className="mt-4 font-display text-4xl md:text-5xl">{copy.title}</h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-ink/60 lg:text-right"
              >
                {copy.description}
              </motion.p>
            </div>

            {/* Main gallery */}
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              {/* Main image viewer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative aspect-[4/3] overflow-hidden rounded-[3rem] border border-ink/8 bg-white shadow-[0_40px_120px_rgba(16,10,8,0.12)]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={GALLERY[activeIndex].image}
                      alt={copy.spaces[activeIndex].name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 60vw, 100vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Navigation controls */}
                <div className="absolute inset-x-6 bottom-6 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={goToPrev}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                    >
                      <ChevronLeft size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={goToNext}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                    >
                      <ChevronRight size={20} />
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setLightboxOpen(true)}
                    className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-xs uppercase tracking-[0.3em] text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    <Expand size={14} />
                    {copy.viewFullscreen}
                  </motion.button>
                </div>

                {/* Current space info */}
                <div className="absolute bottom-6 left-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="font-display text-2xl text-white">{copy.spaces[activeIndex].name}</p>
                  <p className="mt-1 text-sm text-white/70">{copy.spaces[activeIndex].description}</p>
                </div>

                {/* Progress indicator */}
                <div className="absolute right-6 top-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white backdrop-blur-sm">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")}
                </div>
              </motion.div>

              {/* Thumbnail list */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                {GALLERY.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveIndex(index)}
                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                      index === activeIndex
                        ? "border-ink/30 ring-2 ring-ink/10"
                        : "border-ink/8 hover:border-ink/20"
                    }`}
                  >
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={item.image}
                        alt={copy.spaces[index].name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="200px"
                      />
                      <div className={`absolute inset-0 bg-black/30 transition-opacity ${
                        index === activeIndex ? "opacity-0" : "opacity-40"
                      }`} />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <p className={`font-display text-sm text-white transition-opacity ${
                        index === activeIndex ? "opacity-100" : "opacity-80"
                      }`}>
                        {copy.spaces[index].name}
                      </p>
                    </div>

                    {index === activeIndex && (
                      <motion.div
                        layoutId="activeThumb"
                        className="absolute inset-0 rounded-2xl ring-2 ring-[var(--gilded-rose)]"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <X size={14} />
              {copy.close}
            </motion.button>

            {/* Navigation */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-4 text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-6 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-4 text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <ChevronRight size={24} />
            </motion.button>

            {/* Image */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-[80vh] w-[90vw] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={GALLERY[activeIndex].image}
                alt={copy.spaces[activeIndex].name}
                fill
                className="rounded-2xl object-contain"
                sizes="90vw"
              />
            </motion.div>

            {/* Caption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="font-display text-xl text-white">{copy.spaces[activeIndex].name}</p>
              <p className="mt-1 text-sm text-white/60">{copy.spaces[activeIndex].description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
