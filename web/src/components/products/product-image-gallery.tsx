"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  locale: Locale;
  images: string[];
  productName: string;
};

const COPY = {
  en: {
    viewFullscreen: "View fullscreen",
    closeFullscreen: "Close",
    imageOf: "of",
  },
  fr: {
    viewFullscreen: "Plein écran",
    closeFullscreen: "Fermer",
    imageOf: "sur",
  },
  ar: {
    viewFullscreen: "عرض ملء الشاشة",
    closeFullscreen: "إغلاق",
    imageOf: "من",
  },
} as const;

export function ProductImageGallery({ locale, images, productName }: Props) {
  const copy = COPY[locale] || COPY.en;
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Update active index based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const newIndex = Math.min(
        Math.floor(latest * images.length),
        images.length - 1
      );
      setActiveIndex(newIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress, images.length]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const navigateLightbox = useCallback((direction: "prev" | "next") => {
    setLightboxIndex((prev) => {
      if (direction === "prev") {
        return prev === 0 ? images.length - 1 : prev - 1;
      }
      return prev === images.length - 1 ? 0 : prev + 1;
    });
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      if (e.key === "ArrowRight") navigateLightbox("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, navigateLightbox]);

  return (
    <>
      <div ref={containerRef} className="space-y-8">
        {images.map((image, idx) => (
          <GalleryImage
            key={`${image}-${idx}`}
            image={image}
            productName={productName}
            index={idx}
            isFirst={idx === 0}
            onOpenLightbox={() => openLightbox(idx)}
            copy={copy}
          />
        ))}

        {/* Progress Indicator */}
        {images.length > 1 && (
          <div className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2 lg:left-[25%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-full border border-ink/10 bg-white/90 px-4 py-2 shadow-xl backdrop-blur-sm"
            >
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const element = containerRef.current?.children[idx];
                    element?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="group relative"
                >
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      idx === activeIndex
                        ? "w-8 bg-ink"
                        : "w-1.5 bg-ink/20 group-hover:bg-ink/40"
                    )}
                  />
                </button>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={closeLightbox}
              className="absolute right-6 top-6 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <X size={14} />
              {copy.closeFullscreen}
            </motion.button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox("prev");
                  }}
                  className="absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <ChevronLeft size={24} />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox("next");
                  }}
                  className="absolute right-6 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <ChevronRight size={24} />
                </motion.button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative h-[85vh] w-[85vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex]}
                alt={`${productName} - ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="85vw"
                priority
              />
            </motion.div>

            {/* Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white backdrop-blur-sm"
            >
              {lightboxIndex + 1} {copy.imageOf} {images.length}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GalleryImage({
  image,
  productName,
  index,
  isFirst,
  onOpenLightbox,
  copy,
}: {
  image: string;
  productName: string;
  index: number;
  isFirst: boolean;
  onOpenLightbox: () => void;
  copy: { viewFullscreen: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY, scale: smoothScale, opacity }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[3rem] border border-ink/5 bg-white shadow-[0_40px_140px_rgba(16,12,9,0.18)]",
          isFirst ? "h-[95vh]" : "h-[85vh]"
        )}
      >
        {/* Ambient glow effect */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.03))]" />

        <Image
          src={image}
          alt={`${productName} - ${index + 1}`}
          fill
          priority={isFirst}
          className="object-cover transition-transform duration-700"
          sizes="(max-width: 1024px) 100vw, 50vw"
          style={{
            transform: isHovered ? "scale(1.02)" : "scale(1)",
          }}
        />

        {/* Hover overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/10"
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={onOpenLightbox}
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white backdrop-blur-md transition hover:bg-white/30"
              >
                <Expand size={14} />
                {copy.viewFullscreen}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image number indicator */}
        <div className="absolute bottom-6 left-6 z-20 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
    </motion.div>
  );
}
