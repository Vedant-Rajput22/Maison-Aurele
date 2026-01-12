"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCw, Play, Pause, Maximize2 } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

// Default 360 video paths - can be overridden via props
const DEFAULT_360_VIDEO = {
  webm: "/assets/media/product-blazer-spin.webm",
  mp4: "/assets/media/product-blazer-spin.mp4",
};

type Props = {
  locale: Locale;
  webmSrc?: string;
  mp4Src?: string;
  posterSrc?: string;
  productName?: string;
};

const COPY = {
  en: {
    title: "360° View",
    dragToRotate: "Drag to rotate",
    play: "Auto rotate",
    pause: "Pause rotation",
    fullscreen: "View fullscreen",
  },
  fr: {
    title: "Vue 360°",
    dragToRotate: "Glisser pour tourner",
    play: "Rotation auto",
    pause: "Pause rotation",
    fullscreen: "Plein écran",
  },
} as const;

export function Product360Viewer({
  locale,
  webmSrc = DEFAULT_360_VIDEO.webm,
  mp4Src = DEFAULT_360_VIDEO.mp4,
  posterSrc,
}: Props) {
  const copy = COPY[locale] || COPY.en;
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Update progress bar
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Drag to control video position
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !videoRef.current) return;

    const deltaX = e.clientX - startX;
    const video = videoRef.current;
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const timeChange = (deltaX / containerWidth) * video.duration;

    let newTime = video.currentTime + timeChange * 0.1;
    // Loop around
    if (newTime < 0) newTime = video.duration + newTime;
    if (newTime > video.duration) newTime = newTime - video.duration;

    video.currentTime = newTime;
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RotateCw size={16} className="text-[var(--gilded-rose)]" />
          <span className="text-xs uppercase tracking-[0.4em] text-ink/60">
            {copy.title}
          </span>
        </div>
        <span className="text-[0.65rem] text-ink/40">
          {copy.dragToRotate}
        </span>
      </div>

      {/* Video container */}
      <motion.div
        ref={containerRef}
        className="group relative aspect-square cursor-grab overflow-hidden rounded-[2rem] border border-ink/10 bg-[var(--cream)] active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`h-full w-full object-contain transition-opacity duration-500 ${videoLoaded ? "opacity-100" : "opacity-0"
            }`}
          poster={posterSrc}
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src} type="video/mp4" />
        </video>

        {/* Drag indicator overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-black/5" />
        )}

        {/* Controls overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/90 text-ink/60 backdrop-blur-sm transition hover:bg-white hover:text-ink"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/90 text-ink/60 backdrop-blur-sm transition hover:bg-white hover:text-ink"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-ink/5">
          <motion.div
            className="h-full bg-[var(--gilded-rose)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
}
