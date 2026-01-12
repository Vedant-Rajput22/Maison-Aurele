"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode } from "react";

type TransitionVariant = "fade" | "slideUp" | "slideLeft" | "luxury" | "reveal";

type PageTransitionProps = {
  children: ReactNode;
  variant?: TransitionVariant;
  duration?: number;
};

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
  luxury: {
    initial: { 
      opacity: 0, 
      y: 30,
      filter: "blur(10px)",
    },
    animate: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
    },
    exit: { 
      opacity: 0, 
      y: -20,
      filter: "blur(5px)",
    },
  },
  reveal: {
    initial: { 
      clipPath: "inset(0% 0% 100% 0%)",
      opacity: 0,
    },
    animate: { 
      clipPath: "inset(0% 0% 0% 0%)",
      opacity: 1,
    },
    exit: { 
      clipPath: "inset(100% 0% 0% 0%)",
      opacity: 0,
    },
  },
};

export function PageTransition({
  children,
  variant = "luxury",
  duration = 0.6,
}: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Full-screen transition overlay for dramatic page changes
 */
export function TransitionOverlay({
  isActive,
  onComplete,
}: {
  isActive: boolean;
  onComplete?: () => void;
}) {
  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* First layer - dark */}
          <motion.div
            className="fixed inset-0 z-[100] bg-[var(--onyx)]"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{ transformOrigin: "bottom" }}
          />
          
          {/* Second layer - accent */}
          <motion.div
            className="fixed inset-0 z-[101] bg-[var(--gilded-rose)]"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{ transformOrigin: "bottom" }}
            onAnimationComplete={() => {
              onComplete?.();
            }}
          />

          {/* Brand mark during transition */}
          <motion.div
            className="fixed inset-0 z-[102] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <span className="font-display text-2xl text-[var(--parchment)]">
              Maison Aurele
            </span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Curtain-style reveal transition
 */
export function CurtainReveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.01, delay }}
    >
      {/* Curtain overlay */}
      <motion.div
        className="absolute inset-0 z-10 bg-[var(--parchment)]"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{
          duration: 0.8,
          delay: delay + 0.1,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "left" }}
      />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.6,
          delay: delay + 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * Stagger children animation
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
}: {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
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
 * Fade in when entering viewport
 */
export function FadeInView({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scale and fade in
 */
export function ScaleInView({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
