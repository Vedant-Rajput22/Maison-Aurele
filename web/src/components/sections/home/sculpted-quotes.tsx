"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SculptedQuotesContent } from "@/lib/data/homepage-types";
import { gsap, ScrollTrigger, prefersReducedMotion, MOTION_DEFAULTS } from "@/lib/motion";

export function SculptedQuotes({ data }: { data: SculptedQuotesContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate quotes
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.quotes.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, data.quotes.length]);

  // GSAP scroll-triggered number animation
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const decorElements = section.querySelectorAll("[data-decor]");

    decorElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 0.04,
          scale: 1,
          duration: 1.5,
          ease: MOTION_DEFAULTS.ease.luxury,
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-32 md:px-12"
      style={{
        background: "radial-gradient(ellipse at 30% 0%, #1a1311 0%, #0a0606 50%, #040303 100%)",
      }}
    >
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(209,169,130,0.06),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.03),transparent_40%)]" />

      {/* Large decorative number */}
      <div
        data-decor
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-display text-[35vw] leading-none text-white opacity-0"
        style={{ fontWeight: 100 }}
      >
        {String(activeIndex + 1).padStart(2, "0")}
      </div>

      {/* Grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-x-20 top-20 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-20 inset-x-20 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-y-20 left-20 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-y-20 right-20 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="mb-16 flex items-center justify-between">
          <div>
            <p className="text-[0.55rem] uppercase tracking-[0.7em] text-[var(--gilded-rose)]/60">
              Les voix de la maison
            </p>
            <p className="mt-1 text-[0.5rem] uppercase tracking-[0.5em] text-white/30">
              Testimonials
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Navigation dots */}
            <div className="flex gap-2">
              {data.quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 w-2 rounded-full transition-all duration-500 ${index === activeIndex
                      ? "w-8 bg-[var(--gilded-rose)]"
                      : "bg-white/20 hover:bg-white/40"
                    }`}
                  aria-label={`Quote ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quote display area */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.article
              key={activeIndex}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-white"
            >
              {/* Quote card */}
              <div className="relative rounded-[3rem] border border-white/[0.08] bg-white/[0.03] px-10 py-14 shadow-[0_60px_200px_rgba(0,0,0,0.4)] backdrop-blur-sm md:px-20 md:py-20">
                {/* Decorative quote mark */}
                <div className="absolute -top-6 left-10 text-8xl font-display text-[var(--gilded-rose)]/15 md:left-16">
                  "
                </div>

                {/* Quote metadata */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <span className="flex items-center gap-3 text-[0.55rem] uppercase tracking-[0.6em] text-white/40">
                    <span className="h-[1px] w-8 bg-[var(--gilded-rose)]/50" />
                    {localeLabel(activeIndex)}
                  </span>
                  <span className="flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.6em] text-white/20">
                    <span className="text-[var(--gilded-rose)]">
                      {String(activeIndex + 1).padStart(2, "0")}
                    </span>
                    <span>/</span>
                    <span>{String(data.quotes.length).padStart(2, "0")}</span>
                  </span>
                </div>

                {/* Quote text */}
                <p className="font-display text-3xl leading-[1.4] text-white/90 sm:text-4xl md:text-5xl lg:text-6xl">
                  {data.quotes[activeIndex]}
                </p>

                {/* Footer */}
                <div className="mt-10 flex items-center justify-between border-t border-white/[0.06] pt-8">
                  <span className="text-[0.5rem] uppercase tracking-[0.5em] text-white/30">
                    {locale2ndLabel(activeIndex)}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setActiveIndex((prev) =>
                          prev === 0 ? data.quotes.length - 1 : prev - 1
                        );
                        setIsAutoPlaying(false);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/40 transition-all duration-300 hover:border-white/30 hover:text-white"
                      aria-label="Previous quote"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setActiveIndex((prev) => (prev + 1) % data.quotes.length);
                        setIsAutoPlaying(false);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/40 transition-all duration-300 hover:border-white/30 hover:text-white"
                      aria-label="Next quote"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="mt-12 h-[1px] w-full overflow-hidden bg-white/10">
          <motion.div
            key={activeIndex}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isAutoPlaying ? 1 : 0 }}
            transition={{ duration: 6, ease: "linear" }}
            className="h-full origin-left bg-[var(--gilded-rose)]"
          />
        </div>
      </div>
    </section>
  );
}

function localeLabel(index: number) {
  const labels = ["Paris Atelier", "Côte d'Azur", "Rive Gauche", "Salon Privé"];
  return labels[index % labels.length];
}

function locale2ndLabel(index: number) {
  const labels = ["Haute Couture Client", "Bespoke Collection", "Private Client", "Maison Exclusive"];
  return labels[index % labels.length];
}
