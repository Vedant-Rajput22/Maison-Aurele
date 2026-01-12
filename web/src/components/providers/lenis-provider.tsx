"use client";

import { useEffect, useRef, createContext, useContext, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap-setup";

type LenisContextType = {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void;
  stop: () => void;
  start: () => void;
};

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export const useLenis = () => useContext(LenisContext);

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (lenisRef.current) return;

    // Create Lenis with luxury settings
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Connect Lenis scroll to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker for synchronized animation frames
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable lag smoothing for smoother scroll
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const contextValue: LenisContextType = {
    lenis: lenisRef.current,
    scrollTo: (target, options) => {
      lenisRef.current?.scrollTo(target, options);
    },
    stop: () => {
      lenisRef.current?.stop();
    },
    start: () => {
      lenisRef.current?.start();
    },
  };

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
}
