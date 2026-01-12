"use client";

import React, { useEffect, useRef, type RefObject } from "react";
import { gsap, MOTION_DEFAULTS, prefersReducedMotion } from "@/lib/motion/gsap-setup";

type MagneticOptions = {
  strength?: number;
  ease?: string;
  duration?: number;
};

/**
 * Hook that adds magnetic cursor effect to an element.
 * The element will subtly follow the cursor when hovering.
 */
export function useMagneticCursor(
  ref: RefObject<HTMLElement | null>,
  options: MagneticOptions = {}
) {
  const { strength = 0.3, ease = MOTION_DEFAULTS.ease.smooth, duration = 0.5 } = options;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!ref.current) return;

    const element = ref.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration,
        ease,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: duration * 1.5,
        ease: MOTION_DEFAULTS.ease.elastic,
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, strength, ease, duration]);
}

/**
 * Magnetic button component wrapper
 */
export function MagneticWrapper({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useMagneticCursor(ref, { strength });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Custom cursor component for luxury feel
 */
export function useLuxuryCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window === "undefined") return;

    // Only on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Create cursor elements
    const cursor = document.createElement("div");
    cursor.className = "luxury-cursor";
    cursor.style.cssText = `
      position: fixed;
      width: 40px;
      height: 40px;
      border: 1px solid rgba(61, 47, 42, 0.3);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
    `;

    const dot = document.createElement("div");
    dot.className = "luxury-cursor-dot";
    dot.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      background: var(--espresso, #3d2f2a);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transform: translate(-50%, -50%);
    `;

    document.body.appendChild(cursor);
    document.body.appendChild(dot);
    cursorRef.current = cursor;
    cursorDotRef.current = dot;

    // Hide default cursor
    document.body.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      // Dot follows immediately
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      // Ring follows with delay
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const handleMouseEnterLink = () => {
      gsap.to(cursor, {
        width: 60,
        height: 60,
        borderColor: "var(--gilded-rose, #d1a982)",
        duration: 0.3,
      });
      gsap.to(dot, {
        scale: 2,
        duration: 0.3,
      });
    };

    const handleMouseLeaveLink = () => {
      gsap.to(cursor, {
        width: 40,
        height: 40,
        borderColor: "rgba(61, 47, 42, 0.3)",
        duration: 0.3,
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.3,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll("a, button, [role='button'], [data-magnetic]");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnterLink);
      el.addEventListener("mouseleave", handleMouseLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterLink);
        el.removeEventListener("mouseleave", handleMouseLeaveLink);
      });
      cursor.remove();
      dot.remove();
      document.body.style.cursor = "";
    };
  }, []);
}

/**
 * Hook for hover tilt effect (3D rotation on hover)
 */
export function useHoverTilt(
  ref: RefObject<HTMLElement | null>,
  options: {
    maxTilt?: number;
    perspective?: number;
    scale?: number;
  } = {}
) {
  const { maxTilt = 10, perspective = 1000, scale = 1.02 } = options;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!ref.current) return;

    const element = ref.current;
    element.style.transformStyle = "preserve-3d";
    element.style.perspective = `${perspective}px`;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * maxTilt;
      const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * maxTilt;

      gsap.to(element, {
        rotateX,
        rotateY,
        scale,
        duration: 0.5,
        ease: MOTION_DEFAULTS.ease.smooth,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.7,
        ease: MOTION_DEFAULTS.ease.elastic,
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, maxTilt, perspective, scale]);
}
