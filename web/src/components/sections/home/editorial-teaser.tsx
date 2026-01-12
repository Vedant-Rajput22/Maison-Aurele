"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useTransform, useScroll } from "framer-motion";
import type { Locale } from "@/lib/i18n/config";
import type { EditorialTeaserContent } from "@/lib/data/homepage-types";
import { gsap, ScrollTrigger, prefersReducedMotion, MOTION_DEFAULTS } from "@/lib/motion";

function resolveHref(locale: Locale, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function EditorialTeaser({
  locale,
  data,
}: {
  locale: Locale;
  data: EditorialTeaserContent;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Parallax effect for the background image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!cardRef.current) return;

    const card = cardRef.current;

    // 3D tilt effect on hover
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: MOTION_DEFAULTS.ease.luxury,
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-6 pb-32 md:px-12"
      style={{ backgroundColor: "var(--parchment)" }}
    >
      <div
        ref={cardRef}
        className="group relative overflow-hidden rounded-[3rem] border border-[var(--espresso)]/5 text-white shadow-[0_80px_200px_rgba(6,4,2,0.25)]"
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      >
        {/* Background image with parallax */}
        <motion.div
          ref={imageRef}
          className="absolute inset-0"
          style={{ y, scale }}
        >
          <Image
            src={data.heroImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(0.85)" }}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(209,169,130,0.1),transparent_50%)]" />

        {/* Content */}
        <div className="relative grid min-h-[600px] gap-12 px-10 py-20 md:grid-cols-[1fr_360px] md:px-20 lg:min-h-[700px]">
          {/* Left content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <div className="flex items-center gap-4">
                <span className="rounded-full border border-[var(--gilded-rose)]/40 bg-[var(--gilded-rose)]/10 px-4 py-1.5 text-[0.55rem] uppercase tracking-[0.6em] text-[var(--gilded-rose)]">
                  {data.badgeLabel ?? "Journal"}
                </span>
                <span className="h-[1px] w-16 bg-gradient-to-r from-white/30 to-transparent" />
              </div>

              {/* Title */}
              <h3 className="font-display text-4xl leading-[1.1] md:text-5xl lg:text-6xl">
                {data.title}
              </h3>

              {/* Body */}
              <p className="max-w-2xl text-[1rem] leading-relaxed text-white/75">
                {data.body}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-3">
                {data.highlights.map((highlight, index) => (
                  <motion.span
                    key={highlight}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.4em] text-white/60 backdrop-blur-sm"
                  >
                    {highlight}
                  </motion.span>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={resolveHref(locale, data.ctaHref)}
                className="group/link inline-flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.5em] text-white transition-colors hover:text-[var(--gilded-rose)]"
              >
                <span className="relative">
                  {data.ctaLabel}
                  <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-current transition-all duration-500 group-hover/link:w-full" />
                </span>
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Right card */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden self-center md:block"
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="space-y-6 rounded-[2rem] border border-white/15 bg-white/[0.07] p-10 backdrop-blur-xl">
              {/* Decorative corner */}
              <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full border border-[var(--gilded-rose)]/30 bg-[var(--gilded-rose)]/10" />

              <p className="text-[0.55rem] uppercase tracking-[0.6em] text-white/50">
                {locale === "fr" ? "Chapitre actuel" : "Current chapter"}
              </p>
              <p className="font-display text-2xl leading-tight">{data.title}</p>
              <p className="text-sm leading-relaxed text-white/65">{data.body}</p>

              <div className="h-[1px] w-full bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

              <Link
                href={resolveHref(locale, data.ctaHref)}
                className="group/btn flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/5 px-6 py-4 text-center text-[0.6rem] uppercase tracking-[0.5em] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
              >
                <span>{locale === "fr" ? "Lire l'essai" : "Read essay"}</span>
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    </section>
  );
}
