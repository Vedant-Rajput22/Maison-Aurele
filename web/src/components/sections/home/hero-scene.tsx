"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/i18n/config";
import type { HeroContent } from "@/lib/data/homepage-types";
import { gsap, ScrollTrigger, MOTION_DEFAULTS, prefersReducedMotion } from "@/lib/motion";

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { MagneticWrapper } from "@/lib/motion/cursor-effects";
import { Volume2, VolumeX } from "lucide-react";

// Video sources for hero
const HERO_VIDEO = {
  webm: "/assets/media/brand-handstitch-detail.webm",
  mp4: "/assets/media/brand-handstitch-detail.mp4",
};

function resolveHref(locale: Locale, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function HeroScene({
  locale,
  data,
}: {
  locale: Locale;
  data: HeroContent;
}) {
  const copy = data;
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // GSAP Pinned Hero Animation
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current || !contentRef.current || !overlayRef.current) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    const overlay = overlayRef.current;
    const video = videoRef.current;

    // Pin the hero and create scroll-driven animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=150%",
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      },
    });

    // Fade and scale content as user scrolls
    tl.to(content, {
      opacity: 0,
      scale: 0.95,
      y: -60,
      ease: "none",
    }, 0);

    // Intensify overlay gradient
    tl.to(overlay, {
      opacity: 1,
      ease: "none",
    }, 0);

    // Scale video slightly
    if (video) {
      tl.to(video, {
        scale: 1.15,
        ease: "none",
      }, 0);
    }

    tlRef.current = tl;

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
    };
  }, []);

  // Additional cleanup on unmount using layout effect for synchronous execution
  useIsomorphicLayoutEffect(() => {
    return () => {
      if (tlRef.current) {
        const st = tlRef.current.scrollTrigger;
        if (st) {
          st.kill(true);
        }
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate z-0 h-screen w-full overflow-hidden"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full scale-100 object-cover will-change-transform"
        autoPlay
        muted={isMuted}
        loop
        playsInline
      >
        <source src={HERO_VIDEO.webm} type="video/webm" />
        <source src={HERO_VIDEO.mp4} type="video/mp4" />
      </video>

      {/* Gradient Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,6,0.15)_0%,rgba(7,4,2,0.3)_60%,rgba(7,4,2,0.55)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />

      {/* Scroll-driven overlay */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0605] via-transparent to-transparent opacity-0"
      />

      {/* Content Container */}
      <div
        ref={contentRef}
        className="relative mx-auto flex h-full max-w-screen-2xl flex-col items-center justify-center gap-8 px-6 text-center text-white will-change-transform md:px-12"
      >
        {/* Brand Mark */}
        <motion.span
          initial={{ opacity: 0, y: -20, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.8em" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[0.65rem] uppercase tracking-[0.8em] md:text-sm"
        >
          Maison Aurele
        </motion.span>

        {/* Main Headline */}
        <div className="space-y-2 md:space-y-3">
          {copy.titleLines.map((line, index) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 50, clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{
                duration: 1.2,
                delay: 0.2 + 0.15 * index,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Manifesto */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base md:text-lg"
        >
          {copy.manifesto}
        </motion.p>

        {/* CTAs with Magnetic Effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.5em]"
        >
          <MagneticWrapper strength={0.2}>
            <Link
              href={resolveHref(locale, copy.primaryCta.href)}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/40 bg-white/10 px-8 py-4 text-white backdrop-blur-sm transition-all duration-500 hover:border-white/60 hover:bg-white/20"
            >
              <span className="relative z-10">{copy.primaryCta.label}</span>
              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0" />
            </Link>
          </MagneticWrapper>

          <MagneticWrapper strength={0.2}>
            <Link
              href={resolveHref(locale, copy.secondaryCta.href)}
              className="inline-flex items-center gap-2 border-b border-white/40 pb-2 text-white/70 transition-colors duration-300 hover:border-white/60 hover:text-white"
            >
              {copy.secondaryCta.label}
            </Link>
          </MagneticWrapper>
        </motion.div>
      </div>

      {/* Sound Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white/70 backdrop-blur-sm transition-all hover:border-white/50 hover:text-white"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        <AnimatePresence mode="wait">
          {isMuted ? (
            <motion.div
              key="muted"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <VolumeX size={18} />
            </motion.div>
          ) : (
            <motion.div
              key="unmuted"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Volume2 size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: scrollProgress > 0.1 ? 0 : 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">
            {locale === "fr" ? "Défiler" : "Scroll"}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-[1px] bg-gradient-to-b from-white/60 to-transparent"
          />
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--gilded-rose)] to-white/60"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </section>
  );
}






