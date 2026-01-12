"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, MOTION_DEFAULTS, prefersReducedMotion, cleanupScrollTriggers, getMotionDuration } from "@/lib/motion/gsap-setup";

type ScrollAnimationOptions = {
  trigger?: RefObject<HTMLElement | null> | string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
};

/**
 * Hook for creating scroll-triggered animations
 */
export function useScrollAnimation(
  animationFn: (tl: gsap.core.Timeline) => void,
  options: ScrollAnimationOptions = {},
  deps: unknown[] = []
) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const trigger =
      typeof options.trigger === "string"
        ? options.trigger
        : options.trigger?.current;

    if (!trigger) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: options.start ?? "top 80%",
        end: options.end ?? "bottom 20%",
        scrub: options.scrub ?? false,
        pin: options.pin ?? false,
        markers: options.markers ?? false,
        onEnter: options.onEnter,
        onLeave: options.onLeave,
        onEnterBack: options.onEnterBack,
        onLeaveBack: options.onLeaveBack,
      },
    });

    animationFn(tl);
    timelineRef.current = tl;

    return () => {
      tl.kill();
      if (typeof trigger !== "string") {
        cleanupScrollTriggers(trigger);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return timelineRef;
}

/**
 * Hook for parallax effects
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  options: {
    speed?: number;
    direction?: "vertical" | "horizontal";
    start?: string;
    end?: string;
  } = {}
) {
  const { speed = 0.5, direction = "vertical", start = "top bottom", end = "bottom top" } = options;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!ref.current) return;

    const element = ref.current;
    const property = direction === "vertical" ? "y" : "x";
    const distance = 100 * speed;

    gsap.fromTo(
      element,
      { [property]: -distance },
      {
        [property]: distance,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub: true,
        },
      }
    );

    return () => {
      cleanupScrollTriggers(element);
    };
  }, [ref, speed, direction, start, end]);
}

/**
 * Hook for pinned scroll sections
 */
export function usePinnedSection(
  ref: RefObject<HTMLElement | null>,
  options: {
    duration?: string | number;
    start?: string;
    markers?: boolean;
    onProgress?: (progress: number) => void;
  } = {}
) {
  const progressRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!ref.current) return;

    const element = ref.current;

    const st = ScrollTrigger.create({
      trigger: element,
      start: options.start ?? "top top",
      end: options.duration ?? "+=100%",
      pin: true,
      markers: options.markers ?? false,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        options.onProgress?.(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, [ref, options]);

  return progressRef;
}

/**
 * Hook for fade-in reveal animations
 */
export function useFadeInReveal(
  ref: RefObject<HTMLElement | null>,
  options: {
    direction?: "up" | "down" | "left" | "right" | "none";
    distance?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
    start?: string;
  } = {}
) {
  const {
    direction = "up",
    distance = 60,
    duration = MOTION_DEFAULTS.duration.slow,
    delay = 0,
    stagger = MOTION_DEFAULTS.stagger.normal,
    start = "top 85%",
  } = options;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!ref.current) return;

    const element = ref.current;
    const children = element.querySelectorAll("[data-reveal]");
    const targets = children.length > 0 ? children : element;

    const from: gsap.TweenVars = { opacity: 0 };
    if (direction === "up") from.y = distance;
    if (direction === "down") from.y = -distance;
    if (direction === "left") from.x = distance;
    if (direction === "right") from.x = -distance;

    gsap.fromTo(
      targets,
      from,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: getMotionDuration(duration),
        delay,
        ease: MOTION_DEFAULTS.ease.luxury,
        stagger,
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      cleanupScrollTriggers(element);
    };
  }, [ref, direction, distance, duration, delay, stagger, start]);
}

/**
 * Hook for horizontal scroll sections
 */
export function useHorizontalScroll(
  containerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  options: {
    start?: string;
    markers?: boolean;
  } = {}
) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    // Calculate how much to scroll horizontally
    const scrollWidth = content.scrollWidth - container.offsetWidth;

    gsap.to(content, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: options.start ?? "top top",
        end: () => `+=${scrollWidth}`,
        pin: true,
        scrub: 1,
        markers: options.markers ?? false,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      cleanupScrollTriggers(container);
    };
  }, [containerRef, contentRef, options.start, options.markers]);
}

/**
 * Hook for scale/zoom reveal
 */
export function useScaleReveal(
  ref: RefObject<HTMLElement | null>,
  options: {
    from?: number;
    to?: number;
    scrub?: boolean | number;
    start?: string;
    end?: string;
  } = {}
) {
  const {
    from = 0.8,
    to = 1,
    scrub = true,
    start = "top bottom",
    end = "center center",
  } = options;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!ref.current) return;

    const element = ref.current;

    gsap.fromTo(
      element,
      { scale: from, opacity: from < 1 ? 0.5 : 1 },
      {
        scale: to,
        opacity: 1,
        ease: scrub ? "none" : MOTION_DEFAULTS.ease.luxury,
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub,
        },
      }
    );

    return () => {
      cleanupScrollTriggers(element);
    };
  }, [ref, from, to, scrub, start, end]);
}
