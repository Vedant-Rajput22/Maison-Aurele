"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useTransform, useScroll } from "framer-motion";
import type { StoryPanelsContent } from "@/lib/data/homepage-types";
import type { Locale } from "@/lib/i18n/config";
import { gsap, ScrollTrigger, prefersReducedMotion, MOTION_DEFAULTS } from "@/lib/motion";

export function StoryPanels({
  locale,
  data,
}: {
  locale: Locale;
  data: StoryPanelsContent;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current || !panelsRef.current) return;

    const panels = panelsRef.current.querySelectorAll("[data-panel]");

    panels.forEach((panel, index) => {
      const image = panel.querySelector("[data-panel-image]");
      const content = panel.querySelector("[data-panel-content]");
      const overlay = panel.querySelector("[data-panel-overlay]");

      // Parallax image
      if (image) {
        gsap.fromTo(
          image,
          { scale: 1.15, y: 50 },
          {
            scale: 1,
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      // Content reveal
      if (content) {
        const children = content.children;
        gsap.fromTo(
          children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: MOTION_DEFAULTS.duration.luxury,
            ease: MOTION_DEFAULTS.ease.luxury,
            scrollTrigger: {
              trigger: panel,
              start: "top 70%",
            },
          }
        );
      }

      // Overlay animation
      if (overlay) {
        gsap.fromTo(
          overlay,
          { scaleX: 1 },
          {
            scaleX: 0,
            duration: 1.2,
            ease: MOTION_DEFAULTS.ease.expo,
            scrollTrigger: {
              trigger: panel,
              start: "top 75%",
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-32 md:px-12 lg:px-16"
      style={{ backgroundColor: "var(--marble)" }}
    >
      {/* Decorative vertical line */}
      <div className="pointer-events-none absolute inset-y-10 left-1/2 hidden w-px bg-gradient-to-b from-transparent via-[var(--espresso)]/10 to-transparent lg:block" />

      <div className="mx-auto max-w-screen-2xl">
        {/* Header */}
        <div className="mb-20 grid gap-8 lg:grid-cols-2 lg:items-end">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[0.6rem] uppercase tracking-[0.7em] text-[var(--espresso)]/50"
            >
              {data.kicker}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 font-display text-4xl leading-[1.1] text-[var(--espresso)] lg:text-5xl"
            >
              {data.heading}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-md text-sm leading-relaxed text-[var(--espresso)]/60 lg:ml-auto"
          >
            {data.description}
          </motion.p>
        </div>

        {/* Panels */}
        <div ref={panelsRef} className="space-y-16">
          {data.panels.map((panel, index) => {
            const isEven = index % 2 === 0;
            return (
              <article
                key={panel.title}
                data-panel
                className={`group relative grid gap-0 overflow-hidden rounded-[2.5rem] border border-[var(--espresso)]/5 bg-white shadow-[0_60px_200px_rgba(12,8,6,0.1)] lg:grid-cols-2 ${isEven ? "" : "lg:direction-reverse"
                  }`}
              >
                {/* Image side */}
                <div
                  className={`relative h-[400px] overflow-hidden lg:h-[500px] ${isEven ? "" : "lg:order-2"
                    }`}
                >
                  {/* Reveal overlay */}
                  <div
                    data-panel-overlay
                    className="absolute inset-0 z-10 origin-left bg-[var(--espresso)]"
                  />

                  <div data-panel-image className="h-full w-full">
                    {panel.image ? (
                      <Image
                        src={panel.image}
                        alt={panel.title}
                        fill
                        sizes="(min-width:1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[var(--espresso)]/10">
                        <span className="font-display text-4xl text-[var(--espresso)]/20">{panel.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Image content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col text-white">
                        <span className="text-[0.55rem] uppercase tracking-[0.6em] text-white/60">
                          {panel.tag}
                        </span>
                        <span className="mt-1 font-display text-2xl">{panel.title}</span>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20">
                        <span className="text-xs font-medium">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content side */}
                <div
                  data-panel-content
                  className={`flex flex-col justify-center px-10 py-12 lg:px-16 lg:py-16 ${isEven ? "" : "lg:order-1"
                    }`}
                >
                  {/* Chapter marker */}
                  <div className="mb-8 flex items-center gap-4">
                    <span className="rounded-full border border-[var(--gilded-rose)]/30 bg-[var(--gilded-rose)]/5 px-4 py-1.5 text-[0.55rem] uppercase tracking-[0.5em] text-[var(--gilded-rose)]">
                      Chapitre {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-[1px] flex-1 bg-gradient-to-r from-[var(--espresso)]/10 to-transparent" />
                  </div>

                  {/* Main content */}
                  <p className="text-[0.6rem] uppercase tracking-[0.6em] text-[var(--espresso)]/40">
                    {panel.tag}
                  </p>
                  <h3 className="mt-3 font-display text-3xl text-[var(--espresso)] lg:text-4xl">
                    {panel.title}
                  </h3>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--espresso)]/65">
                    {panel.body}
                  </p>

                  {/* Footer */}
                  <div className="mt-10 flex items-center gap-6">
                    <Link
                      href={data.collectionSlug ? `/${locale}/collections/${data.collectionSlug}` : `/${locale}/collections`}
                      className="group/btn flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.4em] text-[var(--espresso)]"
                    >
                      <span className="relative">
                        {locale === "fr" ? "Découvrir" : "Discover"}
                        <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-current transition-all duration-300 group-hover/btn:w-full" />
                      </span>
                      <svg
                        className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom links */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-[var(--espresso)]/10 pt-12 text-[0.6rem] uppercase tracking-[0.5em]">
          <Link
            href={data.collectionSlug ? `/${locale}/collections/${data.collectionSlug}` : `/${locale}/collections`}
            className="group flex items-center gap-2 text-[var(--espresso)] transition-colors hover:text-[var(--gilded-rose)]"
          >
            <span>{locale === "fr" ? "Voir tous les chapitres" : "View all chapters"}</span>
            <svg
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <span className="h-[1px] w-8 bg-[var(--espresso)]/20" />
          <Link
            href={`/${locale}/shop`}
            className="group flex items-center gap-2 text-[var(--espresso)] transition-colors hover:text-[var(--gilded-rose)]"
          >
            <span>{locale === "fr" ? "Acheter la sélection" : "Shop the story"}</span>
            <svg
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
