/**
 * Motion Design Tokens
 * Centralized animation values for consistent motion design
 */

export type MotionDurationScale = "xs" | "sm" | "md" | "lg" | "xl";
export type MotionEasingType = "in" | "out" | "inOut";

/**
 * Duration scale in milliseconds
 */
export const motionDurations: Record<MotionDurationScale, number> = {
  xs: 120,   // Micro interactions
  sm: 200,   // Quick transitions
  md: 320,   // Standard animations
  lg: 480,   // Deliberate movements
  xl: 720,   // Hero/showcase animations
};

/**
 * Stagger delays for sequential animations
 */
export const motionDelays = {
  step: 80,      // Standard stagger increment
  stepLong: 160, // Slower stagger for emphasis
};

/**
 * Easing curves (cubic-bezier values)
 */
export const motionEasings = {
  standard: {
    in: [0.4, 0.0, 1, 1] as const,
    out: [0.0, 0.0, 0.2, 1] as const,
    inOut: [0.4, 0.0, 0.2, 1] as const,
  },
  emphasized: {
    in: [0.4, 0.0, 0.6, 1] as const,
    out: [0.0, 0.0, 0.2, 1] as const,
    inOut: [0.2, 0.0, 0.2, 1] as const,
  },
  // For floating/hovering effects
  bounce: {
    in: [0.6, -0.28, 0.735, 0.045] as const,
    out: [0.175, 0.885, 0.32, 1.275] as const,
    inOut: [0.68, -0.55, 0.265, 1.55] as const,
  },
};

/**
 * Spring configurations for physics-based animations
 */
export const motionSprings = {
  gentle: { damping: 25, stiffness: 120 },
  responsive: { damping: 30, stiffness: 200 },
  snappy: { damping: 40, stiffness: 300 },
  bouncy: { damping: 15, stiffness: 180 },
};

/**
 * Z-index layers for stacking context
 */
export const motionZ = {
  underlay: 0,
  base: 1,
  float: 10,
  overlay: 20,
  modal: 40,
  toast: 50,
};

/**
 * Float/hover animation presets
 */
export const floatAnimations = {
  // Gentle floating like clouds
  gentle: {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  // Subtle hover effect
  subtle: {
    y: [-4, 4, -4],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  // Parallax-style mouse tracking
  parallax: {
    // Applied dynamically based on mouse position
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      ...motionSprings.gentle,
    },
  },
};

/**
 * Text reveal animation presets
 */
export const textRevealPresets = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
};

/**
 * Scroll reveal thresholds
 */
export const scrollThresholds = {
  immediate: 0.1,  // Trigger as soon as visible
  quarter: 0.25,   // Trigger at 25% visible
  half: 0.5,       // Trigger at 50% visible
  full: 1.0,       // Trigger when fully visible
};

/**
 * Route transition presets (for future implementation)
 */
export const routeTransitions = {
  fade: {
    duration: motionDurations.md,
    easing: motionEasings.standard.inOut,
  },
  slide: {
    duration: motionDurations.lg,
    easing: motionEasings.emphasized.inOut,
  },
};
