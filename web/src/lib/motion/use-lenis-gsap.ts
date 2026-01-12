"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap-setup";

/**
 * Custom hook that bridges Lenis smooth scrolling with GSAP ScrollTrigger.
 * This ensures ScrollTrigger updates on Lenis scroll events and both
 * systems stay synchronized.
 */
export function useLenisGSAP() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Create Lenis instance with luxury settings
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Connect Lenis to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP's ticker for synchronized animation frame updates
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's default lag smoothing to prevent jumpy behavior
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return lenisRef;
}

/**
 * Hook to access the current Lenis scroll position
 */
export function useScrollProgress(callback: (progress: number) => void) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      callback(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback]);
}

/**
 * Stop Lenis scrolling temporarily (useful for modals, drawers)
 */
export function useLenisControl() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Access global Lenis instance if available
    const checkLenis = () => {
      const lenisElement = document.querySelector("[data-lenis]");
      if (lenisElement) {
        // @ts-expect-error - Lenis attaches to element
        lenisRef.current = lenisElement.__lenis;
      }
    };
    checkLenis();
  }, []);

  const stop = () => lenisRef.current?.stop();
  const start = () => lenisRef.current?.start();
  const scrollTo = (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => {
    lenisRef.current?.scrollTo(target, options);
  };

  return { stop, start, scrollTo };
}
