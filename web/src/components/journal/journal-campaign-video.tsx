"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

// Campaign video source
const CAMPAIGN_VIDEO = {
  webm: "/assets/media/journal-campaign-chiaroscuro.webm",
  mp4: "/assets/media/journal-campaign-chiaroscuro.mp4",
};

type Props = {
  locale: Locale;
  title?: string;
  subtitle?: string;
  linkTo?: string;
};

const COPY = {
  en: {
    kicker: "Campaign Film",
    title: "Chiaroscuro",
    subtitle: "A meditation on light, shadow, and the eternal dance between darkness and luminance.",
    watchFilm: "Watch the film",
    viewCollection: "View the collection",
  },
  fr: {
    kicker: "Film de campagne",
    title: "Clair-obscur",
    subtitle: "Une méditation sur la lumière, l'ombre et la danse éternelle entre l'obscurité et la luminescence.",
    watchFilm: "Voir le film",
    viewCollection: "Voir la collection",
  },
} as const;

export function JournalCampaignVideo({ locale, title, subtitle, linkTo }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section className="relative px-6 py-24 md:px-12 lg:py-32">
      <div className="mx-auto max-w-screen-2xl">
        <motion.div
          ref={containerRef}
          style={{ scale, opacity }}
          className="relative overflow-hidden rounded-[2.5rem] bg-noir"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Video */}
          <div className="relative aspect-[21/9]">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source src={CAMPAIGN_VIDEO.webm} type="video/webm" />
              <source src={CAMPAIGN_VIDEO.mp4} type="video/mp4" />
            </video>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-noir/50 via-transparent to-noir/50" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-white/30" />
                  <span className="text-[0.55rem] uppercase tracking-[0.5em] text-white/50">
                    {copy.kicker}
                  </span>
                </div>

                <h2 className="font-display text-4xl text-white md:text-5xl lg:text-6xl">
                  {title || copy.title}
                </h2>

                <p className="text-lg text-white/70">
                  {subtitle || copy.subtitle}
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <motion.button
                    onClick={togglePlay}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 rounded-full bg-white px-8 py-4 text-xs uppercase tracking-[0.3em] text-ink transition hover:bg-white/90"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    {copy.watchFilm}
                  </motion.button>

                  {linkTo && (
                    <Link
                      href={linkTo}
                      className="rounded-full border border-white/30 px-8 py-4 text-xs uppercase tracking-[0.3em] text-white backdrop-blur-sm transition hover:bg-white/10"
                    >
                      {copy.viewCollection}
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Video controls */}
            <motion.div
              initial={false}
              animate={{ opacity: showControls ? 1 : 0 }}
              className="absolute right-8 top-8 flex items-center gap-3"
            >
              <button
                onClick={toggleMute}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
              >
                <Maximize2 size={16} />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
