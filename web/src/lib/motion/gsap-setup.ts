"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  
  // Configure ScrollTrigger to prevent removeChild errors
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
}

export { gsap, ScrollTrigger };

// Motion defaults for luxury feel
export const MOTION_DEFAULTS = {
  // Easing curves
  ease: {
    smooth: "power2.out",
    smoothIn: "power2.in",
    smoothInOut: "power2.inOut",
    luxury: "power3.out",
    luxuryIn: "power3.in",
    luxuryInOut: "power3.inOut",
    silk: "power4.out",
    elastic: "elastic.out(1, 0.5)",
    bounce: "bounce.out",
    expo: "expo.out",
    expoInOut: "expo.inOut",
  },
  // Duration presets
  duration: {
    instant: 0.2,
    fast: 0.4,
    normal: 0.6,
    slow: 0.8,
    luxury: 1.2,
    cinematic: 1.8,
  },
  // Stagger presets
  stagger: {
    fast: 0.05,
    normal: 0.08,
    slow: 0.12,
    luxury: 0.15,
  },
} as const;

// Check for reduced motion preference
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Get duration based on reduced motion preference
export function getMotionDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration;
}

// Create a timeline with reduced motion support
export function createTimeline(
  options?: gsap.TimelineVars
): gsap.core.Timeline {
  return gsap.timeline({
    paused: true,
    ...options,
  });
}

/**
 * Safe cleanup utility that prevents React removeChild errors
 * by properly killing and reverting ScrollTrigger instances before React unmounts.
 * The revert parameter (true) restores the original DOM position of pinned elements.
 */
export function cleanupScrollTriggers(trigger: Element | null): void {
  if (!trigger) return;
  
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger === trigger || st.pin === trigger) {
      // Pass true to revert the DOM changes made by pinning
      st.kill(true);
    }
  });
}

/**
 * Kill all ScrollTrigger instances and revert DOM - use sparingly
 */
export function killAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach((st) => st.kill(true));
  ScrollTrigger.clearMatchMedia();
}

/**
 * Refresh ScrollTrigger calculations after layout changes
 */
export function refreshScrollTrigger(): void {
  ScrollTrigger.refresh();
}
