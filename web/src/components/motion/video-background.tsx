"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type VideoBackgroundProps = {
  webmSrc: string;
  mp4Src: string;
  posterSrc?: string;
  overlayGradient?: string;
  className?: string;
  enableParallax?: boolean;
  parallaxScale?: [number, number];
  children?: React.ReactNode;
};

export function VideoBackground({
  webmSrc,
  mp4Src,
  posterSrc,
  overlayGradient = "from-black/60 via-black/30 to-black/70",
  className = "",
  enableParallax = true,
  parallaxScale = [1, 1.15],
  children,
}: VideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    enableParallax ? parallaxScale : [1, 1]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => setIsLoaded(true);
    video.addEventListener("loadeddata", handleLoaded);

    return () => video.removeEventListener("loadeddata", handleLoaded);
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Video container with parallax */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`h-full w-full object-cover transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          poster={posterSrc}
        >
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src} type="video/mp4" />
        </video>
      </motion.div>

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${overlayGradient}`} />

      {/* Film grain effect */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
        <svg className="h-full w-full">
          <filter id="videoNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#videoNoise)" />
        </svg>
      </div>

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

// Ambient video loop component for backgrounds
export function AmbientVideoLoop({
  webmSrc,
  mp4Src,
  posterSrc,
  className = "",
  opacity = 0.15,
}: {
  webmSrc: string;
  mp4Src: string;
  posterSrc?: string;
  className?: string;
  opacity?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
        style={{ opacity }}
        poster={posterSrc}
      >
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src} type="video/mp4" />
      </video>
    </div>
  );
}
