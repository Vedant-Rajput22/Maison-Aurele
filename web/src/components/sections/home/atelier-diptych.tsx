"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useTransform, useScroll } from "framer-motion";
import type { AtelierDiptychContent } from "@/lib/data/homepage-types";
import { gsap, ScrollTrigger, prefersReducedMotion, MOTION_DEFAULTS } from "@/lib/motion";

// Video for craftsmanship detail
const CRAFTSMANSHIP_VIDEO = {
  webm: "/assets/media/brand-handstitch-detail.webm",
  mp4: "/assets/media/brand-handstitch-detail.mp4",
};

export function AtelierDiptych({ data }: { data: AtelierDiptychContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Parallax effect for the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current || !contentRef.current) return;

    const content = contentRef.current;
    const bullets = content.querySelectorAll("[data-bullet]");
    const images = sectionRef.current.querySelectorAll("[data-image]");

    // Stagger bullets
    gsap.fromTo(
      bullets,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: MOTION_DEFAULTS.ease.luxury,
        scrollTrigger: {
          trigger: content,
          start: "top 70%",
        },
      }
    );

    // Parallax images
    images.forEach((image, index) => {
      const inner = image.querySelector("[data-image-inner]");
      if (inner) {
        gsap.fromTo(
          inner,
          { scale: 1.2, y: 60 },
          {
            scale: 1,
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: image,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
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
      style={{
        background: "linear-gradient(145deg, #f7f3ed 0%, #e8e0d4 50%, #f2ece4 100%)",
      }}
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(209,169,130,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(100,80,60,0.05),transparent_40%)]" />

      {/* Decorative lines */}
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute left-16 top-20 bottom-20 hidden w-[1px] bg-gradient-to-b from-transparent via-[var(--espresso)]/10 to-transparent lg:block"
      />

      <div className="relative mx-auto max-w-screen-2xl">
        <div className="grid gap-16 lg:grid-cols-[380px_1fr] lg:gap-20">
          {/* Left content */}
          <div ref={contentRef} className="relative">
            {/* Sticky content on desktop */}
            <div className="lg:sticky lg:top-32 space-y-8">
              {/* Kicker */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[0.55rem] uppercase tracking-[0.7em] text-[var(--gilded-rose)]"
              >
                {data.kicker}
              </motion.p>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl leading-[1.1] text-[var(--espresso)] lg:text-5xl"
              >
                {data.title}
              </motion.h2>

              {/* Body */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-[0.95rem] leading-relaxed text-[var(--espresso)]/60"
              >
                {data.body}
              </motion.p>

              {/* Bullets card */}
              <div className="overflow-hidden rounded-[2rem] border border-[var(--espresso)]/8 bg-white/80 shadow-[0_30px_100px_rgba(23,18,10,0.08)] backdrop-blur-sm">
                <div className="p-8">
                  <p className="mb-6 text-[0.5rem] uppercase tracking-[0.6em] text-[var(--espresso)]/40">
                    L'excellence artisanale
                  </p>
                  <div className="space-y-4">
                    {data.bullets.map((bullet, index) => (
                      <div
                        key={bullet}
                        data-bullet
                        className="flex items-center gap-4"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--gilded-rose)]/20 bg-[var(--gilded-rose)]/5 text-[0.55rem] text-[var(--gilded-rose)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="h-[1px] flex-1 bg-gradient-to-r from-[var(--espresso)]/10 to-transparent" />
                        <span className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--espresso)]/70">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right media - Video + Image */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Craftsmanship video */}
            <motion.div
              data-image
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="group relative h-[400px] overflow-hidden rounded-[2rem] border border-[var(--espresso)]/5 bg-white shadow-[0_50px_150px_rgba(23,18,10,0.1)] md:h-[500px]"
            >
              {/* Video container */}
              <div data-image-inner className="absolute inset-0">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedData={() => setVideoLoaded(true)}
                  className={`h-full w-full object-cover transition-opacity duration-700 ${
                    videoLoaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <source src={CRAFTSMANSHIP_VIDEO.webm} type="video/webm" />
                  <source src={CRAFTSMANSHIP_VIDEO.mp4} type="video/mp4" />
                </video>
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[var(--gilded-rose)]/0 transition-colors duration-500 group-hover:bg-[var(--gilded-rose)]/5" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[0.5rem] uppercase tracking-[0.6em] text-white/50">
                      Savoir-faire
                    </p>
                    <p className="mt-1 font-display text-xl text-white">
                      {data.images[0]?.alt || "Hand-stitching detail"}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Index badge */}
              <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/20 text-[0.6rem] text-white backdrop-blur-sm">
                01
              </div>
            </motion.div>

            {/* Second image */}
            {data.images[1] && (
              <motion.div
                data-image
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="group relative h-[350px] overflow-hidden rounded-[2rem] border border-[var(--espresso)]/5 bg-white shadow-[0_50px_150px_rgba(23,18,10,0.1)] md:mt-16 md:h-[450px]"
              >
                {/* Image container */}
                <div data-image-inner className="absolute inset-0">
                  <Image
                    src={data.images[1].src}
                    alt={data.images[1].alt}
                    fill
                    sizes="(min-width:1024px) 40vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[var(--gilded-rose)]/0 transition-colors duration-500 group-hover:bg-[var(--gilded-rose)]/5" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[0.5rem] uppercase tracking-[0.6em] text-white/50">
                        Héritage
                      </p>
                      <p className="mt-1 font-display text-xl text-white">{data.images[1].alt}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20">
                      <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Index badge */}
                <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/20 text-[0.6rem] text-white backdrop-blur-sm">
                  02
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
