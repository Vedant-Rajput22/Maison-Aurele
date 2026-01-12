"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { LookbookCarouselContent } from "@/lib/data/homepage-types";
import type { Locale } from "@/lib/i18n/config";
import { gsap, ScrollTrigger, prefersReducedMotion, MOTION_DEFAULTS } from "@/lib/motion";

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function LookbookCarousel({
  locale,
  data,
}: {
  locale: Locale;
  data: LookbookCarouselContent;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current || !containerRef.current || !slidesRef.current) return;
    if (data.slides.length === 0) return;

    const section = sectionRef.current;
    const container = containerRef.current;
    const slides = slidesRef.current;
    const slideElements = slides.querySelectorAll("[data-lookbook-slide]");

    // Calculate total scroll distance
    const totalWidth = slides.scrollWidth - container.offsetWidth;

    // Horizontal scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalWidth + window.innerHeight}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          setProgress(self.progress);
          const newIndex = Math.min(
            Math.floor(self.progress * data.slides.length),
            data.slides.length - 1
          );
          setActiveIndex(newIndex);
        },
      },
    });

    // Horizontal scroll
    tl.to(slides, {
      x: -totalWidth,
      ease: "none",
    });

    tlRef.current = tl;

    // Individual slide animations
    slideElements.forEach((slide, index) => {
      const image = slide.querySelector("[data-slide-image]");
      const content = slide.querySelector("[data-slide-content]");

      // Parallax on images
      if (image) {
        gsap.fromTo(
          image,
          { x: 100 },
          {
            x: -100,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${totalWidth + window.innerHeight}`,
              scrub: 1.5,
            },
          }
        );
      }
    });

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
      // Also kill any individual slide ScrollTriggers
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill(true);
      });
    };
  }, [data.slides.length]);

  // Additional cleanup on unmount using layout effect for synchronous execution
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    return () => {
      if (tlRef.current) {
        const st = tlRef.current.scrollTrigger;
        if (st) {
          st.kill(true);
        }
        tlRef.current.kill();
        tlRef.current = null;
      }
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill(true);
      });
    };
  }, []);

  const headingWords = data.title.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "var(--parchment)" }}
    >
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(209,169,130,0.1),transparent_50%)]" />

      {/* Header - Fixed */}
      <div className="absolute left-0 right-0 top-0 z-20 px-6 pt-24 md:px-12 lg:px-16">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex items-end justify-between">
            <div className="max-w-2xl space-y-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[0.6rem] uppercase tracking-[0.7em] text-[var(--gilded-rose)]"
              >
                {data.kicker}
              </motion.p>
              <h2 className="font-display text-4xl leading-[1.1] text-[var(--espresso)] lg:text-5xl">
                {headingWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="mr-[0.3em] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </h2>
            </div>

            {/* Progress indicator */}
            <div className="hidden items-center gap-6 lg:flex">
              <div className="flex gap-2">
                {data.slides.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-8 rounded-full transition-all duration-500 ${
                      i === activeIndex
                        ? "bg-[var(--gilded-rose)]"
                        : i < activeIndex
                        ? "bg-[var(--espresso)]/30"
                        : "bg-[var(--espresso)]/10"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--espresso)]/50">
                {String(activeIndex + 1).padStart(2, "0")} / {String(data.slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div ref={containerRef} className="relative h-screen w-full overflow-hidden pt-48">
        <div
          ref={slidesRef}
          className="flex h-full items-center gap-8 px-6 will-change-transform md:px-12"
          style={{ width: `${data.slides.length * 85}vw` }}
        >
          {data.slides.map((slide, index) => (
            <article
              key={slide.title}
              data-lookbook-slide
              className="relative h-[75vh] w-[75vw] flex-shrink-0 overflow-hidden rounded-[2.5rem] border border-[var(--espresso)]/10 bg-white shadow-[0_60px_180px_rgba(61,47,42,0.15)] lg:w-[60vw]"
            >
              <div className="grid h-full lg:grid-cols-[1.2fr_1fr]">
                {/* Image */}
                <div className="relative h-full overflow-hidden">
                  <div
                    data-slide-image
                    className="absolute inset-[-20%] will-change-transform"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      sizes="60vw"
                      className="object-cover"
                    />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/60 lg:to-white/80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />

                  {/* Sequence indicator */}
                  <div className="absolute bottom-6 left-6 lg:hidden">
                    <span className="rounded-full border border-white/30 bg-black/20 px-4 py-2 text-[0.6rem] uppercase tracking-[0.4em] text-white backdrop-blur-sm">
                      {locale === "fr" ? "Séquence" : "Sequence"} {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div
                  data-slide-content
                  className="flex flex-col justify-between p-8 lg:p-12"
                >
                  <div className="space-y-6">
                    <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[var(--gilded-rose)]">
                      {locale === "fr" ? "Séquence" : "Sequence"} {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display text-3xl text-[var(--espresso)] lg:text-4xl">
                      {slide.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--espresso)]/70">
                      {slide.body}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-4 pt-8">
                    <Link
                      href={data.collectionSlug ? `/${locale}/collections/${data.collectionSlug}` : `/${locale}/collections`}
                      className="group inline-flex items-center gap-2 rounded-full border border-[var(--espresso)]/20 px-6 py-3 text-[0.6rem] uppercase tracking-[0.4em] text-[var(--espresso)] transition-all hover:border-[var(--espresso)]/40 hover:bg-[var(--espresso)]/5"
                    >
                      <span>{locale === "fr" ? "Voir le chapitre" : "View chapter"}</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                    <Link
                      href={`/${locale}/shop`}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--espresso)] px-6 py-3 text-[0.6rem] uppercase tracking-[0.4em] text-[var(--parchment)] transition-all hover:bg-[var(--espresso)]/90"
                    >
                      {locale === "fr" ? "Boutique" : "Shop"}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Decorative number */}
              <div className="pointer-events-none absolute -right-4 -top-8 font-display text-[12rem] leading-none text-[var(--espresso)]/[0.03]">
                {String(index + 1).padStart(2, "0")}
              </div>
            </article>
          ))}

          {/* End slide */}
          <div className="flex h-[75vh] w-[40vw] flex-shrink-0 items-center justify-center">
            <div className="text-center">
              <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[var(--espresso)]/40">
                {locale === "fr" ? "Fin du chapitre" : "End of chapter"}
              </p>
              <Link
                href={`/${locale}/collections`}
                className="mt-6 inline-flex items-center gap-2 text-lg font-display text-[var(--espresso)] underline decoration-[var(--gilded-rose)] underline-offset-4 transition-all hover:decoration-2"
              >
                {locale === "fr" ? "Voir toutes les collections" : "View all collections"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-8 left-6 right-6 z-20 md:left-12 md:right-12">
        <div className="mx-auto max-w-screen-2xl">
          <div className="h-[2px] overflow-hidden rounded-full bg-[var(--espresso)]/10">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--gilded-rose)] to-[var(--espresso)]/60"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
