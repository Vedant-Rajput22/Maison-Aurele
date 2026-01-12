"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

// Safe useLayoutEffect for SSR
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  locale: Locale;
};

const COPY = {
  en: {
    kicker: "The Maison",
    title: "Where heritage meets tomorrow",
    subtitle: "Paris atelier, Riviera light, digital couture",
    manifesto: "Each collection reads as a chapter—film, voice, materials—before private shopping and appointments.",
    scroll: "Discover our story",
    watchFilm: "Watch the film",
    founded: "Founded",
    ateliers: "Ateliers",
    countries: "Countries",
  },
  fr: {
    kicker: "La Maison",
    title: "Là où l'héritage rencontre demain",
    subtitle: "Atelier parisien, lumière Riviera, couture numérique",
    manifesto: "Chaque collection se lit comme un chapitre : vidéos, voix, matières, puis boutiques et rendez-vous privés.",
    scroll: "Découvrir notre histoire",
    watchFilm: "Voir le film",
    founded: "Fondée en",
    ateliers: "Ateliers",
    countries: "Pays",
  },
} as const;

export function MaisonHero({ locale }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showFilmOverlay, setShowFilmOverlay] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.8]);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger reveal for stats
      gsap.from(".maison-stat", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".maison-stats",
          start: "top 80%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
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
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <section ref={containerRef} className="relative min-h-[200vh]">
        {/* Fixed video background */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div style={{ scale: videoScale, opacity: videoOpacity }} className="absolute inset-0">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source src="/assets/media/maison-atelier-docu.webm" type="video/webm" />
              <source src="/assets/media/maison-atelier-docu.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Dark overlay */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"
          />

          {/* Film grain */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
            <svg className="h-full w-full">
              <filter id="maisonNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#maisonNoise)" />
            </svg>
          </div>

          {/* Content */}
          <motion.div style={{ y: contentY }} className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
            <div className="mx-auto w-full max-w-screen-2xl">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-3xl space-y-8"
              >
                {/* Kicker */}
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-white/40" />
                  <span className="text-[0.65rem] uppercase tracking-[0.5em] text-white/60">
                    {copy.kicker}
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-display text-5xl leading-[1.1] text-white md:text-7xl lg:text-8xl">
                  {copy.title}
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-white/70 md:text-xl">{copy.subtitle}</p>

                {/* Manifesto card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-md"
                >
                  <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/40">Manifesto</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{copy.manifesto}</p>
                </motion.div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowFilmOverlay(true)}
                    className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    <Play size={14} className="transition-transform group-hover:scale-110" />
                    {copy.watchFilm}
                  </motion.button>
                </div>
              </motion.div>

              {/* Stats row */}
              <div className="maison-stats mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8 md:max-w-xl">
                <div className="maison-stat">
                  <p className="font-display text-4xl text-white md:text-5xl">1962</p>
                  <p className="mt-1 text-[0.6rem] uppercase tracking-[0.4em] text-white/50">{copy.founded}</p>
                </div>
                <div className="maison-stat">
                  <p className="font-display text-4xl text-white md:text-5xl">12</p>
                  <p className="mt-1 text-[0.6rem] uppercase tracking-[0.4em] text-white/50">{copy.ateliers}</p>
                </div>
                <div className="maison-stat">
                  <p className="font-display text-4xl text-white md:text-5xl">18</p>
                  <p className="mt-1 text-[0.6rem] uppercase tracking-[0.4em] text-white/50">{copy.countries}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Video controls */}
          <div className="absolute bottom-8 right-8 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMute}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </motion.button>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-[0.55rem] uppercase tracking-[0.4em] text-white/50">{copy.scroll}</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-12 w-px bg-gradient-to-b from-white/50 to-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Film overlay */}
      <AnimatePresence>
        {showFilmOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            onClick={() => setShowFilmOverlay(false)}
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute right-8 top-8 text-xs uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
            >
              Close
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="aspect-video w-[90vw] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                autoPlay
                controls
                className="h-full w-full rounded-2xl"
              >
                <source
                  src="/assets/media/maison-heritage-archive.webm"
                  type="video/webm"
                />
                <source
                  src="/assets/media/maison-heritage-archive.mp4"
                  type="video/mp4"
                />
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
