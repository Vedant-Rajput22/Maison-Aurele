"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type JournalReadingProgressProps = {
  /** Target element to track scroll progress against */
  target?: React.RefObject<HTMLElement | null>;
  /** Position of the progress bar */
  position?: "top" | "bottom";
  /** Show progress percentage */
  showPercentage?: boolean;
  /** Color variant */
  variant?: "default" | "gold" | "minimal";
};

export function JournalReadingProgress({
  target,
  position = "top",
  showPercentage = false,
  variant = "default",
}: JournalReadingProgressProps) {
  const { scrollYProgress } = useScroll({
    target: target ?? undefined,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const [percentValue, setPercentValue] = useState(0);

  useEffect(() => {
    return percentage.on("change", (v) => setPercentValue(Math.round(v)));
  }, [percentage]);

  const colors = {
    default: "from-[var(--espresso)]/70 to-[var(--espresso)]",
    gold: "from-[var(--gilded-rose)] to-[var(--gilded-rose)]/80",
    minimal: "from-[var(--onyx)] to-[var(--onyx)]",
  };

  return (
    <motion.div
      className={cn(
        "fixed left-0 right-0 z-50 h-[3px] origin-left",
        position === "top" ? "top-0" : "bottom-0",
        variant === "minimal" && "h-[2px]"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {/* Background Track */}
      <div className="absolute inset-0 bg-[var(--espresso)]/5" />
      
      {/* Progress Bar */}
      <motion.div
        className={cn(
          "h-full bg-gradient-to-r",
          colors[variant]
        )}
        style={{ scaleX }}
      />

      {/* Percentage Indicator */}
      {showPercentage && (
        <motion.div
          className={cn(
            "absolute right-4 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--espresso)]/60",
            position === "top" ? "top-3" : "bottom-3"
          )}
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]),
          }}
        >
          <span className="font-mono">{percentValue}%</span>
          <span>read</span>
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Minimal progress dots for compact displays
 */
export function JournalProgressDots({
  total,
  current,
  className,
}: {
  total: number;
  current: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            index === current
              ? "w-6 bg-[var(--gilded-rose)]"
              : index < current
              ? "w-1.5 bg-[var(--espresso)]/30"
              : "w-1.5 bg-[var(--espresso)]/10"
          )}
          initial={false}
          animate={{ scale: index === current ? 1 : 0.8 }}
        />
      ))}
    </div>
  );
}

/**
 * Scroll indicator for hero sections
 */
export function JournalScrollIndicator({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className={cn("flex flex-col items-center gap-3", className)}
    >
      {label && (
        <span className="text-[0.6rem] uppercase tracking-[0.4em] text-current opacity-50">
          {label}
        </span>
      )}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="h-10 w-[1px] bg-gradient-to-b from-current to-transparent opacity-40"
      />
    </motion.div>
  );
}
