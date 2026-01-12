// GSAP Core Setup
export {
  gsap,
  ScrollTrigger,
  MOTION_DEFAULTS,
  prefersReducedMotion,
  getMotionDuration,
  createTimeline,
  cleanupScrollTriggers,
  killAllScrollTriggers,
  refreshScrollTrigger,
} from "./gsap-setup";

// Lenis-GSAP Bridge
export {
  useLenisGSAP,
  useScrollProgress,
  useLenisControl,
} from "./use-lenis-gsap";

// Scroll Animation Hooks
export {
  useScrollAnimation,
  useParallax,
  usePinnedSection,
  useFadeInReveal,
  useHorizontalScroll,
  useScaleReveal,
} from "./scroll-hooks";

// Cursor Effects
export {
  useMagneticCursor,
  MagneticWrapper,
  useLuxuryCursor,
  useHoverTilt,
} from "./cursor-effects";
