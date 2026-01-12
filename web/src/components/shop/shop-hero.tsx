"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { ShopCategory } from "@/lib/data/shop";
import { ArrowDown, Play, Pause, Volume2, VolumeX } from "lucide-react";

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type ShopHeroProps = {
  locale: Locale;
  quickCategories: ShopCategory[];
  onCategorySelect: (slug: string) => void;
  onScrollToGrid: () => void;
};

const COPY = {
  en: {
    kicker: "Maison Aurèle",
    title: "The Boutique",
    subtitle: "A curated promenade through our universe",
    manifesto: "Each piece tells a story of Parisian craftsmanship, where heritage meets contemporary elegance. Discover collections born from the hands of master artisans.",
    explore: "Explore",
    scroll: "Scroll to discover",
    quickAccess: "Quick access",
  },
  fr: {
    kicker: "Maison Aurèle",
    title: "La Boutique",
    subtitle: "Une promenade raffinée à travers notre univers",
    manifesto: "Chaque pièce raconte l'histoire d'un savoir-faire parisien, où le patrimoine rencontre l'élégance contemporaine. Découvrez des collections nées des mains de maîtres artisans.",
    explore: "Explorer",
    scroll: "Défiler pour découvrir",
    quickAccess: "Accès rapide",
  },
  ar: {
    kicker: "ميزون أوريل",
    title: "البوتيك",
    subtitle: "نزهة راقية عبر عالمنا",
    manifesto: "كل قطعة تروي قصة الحرفية الباريسية، حيث يلتقي التراث بالأناقة المعاصرة. اكتشف مجموعات ولدت من أيدي أساتذة الحرف.",
    explore: "استكشف",
    scroll: "مرر للاكتشاف",
    quickAccess: "وصول سريع",
  },
};

export function ShopHero({ locale, quickCategories, onCategorySelect, onScrollToGrid }: ShopHeroProps) {
  const copy = COPY[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.8]);

  // GSAP pinned hero
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current || !contentRef.current) return;

    const section = sectionRef.current;
    const content = contentRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=80%",
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      },
    });

    tl.to(content, {
      y: -100,
      opacity: 0,
      ease: "none",
    }, 0);

    tlRef.current = tl;

    return () => {
      if (tlRef.current) {
        const st = tlRef.current.scrollTrigger;
        if (st) st.kill(true);
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    return () => {
      if (tlRef.current) {
        const st = tlRef.current.scrollTrigger;
        if (st) st.kill(true);
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[var(--onyx)]"
    >
      {/* Video Background */}
      <motion.div 
        className="absolute inset-0 will-change-transform"
        style={{ scale: videoScale }}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/assets/media/hero-paris-silk.webm" type="video/webm" />
          <source src="/assets/media/hero-paris-silk.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Cinematic Overlays */}
      <motion.div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ opacity: overlayOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </motion.div>

      {/* Film Grain */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex h-full flex-col justify-between px-6 pb-16 pt-32 text-white md:px-12 lg:px-16"
      >
        {/* Top Section */}
        <div className="mx-auto w-full max-w-screen-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <span className="text-[0.6rem] uppercase tracking-[0.7em] text-white/60">
              {copy.kicker}
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-[var(--gilded-rose)] to-transparent" />
          </motion.div>
        </div>

        {/* Center Content */}
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl leading-[0.9] md:text-7xl lg:text-8xl xl:text-9xl"
          >
            {copy.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-6 text-lg text-white/70 md:text-xl"
          >
            {copy.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-6 max-w-2xl text-sm leading-relaxed text-white/50"
          >
            {copy.manifesto}
          </motion.p>

          {/* Quick Categories */}
          {quickCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-10"
            >
              <span className="mb-4 block text-[0.6rem] uppercase tracking-[0.5em] text-white/40">
                {copy.quickAccess}
              </span>
              <div className="flex flex-wrap justify-center gap-3">
                {quickCategories.slice(0, 4).map((category, index) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                    onClick={() => onCategorySelect(category.slug)}
                    className="group relative overflow-hidden rounded-full border border-white/20 bg-white/5 px-6 py-3 text-[0.65rem] uppercase tracking-[0.4em] text-white/80 backdrop-blur-sm transition-all duration-500 hover:border-white/40 hover:bg-white/10"
                  >
                    <span className="relative z-10">{category.title}</span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mx-auto flex w-full max-w-screen-2xl items-end justify-between">
          {/* Video Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={toggleMute}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            onClick={onScrollToGrid}
            className="group flex flex-col items-center gap-3"
          >
            <span className="text-[0.6rem] uppercase tracking-[0.5em] text-white/50 transition-colors group-hover:text-white/80">
              {copy.scroll}
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-12 w-6 items-start justify-center rounded-full border border-white/30 pt-2"
            >
              <div className="h-2 w-1 rounded-full bg-white/60" />
            </motion.div>
          </motion.button>

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-[0.6rem] uppercase tracking-[0.5em] text-white/40"
          >
            {Math.round(scrollProgress * 100)}%
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Transition */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--parchment)] to-transparent" />
    </section>
  );
}
