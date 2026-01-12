"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, MOTION_DEFAULTS, prefersReducedMotion } from "@/lib/motion/gsap-setup";
import { cn } from "@/lib/utils";

type SplitTextProps = {
  children: string;
  className?: string;
  style?: CSSProperties;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  splitBy?: "chars" | "words" | "lines";
  animation?: "fadeUp" | "fadeIn" | "scale" | "blur" | "reveal";
  delay?: number;
  duration?: number;
  stagger?: number;
  trigger?: "mount" | "scroll";
  scrollStart?: string;
};

export function SplitText({
  children,
  className,
  style,
  as: Component = "div",
  splitBy = "chars",
  animation = "fadeUp",
  delay = 0,
  duration = MOTION_DEFAULTS.duration.normal,
  stagger = MOTION_DEFAULTS.stagger.fast,
  trigger = "scroll",
  scrollStart = "top 85%",
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!containerRef.current) return;
    if (hasAnimated.current) return;

    const container = containerRef.current;
    const elements = container.querySelectorAll("[data-split-element]");

    if (elements.length === 0) return;

    // Set initial state
    const fromVars: gsap.TweenVars = { opacity: 0 };
    const toVars: gsap.TweenVars = {
      opacity: 1,
      duration,
      delay,
      stagger,
      ease: MOTION_DEFAULTS.ease.luxury,
    };

    switch (animation) {
      case "fadeUp":
        fromVars.y = 40;
        toVars.y = 0;
        break;
      case "scale":
        fromVars.scale = 0.8;
        toVars.scale = 1;
        break;
      case "blur":
        fromVars.filter = "blur(10px)";
        toVars.filter = "blur(0px)";
        break;
      case "reveal":
        fromVars.clipPath = "inset(100% 0% 0% 0%)";
        toVars.clipPath = "inset(0% 0% 0% 0%)";
        fromVars.y = 0;
        break;
      default:
        break;
    }

    gsap.set(elements, fromVars);

    if (trigger === "mount") {
      gsap.to(elements, toVars);
      hasAnimated.current = true;
    } else {
      gsap.to(elements, {
        ...toVars,
        scrollTrigger: {
          trigger: container,
          start: scrollStart,
          toggleActions: "play none none none",
        },
      });
    }

    return () => {
      // Cleanup is handled by GSAP
    };
  }, [animation, delay, duration, stagger, trigger, scrollStart]);

  const splitContent = () => {
    if (splitBy === "chars") {
      return children.split("").map((char, i) => (
        <span
          key={i}
          data-split-element
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char}
        </span>
      ));
    }

    if (splitBy === "words") {
      return children.split(" ").map((word, i, arr) => (
        <span key={i} className="inline-block">
          <span data-split-element className="inline-block">
            {word}
          </span>
          {i < arr.length - 1 && <span>&nbsp;</span>}
        </span>
      ));
    }

    // Lines - wrap each line
    return children.split("\n").map((line, i) => (
      <span key={i} data-split-element className="block overflow-hidden">
        <span className="inline-block">{line}</span>
      </span>
    ));
  };

  return (
    <Component ref={containerRef} className={cn(className)} style={style}>
      {splitContent()}
    </Component>
  );
}

/**
 * Animated heading with luxury reveal effect
 */
export function LuxuryHeading({
  children,
  className,
  as = "h2",
  delay = 0,
}: {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
  delay?: number;
}) {
  return (
    <SplitText
      as={as}
      className={cn("font-display", className)}
      splitBy="words"
      animation="fadeUp"
      delay={delay}
      stagger={MOTION_DEFAULTS.stagger.slow}
      duration={MOTION_DEFAULTS.duration.luxury}
    >
      {children}
    </SplitText>
  );
}

/**
 * Line-by-line reveal for paragraphs
 */
export function RevealParagraph({
  children,
  className,
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!ref.current) return;

    const lines = ref.current.querySelectorAll("[data-line]");
    
    gsap.fromTo(
      lines,
      { 
        opacity: 0, 
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: MOTION_DEFAULTS.duration.slow,
        delay,
        stagger: MOTION_DEFAULTS.stagger.slow,
        ease: MOTION_DEFAULTS.ease.luxury,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        },
      }
    );
  }, [delay]);

  // Split by sentences or natural breaks
  const sentences = children.split(/(?<=[.!?])\s+/);

  return (
    <p ref={ref} className={className}>
      {sentences.map((sentence, i) => (
        <span key={i} data-line className="block overflow-hidden">
          <span className="inline-block">{sentence} </span>
        </span>
      ))}
    </p>
  );
}

/**
 * Counter animation for numbers
 */
export function AnimatedCounter({
  value,
  duration = 2,
  className,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (ref.current) ref.current.textContent = `${prefix}${value}${suffix}`;
      return;
    }
    if (!ref.current) return;
    if (hasAnimated.current) return;

    const element = ref.current;
    const counter = { value: 0 };

    gsap.to(counter, {
      value,
      duration,
      ease: MOTION_DEFAULTS.ease.luxuryInOut,
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        onEnter: () => {
          hasAnimated.current = true;
        },
      },
      onUpdate: () => {
        element.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
      },
    });
  }, [value, duration, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

/**
 * Typewriter effect
 */
export function Typewriter({
  text,
  className,
  speed = 50,
  delay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (ref.current) ref.current.textContent = text;
      return;
    }
    if (!ref.current) return;

    const element = ref.current;
    let index = 0;
    element.textContent = "";

    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (index < text.length) {
          element.textContent = text.slice(0, index + 1);
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [text, speed, delay]);

  return <span ref={ref} className={className} />;
}
