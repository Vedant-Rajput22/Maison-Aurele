"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { GalleryScrollSceneContent } from "@/lib/data/homepage-types";
import { gsap, ScrollTrigger, prefersReducedMotion, MOTION_DEFAULTS } from "@/lib/motion";

export function GalleryScrollScene({ data }: { data: GalleryScrollSceneContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current || !headingRef.current || !cardsRef.current) return;

    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current.querySelectorAll("[data-gallery-card]");

    // Heading reveal animation
    gsap.fromTo(
      heading.querySelectorAll("[data-heading-word]"),
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: MOTION_DEFAULTS.duration.luxury,
        stagger: MOTION_DEFAULTS.stagger.slow,
        ease: MOTION_DEFAULTS.ease.luxury,
        scrollTrigger: {
          trigger: heading,
          start: "top 80%",
        },
      }
    );

    // Cards staggered reveal with parallax
    cards.forEach((card, index) => {
      const image = card.querySelector("[data-gallery-image]");
      const content = card.querySelector("[data-gallery-content]");

      // Card reveal
      gsap.fromTo(
        card,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION_DEFAULTS.duration.luxury,
          ease: MOTION_DEFAULTS.ease.luxury,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        }
      );

      // Image parallax
      if (image) {
        gsap.fromTo(
          image,
          { y: 60, scale: 1.15 },
          {
            y: -60,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      }

      // Content stagger
      if (content) {
        gsap.fromTo(
          content.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: MOTION_DEFAULTS.duration.slow,
            stagger: 0.1,
            ease: MOTION_DEFAULTS.ease.luxury,
            scrollTrigger: {
              trigger: card,
              start: "top 70%",
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || st.trigger === heading) {
          st.kill();
        }
      });
    };
  }, []);

  // Split heading into words
  const headingWords = data.heading.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-32 md:px-12 lg:px-16"
      style={{ background: "linear-gradient(160deg, #0a0605 0%, #1a120e 50%, #0d0907 100%)" }}
    >
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-x-16 top-16 hidden h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />
      <div className="pointer-events-none absolute inset-y-12 left-10 hidden w-[1px] bg-gradient-to-b from-white/10 via-transparent to-white/5 lg:block" />
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] bg-[radial-gradient(circle,rgba(209,169,130,0.08),transparent_70%)]" />

      <div className="mx-auto max-w-screen-2xl">
        {/* Header */}
        <div className="mb-20 grid gap-12 lg:grid-cols-[380px_1fr]">
          <div className="space-y-8">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[0.6rem] uppercase tracking-[0.8em] text-[var(--gilded-rose)]"
            >
              {data.kicker}
            </motion.p>
            
            <h2
              ref={headingRef}
              className="font-display text-4xl leading-[1.15] text-white lg:text-5xl"
            >
              {headingWords.map((word, i) => (
                <span key={i} data-heading-word className="inline-block mr-[0.3em]">
                  {word}
                </span>
              ))}
            </h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-sm leading-relaxed text-white/60"
            >
              {data.description}
            </motion.p>
          </div>

          {/* Chapter index */}
          <div className="hidden lg:flex lg:items-end lg:justify-end">
            <div className="space-y-3 text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
              <p className="text-white/60">Itinéraire</p>
              <div className="space-y-2">
                {data.artworks.map((art, index) => (
                  <div key={art.title} className="flex items-center gap-4">
                    <span className="w-8 text-[var(--gilded-rose)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-[1px] w-24 bg-gradient-to-r from-white/20 to-transparent" />
                    <span className="text-white/50">{art.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Cards */}
        <div ref={cardsRef} className="space-y-16">
          {data.artworks.map((art, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <article
                key={art.title}
                data-gallery-card
                className={`relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] shadow-[0_80px_200px_rgba(0,0,0,0.5)] backdrop-blur-sm ${
                  isEven ? "" : "lg:ml-auto lg:max-w-[90%]"
                }`}
              >
                <div className={`grid gap-0 ${isEven ? "lg:grid-cols-[480px_1fr]" : "lg:grid-cols-[1fr_480px]"}`}>
                  {/* Image */}
                  <div className={`relative h-[400px] overflow-hidden lg:h-[500px] ${!isEven ? "lg:order-2" : ""}`}>
                    <div data-gallery-image className="absolute inset-0 will-change-transform">
                      <Image
                        src={art.image}
                        alt={art.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-${isEven ? 'r' : 'l'} from-transparent to-black/40`} />
                    
                    {/* Chapter indicator */}
                    <div className="absolute bottom-6 left-6 flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-xs text-white/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[0.6rem] uppercase tracking-[0.4em] text-white/60">
                        Chapitre
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    data-gallery-content
                    className={`flex flex-col justify-between gap-8 px-8 py-10 lg:px-12 lg:py-14 ${!isEven ? "lg:order-1" : ""}`}
                  >
                    <div className="space-y-6">
                      <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[var(--gilded-rose)]">
                        Étape {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-display text-3xl text-white lg:text-4xl">{art.title}</h3>
                      <p className="text-base leading-relaxed text-white/70">{art.body}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-3">
                      {["Textures", "Gestures", "Sound"].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[0.6rem] uppercase tracking-[0.4em] text-white/50 transition-colors hover:border-white/30 hover:text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute right-8 top-8 hidden lg:block">
                  <div className="h-16 w-16 rounded-full border border-white/10" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
