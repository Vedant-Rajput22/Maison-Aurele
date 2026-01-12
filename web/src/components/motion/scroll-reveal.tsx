"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variant } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimationVariant = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "blur" | "reveal";

type Props = {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  duration?: number;
  variant?: AnimationVariant;
  once?: boolean;
};

const getVariants = (variant: AnimationVariant): { hidden: Variant; visible: Variant } => {
  const base = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  switch (variant) {
    case "fadeUp":
      return {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
      };
    case "fadeDown":
      return {
        hidden: { opacity: 0, y: -40 },
        visible: { opacity: 1, y: 0 },
      };
    case "fadeLeft":
      return {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0 },
      };
    case "fadeRight":
      return {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0 },
      };
    case "scale":
      return {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
      };
    case "blur":
      return {
        hidden: { opacity: 0, filter: "blur(10px)" },
        visible: { opacity: 1, filter: "blur(0px)" },
      };
    case "reveal":
      return {
        hidden: { clipPath: "inset(0% 0% 100% 0%)" },
        visible: { clipPath: "inset(0% 0% 0% 0%)" },
      };
    default:
      return base;
  }
};

export function ScrollReveal({
  children,
  className,
  threshold = 0.2,
  delay = 0,
  duration = 0.7,
  variant = "fadeUp",
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const margin = `-${Math.round(threshold * 100)}% 0px` as const;
  const isInView = useInView(ref, { 
    once, 
    margin: margin as unknown as `${number}px ${number}px ${number}px ${number}px`
  });

  const variants = getVariants(variant);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered reveal for lists/grids
 */
export function ScrollRevealStagger({
  children,
  className,
  staggerDelay = 0.1,
  baseDelay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: baseDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parallax wrapper with scroll-based movement
 */
export function ParallaxWrapper({
  children,
  className,
  speed = 0.5,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distance = (elementCenter - viewportCenter) * speed;
      setOffset(distance);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      <div style={{ transform: `translateY(${offset}px)` }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Text mask reveal animation
 */
export function TextMaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: "0%" } : { y: "100%" }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Image reveal with overlay
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
  overlayColor = "var(--parchment)",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  overlayColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" as unknown as `${number}px ${number}px ${number}px ${number}px` });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {children}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ scaleX: 1 }}
        animate={isInView ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{
          duration: 1,
          delay,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "right", backgroundColor: overlayColor }}
      />
    </div>
  );
}
